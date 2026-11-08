import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = (file) => readFileSync(new URL(file, import.meta.url), 'utf8');
test('table treatment is loaded once for every route and preserves responsive layout', () => {
  assert.match(read('../app/layout.tsx'), /import "\.\/tables.css"/);
  const css = read('../app/tables.css');
  for (const token of ['font-size: 16px', 'font-weight: 700', 'var(--archive-heading)', 'text-shadow:', 'tbody tr:is(:hover, :focus-within)', '0 0 20px var(--button-glow)', 'prefers-reduced-motion']) assert.ok(css.includes(token));
  assert.match(css, /background: transparent !important/);
  assert.doesNotMatch(css, /display:|grid-template|width:|padding:/);
  assert.doesNotMatch(read('../features/stella/components/planets.module.css'), /ingressTable|ingressRow/);
});
