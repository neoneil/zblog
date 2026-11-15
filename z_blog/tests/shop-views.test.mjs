import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
test("home shop is a single linked entry and full catalog defaults to grid", () => {
  const source = read("../features/services/components/services-list.tsx");
  assert.match(source, /useState<"grid" \| "list">\("grid"\)/);
  const embedded = source.slice(
    source.indexOf("if (embedded)"),
    source.indexOf("const content"),
  );
  assert.match(embedded, /href="\/services"/);
  assert.doesNotMatch(embedded, /<ProductCard|<Select/);
  assert.match(source, /aria-pressed=\{view === id\}/);
  assert.match(source, /layout="list"/);
  assert.ok(
    existsSync(
      new URL("../public/products/arcane-creations.png", import.meta.url),
    ),
  );
});
test("list cards reuse existing product links, images and integer prices", () => {
  const source = read("../features/services/components/shop-shared.tsx");
  assert.match(source, /layout = "grid"/);
  assert.match(source, /productHref\(product\)/);
  assert.match(source, /formatPrice\(product.priceCents, language\)/);
  assert.match(source, /styles.listCard/);
  assert.match(source, /layout === "list"/);
});
