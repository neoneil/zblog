import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const exports = {};
new Function('exports', ts.transpileModule(readFileSync(new URL('../features/stella/lib/retrograde-reference.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(exports);
const { retrogradeReferenceDate } = exports;
test('selected year changes snapshot date while keeping the UTC month and time', () => {
  const now = new Date('2026-11-07T10:24:35.123Z');
  assert.equal(retrogradeReferenceDate(2026, now).toISOString(), now.toISOString());
  assert.equal(retrogradeReferenceDate(2025, now).toISOString(), '2025-11-07T10:24:35.123Z');
  assert.equal(retrogradeReferenceDate(2027, now).toISOString(), '2027-11-07T10:24:35.123Z');
  assert.equal(now.toISOString(), '2026-11-07T10:24:35.123Z');
});
test('leap day clamps correctly and invalid dates are rejected', () => {
  const leap = new Date('2024-02-29T12:00:00Z');
  assert.equal(retrogradeReferenceDate(2025, leap).toISOString(), '2025-02-28T12:00:00.000Z');
  assert.equal(retrogradeReferenceDate(2028, leap).toISOString(), '2028-02-29T12:00:00.000Z');
  assert.throws(() => retrogradeReferenceDate(1800, leap));
  assert.throws(() => retrogradeReferenceDate(2025, new Date('invalid')));
});
