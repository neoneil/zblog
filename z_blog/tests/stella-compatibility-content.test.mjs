import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const cache = new Map();
function load(name) {
  if (cache.has(name)) return cache.get(name);
  const exports = {};
  const source = readFileSync(new URL(`../features/stella/lib/${name}.ts`, import.meta.url), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  new Function('exports', 'require', code)(exports, (dependency) => load(dependency.replace('./', '')));
  cache.set(name, exports);
  return exports;
}
test('all 78 unique pairs have expanded bilingual material and both complete sign profiles', () => {
  const { compatibilityNarrative } = load('compatibility-content');
  const { zodiacProfiles } = load('zodiac-profiles');
  let count = 0;
  for (let a = 0; a < 12; a++) for (let b = a; b < 12; b++) {
    const reading = compatibilityNarrative(a, b);
    for (const paragraphs of [reading.elementParagraphs, reading.modalityParagraphs]) {
      assert.ok(paragraphs.length >= 2);
      for (const text of paragraphs) assert.ok(text.en.length > 100 && text.zh.length > 20);
    }
    for (const sign of [a, b]) {
      const profile = zodiacProfiles[sign];
      assert.ok(profile.about.length >= 3 && profile.strengths.length >= 4);
      assert.ok(profile.dates.en && profile.dates.zh && profile.purpose.en && profile.purpose.zh);
    }
    count++;
  }
  assert.equal(count, 78);
});
test('element and modality analysis is independent of input order', () => {
  const { compatibilityNarrative } = load('compatibility-content');
  for (let a = 0; a < 12; a++) for (let b = 0; b < 12; b++) {
    const forward = compatibilityNarrative(a, b), reverse = compatibilityNarrative(b, a);
    assert.deepEqual(forward.elementParagraphs.at(-1), reverse.elementParagraphs.at(-1));
    assert.deepEqual(forward.modalityParagraphs.at(-1), reverse.modalityParagraphs.at(-1));
  }
});
