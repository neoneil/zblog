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
  openaiLoads = 0;
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
    if (name === "openai") {
      openaiLoads++;
      throw new Error("Stella must not load OpenAI.");
    }
    if (name === "@/features/billing/lib/ai-access")
      return {
        consumeAiAccess: async () => {
          accessCalls++;
          throw new Error("Stella must not consume a reading allowance.");
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
test("retired Stella reading API never loads OpenAI or consumes access", async () => {
  const { POST } = load("app/api/stella-reading/route.ts");
  const request = (body) =>
    new Request("http://localhost/api/stella-reading", {
      method: "POST",
      body: JSON.stringify(body),
    });
  for (const body of [
    { birth, language: "en" },
    { birth, language: "zh" },
    {},
    null,
  ]) {
    const response = await POST(request(body));
    assert.equal(response.status, 410);
    const result = await response.json();
    assert.equal(
      result.consultationUrl,
      "/services/natal-chart-interpretation-masterclass",
    );
    assert.equal(result.code, "consultation_required");
    assert.ok(result.message.en && result.message.zh);
  }
  assert.equal(accessCalls, 0);
  assert.equal(openaiLoads, 0);
});

test("Stella reading actions use the consultation URL without generation requests", () => {
  for (const file of [
    "features/stella/components/stella-analysis.tsx",
    "features/stella/components/stella-ask.tsx",
  ]) {
    const source = readFileSync(new URL(file, root), "utf8");
    assert.ok(source.includes("STELLA_CONSULTATION_HREF"));
    assert.ok(source.includes("href={STELLA_CONSULTATION_HREF}"));
    assert.ok(!source.includes("/api/stella-reading"));
    assert.ok(!source.includes("fetch("));
    assert.ok(!source.includes('from "openai"'));
  }
});

test("birth panel removes save/share and JSON export while linking consultation actions", () => {
  const source = readFileSync(
    new URL("features/stella/components/stella-client.tsx", root),
    "utf8",
  );
  const analysisSource = readFileSync(
    new URL("features/stella/components/stella-analysis.tsx", root),
    "utf8",
  );
  for (const removed of [
    "SaveShare",
    "saveBirth",
    "setSaved",
    "downloadData",
    "Download Chart Data",
    "下载星盘数据",
    "stella-natal-chart.json",
  ])
    assert.ok(!source.includes(removed), removed);
  assert.ok(!analysisSource.includes("export function SaveShare"));
  assert.match(
    source,
    /<Link className=\{styles\.secondary\} href=\{STELLA_CONSULTATION_HREF\}>/,
  );
  assert.match(
    source,
    /<Link className=\{styles\.chartQuestion\} href=\{STELLA_CONSULTATION_HREF\}>/,
  );
  assert.ok(
    source.includes("scene.current?.download()"),
    "chart-image download remains independent of removed JSON export",
  );
});
