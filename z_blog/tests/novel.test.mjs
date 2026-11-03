import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
const read = (p) => readFileSync(new URL(p, import.meta.url), "utf8");
const compiled = ts.transpileModule(read("../features/tarot-novel/lib/youtube.ts"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const exports = {};
new Function("exports", compiled)(exports);
test("YouTube URLs are restricted to video IDs on trusted HTTPS hosts", () => {
  for (const url of ["https://youtu.be/M7lc1UVf-VE", "https://www.youtube.com/watch?v=M7lc1UVf-VE", "https://youtube.com/shorts/M7lc1UVf-VE"]) assert.equal(exports.youtubeEmbed(url), "https://www.youtube-nocookie.com/embed/M7lc1UVf-VE");
  for (const url of [null, "javascript:alert(1)", "https://youtube.com.evil.com/watch?v=M7lc1UVf-VE", "http://youtu.be/M7lc1UVf-VE", "https://youtube.com/watch?v=bad"]) assert.equal(exports.youtubeEmbed(url), null);
});
test("public readers filter publication and admin writes require shared guard", () => {
  assert.match(read("../features/tarot-novel/lib/chapters.ts"), /eq\("status", "published"\)/);
  assert.match(read("../app/admin/novel/actions.ts"), /await requireAdmin/);
  assert.match(read("../app/admin/novel/page.tsx"), /await requireAdmin/);
  assert.match(read("../supabase/novel-chapters.sql"), /enable row level security/);
  assert.match(read("../supabase/novel-chapters.sql"), /role = 'admin'/);
});
test("chapter selection, bilingual reading, and safe plain text rendering", () => {
  const source = read("../features/tarot-novel/components/astrology-tarot-novel.tsx");
  assert.match(source, /setSelected\(item.id\)/);
  assert.match(source, /阅读本章节/);
  assert.match(source, /field\(current, "content"\)/);
  assert.doesNotMatch(source, /dangerouslySetInnerHTML|给小小探索者的线索|海王星：梦与想象/);
});

test("chapter deletion is guarded and requires explicit UI confirmation", () => {
  const actions = read("../app/admin/novel/actions.ts");
  const deletion = actions.slice(actions.indexOf("export async function deleteChapter"), actions.indexOf("export async function saveChapter"));
  assert.match(deletion, /await requireAdmin/);
  assert.match(deletion, /delete\(\)\.eq\("id", id\)/);
  assert.match(read("../features/tarot-novel/components/chapter-editor.tsx"), /window.confirm/);
});

test("comments bind authenticated identity, enforce database limits, and replace demo reviews", () => {
  const actions = read("../app/tarot-novel/comment-actions.ts");
  assert.match(actions, /auth.getUser\(\)/);
  assert.match(actions, /user_id: user.id/);
  assert.match(actions, /body.length > 2000/);
  const sql = read("../supabase/novel-comments.sql");
  assert.match(sql, /enable row level security/);
  assert.match(sql, /on delete cascade/);
  assert.match(sql, /pg_advisory_xact_lock/);
  assert.match(sql, /interval '1 minute'/);
  assert.match(sql, /c.status = 'published'/);
  const component = read("../features/tarot-novel/components/reader-comments.tsx");
  assert.doesNotMatch(component, /dangerouslySetInnerHTML/);
  assert.match(component, /comment.body/);
  assert.doesNotMatch(read("../features/tarot-novel/components/astrology-tarot-novel.tsx"), /Ethan|Lily|Mia/);
});
