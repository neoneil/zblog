import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';

const require = createRequire(import.meta.url);
function load(file) {
  const exports = {};
  new Function('exports', 'require', ts.transpileModule(readFileSync(new URL(file, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText)(exports, require);
  return exports;
}
const { calculateNatalChart } = load('../lib/astrology/natal-chart.ts');
const { formatDegrees } = load('../lib/astrology/format-degrees.ts');
const birth = { name: 'Shanghai audit', year: 1985, month: 3, day: 27, hour: 10, minute: 30, latitude: 31.2304, longitude: 121.4737, houseSystem: 'placidus', zodiac: 'tropical' };
// Independent diagnostic: Swiss Ephemeris 2.10.03 / Moshier, 1985-03-27 02:30 UTC.
const swissCusps = [88.7929256291,111.0863493644,134.4281031411,162.0470298686,195.9809963507,233.7258019104,268.7929256291,291.0863493644,314.4281031411,342.0470298686,15.9809963507,53.7258019104];
const swissPlanets = [6.3749279093,67.2123045354,18.3246619890,18.7150503215,38.5947159444,310.0924790888,237.8066997454,257.9784138222,273.5943611767,214.0980564589];
const distance = (a, b) => Math.abs((a - b + 540) % 360 - 180);

test('Shanghai civil birth time maps to UTC+8 without changing existing chart calculations', async () => {
  const { Origin } = require('circular-natal-horoscope-js');
  const origin = new Origin({ ...birth, month: birth.month - 1, date: birth.day });
  assert.equal(origin.timezone.name, 'Asia/Shanghai');
  assert.equal(origin.utcTimeFormatted, '1985-03-27T02:30:00Z');
  const chart = await calculateNatalChart(birth);
  chart.planets.forEach((planet, i) => assert.ok(distance(planet.absoluteDegrees, swissPlanets[i]) < .01, planet.key));
  assert.ok(distance(chart.angles[0].absoluteDegrees, swissCusps[0]) < .005);
  assert.ok(distance(chart.angles[1].absoluteDegrees, swissCusps[9]) < .005);
  // These are case-specific tolerances, not a general accuracy guarantee for this library.
  chart.houses.forEach((house, i) => assert.ok(distance(house.cuspDegrees, swissCusps[i]) < .05, `house ${i + 1}`));
  assert.equal(chart.houses[4].cuspDegrees, 195.9829);
  assert.ok(distance(chart.houses[4].cuspDegrees, swissCusps[4]) < .002);
});

test('higher-resolution display keeps seconds and leaves raw degrees intact', () => {
  assert.equal(formatDegrees(15.9829), '15° 58′ 58″');
  assert.equal(formatDegrees(28.7917), '28° 47′ 30″');
  assert.equal(formatDegrees(NaN), '--');
  const source = readFileSync(new URL('../features/stella/components/stella-client.tsx', import.meta.url), 'utf8');
  assert.ok(source.includes('formatDegrees(p.signDegrees)'));
  assert.ok(source.includes('formatDegrees(h.signDegrees)'));
  assert.ok(source.includes('h.cuspDegrees.toFixed(6)'));
});
