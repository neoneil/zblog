import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('home hero uses an existing PNG without an unconfigured local query string', () => {
  const source = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');
  const src = source.match(/src="(\/home-[^"]+)"/)?.[1];
  assert.ok(src);
  assert.ok(!src.includes('?'));
  const image = readFileSync(new URL(`../public${src}`, import.meta.url));
  assert.equal(image.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
});
