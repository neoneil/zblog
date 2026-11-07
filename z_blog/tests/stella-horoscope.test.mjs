import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";

const require = createRequire(import.meta.url);
const modules = new Map();
function load(url) {
  const key = url.href;
  if (modules.has(key)) return modules.get(key);
  const { outputText } = ts.transpileModule(readFileSync(url, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  });
  const exports = {};
  modules.set(key, exports);
  const localRequire = (name) =>
    name.startsWith(".") ? load(new URL(`${name}.ts`, url)) : require(name);
  new Function("require", "exports", outputText)(localRequire, exports);
  return exports;
}
const root = new URL("../features/stella/lib/", import.meta.url);
const { solarHouse, getHoroscopeForecast: forecast } = load(
  new URL("horoscope-calculations.ts", root),
);
const { getExploreSkySnapshot } = load(new URL("sky.ts", root));
const { eclipseYear, calendarPlanetIngresses } = load(
  new URL("explore-calculations.ts", root),
);
const date = new Date("2026-03-03T01:00:00Z");

// Captured from the live public page, not inferred from our ephemeris.
// Venus's Libra index follows from the page's Aries solar house 7.
const monthlyAriesSource = {
  source: "Public reference capture: /horoscope/monthly/aries",
  heading: "October 2026",
  observedUtcDate: "2026-10-31",
  sign: 0,
  transits: [
    { planet: "jupiter", sign: 4, house: 5 },
    { planet: "saturn", sign: 0, house: 1 },
    { planet: "venus", sign: 6, house: 7 },
    { planet: "mars", sign: 4, house: 5 },
  ],
};

test("all 144 sign pairs produce the twelve whole-sign solar houses", () => {
  for (let sign = 0; sign < 12; sign++) {
    const houses = Array.from({ length: 12 }, (_, transit) =>
      solarHouse(sign, transit),
    );
    assert.deepEqual(
      [...houses].sort((a, b) => a - b),
      Array.from({ length: 12 }, (_, i) => i + 1),
    );
    assert.equal(solarHouse(sign, sign), 1);
    assert.equal(solarHouse(sign, (sign + 11) % 12), 12);
  }
  for (const invalid of [-1, 12, 0.5, NaN, Infinity, "1", null]) {
    assert.throws(() => solarHouse(invalid, 0), RangeError);
    assert.throws(() => solarHouse(0, invalid), RangeError);
    assert.throws(() => forecast(invalid, "daily", date), RangeError);
  }
});

test("daily forecasts are deterministic, UTC-day stable and preserve inputs", () => {
  const result = forecast(0, "daily", date);
  assert.deepEqual(
    forecast(0, "daily", new Date("2026-03-03T23:59:59Z")),
    result,
  );
  assert.deepEqual(
    forecast(0, "daily", new Date("2026-03-04T09:59:59+10:00")),
    result,
  );
  assert.equal(date.toISOString(), "2026-03-03T01:00:00.000Z");
  assert.notDeepEqual(forecast(1, "daily", date).sections, result.sections);
  assert.notDeepEqual(
    forecast(0, "daily", new Date("2026-03-04T00:00:00Z")).sections,
    result.sections,
  );
  result.sections[0].title.en = "mutated";
  result.keyDates[0].event.en = "mutated";
  result.transits[0].house = -1;
  assert.notDeepEqual(forecast(0, "daily", date), result);
});

test("transits match supplied UTC-day noon, leap day and January/July samples", () => {
  const cases = [
    ["daily", date, ["2026-03-03T12:00:00Z"]],
    ["monthly", new Date("2024-02-29T23:00:00Z"), ["2024-02-29T12:00:00Z"]],
    ["monthly", date, ["2026-03-03T12:00:00Z"]],
    ["yearly", date, ["2026-01-01T12:00:00Z", "2026-07-01T12:00:00Z"]],
  ];
  for (const [period, when, samples] of cases) {
    const expected = samples.flatMap((sample) =>
      getExploreSkySnapshot(new Date(sample)).planets.map((p) => ({
        planet: p.key,
        sign: p.signIndex,
        house: solarHouse(11, p.signIndex),
      })),
    );
    assert.deepEqual(forecast(11, period, when).transits, expected);
  }
});

