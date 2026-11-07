import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const source = readFileSync(new URL('../features/stella/lib/faq-content.ts', import.meta.url), 'utf8');
const exports = {};
const notes = {};
new Function('exports', ts.transpileModule(readFileSync(new URL('../features/stella/lib/faq-notes.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(notes);
new Function('exports', 'require', ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(exports, () => notes);
test('six FAQ groups cover all 31 reference question topics in both languages', () => {
  let count = 0;
  for (const [name, expected] of [['guideFaq', 6], ['numerologyFaq', 5], ['retrogradeFaq', 5], ['voidFaq', 5], ['moonFaq', 5], ['skyFaq', 5]]) {
    const items = exports[name];
    assert.equal(items.length, expected);
    assert.equal(new Set(items.map((item) => item.question.en)).size, expected);
    for (const item of items) for (const language of ['en', 'zh']) {
      assert.ok(item.question[language].length > 4);
      assert.ok(item.answer[language].length > 20);
    }
    count += items.length;
  }
  assert.equal(count, 31);
});
test('time-sensitive answers do not embed a stale calendar date or fixed current planetary state', () => {
  for (const items of [exports.skyFaq, exports.moonFaq, exports.voidFaq, exports.retrogradeFaq]) {
    for (const item of items) assert.doesNotMatch(item.answer.en, /2026|October|November|currently \d+ planets/i);
  }
});
test('each answer includes a bilingual explanation and separates its additional context', () => {
  for (const items of Object.values(exports)) for (const item of items) {
    assert.ok(item.answer.en.includes('\n\n'));
    assert.ok(item.answer.zh.includes('\n\n'));
    assert.ok(item.answer.en.length > 250);
  }
});
