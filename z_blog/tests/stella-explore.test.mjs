import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";
import * as astro from "astronomy-engine";

const require = createRequire(import.meta.url);
function load(path) {
  const source = readFileSync(new URL(path, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  });
  const exports = {};
  new Function("require", "exports", outputText)(require, exports);
  return exports;
}
const config = load("../features/stella/lib/explore-config.ts");
const calc = load("../features/stella/lib/explore-calculations.ts");
const number = load("../features/stella/lib/numerology.ts");
const { phaseIndex } = load("../features/stella/lib/moon-phase.ts");
const sky = load("../features/stella/lib/sky.ts");
const date = Date.parse("2026-01-01T00:00:00Z"),
  day = 86400000;

test("phase names follow the reference's eight 45-degree bins", () => {
  assert.equal(phaseIndex(0), 0);
  assert.equal(phaseIndex(90), 2);
  assert.equal(phaseIndex(180), 4);
  assert.equal(phaseIndex(249), 5);
  assert.equal(phaseIndex(270), 6);
  assert.equal(phaseIndex(359), 7);
  assert.equal(phaseIndex(10), 0);
  assert.equal(phaseIndex(84), 1);
});
test("Explore reproduces the original's captured eleven-aspect sky list", () => {
  // Public /todays-sky captured on 2026-10-31 at 05:49:36 UTC.
  const observed = [
    ["moon", "mercury", "trine", 0.8],
    ["mercury", "mars", "square", 0.8],
    ["neptune", "pluto", "sextile", 1],
    ["uranus", "pluto", "trine", 1.6],
    ["venus", "jupiter", "sextile", 2.4],
    ["uranus", "neptune", "sextile", 2.6],
    ["sun", "pluto", "square", 4.7],
    ["mars", "jupiter", "conjunction", 6],
    ["venus", "pluto", "square", 6.5],
    ["mercury", "jupiter", "square", 6.8],
    ["saturn", "neptune", "conjunction", 7.2],
  ];
  const time = new Date("2026-10-31T05:49:36Z");
  const snapshot = sky.getExploreSkySnapshot(time);
  const actual = snapshot.aspects
    .toSorted((a, b) => a.orb - b.orb)
    .map((a) => [a.a, a.b, a.type, Math.round(a.orb * 10) / 10]);
  assert.deepEqual(actual, observed);
  assert.equal(
    snapshot.moon.illumination,
    (1 - Math.cos((snapshot.moon.phase * Math.PI) / 180)) / 2,
  );
  assert.ok(
    sky.getSkySnapshot(time).aspects.every((a) => a.orb <= 6),
    "legacy scene keeps its existing aspect rules",
  );
});
test("11 unique tools, 78 canonical pairs, and symmetric pair dynamics", () => {
  assert.equal(config.stellaTools.length, 11);
  assert.equal(new Set(config.stellaTools.map((t) => t.slug)).size, 11);
  assert.equal(config.compatibilityPairs.length, 78);
  assert.equal(new Set(config.compatibilityPairs).size, 78);
  for (const slug of config.compatibilityPairs) {
    const pair = config.parsePair(slug);
    assert.ok(pair);
    assert.deepEqual(
      config.pairDynamics(...pair),
      config.pairDynamics(...pair.toReversed()),
    );
  }
  for (const invalid of [
    "aries",
    "taurus-aries",
    "aries-nope",
    "aries-aries-extra",
    "__proto__-aries",
  ])
    assert.equal(config.parsePair(invalid), null);
});
test("all twelve approved constellation images are local, lightweight and safe",()=>{
  for(const slug of config.signSlugs){
    const svg=readFileSync(new URL(`../public/stella/constellations/${slug}.svg`,import.meta.url),"utf8");
    assert.match(svg,/viewBox="0 0 112 76"/);
    assert.match(svg,/#62d8ff/);
    assert.match(svg,/<path /);
    assert.match(svg,/<circle /);
    assert.doesNotMatch(svg,/<script|<foreignObject|href=|<rect/i);
    assert.ok(Buffer.byteLength(svg)<16000,slug);
  }
});
test("366 birthday routes include leap day, cross years correctly and have finite profiles", () => {
  assert.equal(config.birthdaySlugs.length, 366);
  assert.ok(config.birthdaySlugs.includes("february-29"));
  for (const slug of config.birthdaySlugs) {
    const parsed = config.parseBirthday(slug);
    assert.ok(parsed);
    const p = calc.birthdayProfile(parsed.month, parsed.day);
    assert.ok(p.sign >= 0 && p.sign < 12);
    assert.ok(p.decan >= 1 && p.decan <= 3);
    assert.ok(p.degree >= 0 && p.degree < 30);
    assert.ok(config.planetCopy[p.ruler]);
  }
  for (const invalid of [
    "february-30",
    "april-31",
    "january-0",
    "january-01",
    "march-1-extra",
    "nope-1",
  ])
    assert.equal(config.parseBirthday(invalid), null);
});
test("birthday decan rulers use modern triplicity for all twelve signs", () => {
  const cases = [
    [
      [3, 25],
      [4, 5],
      [4, 15],
      ["mars", "sun", "jupiter"],
    ],
    [
      [4, 25],
      [5, 5],
      [5, 15],
      ["venus", "mercury", "saturn"],
    ],
    [
      [5, 25],
      [6, 5],
      [6, 15],
      ["mercury", "venus", "uranus"],
    ],
    [
      [6, 25],
      [7, 5],
      [7, 15],
      ["moon", "pluto", "neptune"],
    ],
    [
      [7, 25],
      [8, 5],
      [8, 15],
      ["sun", "jupiter", "mars"],
    ],
    [
      [8, 25],
      [9, 5],
      [9, 15],
      ["mercury", "saturn", "venus"],
    ],
    [
      [9, 30],
      [10, 10],
      [10, 20],
      ["venus", "uranus", "mercury"],
    ],
    [
      [10, 25],
      [11, 5],
      [11, 15],
      ["pluto", "neptune", "moon"],
    ],
    [
      [11, 25],
      [12, 5],
      [12, 15],
      ["jupiter", "mars", "sun"],
    ],
    [[12, 25], [1, 15], null, ["saturn", "venus", "mercury"]],
    [
      [1, 25],
      [2, 5],
      [2, 15],
      ["uranus", "mercury", "venus"],
    ],
    [
      [2, 25],
      [3, 5],
      [3, 15],
      ["neptune", "moon", "pluto"],
    ],
  ];
  for (const [sign, row] of cases.entries()) {
    for (let index = 0; index < 3; index++) {
      if (!row[index]) continue;
      const result = calc.birthdayProfile(...row[index]);
      assert.equal(result.sign, sign);
      assert.equal(result.decan, index + 1);
      assert.equal(result.ruler, row[3][index]);
      assert.deepEqual(calc.birthdayProfile(...row[index]), result);
    }
  }
  const september30 = calc.birthdayProfile(9, 30);
  assert.equal(september30.sign, 6);
  assert.equal(september30.decan, 1);
  assert.equal(september30.ruler, "venus");
});
test("all 366 birthday profile values match captured original results", () => {
  const fixture = JSON.parse(
    readFileSync(
      new URL("./fixtures/stella-birthday-reference.json", import.meta.url),
      "utf8",
    ),
  );
  assert.equal(fixture.rows.length, 366);
  for (const [month, day, sign, decan, ruler, degree] of fixture.rows) {
    assert.deepEqual(
      calc.birthdayProfile(month, day),
      { sign: config.signSlugs.indexOf(sign), decan, ruler, degree },
      `${month}-${day}`,
    );
  }
});
test("calendar sampling reproduces the original moon, retrograde, VOC and Mercury tables", () => {
  const ref = JSON.parse(
    readFileSync(
      new URL("./fixtures/stella-calendar-reference.json", import.meta.url),
      "utf8",
    ),
  );
  assert.deepEqual(
    calc.moonMonth(ref.year, ref.month).days.map((d) => ({
      day: d.day,
      phase: phaseIndex(d.phase),
      sign: d.sign,
      percent: Math.round(d.illumination * 100),
    })),
    ref.moon,
  );
  assert.deepEqual(
    calc
      .calendarVoidPeriods(ref.year, ref.month)
      .map(({ start, end, sign }) => ({ start, end, sign })),
    ref.voc,
  );
  assert.deepEqual(
    calc.calendarRetrogradePeriods(ref.year).map((p) => ({
      planet: p.planet,
      start: p.start,
      end: p.clippedEnd
        ? new Date(Date.parse(p.end) - 86400000).toISOString()
        : p.end,
      signs:
        p.startSign === p.endSign ? [p.startSign] : [p.startSign, p.endSign],
    })),
    ref.retro,
  );
  assert.deepEqual(
    calc
      .calendarPlanetIngresses("mercury", ref.year)
      .map((p) => ({ date: p.time.slice(0, 10), sign: p.sign })),
    ref.mercuryIngress,
  );
});
test("all eight original planetary ingress calendars match", () => {
  const fixture = JSON.parse(
    readFileSync(
      new URL("./fixtures/stella-planets-reference.json", import.meta.url),
      "utf8",
    ),
  );
  let count = 0;
  for (const [planet, reference] of Object.entries(fixture.planets)) {
    const window = calc.planetCalendarWindow(planet, fixture.year);
    assert.equal(window.startYear, reference.startYear);
    assert.equal(window.endYear, reference.endYear);
    const rows = calc
      .calendarPlanetIngresses(planet, fixture.year)
      .map((p) => ({ date: p.time.slice(0, 10), sign: p.sign }));
    assert.deepEqual(rows, reference.rows, planet);
    count += rows.length;
  }
  assert.equal(count, 199);
});
test("numerology reduces components independently and preserves all master numbers", () => {
  assert.equal(number.lifePath("1990-03-29").number, 6);
  assert.equal(number.lifePath("1995-12-14").number, 5);
  assert.equal(number.lifePath("2000-01-08").number, 11);
  assert.equal(number.lifePath("2009-11-29").number, 33);
  assert.deepEqual(number.lifePath("2009-11-29").components, [11, 11, 11]);
  for (const n of [11, 22, 33]) assert.equal(number.reduceNumber(n), n);
  for (const invalid of [
    "2023-02-29",
    "2026-04-31",
    "",
    "1995-1-1",
    "not-a-date",
  ])
    assert.throws(() => number.lifePath(invalid), RangeError);
});
test("moon calendar has actual days, UTC-noon samples and four precise phase searches", () => {
  const month = calc.moonMonth(2024, 2);
  assert.equal(month.days.length, 29);
  assert.equal(calc.moonMonth(2023, 2).days.length, 28);
  assert.equal(calc.moonMonth(2026, 4).days.length, 30);
  for (const d of month.days) {
    const time = new Date(d.time);
    assert.equal(time.getUTCHours(), 12);
    assert.ok(Math.abs(astro.MoonPhase(time) - d.phase) < 1e-9);
    assert.ok(d.illumination >= 0 && d.illumination <= 1);
  }
  for (const q of month.quarters) {
    let error =
      ((astro.MoonPhase(new Date(q.time)) - q.quarter * 90 + 540) % 360) - 180;
    assert.ok(Math.abs(error) < 0.001);
  }
});
test("ingress refinement handles 360-degree wrap and retrograde re-entry", () => {
  const events = calc.planetIngresses("mercury", 2026);
  assert.ok(events.length > 30);
  assert.ok(events.some((e) => e.retrograde));
  assert.ok(events.some((e) => e.sign === 0));
  for (const event of events) {
    const t = Date.parse(event.time),
      before = Math.floor(calc.longitude("mercury", t - 3000) / 30),
      after = Math.floor(calc.longitude("mercury", t + 3000) / 30);
    assert.notEqual(before, after);
    assert.equal(after, event.sign);
  }
});
test("retrograde periods have station boundaries and cross-year flags", () => {
  const periods = calc.retrogradePeriods(2026, ["mercury", "jupiter"]);
  const mercury = periods.filter((p) => p.planet === "mercury");
  assert.equal(mercury.length, 3);
  for (const p of periods) {
    assert.ok(p.start < p.end);
    const start = Date.parse(p.start),
      end = Date.parse(p.end);
    assert.ok(calc.speed(p.planet, (start + end) / 2) < 0);
    if (!p.clippedStart) {
      assert.ok(calc.speed(p.planet, start - 60000) > 0);
      assert.ok(calc.speed(p.planet, start + 60000) < 0);
    }
    if (!p.clippedEnd) {
      assert.ok(calc.speed(p.planet, end - 60000) < 0);
      assert.ok(calc.speed(p.planet, end + 60000) > 0);
    }
  }
  assert.ok(periods.some((p) => p.planet === "jupiter" && p.clippedStart));
  assert.equal(calc.retrogradePeriods(2026, ["mars"]).length, 0);
});
test("VOC periods end at ingress, start at an exact major aspect and do not overlap", () => {
  const periods = calc.voidPeriods(2026, 10);
  assert.ok(periods.length >= 12 && periods.length <= 15);
  for (let i = 0; i < periods.length; i++) {
    const p = periods[i],
      start = Date.parse(p.start),
      end = Date.parse(p.end);
    assert.ok(end > start);
    assert.equal(Math.floor(calc.longitude("moon", end - 3000) / 30), p.sign);
    assert.equal(
      Math.floor(calc.longitude("moon", end + 3000) / 30),
      (p.sign + 1) % 12,
    );
    if (p.lastPlanet) {
      const separation = Math.abs(
        ((calc.longitude("moon", start) -
          calc.longitude(p.lastPlanet, start) +
          540) %
          360) -
          180,
      );
      assert.ok(Math.abs(separation - p.angle) < 0.001);
    }
    if (i) assert.ok(periods[i - 1].end <= p.start);
  }
});
test("eclipses enumerate both solar and lunar events with known 2024 and 2026 peaks", () => {
  const events = calc.eclipseYear(2026);
  assert.equal(events.length, 4);
  assert.equal(events.filter((e) => e.body === "solar").length, 2);
  assert.equal(events.filter((e) => e.body === "lunar").length, 2);
  const march = events.find((e) => e.id === "2026-03-03-lunar");
  assert.ok(march);
  assert.equal(march.kind, "total");
  assert.ok(
    Math.abs(Date.parse(march.time) - Date.parse("2026-03-03T11:33:00Z")) <
      180000,
  );
  const april = calc.eclipseYear(2024).find((e) => e.id === "2024-04-08-solar");
  assert.equal(april.kind, "total");
  assert.ok(
    Math.abs(Date.parse(april.time) - Date.parse("2024-04-08T18:17:00Z")) <
      180000,
  );
});
test("invalid calculation ranges are rejected", () => {
  for (const year of [NaN, 1800, 2101, 2026.5]) {
    assert.throws(() => calc.moonMonth(year, 1), RangeError);
    assert.throws(() => calc.eclipseYear(year), RangeError);
  }
  for (const month of [0, 13, 1.5])
    assert.throws(() => calc.moonMonth(2026, month), RangeError);
  assert.throws(() => calc.longitude("missing", date), RangeError);
  assert.throws(() => calc.birthdayProfile(2, 30), RangeError);
  assert.ok(day > 0);
});
