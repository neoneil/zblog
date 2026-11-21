import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import ts from "typescript";

// Read the original copy through the TypeScript parser rather than duplicating it.
async function constant(file, name) {
  const text = await readFile(file, "utf8");
  const source = ts.createSourceFile(
    file,
    text,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  let initializer;
  function visit(node) {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === name
    )
      initializer = node.initializer;
    ts.forEachChild(node, visit);
  }
  visit(source);
  assert.ok(initializer, `Missing copy source ${name}`);
  const js = ts.transpileModule(
    `export default ${initializer.getText(source)}`,
    {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
      },
    },
  ).outputText;
  return (
    await import(
      `data:text/javascript;base64,${Buffer.from(js).toString("base64")}`
    )
  ).default;
}
const archive = await constant(
  "features/thoth/components/knowledge-entries.tsx",
  "knowledgeEntries",
);
const celestial = await constant(
  "features/stella/lib/celestial-entries.ts",
  "celestialEntries",
);
const sectionCopy = await constant(
  "features/stella/lib/celestial-entries.ts",
  "celestialSectionCopy",
);
const { chromium } = await import(
  pathToFileURL(
    process.env.PLAYWRIGHT_MODULE ||
      "/tmp/zblog-browser-check/node_modules/playwright-core/index.mjs",
  )
);
const base = process.env.HOME_TEST_URL || "http://localhost:3001";
const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox"],
});
try {
  for (const { width, theme, language } of [
    { width: 320, theme: "dark", language: "zh" },
    { width: 1440, theme: "light", language: "en" },
  ]) {
    const context = await browser.newContext({
      viewport: { width, height: 1000 },
    });
    await context.addInitScript(
      ({ theme, language }) => {
        localStorage.setItem("site-theme", theme);
        localStorage.setItem("site-language", language);
      },
      { theme, language },
    );
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(base, { waitUntil: "networkidle" });
    await page.locator("#home-explore:visible a").first().click();
    await page.waitForURL("**/esoteric-archive");
    await page.waitForLoadState("networkidle");
    const cards = page.locator("#home-knowledge:visible a");
    await cards.first().waitFor();
    assert.equal(await cards.count(), 4);
    for (let index = 0; index < archive.length; index++) {
      assert.equal(
        await cards.nth(index).locator("h3").textContent(),
        archive[index][language],
      );
      assert.equal(
        await cards.nth(index).locator("p").textContent(),
        archive[index].description[language],
      );
      assert.equal(
        await cards.nth(index).getAttribute("href"),
        `/thoth/${archive[index].slug}?lang=${language}`,
      );
    }
    await page.screenshot({
      path: `/tmp/esoteric-archive-${width}-${language}.png`,
      fullPage: true,
      style: "aside { display:none !important; }",
    });
    console.log(
      `PASS ${language}: archive navigation, original four cards, full subtitles and destinations`,
    );

    await page.goto(`${base}/categories/understanding-children`, {
      waitUntil: "networkidle",
    });
    const tools = page.locator("[data-stella-tool]:visible");
    await tools.first().waitFor();
    assert.equal(await tools.count(), 13);
    assert.deepEqual(
      await tools.evaluateAll((items) =>
        items.map((item) => Number(item.dataset.toolIndex)),
      ),
      Array.from({ length: 13 }, (_, i) => i + 1),
    );
    assert.deepEqual(
      await tools.evaluateAll((items) =>
        items.map((item) => item.getAttribute("href")),
      ),
      [
        "/stella",
        "/stella/compatibility",
        "/stella/birth-chart",
        "/stella/todays-sky",
        "/stella/moon-calendar",
        "/stella/retrograde",
        "/stella/void-of-course-moon",
        "/stella/planets",
        "/stella/numerology",
        "/stella/birthday",
        "/stella/eclipse",
        "/stella/zodiac",
        "/stella/horoscope",
      ],
    );
    for (const [offset, slug] of [
      [1, "zodiac"],
      [2, "horoscope"],
    ]) {
      const card = page.locator(`[data-stella-tool="${slug}"]:visible`);
      assert.equal(
        await card.locator("h3").textContent(),
        celestial[offset].title[language],
      );
      assert.equal(
        await card.locator("p").textContent(),
        celestial[offset].description[language],
      );
      assert.ok(
        decodeURIComponent(
          await card.locator("img").getAttribute("src"),
        ).includes(celestial[offset].backgroundImage),
      );
      assert.equal(
        (await context.request.get(`${base}/stella/${slug}`)).status(),
        200,
      );
    }
    assert.ok(
      (await page.locator("main").innerText()).includes(
        celestial[0].description[language],
      ),
    );
    assert.ok(
      (await page.locator("main").innerText()).includes(
        sectionCopy.description[language],
      ),
    );
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    await page.screenshot({
      path: `/tmp/stellar-tools-${width}-${language}.png`,
      fullPage: true,
      style: "aside { display:none !important; }",
    });
    console.log(
      `PASS ${language}: thirteen tools; zodiac and horoscope are 12/13 with original images and subtitles`,
    );

    await page.goto(`${base}/community`, { waitUntil: "networkidle" });
    assert.ok(
      (await page.locator("main").innerText()).includes(
        language === "zh"
          ? "你的星座，你的守护者，你的星辰同伴。"
          : "Your Sign. Your Guardian. Your People.",
      ),
    );
    await page.goto(`${base}/services`, { waitUntil: "networkidle" });
    assert.ok(
      (await page.locator("main").innerText()).includes(
        language === "zh"
          ? "从古老智慧到日常魔法——探索神秘学课程、专属解读与魔法珍藏。"
          : "From Ancient Wisdom to Everyday Magic — Discover Courses, Readings & Mystical Treasures.",
      ),
    );
    await page.goto(
      `${base}/parentinglab/healingdaily/videos?category=general`,
      { waitUntil: "networkidle" },
    );
    assert.equal(new URL(page.url()).pathname, "/login");
    assert.deepEqual(errors, []);
    console.log(
      `PASS ${language}: community/shop subtitles preserved; video admin access unchanged`,
    );
    await context.close();
  }
} finally {
  await browser.close();
}
