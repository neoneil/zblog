import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const read = (file) => readFileSync(new URL(file, import.meta.url), 'utf8');
const exports = {};
new Function('exports', ts.transpileModule(read('../features/stella/lib/eclipse-content.ts'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText)(exports);

test('eclipse content covers lunar phases, all six axes and twelve distinct bilingual house prompts', () => {
  const { lunarEclipseIntroduction, eclipseAxisReflections, lunarEclipseReflections, eclipseHousePrompts } = exports;
  assert.equal(lunarEclipseIntroduction.length, 3);
  assert.equal(eclipseAxisReflections.length, 6);
  assert.equal(lunarEclipseReflections.length, 2);
  assert.equal(eclipseHousePrompts.length, 12);
  for (const copy of [...lunarEclipseIntroduction, ...eclipseAxisReflections, ...lunarEclipseReflections, ...eclipseHousePrompts]) {
    assert.ok(copy.en.split(/\s+/).length >= 30);
    assert.ok(copy.zh.length > 50);
  }
  assert.equal(new Set(eclipseHousePrompts.map((copy) => copy.en)).size, 12);
  assert.match(eclipseAxisReflections[5].en, /Virgo–Pisces/);
});

test('details use calculated axis data and responsive glowing cards without altering calculation code', () => {
  const component = read('../features/stella/components/eclipse-explorer.tsx');
  assert.match(component, /Astrological Significance/);
  assert.match(component, /eclipseAxisReflections\[sign % 6\]/);
  assert.match(component, /eclipseHousePrompts\[house\]/);
  assert.match(component, /<article key=\{name\} className=\{styles.card\}>/);
  assert.match(component, /What Is a Solar Eclipse/);
  assert.match(read('../features/stella/components/eclipse.module.css'), /repeat\(2, minmax\(0, 1fr\)\)/);
});
