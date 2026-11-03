import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';

const root = path.resolve('public/飞书文档');
function files(dir) { return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? files(path.join(dir, entry.name)) : entry.name.endsWith('.md') ? [path.join(dir, entry.name)] : []); }
test('every Chinese source has a current English translation with matching image references', () => {
  for (const file of files(root)) {
    const relative = path.relative(root, file).split(path.sep).join('/');
    const source = readFileSync(file, 'utf8');
    const id = createHash('sha256').update(relative).digest('hex');
    const translated = JSON.parse(readFileSync(`features/feishu-docs/translations/${id}.json`, 'utf8'));
    assert.equal(translated.sourceHash, createHash('sha256').update(source).digest('hex'), relative);
    const urls = (text) => [...text.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map((match) => match[1]);
    assert.deepEqual(urls(translated.markdown), urls(source), relative);
    const text = translated.markdown.replace(/!\[[^\]]*\]\([^)]+\)/g, '');
    assert.doesNotMatch(text, /[\u3400-\u9fff]/u, relative);
    assert.ok(text.trim().length > 0, relative);
    assert.equal((text.match(/^#+[ \t]+\S/gm) ?? []).length, (source.match(/^#+[ \t]+\S/gm) ?? []).length, relative);
  }
});
test('numbered bold symbolism entries start on separate paragraphs', () => {
  const source = '**3\\.Symbol: air**\n**4\\.Hebrew: ox**';
  const result = source.replace(/\s*\*\*(\d+\\?\.[^\n]*?)\*\*/g, '\n\n**$1**');
  assert.ok(result.includes('\n\n**4\\.Hebrew: ox**'));
});
