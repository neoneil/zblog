import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";

const require = createRequire(import.meta.url);
function load(path, imports = {}) {
  const { outputText } = ts.transpileModule(
    readFileSync(new URL(path, import.meta.url), "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    },
  );
  const exports = {};
  new Function("require", "exports", outputText)(
    (name) => imports[name] ?? require(name),
    exports,
  );
  return exports;
}
const catalog = load("../features/services/lib/catalog.ts");
const cart = load("../features/services/lib/cart.ts", { "./catalog": catalog });

test("three bilingual products have distinct local images, minor-unit AUD prices and valid routes", () => {
  assert.equal(catalog.products.length, 3);
  assert.equal(new Set(catalog.products.map((p) => p.id)).size, 3);
  assert.equal(new Set(catalog.products.map((p) => p.slug)).size, 3);
  assert.equal(new Set(catalog.products.map((p) => p.image)).size, 3);
  for (const p of catalog.products) {
    assert.ok(existsSync(new URL(`../public${p.image}`, import.meta.url)));
    assert.ok(Number.isSafeInteger(p.priceCents) && p.priceCents > 0);
    assert.ok(p.title.en.length && p.title.zh.length && p.intro.zh.length);
    assert.equal(catalog.productHref(p), `/services/${p.slug}`);
  }
  assert.equal(catalog.getProduct("tarot-reading").priceCents, 14378);
  assert.match(catalog.formatPrice(14378), /143\.78/);
});

test("filters and all sort options work without mutating the catalog", () => {
  const before = JSON.stringify(catalog.products);
  assert.equal(catalog.selectProducts("courses", "title-asc").length, 2);
  assert.equal(catalog.selectProducts("readings", "title-asc").length, 1);
  for (const field of ["title", "price", "date"]) {
    const asc = catalog.selectProducts("all", `${field}-asc`).map((p) => p.id);
    const desc = catalog
      .selectProducts("all", `${field}-desc`)
      .map((p) => p.id);
    assert.deepEqual(asc, desc.reverse());
  }
  assert.equal(
    catalog.selectProducts("all", "title-asc")[0].id,
    "transits-course",
  );
  assert.equal(
    catalog.selectProducts("all", "price-asc")[0].id,
    "tarot-reading",
  );
  assert.equal(JSON.stringify(catalog.products), before);
});

test("cart rejects corrupt, forged and out-of-bounds records and merges duplicate products", () => {
  for (const value of [null, {}, "not-json", 1])
    assert.deepEqual(cart.normaliseCart(value), []);
  assert.deepEqual(
    cart.normaliseCart([
      { productId: "fake", quantity: 1 },
      { productId: "tarot-reading", quantity: 0 },
      { productId: "tarot-reading", quantity: 100 },
      { productId: "tarot-reading", quantity: 1.2 },
    ]),
    [],
  );
  assert.deepEqual(
    cart.normaliseCart([
      { productId: "tarot-reading", quantity: 90 },
      { productId: "tarot-reading", quantity: 20 },
    ]),
    [{ productId: "tarot-reading", quantity: 99 }],
  );
  const forged = [{ productId: "tarot-reading", quantity: 2, priceCents: 1 }];
  assert.equal(cart.cartTotals(forged).subtotalCents, 28756);
});

test("quantities, removals and exact integer subtotals remain consistent", () => {
  let value = cart.changeQuantity([], "tarot-reading", 1);
  value = cart.changeQuantity(value, "tarot-reading", 3);
  value = cart.changeQuantity(value, "natal-masterclass", 2);
  assert.deepEqual(cart.cartTotals(value), { count: 5, subtotalCents: 106934 });
  assert.deepEqual(cart.changeQuantity(value, "fake", 1), value);
  assert.deepEqual(cart.changeQuantity(value, "tarot-reading", -1), value);
  assert.deepEqual(cart.changeQuantity(value, "tarot-reading", 100), value);
  value = cart.changeQuantity(value, "tarot-reading", 0);
  assert.deepEqual(cart.cartTotals(value), { count: 2, subtotalCents: 63800 });
  assert.deepEqual(cart.changeQuantity(value, "natal-masterclass", 0), []);
});
