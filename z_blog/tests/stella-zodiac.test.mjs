import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";

const require = createRequire(import.meta.url);
function load(file) {
  const { outputText } = ts.transpileModule(
    readFileSync(new URL(file, import.meta.url), "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    },
  );
  const exports = {};
  new Function("require", "exports", outputText)(require, exports);
  return exports;
}
const { zodiacProfiles } = load("../features/stella/lib/zodiac-profiles.ts");
const { signSlugs } = load("../features/stella/lib/explore-config.ts");

test("twelve complete bilingual profiles preserve every zodiac section", () => {
  assert.equal(zodiacProfiles.length, signSlugs.length);
  const unique = new Set();
  for (let sign = 0; sign < 12; sign++) {
    const profile = zodiacProfiles[sign];
    for (const key of [
      "dates",
      "purpose",
      "lesson",
      "sun",
      "moon",
      "rising",
      "midheaven",
    ]) {
      assert.ok(profile[key].en.trim().length > 0, `${signSlugs[sign]} ${key}`);
      assert.match(profile[key].zh, /[\u3400-\u9fff]/);
    }
    for (const key of ["about", "traits", "strengths", "challenges"]) {
      assert.ok(profile[key].length >= 4, `${signSlugs[sign]} ${key}`);
      for (const item of profile[key]) {
        assert.ok(item.en.trim().length > 0);
        assert.match(item.zh, /[\u3400-\u9fff]/);
      }
    }
    assert.equal(profile.bestMatches.length, 4);
    assert.equal(new Set(profile.bestMatches).size, 4);
    assert.ok(
      profile.bestMatches.every(
        (i) => Number.isInteger(i) && i >= 0 && i < 12 && i !== sign,
      ),
    );
    unique.add(profile.about[0].en);
  }
  assert.equal(unique.size, 12);
});

test("homepage categories retain the three module entrances and bilingual descriptions", () => {
  const { categories } = load("../lib/categories.ts");
  assert.deepEqual(categories[1].title, { en: "Zodiac Signs", zh: "十二星座" });
  assert.equal(categories[1].href, "/stella/zodiac");
  assert.deepEqual(categories[2].title, { en: "Horoscopes", zh: "星座运势" });
  assert.equal(categories[2].href, "/stella/horoscope");
  assert.equal(categories[0].href, undefined);
  assert.match(categories[0].title.en, /Astrology Tools$/);
  assert.match(categories[0].title.zh.trim(), /占星工具$/);
  assert.match(categories[0].description.en, /eleven astrology tools/);
  assert.match(categories[1].description.en, /Sun, Moon, Rising/);
  assert.match(categories[2].description.en, /daily, monthly and yearly/);
  for (const category of categories.slice(0, 3)) {
    assert.match(category.description.zh, /[\u3400-\u9fff]/);
    assert.ok(category.description.en.length > 40);
  }
  assert.equal(categories[3].href, undefined);
});

test("Astrology Tools derives all eleven links from the shared registry", () => {
  const page = readFileSync(
    new URL(
      "../app/categories/understanding-children/page.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  const overview = readFileSync(
    new URL(
      "../features/stella/components/stella-tools-overview.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  const shell = readFileSync(
    new URL(
      "../features/stella/components/explore-shared.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  assert.match(page, /StellaToolsOverview/);
  assert.doesNotMatch(page, /supabase/);
  assert.match(overview, /ExploreShell/);
  assert.match(overview, /title=\{categories\[0\]\.title\}/);
  assert.match(shell, /tools = stellaTools/);
  assert.match(shell, /tools\.map/);
  assert.match(overview, /tools=\{stellaTools\}/);
});
