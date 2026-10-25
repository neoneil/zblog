import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import ts from "typescript";
import * as astronomy from "astronomy-engine";

// Transpile the isolated helpers in memory; no runner dependency or generated files.
const require = createRequire(import.meta.url);
function load(path) {
  const source = readFileSync(new URL(path, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  });
  const exports = {};
  new Function("require", "exports", outputText)(require, exports);
  return exports;
}
const { getSkySnapshot, getStarDirection, PLANET_COLORS, PLANET_SYMBOLS, SIGN_NAMES, SIGN_SYMBOLS } = load("../features/stella/lib/sky.ts");
const { BRIGHT_STARS, CONSTELLATIONS } = load("../features/stella/data/stars.ts");
const date = new Date("2024-04-08T18:00:00Z");
const snapshot = getSkySnapshot(date);

test("deterministic, date-preserving, finite and normalized contract", () => {
  assert.deepEqual(getSkySnapshot(date), snapshot);
  assert.equal(date.toISOString(), "2024-04-08T18:00:00.000Z");
  assert.equal(snapshot.planets.length, 10);
  assert.equal(new Set(snapshot.planets.map(p => p.key)).size, 10);
  for (const p of snapshot.planets) {
    assert.ok(p.longitude >= 0 && p.longitude < 360);
    assert.ok(p.latitude >= -90 && p.latitude <= 90);
    assert.ok(Number.isFinite(p.distance) && p.distance > 0);
    assert.equal(p.signIndex, Math.floor(p.longitude / 30));
    assert.equal(p.signDegrees, p.longitude % 30);
    assert.equal(typeof p.retrograde, "boolean");
    assert.match(PLANET_COLORS[p.key], /^#[\da-f]{6}$/i);
    assert.ok(PLANET_SYMBOLS[p.key] && p.label && p.labelZh);
  }
  assert.equal(SIGN_NAMES.en.length, 12);
  assert.equal(SIGN_NAMES.zh.length, 12);
  assert.equal(SIGN_SYMBOLS.length, 12);
});

test("all coordinates match installed astronomy-engine, not synthetic positions", () => {
  for (const p of snapshot.planets) {
    const vector = astronomy.GeoVector(astronomy.Body[p.label], date, true);
    const ecliptic = astronomy.Ecliptic(vector);
    assert.ok(Math.abs(p.longitude - ecliptic.elon) < 1e-10);
    assert.equal(p.latitude, ecliptic.elat);
    assert.equal(p.distance, Math.hypot(vector.x, vector.y, vector.z));
  }
});

test("known new/full moon events and engine illumination", () => {
  assert.ok(snapshot.moon.illumination < 0.001);
  assert.ok(Math.min(snapshot.moon.phase, 360 - snapshot.moon.phase) < 1);
  assert.equal(snapshot.moon.illumination, astronomy.Illumination(astronomy.Body.Moon, date).phase_fraction);
  const full = getSkySnapshot(new Date("2024-03-25T07:00:00Z")).moon;
  assert.ok(full.illumination > 0.999);
  assert.ok(Math.abs(full.phase - 180) < 1);
});

test("Mercury retrograde and direct dates, Sun wraparound", () => {
  assert.equal(snapshot.planets.find(p => p.key === "mercury").retrograde, true);
  const direct = getSkySnapshot(new Date("2024-05-15T00:00:00Z"));
  assert.equal(direct.planets.find(p => p.key === "mercury").retrograde, false);
  const equinox = getSkySnapshot(new Date("2024-03-20T03:06:00Z"));
  assert.equal(equinox.planets.find(p => p.key === "sun").retrograde, false);
});

test("aspects use unique unordered pairs and wrapped longitude separation", () => {
  const angles = { conjunction: 0, sextile: 60, square: 90, trine: 120, opposition: 180 };
  const expected = [];
  for (let i = 0; i < snapshot.planets.length; i++) {
    for (let j = i + 1; j < snapshot.planets.length; j++) {
      const a = snapshot.planets[i];
      const b = snapshot.planets[j];
      const delta = Math.abs(a.longitude - b.longitude);
      const separation = Math.min(delta, 360 - delta);
      for (const [type, angle] of Object.entries(angles)) {
        const orb = Math.abs(separation - angle);
        if (orb <= 6) expected.push({ a: a.key, b: b.key, type, orb });
      }
    }
  }
  assert.equal(snapshot.aspects.length, expected.length);
  expected.forEach((e, i) => {
    assert.deepEqual({ ...snapshot.aspects[i], orb: 0 }, { ...e, orb: 0 });
    assert.ok(Math.abs(snapshot.aspects[i].orb - e.orb) < 1e-10);
  });
});

test("catalog uses degrees, unique real names, and valid line endpoints", () => {
  const names = new Set(BRIGHT_STARS.map(s => s.name));
  assert.equal(names.size, BRIGHT_STARS.length);
  for (const s of BRIGHT_STARS) {
    assert.ok(s.ra >= 0 && s.ra < 360);
    assert.ok(s.dec >= -90 && s.dec <= 90);
    assert.ok(Number.isFinite(s.magnitude));
  }
  assert.equal(BRIGHT_STARS.find(s => s.name === "Sirius").ra, 101.287215);
  for (const c of CONSTELLATIONS) {
    for (const [a, b] of c.lines) assert.ok(a !== b && names.has(a) && names.has(b));
  }
});

test("expanded catalog covers 88 constellations and stays within the data budget", () => {
  const root = new URL("../features/stella/data/", import.meta.url);
  const provenance = JSON.parse(readFileSync(new URL("catalog-provenance.json", root), "utf8"));
  assert.equal(CONSTELLATIONS.length, 88);
  assert.equal(new Set(CONSTELLATIONS.map(c => c.name)).size, 88);
  assert.ok(BRIGHT_STARS.length >= 5070);
  assert.equal(provenance.stars, BRIGHT_STARS.length);
  assert.equal(provenance.magnitudeLimitedStars, 5070);
  assert.equal(provenance.unresolvedEndpoints, 0);
  assert.equal(provenance.lineSegments, CONSTELLATIONS.reduce((sum, c) => sum + c.lines.length, 0));
  for (const name of ["Orion", "Leo", "Gemini", "Taurus", "Crux", "Serpens", "Ursa Major", "Octans"]) {
    assert.ok(CONSTELLATIONS.some(c => c.name === name && c.lines.length > 0), name);
  }
  for (const c of CONSTELLATIONS) {
    const edges = c.lines.map(pair => [...pair].sort().join("|"));
    assert.equal(new Set(edges).size, edges.length, c.name);
  }
  for (const hip of provenance.supplementalD3HipIds) {
    assert.ok(BRIGHT_STARS.some(s => s.name === `HIP ${hip}`));
  }
  for (const name of ["Sirius", "Canopus", "Arcturus", "Vega", "Capella", "Rigel", "Betelgeuse", "Acrux", "Polaris"]) {
    assert.ok(BRIGHT_STARS.some(s => s.name === name), name);
  }
  const bytes = readdirSync(root).reduce((sum, name) => sum + statSync(new URL(name, root)).size, 0);
  assert.ok(bytes < 700_000, `${bytes} bytes`);
  assert.match(readFileSync(new URL("LICENSE.d3-celestial.txt", root), "utf8"), /Copyright \(c\) 2015, Olaf Frohn/);
  assert.match(readFileSync(new URL("LICENSE.HYG.md", root), "utf8"), /Attribution-ShareAlike 4.0/);
  assert.ok(readFileSync(new URL("LICENSE.CC-BY-SA-4.0.html", root), "utf8").length > 10000);
});

test("invalid Date rejected explicitly", () => {
  assert.throws(() => getSkySnapshot(new Date(NaN)), RangeError);
});

test("star directions are finite unit vectors for catalog stars and poles", () => {
  for (const when of [date, new Date("2100-01-01T00:00:00Z")]) {
    for (const { ra, dec } of [...BRIGHT_STARS, { ra: 0, dec: 90 }, { ra: 360, dec: -90 }]) {
      const direction = getStarDirection(ra, dec, when);
      assert.equal(direction.length, 3);
      assert.ok(direction.every(Number.isFinite));
      assert.ok(Math.abs(Math.hypot(...direction) - 1) < 1e-14);
    }
  }
});

test("star rotation matches Ecliptic true-of-date frame and THREE mapping", () => {
  for (const when of [date, new Date("2100-01-01T00:00:00Z")]) {
    for (const { ra, dec } of BRIGHT_STARS) {
      const alpha = ra * Math.PI / 180;
      const delta = dec * Math.PI / 180;
      const eqj = new astronomy.Vector(Math.cos(delta) * Math.cos(alpha), Math.cos(delta) * Math.sin(alpha), Math.sin(delta), new astronomy.AstroTime(when));
      const { vec } = astronomy.Ecliptic(eqj);
      const length = Math.hypot(vec.x, vec.y, vec.z);
      const expected = [vec.x / length, vec.z / length, -vec.y / length];
      getStarDirection(ra, dec, when).forEach((value, i) => assert.ok(Math.abs(value - expected[i]) < 1e-14));
    }
  }
  assert.notDeepEqual(getStarDirection(100, 20, date), getStarDirection(100, 20, new Date("2100-01-01T00:00:00Z")));
});

test("star direction rejects invalid date and invalid coordinates", () => {
  assert.throws(() => getStarDirection(100, 20, new Date(NaN)), RangeError);
  for (const [ra, dec] of [[NaN, 0], [0, Infinity], [Infinity, 0], [0, 91], [0, -91]]) {
    assert.throws(() => getStarDirection(ra, dec, date), RangeError);
  }
});
