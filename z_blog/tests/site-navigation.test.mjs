import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const root = new URL('../', import.meta.url);
const read = file => readFileSync(new URL(file, root), 'utf8');
function load(file) {
  const exports = {};
  const output = ts.transpileModule(read(file), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  new Function('exports', 'require', output)(exports, name => {
    if (name === '@/features/services/lib/catalog') return load('features/services/lib/catalog.ts');
    if (name === './service-guide-assets') return load('features/services/lib/service-guide-assets.ts');
    throw new Error(name);
  });
  return exports;
}
const { siteNavigation: entries } = load('components/site/navigation-data.ts');
const byId = id => entries.find(entry => entry.id === id);

test('top level follows the requested order with Community as a direct link', () => {
  assert.deepEqual(entries.map(entry => entry.id), ['home','stories','archive','tarot','blueprints','celestial','shop','community','contact']);
  assert.equal(byId('community').href, '/community');
  assert.equal(byId('community').children, undefined);
  assert.equal(byId('stories').href, '/tarot-novel');
  assert.equal(byId('classroom'), undefined);
  assert.equal(byId('about'), undefined);
  assert.equal(byId('contact').label.zh, '联系我们');
});

test('five category dropdowns have 4/4/4/4/7 links matching home destinations', () => {
  assert.deepEqual(['archive','tarot','blueprints','celestial','shop'].map(id => byId(id).children.length), [4,4,4,4,7]);
  assert.deepEqual(byId('archive').children.map(item => item.href), ['/thoth/tree-of-life','/thoth/tarot','/thoth/astrology','/thoth/library']);
  assert.deepEqual(byId('tarot').children.map(item => item.href), ['/tarot-ai','/feishu-docs','/thoth-tarot/readings','/thoth-tarot']);
  assert.deepEqual(byId('blueprints').children.map(item => item.href), ['/astroplate','/synastry','/stella','/stella/numerology']);
  assert.deepEqual(byId('celestial').children.map(item => item.href), ['/categories/understanding-children','/stella/zodiac','/stella/horoscope','/parentinglab/healingdaily/videos?category=general']);
  const { products, productHref } = load('features/services/lib/catalog.ts');
  assert.deepEqual(byId('shop').children.map(item => item.href), products.map(productHref));
  assert.deepEqual(byId('contact').children.map(item => item.href), ['/classroom','/aboutus','/contact','/#home-newsletter']);
});

test('all labels are bilingual, utility controls and authorization remain present', () => {
  entries.flatMap(entry => [entry, ...(entry.children || [])]).forEach(entry => {
    assert.ok(entry.label.en && entry.label.zh);
    if (entry.href) assert.ok(entry.href.startsWith('/'));
  });
  const navbar = read('components/site/navbar-client.tsx');
  for (const text of ['<CartLink />','href="/pricing"','canManagePosts &&','href="/admin"','<LogoutButton />','<ThemeToggle />','<LanguageToggle />','src={avatar}']) assert.ok(navbar.includes(text), text);
  assert.ok(!navbar.includes('{email}'));
  assert.ok(!navbar.includes('>{name}</span>'));
  const nav = read('components/site/site-navigation.tsx');
  for (const text of ['aria-expanded','aria-controls','ArrowDown','ArrowUp','Escape','pointerdown','localizedQuery']) assert.ok(nav.includes(text), text);
});

test('footer reuses navbar groups with vertical children and no legacy link collections', () => {
  const footer = read('components/site/footer.tsx');
  const navigation = read('components/site/footer-navigation.tsx');
  const css = read('components/site/footer-navigation.module.css');
  assert.ok(footer.includes('<FooterNavigation />'));
  for (const legacy of ['footerColumns', 'zodiacLinks', 'horoscopeLinks', 'stellaTools']) assert.ok(!footer.includes(legacy));
  assert.ok(navigation.includes('from "./navigation-data"'));
  assert.ok(navigation.includes('siteNavigation.filter'));
  assert.ok(navigation.includes('entry.children!.map'));
  assert.ok(navigation.includes('child.localizedQuery'));
  assert.ok(navigation.includes('t(child.label)'));
  assert.match(css, /\.children\s*\{[^}]*flex-direction:\s*column/s);
  assert.equal(entries.flatMap(entry => entry.children || [entry]).length, 30);
});
