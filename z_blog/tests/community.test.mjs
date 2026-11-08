import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const root = new URL('../', import.meta.url);
function load(file) {
  const exports = {};
  const output = ts.transpileModule(readFileSync(new URL(file, root), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  new Function('exports', 'require', output)(exports, name => {
    if (name === '@/features/stella/lib/explore-config') return load('features/stella/lib/explore-config.ts');
    throw new Error(name);
  });
  return exports;
}
const { directoryFilters, literalSearch, profilePayload, validAvatar, validWebsite, PUBLIC_FIELDS } = load('features/community/lib/model.ts');
const read = file => readFileSync(new URL(file, root), 'utf8');
function form(extra = {}) {
  const value = new FormData();
  Object.entries({ username: 'STARS_27', display_name: 'Stellar reader', member_type: 'reader', zodiac_sign: 'aries', about: '**Hello**', is_public: 'on', ...extra }).forEach(([k,v]) => value.set(k,v));
  return value;
}

test('filters accept twelve signs and only the requested member roles', () => {
  assert.deepEqual(directoryFilters({}), { q: '', sign: '', role: '', sort: 'newest', page: 1 });
  assert.equal(directoryFilters({ sign: 'aries', role: 'reader', page: '2', sort: 'name' }).sign, 'aries');
  assert.equal(directoryFilters({ sign: 'cancer', role: 'customer' }).role, 'customer');
  assert.deepEqual(directoryFilters({ sign: 'unknown', role: 'admin', sort: 'featured', page: '-2' }), { q: '', sign: '', role: '', sort: 'newest', page: 1 });
  assert.equal(directoryFilters({ q: ['x'], page: '1.5' }).page, 1);
  assert.equal(directoryFilters({ q: 'x'.repeat(100) }).q.length, 80);
  assert.ok(!/[,%_*()]/.test(literalSearch('a%,user_id.eq.test,(x)*_')));
  assert.equal(literalSearch('王 星辰'), '王 星辰');
});

test('profile validation does not accept privilege roles, injected ownership, or unsafe URLs', () => {
  const value = profilePayload(form({ user_id: 'someone-else', role: 'admin', password: 'secret' }));
  assert.equal(value.username, 'stars_27');
  assert.equal(value.is_public, true);
  assert.ok(!('user_id' in value));
  assert.ok(!('role' in value));
  assert.ok(!('password' in value));
  for (const invalid of [{ member_type: 'admin' }, { zodiac_sign: 'ophiuchus' }, { username: '../me' }, { display_name: '' }, { about: 'x'.repeat(6001) }, { website: 'javascript:alert(1)' }]) assert.equal(profilePayload(form(invalid)), null);
  assert.equal(profilePayload(form({ is_public: '' })).is_public, false);
  assert.equal(validWebsite('https://example.com/about'), true);
  assert.equal(validWebsite('https://user:password@example.com'), false);
});

test('avatars stay in the authenticated owners project and storage folder', () => {
  const base = 'https://project.supabase.co';
  const url = `${base}/storage/v1/object/public/community-avatars/owner/1234-abcd.jpg`;
  assert.equal(validAvatar(url, 'owner', base), true);
  assert.equal(validAvatar(url, 'other', base), false);
  assert.equal(validAvatar(url.replace('project.supabase.co', 'tracker.example'), 'owner', base), false);
  assert.equal(validAvatar(url + '?token=secret', 'owner', base), false);
  assert.equal(validAvatar(url.replace('.jpg', '.svg'), 'owner', base), false);
});

test('database access is owner scoped and never exposes account email or passwords', () => {
  assert.ok(!/email|password/.test(PUBLIC_FIELDS));
  const sql = read('supabase/community.sql');
  assert.match(sql, /enable row level security/);
  assert.match(sql, /is_public or \(select auth.uid\(\)\) = user_id/);
  assert.match(sql, /with check \(\(select auth.uid\(\)\) = user_id\)/);
  assert.match(sql, /is_public boolean not null default false/);
  assert.match(sql, /security invoker/);
  assert.doesNotMatch(sql, /grant update \([^)]*created_at/);
  assert.match(sql, /storage.foldername\(name\)\)\[1\] = \(select auth.uid\(\)\)::text/);
  const server = read('features/community/lib/server.ts');
  assert.match(server, /eq\("is_public", true\)/);
  assert.match(server, /range\(start, start \+ PAGE_SIZE - 1\)/);
  const action = read('app/community/actions.ts');
  assert.match(action, /getCurrentUserWithRole\(\)/);
  assert.match(action, /user_id: user.id/);
  assert.match(action, /eq\("user_id", user.id\)/);
});

test('public biography renders safe Markdown without raw HTML, and the editor stays collapsed', () => {
  assert.match(read('features/community/components/member-detail.tsx'), /ReactMarkdown skipHtml/);
  assert.match(read('features/community/components/profile-editor.tsx'), /<details className=\{styles.editor\}>/);
  assert.match(read('features/community/components/profile-editor.tsx'), /form.delete\("password"\)/);
  assert.match(read('components/site/navigation-data.ts'), /href: "\/community"/);
  const directory = read('features/community/components/community-directory.tsx');
  assert.match(directory, /params.toString\(\)/);
  assert.doesNotMatch(directory, /params.size/);
});
