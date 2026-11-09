import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, normalize } from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";

const root = new URL("../", import.meta.url),
  require = createRequire(import.meta.url),
  cache = new Map();
let accessCalls = 0,
  allowed = true,
  completion;
class FakeOpenAI {
  chat = {
    completions: {
      create: async (args) => {
        completion = args;
        return {
          choices: [{ message: { content: "A personalized reading." } }],
        };
      },
    },
  };
}
function load(file) {
  if (cache.has(file)) return cache.get(file);
  const exports = {};
  cache.set(file, exports);
  const js = ts.transpileModule(readFileSync(new URL(file, root), "utf8"), {
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
    },
  }).outputText;
  new Function("exports", "require", js)(exports, (name) => {
    if (name === "next/server")
      return {
        NextResponse: { json: (value, init) => Response.json(value, init) },
      };
    if (name === "openai") return { __esModule: true, default: FakeOpenAI };
    if (name === "@/features/billing/lib/ai-access")
      return {
        consumeAiAccess: async () => {
          accessCalls++;
          return allowed
            ? { allowed: true }
            : {
                allowed: false,
                message: "Sign in",
                code: "login_required",
                httpStatus: 401,
              };
        },
      };
    if (name.startsWith("@/")) return load(name.slice(2) + ".ts");
    if (name.startsWith("."))
      return load(
        normalize(dirname(file) + "/" + name).replaceAll("\\", "/") + ".ts",
      );
    return require(name);
  });
  return exports;
}
const analysis = load("features/stella/lib/app-analysis.ts"),
  { calculateNatalChart } = load("lib/astrology/natal-chart.ts"),
  { getSkySnapshot } = load("features/stella/lib/sky.ts");
const birth = {
  name: "Shanghai",
  year: 1985,
  month: 3,
  day: 27,
  hour: 10,
  minute: 30,
  latitude: 31.2304,
  longitude: 121.4737,
  houseSystem: "placidus",
  zodiac: "tropical",
};
const base = await calculateNatalChart(birth),
  enriched = await analysis.enrichStellaChart(base),
  chart = enriched.chart;

