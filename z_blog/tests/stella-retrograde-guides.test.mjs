import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const exports = {};
const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
new Function('exports', ts.transpileModule(read('../features/stella/lib/retrograde-guides.ts'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(exports);
for (const file of ['retrograde-myths', 'retrograde-practices']) {
  new Function('exports', ts.transpileModule(read(`../features/stella/lib/${file}.ts`), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(exports);
}
test('each planet has four substantial bilingual myth explanations and practical exercises', () => {
  for (const [planet, guide] of Object.entries(exports.retrogradeGuides)) {
    for (const [details, fields] of [[exports.retrogradeMyths[planet], ['context', 'action']], [exports.retrogradePractices[planet], ['steps', 'example']]]) {
      assert.equal(details.length, guide.practices.length);
      for (const detail of details) {
        for (const field of fields) assert.ok(detail[field].en && detail[field].zh);
        assert.ok(fields.map((field) => detail[field].en).join(' ').split(/\s+/).length >= 50, `${planet} needs a substantial explanation`);
      }
    }
  }
  const component = read('../features/stella/components/planet-retrograde-guide.tsx');
  for (const field of ['explanation.context', 'explanation.action', 'detail.steps', 'detail.example']) assert.ok(component.includes(field));
});
test('all eight planets have bilingual individual guides, four practical tips and four misconception cards', () => {
  assert.deepEqual(Object.keys(exports.retrogradeGuides), ['mercury','venus','mars','jupiter','saturn','uranus','neptune','pluto']);
  for (const guide of Object.values(exports.retrogradeGuides)) {
    assert.equal(guide.practices.length, 4);
    assert.equal(guide.misconceptions.length, 4);
    for (const copy of [guide.summary, guide.cycle, guide.deeper, ...guide.practices, ...guide.misconceptions]) assert.ok(copy.en && copy.zh);
  }
});
test('guides preserve year navigation, expose all section types and show twelve sign interpretations', () => {
  const component = read('../features/stella/components/planet-retrograde-guide.tsx');
  for (const title of ['Myths vs. Reality', 'A Deeper Perspective', 'Practical Tips']) assert.ok(component.includes(title));
  assert.match(component, /signSlugs.map/);
  assert.match(component, /position.signIndex - index/);
  assert.match(component, /<FAQ/);
  const parent = read('../features/stella/components/retrograde-explorer.tsx');
  assert.match(parent, /Full \$\{planetCopy\[key\].name.en\} Retrograde Guide/);
  assert.match(parent, /retrograde\/\$\{key\}\?year=\$\{year\}/);
  const css = read('../features/stella/components/retrograde.module.css');
  assert.match(css, /repeat\(2, minmax\(0, 1fr\)\)/);
});
