import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { dirname, normalize } from "node:path";
import ts from "typescript";

const root = new URL("../", import.meta.url);
const cache = new Map();
function load(file) {
  if (cache.has(file)) return cache.get(file);
  const exports = {};
  cache.set(file, exports);
  const js = ts.transpileModule(readFileSync(new URL(file, root), "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  new Function("exports", "require", js)(exports, (name) => {
    if (name.startsWith("."))
      return load(
        normalize(dirname(file) + "/" + name).replaceAll("\\", "/") + ".ts",
      );
    throw new Error(name);
  });
  return exports;
}
const { serviceGuides } = load("features/services/lib/service-guides.ts");
const { serviceGuideImages } = load(
  "features/services/lib/service-guide-assets.ts",
);
const { products } = load("features/services/lib/catalog.ts");
const ids = [
  "transits-course",
  "tarot-course",
  "natal-masterclass",
  "tarot-reading",
];

test("Word-defined guides and embedded images apply to exactly four online products", () => {
  assert.deepEqual(Object.keys(serviceGuides).sort(), ids.slice().sort());
  assert.deepEqual(Object.keys(serviceGuideImages).sort(), ids.slice().sort());
  assert.equal(products.length, 7);
  for (const id of ids) {
    const product = products.find((p) => p.id === id);
    assert.equal(product.image, serviceGuideImages[id]);
    const path = new URL("public" + product.image, root);
    assert.ok(existsSync(path));
    const png = readFileSync(path);
    assert.equal(png.subarray(1, 4).toString(), "PNG");
    assert.ok(png.readUInt32BE(16) > 600 && png.readUInt32BE(20) > 600);
  }
  for (const product of products.filter((p) => p.category === "physical")) {
    assert.equal(serviceGuides[product.id], undefined);
    const physicalImages = {
      "celestial-jewelry": "/products/star.png",
      "mystic-fragrances": "/products/letter.png",
      "arcane-creations": "/products/apple.png",
    };
    assert.equal(product.image, physicalImages[product.id]);
    assert.ok(existsSync(new URL("public" + product.image, root)));
  }
  assert.deepEqual(
    products.slice(0, 4).map((p) => p.priceCents),
    [29900, 18900, 24900, 14378],
  );
});

test("every guide includes complete bilingual copy without editorial placeholders", () => {
  function walk(value) {
    if (Array.isArray(value)) return value.forEach(walk);
    if (!value || typeof value !== "object") return;
    if ("zh" in value || "en" in value) {
      for (const lang of ["zh", "en"]) {
        assert.ok(value[lang]?.length);
        const text =
          typeof value[lang] === "string"
            ? value[lang]
            : value[lang]
                .map((p) => (typeof p === "string" ? p : p.label))
                .join("");
        assert.ok(
          !/缺失英文|缺失中文|链接留空|连接到http|localhost:3001/.test(text),
        );
        if (lang === "en") assert.ok(!/[\u4e00-\u9fff]/.test(text));
      }
    }
    Object.values(value).forEach(walk);
  }
  Object.values(serviceGuides).forEach(walk);
});

test("course guides contain the specified 20-hour tuition and annual academy access", () => {
  for (const id of ["transits-course", "tarot-course"]) {
    const guide = serviceGuides[id];
    const advanced = guide.sections.find((s) => s.id === "advanced-course");
    const annual = guide.sections.find((s) => s.id === "annual-membership");
    assert.match(advanced.title.zh, /20小时/);
    assert.match(advanced.title.en, /20 Hours/);
    assert.equal(advanced.lists[0].items.length, id === "tarot-course" ? 8 : 5);
    assert.ok(
      JSON.stringify(annual).includes(
        "/parentinglab/healingdaily/videos?category=general",
      ),
    );
    assert.equal(annual.cta.en, "BECOME AN ANNUAL MEMBER");
    assert.equal(annual.cta.href, undefined);
  }
});

test("consultation guides distinguish standalone 60-minute and monthly shared 15-minute benefits", () => {
  for (const id of ["natal-masterclass", "tarot-reading"]) {
    const guide = serviceGuides[id];
    const single = guide.sections.find(
      (s) => s.id === "individual-consultation",
    );
    const monthly = guide.sections.find((s) => s.id === "monthly-membership");
    assert.match(single.title.zh, /60分钟/);
    assert.match(monthly.title.zh, /15分钟/);
    assert.match(monthly.note.zh, /仅限一次15分钟/);
    assert.match(monthly.note.zh, /不累计、不结转/);
    assert.match(monthly.note.en, /one 15-minute/);
    assert.equal(monthly.cta.en, "BECOME A MONTHLY MEMBER");
    assert.equal(monthly.cta.href, undefined);
    assert.equal(
      guide.sections.find((s) => s.id === "why-consult").highlights.length,
      5,
    );
  }
  const chart = JSON.stringify(serviceGuides["natal-masterclass"]);
  assert.ok(chart.includes('"href":"/astroplate"'));
  assert.ok(chart.includes('"href":"/classroom"'));
});
