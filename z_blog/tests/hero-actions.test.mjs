import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const root = new URL('../', import.meta.url);
const read = file => readFileSync(new URL(file, root), 'utf8');
const source = read('components/site/home-hero-actions.tsx');
const ast = ts.createSourceFile('hero.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
let actions;
function visit(node) {
  if (ts.isVariableDeclaration(node) && node.name.getText(ast) === 'actions') {
    actions = node.initializer.elements.map(item => Object.fromEntries(item.properties.map(property => [property.name.getText(ast), property.initializer.text])));
  }
  ts.forEachChild(node, visit);
}
visit(ast);
const catalog = {};
new Function('exports', ts.transpileModule(read('features/services/lib/catalog.ts'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(catalog);

test('all six hero actions link to existing tool, membership or product pages', () => {
  assert.equal(actions.length, 6);
  assert.deepEqual(actions.slice(0, 4).map(action => action.href), ['/tarot-novel', '/stella', '/tarot-ai', '/pricing']);
  for (const title of ['CHART CONSULTATION', 'TAROT CONSULTATION']) {
    const product = catalog.products.find(product => product.title.en === title);
    assert.ok(product);
    assert.equal(actions.find(action => action.en === title).href, catalog.productHref(product));
  }
  assert.ok(actions.every(action => action.href && action.zh && action.en));
  assert.ok(!source.includes('disabled'));
});

test('hero, membership, cart and its badge share the same glass appearance', () => {
  for (const path of ['components/site/home-hero-actions.tsx', 'components/site/navbar-client.tsx', 'features/services/components/shop-shared.tsx']) {
    assert.ok(read(path).includes('glass-action.module.css'), path);
    assert.ok(read(path).includes('glassStyles.action'), path);
  }
  assert.ok(read('features/services/components/shop-shared.tsx').includes('glassStyles.badge'));
  const css = read('components/ui/glass-action.module.css');
  assert.match(css, /\.badge \{ composes: action/);
  assert.match(css, /\.action:focus-visible/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(read('app/layout.tsx'), /import "\.\/home-hero-theme.css"/);
});