test("captured October 2026 source fixture disagrees with both first-day and midmonth Venus", () => {
  const planets = monthlyAriesSource.transits.map((p) => p.planet);
  const expected = [
    { planet: "jupiter", sign: 4, house: 5 },
    { planet: "saturn", sign: 0, house: 1 },
    { planet: "venus", sign: 7, house: 8 },
    { planet: "mars", sign: 4, house: 5 },
  ];
  const select = (transits) =>
    planets.map((key) => transits.find((p) => p.planet === key));
  for (const day of ["01", "15"]) {
    for (const hour of ["00", "12"]) {
      const snapshot = getExploreSkySnapshot(
        new Date(`2026-10-${day}T${hour}:00:00Z`),
      );
      const transits = snapshot.planets.map((p) => ({
        planet: p.key,
        sign: p.signIndex,
        house: solarHouse(0, p.signIndex),
      }));
      assert.deepEqual(select(transits), expected);
      assert.deepEqual(
        select(transits).map(
          (p, index) =>
            p.sign === monthlyAriesSource.transits[index].sign &&
            p.house === monthlyAriesSource.transits[index].house,
        ),
        [true, true, false, true],
        `${monthlyAriesSource.source}: October ${day} ${hour}:00 UTC`,
      );
    }
  }
  const result = forecast(0, "monthly", new Date("2026-10-01T23:59:59Z"));
  assert.deepEqual(select(result.transits), expected);
  // This checks our declared sampling contract, not source algorithm parity.
  const noon = getExploreSkySnapshot(new Date("2026-10-01T12:00:00Z"));
  assert.deepEqual(
    result.transits,
    noon.planets.map((p) => ({
      planet: p.key,
      sign: p.signIndex,
      house: solarHouse(0, p.signIndex),
    })),
  );
});

test("October 31 monthly forecast matches captured real-time source numeric fixture", () => {
  const when = new Date(`${monthlyAriesSource.observedUtcDate}T23:59:59Z`);
  const result = forecast(monthlyAriesSource.sign, "monthly", when);
  assert.deepEqual(
    monthlyAriesSource.transits.map(({ planet }) =>
      result.transits.find((p) => p.planet === planet),
    ),
    monthlyAriesSource.transits,
  );
  assert.match(
    result.sections[0].paragraphs[0].en,
    /Venus in Libra \(solar house 7\)/,
  );
  assert.deepEqual(result.transits, forecast(0, "daily", when).transits);
});

test("October 25 noon sky matches captured source numbers but does not establish its sampling rule", () => {
  const sky = getExploreSkySnapshot(new Date("2026-10-25T12:00:00Z"));
  const actual = monthlyAriesSource.transits.map(({ planet }) => {
    const p = sky.planets.find((p) => p.key === planet);
    return {
      planet,
      sign: p.signIndex,
      house: solarHouse(monthlyAriesSource.sign, p.signIndex),
    };
  });
  assert.deepEqual(actual, monthlyAriesSource.transits);
});

test("annual 2026 Aries Jupiter numeric fixture matches Cancer/4 then Leo/5", () => {
  const result = forecast(0, "yearly", new Date("2026-10-01T00:00:00Z"));
  assert.deepEqual(
    result.transits.filter((p) => p.planet === "jupiter"),
    [
      { planet: "jupiter", sign: 3, house: 4 },
      { planet: "jupiter", sign: 4, house: 5 },
    ],
  );
});

