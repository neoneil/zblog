import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import ts from "typescript";
const nodeRequire = createRequire(import.meta.url);

// Compile only these local modules; API dependencies are injected to avoid live AI or billing calls.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
function loader(overrides = {}) {
  const cache = new Map();
  function load(file) {
    file = path.resolve(root, file);
    if (cache.has(file)) return cache.get(file).exports;
    const compiled = { exports: {} };
    cache.set(file, compiled);
    const source = ts.transpileModule(fs.readFileSync(file, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
    }).outputText;
    const localRequire = (id) => {
      if (Object.hasOwn(overrides, id)) return overrides[id];
      if (id.startsWith("@/")) return load(id.slice(2) + ".ts");
      if (id.startsWith(".")) return load(path.resolve(path.dirname(file), id) + ".ts");
      return nodeRequire(id);
    };
    new Function("require", "module", "exports", source)(localRequire, compiled, compiled.exports);
    return compiled.exports;
  }
  return load;
}
const load = loader();
const { DEFAULT_FORM, calculateNatalChart } = load("lib/astrology/natal-chart.ts");
const { parseSynastryInput, compareCharts, calculateSynastry, relationships, topics } = load("lib/astrology/synastry.ts");
const person = { ...DEFAULT_FORM, latitude: -33.8688, longitude: 151.2093, timeKnown: true };
const input = { personA: person, personB: { ...person, year: 2000, month: 1, day: 1 }, relationship: "friends", otherRelationship: "", language: "zh" };

test("validates dates, coordinates, relationship and shared zodiac", () => {
  assert.equal(relationships.length, 6);
  assert.equal(topics.length, 6);
  for (const relationship of relationships) assert.equal(parseSynastryInput({ ...input, relationship: relationship.key, otherRelationship: "siblings" }).relationship, relationship.key);
  for (const patch of [{ month: 2, day: 30 }, { hour: 24 }, { latitude: 90 }, { longitude: Infinity }, { year: 1899 }, { minute: NaN }]) {
    assert.throws(() => parseSynastryInput({ ...input, personA: { ...person, ...patch } }));
  }
  assert.throws(() => parseSynastryInput({ ...input, relationship: "other" }));
  assert.throws(() => parseSynastryInput({ ...input, otherRelationship: "a".repeat(301) }));
  assert.throws(() => parseSynastryInput({ ...input, personB: { ...person, zodiac: "sidereal" } }));
  assert.equal(parseSynastryInput({ ...input, personA: { ...person, timeKnown: false } }).personA.hour, 12);
});

test("reuses natal engine and derives both charts and overlays", async () => {
  const result = await calculateSynastry(parseSynastryInput(input));
  const natal = await calculateNatalChart(person);
  assert.deepEqual(result.chartA.planets, natal.planets);
  assert.equal(result.chartA.planets.length, 10);
  assert.equal(result.chartA.houses.length, 12);
  assert.equal(result.chartB.angles.length, 2);
  assert.equal(result.aInB.length, 10);
  assert.equal(result.bInA.length, 10);
  assert.ok(new Set(result.chartA.planets.map(p => Math.floor(p.absoluteDegrees))).size > 5);
  assert.ok(result.aspects.length > 0);
  assert.ok(result.aspects.every(a => a.orb >= 0 && a.orb <= (a.type === "sextile" ? 4 : 6)));
  const reversed = compareCharts(result.chartB, result.chartA, true, true);
  assert.deepEqual(result.aInB, reversed.bInA);
  assert.deepEqual(result.bInA, reversed.aInB);
});

test("wraparound aspects and house boundaries are deterministic", () => {
  const p = (key, absoluteDegrees) => ({ key, absoluteDegrees, label: key, labelZh: key });
  const chart = (planets) => ({ planets, angles: [], houses: Array.from({ length: 12 }, (_, i) => ({ cuspDegrees: i * 30, house: i + 1 })) });
  const a = chart([p("sun", 359)]), b = chart([p("moon", 1)]);
  const result = compareCharts(a, b, true, true);
  assert.equal(result.aspects[0].type, "conjunction");
  assert.equal(result.aspects[0].orb, 2);
  assert.equal(result.aInB[0].house, 12);
  assert.equal(result.bInA[0].house, 1);
  assert.equal(compareCharts(chart([p("sun", 0)]), chart([p("mars", 65)]), true, true).aspects.length, 0);
});

test("unknown times omit houses/angles and flag Moon data", async () => {
  const result = await calculateSynastry(parseSynastryInput({ ...input, personA: { ...person, timeKnown: false } }));
  assert.equal(result.chartA.houses.length, 0);
  assert.equal(result.chartA.angles.length, 0);
  assert.ok(result.chartA.planets.every(p => p.house === undefined));
  assert.equal(result.bInA.length, 0);
  assert.equal(result.aInB.length, 10);
  assert.ok(result.aInB.find(p => p.key === "moon").provisional);
  assert.ok(result.aspects.filter(a => a.a === "moon").every(a => a.provisional));
  assert.ok(result.aspects.every(a => !["ascendant", "midheaven"].includes(a.a)));
});

test("API validates before charging, protects access and uses canonical chart data", async () => {
  let consumed = 0, calls = 0, authenticated = true, allowed = true, prompt;
  const reading = { overview: "Overview", sections: Object.fromEntries(topics.map(t => [t.key, "Example"])) };
  class FakeOpenAI {
    chat = { completions: { create: async (params) => { calls++; prompt = params; return { choices: [{ message: { content: JSON.stringify(reading) } }] }; } } };
  }
  const route = loader({
    openai: FakeOpenAI,
    "@/features/billing/lib/ai-access": {
      getAiAccessStatus: async () => ({ authenticated }),
      consumeAiAccess: async () => { consumed++; return allowed ? { allowed: true } : { allowed: false, message: "Limit", code: "daily_limit_reached", httpStatus: 403 }; },
    },
  })("app/api/synastry/route.ts");
  const post = body => route.POST(new Request("http://localhost/api/synastry", { method: "POST", body: JSON.stringify(body) }));
  const previousKey = process.env.OPENAI_API_KEY;
  process.env.OPENAI_API_KEY = "mock-only";
  try {
    assert.equal((await post({ ...input, action: "read", personA: { ...person, day: 90 } })).status, 400);
    assert.equal(consumed, 0);
    authenticated = false;
    assert.equal((await post({ ...input, action: "calculate" })).status, 401);
    authenticated = true;
    assert.equal((await post({ ...input, action: "calculate" })).status, 200);
    assert.equal(consumed, 0); assert.equal(calls, 0);
    const response = await post({ ...input, action: "read", result: { aspects: ["forged"] } });
    assert.equal(response.status, 200);
    assert.deepEqual((await response.json()).reading, reading);
    assert.equal(consumed, 1); assert.equal(calls, 1);
    const payload = JSON.parse(prompt.messages[1].content);
    assert.ok(payload.crossAspects.every(a => typeof a.orb === "number"));
    assert.equal(prompt.response_format.json_schema.schema.properties.sections.required.length, 6);
    allowed = false;
    assert.equal((await post({ ...input, action: "read" })).status, 403);
    assert.equal(calls, 1);
  } finally {
    if (previousKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = previousKey;
  }
});