test("Stella enrichment preserves core values and adds exactly Chiron and the nodes", () => {
  assert.equal(enriched.utc, "1985-03-27T02:30:00Z");
  assert.equal(enriched.timezone, "Asia/Shanghai");
  assert.deepEqual(chart.planets.slice(0, 10), base.planets);
  assert.deepEqual(chart.houses, base.houses);
  assert.deepEqual(chart.angles, base.angles);
  assert.equal(chart.planets.length, 13);
  assert.deepEqual(
    chart.planets.slice(10).map((p) => p.key),
    ["chiron", "northnode", "southnode"],
  );
  assert.ok(
    chart.planets.every(
      (p) =>
        Number.isFinite(p.absoluteDegrees) && p.house >= 1 && p.house <= 12,
    ),
  );
  assert.equal(
    Math.abs(
      chart.planets[11].absoluteDegrees - chart.planets[12].absoluteDegrees,
    ),
    180,
  );
});
test("calendar windows, birthday age and annual timing use real boundaries", () => {
  const w = analysis.periodWindow(new Date("2026-11-09T23:59:00Z"), "week");
  assert.equal(w.start.toISOString(), "2026-11-09T00:00:00.000Z");
  assert.equal(w.end.toISOString(), "2026-11-16T00:00:00.000Z");
  const m = analysis.periodWindow(new Date("2028-02-29T00:00:00Z"), "month");
  assert.equal(m.end.toISOString(), "2028-03-01T00:00:00.000Z");
  assert.equal(analysis.ageAt(birth, new Date("2026-03-26T12:00Z")), 40);
  assert.equal(analysis.ageAt(birth, new Date("2026-03-27T12:00Z")), 41);
  const timing = analysis.timingTechniques(
    chart,
    enriched.utc,
    new Date("2026-11-09T00:00Z"),
  );
  assert.equal(timing.profectionHouse, 6);
  assert.equal(timing.timeLord, "mars");
  assert.equal(timing.solarYear, 2027);
  const actual = getSkySnapshot(new Date(timing.solarReturn)).planets[0]
    .longitude;
  assert.ok(Math.abs(actual - chart.planets[0].absoluteDegrees) < 0.02);
});
test("moon phases and transits are finite, unique and constrained to the requested interval", () => {
  const date = new Date("2026-11-09T12:00Z"),
    sky = getSkySnapshot(date),
    next = getSkySnapshot(new Date(+date + 3600000));
  const phases = analysis.moonEvents(date, "month");
  assert.ok(phases.length >= 4);
  assert.ok(
    phases.every(
      (p) => p.time.startsWith("2026-11") && p.sign >= 0 && p.sign < 12,
    ),
  );
  const transits = analysis.chartTransits(chart, sky, next);
  assert.ok(transits.length > 0);
  assert.equal(
    new Set(transits.map((t) => t.a + t.b + t.type)).size,
    transits.length,
  );
  assert.ok(
    transits.every((t) => t.orb <= 3 && t.strength >= 0 && t.strength <= 100),
  );
  const rows = analysis.keyTransitDates(chart, date, "week");
  assert.ok(rows.length <= 3 && rows.length > 0);
  assert.ok(rows.every((r) => r.time >= "2026-11-09" && r.time < "2026-11-16"));
  const rays = analysis.skyRayEnergies(sky, date);
  assert.equal(rays.length, 7);
  assert.ok(rays.every((r) => Number.isFinite(r.relative)));
});
test("planetary hours, angles and Saturn return roots are computable", () => {
  const date = new Date("2026-11-09T12:00Z"),
    hour = analysis.planetaryHour(date, 31.2304, 121.4737, "Asia/Shanghai");
  assert.ok(hour);
  assert.ok(new Date(hour.end) > date);
  const angles = analysis.currentAngles(date, 31.2304, 121.4737);
  assert.ok(Object.values(angles).every((v) => v >= 0 && v < 360));
  const rows = analysis.angularPlanets(
    getSkySnapshot(date),
    date,
    31.2304,
    121.4737,
  );
  assert.equal(rows.length, 10);
  assert.ok(rows.every((r) => r.altitude >= -90 && r.altitude <= 90));
  assert.equal(
    analysis.planetaryHour(new Date("2026-06-21T12:00Z"), 89, 0),
    null,
  );
  const returns = analysis.saturnReturns(chart, enriched.utc);
  assert.equal(returns.length, 3);
  assert.ok(returns.every((r) => r.time));
  assert.ok(
    new Date(returns[0].time).getUTCFullYear() >= 2013 &&
      new Date(returns[0].time).getUTCFullYear() <= 2016,
  );
});
test("reading API validates requests and enforces existing access", async () => {
  const { POST } = load("app/api/stella-reading/route.ts");
  const request = (body) =>
    new Request("http://localhost/api/stella-reading", {
      method: "POST",
      body: JSON.stringify(body),
    });
  const body = {
    birth,
    topic: "energy",
    style: "overview",
    period: "today",
    language: "en",
    date: "2026-11-09T12:00Z",
  };
  const prior = process.env.OPENAI_API_KEY;
  process.env.OPENAI_API_KEY = "test-key";
  try {
    for (const invalid of [
      { ...body, birth: { ...birth, day: 32 } },
      { ...body, topic: "bad" },
      { ...body, date: "bad" },
      { ...body, detail: 123 },
    ]) {
      assert.equal((await POST(request(invalid))).status, 400);
    }
    assert.equal(
      (
        await POST(
          request({
            ...body,
            topic: "life-moment",
            detail: JSON.stringify({ date: "2026-02-31" }),
          }),
        )
      ).status,
      400,
    );
    assert.equal(accessCalls, 0);
    allowed = false;
    assert.equal((await POST(request(body))).status, 401);
    assert.equal(completion, undefined);
    allowed = true;
    const response = await POST(request(body));
    assert.equal(response.status, 200);
    assert.equal((await response.json()).reading, "A personalized reading.");
    assert.match(completion.messages[0].content, /exclusively in English/);
    const payload = JSON.parse(completion.messages[1].content);
    assert.equal(payload.context.birthUtc, "1985-03-27T02:30:00Z");
    assert.equal(payload.context.chart.planets.length, 13);
    const moment = await POST(
      request({
        ...body,
        topic: "life-moment",
        language: "zh",
        detail: JSON.stringify({
          date: "2020-01-01",
          category: "Career",
          description: "A change",
        }),
      }),
    );
    assert.equal(moment.status, 200);
    assert.equal(
      JSON.parse(completion.messages[1].content).context.date,
      "2020-01-01T12:00:00.000Z",
    );
    assert.match(completion.messages[0].content, /Simplified Chinese/);
  } finally {
    if (prior === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = prior;
  }
});