test("monthly forecasts are UTC-day stable, can change within a month, and yearly forecasts stay year-stable", () => {
  const daily = forecast(0, "daily", date),
    monthly = forecast(0, "monthly", date),
    yearly = forecast(0, "yearly", date);
  assert.notDeepEqual(daily.sections, monthly.sections);
  assert.notDeepEqual(monthly.sections, yearly.sections);
  assert.deepEqual(
    forecast(0, "monthly", new Date("2026-03-03T23:59:59Z")),
    monthly,
  );
  assert.deepEqual(
    forecast(0, "monthly", new Date("2026-03-04T09:59:59+10:00")),
    monthly,
  );
  assert.notDeepEqual(
    forecast(0, "monthly", new Date("2026-03-31T23:59:59Z")).transits,
    monthly.transits,
  );
  const earlyOctober = forecast(0, "monthly", new Date("2026-10-01T00:00:00Z"));
  const lateOctober = forecast(0, "monthly", new Date("2026-10-31T00:00:00Z"));
  assert.notDeepEqual(earlyOctober.sections, lateOctober.sections);
  assert.deepEqual(earlyOctober.keyDates, lateOctober.keyDates);
  assert.deepEqual(
    forecast(0, "yearly", new Date("2026-12-31T23:59:59Z")),
    yearly,
  );
  assert.notDeepEqual(
    forecast(0, "monthly", new Date("2026-04-01Z")).sections,
    monthly.sections,
  );
  assert.notDeepEqual(
    forecast(0, "yearly", new Date("2027-01-01Z")).sections,
    yearly.sections,
  );
});

test("all periods have ordered bilingual sections and distinct text for all twelve signs", () => {
  const titles = {
    daily: ["Today's Energy"],
    monthly: [
      "Overview",
      "Love & Relationships",
      "Career & Ambition",
      "Personal Growth",
      "This Month's Challenge",
    ],
    yearly: [
      "Overview",
      "Jupiter in Your Houses",
      "Saturn in Your House",
      "Eclipse Season",
      "Love",
      "Career",
    ],
  };
  for (const period of Object.keys(titles)) {
    const texts = new Set();
    for (let sign = 0; sign < 12; sign++) {
      const result = forecast(sign, period, date);
      assert.deepEqual(
        result.sections.map((s) => s.title.en),
        titles[period],
      );
      const paragraphs = new Set();
      for (const section of result.sections) {
        assert.ok(section.paragraphs.length > 0);
        for (const value of [section.title, ...section.paragraphs]) {
          assert.ok(value.en.length > 0);
          assert.match(value.zh, /[\u3400-\u9fff]/);
        }
        for (const paragraph of section.paragraphs) {
          assert.ok(
            !paragraphs.has(paragraph.en),
            "sections should not repeat the same paragraph",
          );
          paragraphs.add(paragraph.en);
        }
      }
      texts.add(JSON.stringify(result.sections));
    }
    assert.equal(texts.size, 12);
  }
});

test("section content follows period-specific planet roles without daily sample narration", () => {
  const daily = forecast(0, "daily", date).sections[0];
  assert.match(daily.paragraphs[0].en, /Moon.*Sun/);
  assert.doesNotMatch(daily.paragraphs[0].en, /sample|UTC|2026-/);
  const monthly = forecast(0, "monthly", new Date("2026-10-01Z")).sections;
  for (const planet of [
    "Jupiter in Leo",
    "Saturn in Aries",
    "Venus in Scorpio",
    "Mars in Leo",
  ])
    assert.ok(monthly[0].paragraphs[0].en.includes(planet));
  assert.match(monthly[1].paragraphs[0].en, /Venus/);
  assert.match(monthly[2].paragraphs[0].en, /Saturn.*Mars/);
  assert.match(monthly[3].paragraphs[0].en, /Jupiter/);
  assert.match(monthly[4].paragraphs[0].en, /Saturn/);
  const yearly = forecast(0, "yearly", date).sections;
  assert.match(
    yearly[1].paragraphs[0].en,
    /January-June.*Jupiter in Cancer \(solar house 4\)/,
  );
  assert.match(
    yearly[1].paragraphs[1].en,
    /July-December.*Jupiter in Leo \(solar house 5\)/,
  );
  assert.equal(yearly[3].paragraphs.length, eclipseYear(2026).length);
  for (const [index, eclipse] of eclipseYear(2026).entries()) {
    assert.ok(
      yearly[3].paragraphs[index].en.includes(eclipse.time.slice(0, 10)),
    );
    assert.ok(
      yearly[3].paragraphs[index].en.includes(
        `solar house ${solarHouse(0, Math.floor(eclipse.longitude / 30))}`,
      ),
    );
  }
});

