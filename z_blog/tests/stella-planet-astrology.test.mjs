import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
function load(file, require = () => { throw new Error('Unexpected import'); }) {
  const exports = {};
  new Function('exports', 'require', ts.transpileModule(read(`../features/stella/lib/${file}.ts`), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText)(exports, require);
  return exports;
}
const transits = load('planetary-transits');
const { planetAstrology } = load('planet-astrology', (path) => {
  assert.equal(path, './planetary-transits');
  return transits;
});

test('all eight planets have distinct bilingual introductions with an integrated deeper perspective', () => {
  assert.deepEqual(Object.keys(planetAstrology), ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto']);
  assert.equal(planetAstrology.mercury, transits.mercuryInAstrology);
  const firstParagraphs = new Set();
  for (const paragraphs of Object.values(planetAstrology)) {
    assert.equal(paragraphs.length, 3);
    for (const copy of paragraphs) {
      assert.ok(copy.en.length > 200 && copy.zh.length > 60);
    }
    assert.match(paragraphs[2].en, /[Rr]ay/);
    firstParagraphs.add(paragraphs[0].en);
  }
  assert.equal(firstParagraphs.size, 8);
});

test('shared detail layout places introductions before twelve glowing responsive sign cards', () => {
  const component = read('../features/stella/components/planets-explorer.tsx');
  assert.ok(component.indexOf('About ${name.en} in Astrology') < component.indexOf('${name.en} Through the Signs'));
  assert.match(component, /className=\{planetStyles.signCards\}/);
  assert.match(component, /<article key=\{i\} className=\{styles.card\}>/);
  const css = read('../features/stella/components/planets.module.css');
  assert.match(css, /grid-template-columns: minmax\(0, 1fr\)/);
  assert.match(css, /repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(read('../features/stella/components/explore.module.css'), /composes: glow from/);
});