test("yearly key dates retain eclipses, selected-sign non-Moon and global major ingresses only", () => {
  const result = forecast(0, "yearly", date);
  for (const eclipse of eclipseYear(2026)) {
    const entry = result.keyDates.find((d) =>
      d.event.en.includes(eclipse.time),
    );
    assert.ok(entry);
    assert.equal(entry.date, eclipse.time.slice(0, 10));
    assert.ok(
      entry.event.en.includes(`${eclipse.kind} ${eclipse.body} eclipse`),
    );
  }
  let count = eclipseYear(2026).length;
  for (const planet of [
    "sun",
    "moon",
    "mercury",
    "venus",
    "mars",
    "jupiter",
    "saturn",
    "uranus",
    "neptune",
    "pluto",
  ]) {
    for (const ingress of calendarPlanetIngresses(planet, 2026).filter((e) =>
      e.time.startsWith("2026-"),
    )) {
      const expected =
        planet !== "moon" &&
        (ingress.sign === 0 ||
          ["jupiter", "saturn", "uranus", "neptune", "pluto"].includes(planet));
      const found = result.keyDates.some(
        (d) =>
          d.date === ingress.time.slice(0, 10) &&
          d.event.en.toLowerCase().startsWith(`${planet} enters `),
      );
      assert.equal(found, expected, `${planet} ${ingress.time}`);
      if (expected) count++;
    }
  }
  assert.equal(result.keyDates.length, count);
  assert.ok(!result.keyDates.some((d) => d.event.en.startsWith("Moon enters")));
  assert.deepEqual(
    result.keyDates.map((d) => d.date),
    result.keyDates.map((d) => d.date).sort(),
  );
});

test("monthly key dates include all Sun ingresses, selected-sign Moon and planetary ingresses, and eclipses", () => {
  for (const sign of [0, 6, 11]) {
    const result = forecast(sign, "monthly", date);
    let count = eclipseYear(2026).filter((e) =>
      e.time.startsWith("2026-03"),
    ).length;
    for (const planet of [
      "sun",
      "moon",
      "mercury",
      "venus",
      "mars",
      "jupiter",
      "saturn",
      "uranus",
      "neptune",
      "pluto",
    ]) {
      for (const ingress of calendarPlanetIngresses(planet, 2026).filter((e) =>
        e.time.startsWith("2026-03"),
      )) {
        const expected = planet === "sun" || ingress.sign === sign;
        const found = result.keyDates.some(
          (d) =>
            d.date === ingress.time.slice(0, 10) &&
            d.event.en.toLowerCase().startsWith(`${planet} enters `),
        );
        assert.equal(found, expected, `${sign}: ${planet} ${ingress.time}`);
        if (expected) count++;
      }
    }
    assert.equal(result.keyDates.length, count);
    assert.ok(
      result.keyDates.some((d) => d.event.en.startsWith("Moon enters")),
    );
    assert.ok(result.keyDates.some((d) => d.event.en.startsWith("Sun enters")));
    assert.deepEqual(
      result.keyDates.map((d) => d.date),
      result.keyDates.map((d) => d.date).sort(),
    );
    assert.deepEqual(
      forecast(sign, "daily", date).keyDates,
      result.keyDates.filter((d) => d.date === "2026-03-03"),
    );
  }
});

test("invalid dates, periods and unsupported years fail explicitly", () => {
  for (const invalid of [
    new Date(NaN),
    null,
    "2026-01-01",
    new Date("1899-12-31Z"),
    new Date("2101-01-01Z"),
  ])
    assert.throws(() => forecast(0, "daily", invalid), RangeError);
  for (const period of ["weekly", "", null])
    assert.throws(() => forecast(0, period, date), RangeError);
});
