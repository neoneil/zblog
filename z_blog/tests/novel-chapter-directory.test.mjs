import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";

const { build } = await import(
  pathToFileURL(
    process.env.ESBUILD_MODULE ||
      "/tmp/zblog-billing-test/node_modules/esbuild/lib/main.js",
  )
);
const bundle = await build({
  entryPoints: ["features/tarot-novel/lib/novel-world.ts"],
  write: false,
  bundle: true,
  format: "esm",
  platform: "node",
  packages: "external",
});
const { acts } = await import(
  `data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString("base64")}`
);
const { chromium } = await import(
  pathToFileURL(
    process.env.PLAYWRIGHT_MODULE ||
      "/tmp/zblog-browser-check/node_modules/playwright-core/index.mjs",
  )
);
const base = process.env.NOVEL_TEST_URL || "http://localhost:3001";
const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox"],
});
try {
  for (const { width, language, theme } of [
    { width: 320, language: "zh", theme: "dark" },
    { width: 1440, language: "en", theme: "light" },
    { width: 1440, language: "zh", theme: "dark" },
  ]) {
    const context = await browser.newContext({
      viewport: { width, height: 1000 },
      reducedMotion: "reduce",
    });
    await context.addInitScript(
      ({ language, theme }) => {
        localStorage.setItem("site-language", language);
        localStorage.setItem("site-theme", theme);
      },
      { language, theme },
    );
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${base}/tarot-novel`, { waitUntil: "networkidle" });
    const directory = page.locator("#chapters:visible");
    await directory.waitFor();
    const navigation=page.locator('#novel-directory:visible a');
    assert.equal(await navigation.count(),7);
    assert.deepEqual(await navigation.evaluateAll(items=>items.map(item=>item.getAttribute('href'))),['#chapters','#synopsis','#relationships','#characters','#astrology','#trials','#forbidden-apple']);
    assert.ok((await navigation.evaluateAll(items=>items.map(item=>{const style=getComputedStyle(item);return {font:parseFloat(style.fontSize),border:parseFloat(style.borderTopWidth),height:item.getBoundingClientRect().height};}))).every(item=>item.font>=20&&item.border>=1&&item.height>=52));
    assert.equal(await page.getByRole('link',{name:/^(开始阅读|探索故事|Start reading|Explore the story)$/}).count(),0);
    assert.equal(await page.locator('main span').filter({hasText:/^\d{2} · STARDUST STORIES$/}).count(),0);
    await directory.scrollIntoViewIfNeeded();
    assert.equal(await page.locator('#acts, a[href="#acts"]').count(), 0);
    assert.equal(await directory.locator("iframe").count(), 0);
    assert.equal(
      await directory
        .getByRole("link", { name: /阅读本章节|Read this chapter/ })
        .count(),
      0,
    );
    for (const act of acts) {
      const tab = directory.getByRole("button", {
        name: act.name[language],
        exact: true,
      });
      await tab.click();
      const preview = directory.locator(`[data-act-preview="${act.number}"]`);
      await preview.waitFor();
      assert.equal(await tab.getAttribute("aria-pressed"), "true");
      assert.equal(
        await preview.locator("h3").textContent(),
        act.name[language],
      );
      assert.equal(
        await preview.locator("[data-act-summary]").textContent(),
        act.content[language],
      );
      assert.ok(
        decodeURIComponent(
          await preview.locator("img").getAttribute("src"),
        ).includes(act.image),
      );
      const links = directory.locator("a[data-chapter-number]");
      assert.equal(await links.count(), 10);
      assert.deepEqual(
        await links.evaluateAll((items) =>
          items.map((item) => Number(item.dataset.chapterNumber)),
        ),
        act.chapters.map((chapter) => chapter.number),
      );
      for (const href of await links.evaluateAll((items) =>
        items.map((item) => item.getAttribute("href")),
      ))
        assert.ok(href.startsWith("/tarot-novel/") && !href.includes("/acts/"));
      await links.last().focus();
      assert.equal(
        await preview.locator("[data-act-summary]").textContent(),
        act.content[language],
      );
      const image = await preview.locator("img").boundingBox();
      const title = await preview.locator("h3").boundingBox();
      assert.ok(title.y >= image.y + image.height);
      const left = await preview.boundingBox();
      const right = await links.locator("..").first().boundingBox();
      assert.ok(Math.abs(image.x-left.x-1)<1);
      assert.ok(Math.abs(image.width-left.width+2)<1);
      if (width >= 1024) {
        const available=left.width+right.width;
        assert.ok(Math.abs(left.width/(available*0.6)-1.3)<0.02);
        assert.ok(image.width > 900);
        assert.ok(right.width>=260);
      } else {
        assert.ok(right.y >= left.y + left.height);
        assert.ok(image.width > 190);
      }
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
      );
    }
    await directory
      .getByRole("button", { name: acts[0].name[language], exact: true })
      .click();
    await directory.screenshot({
      path: `/tmp/novel-directory-${width}-${language}-${theme}.png`,
    });
    const chapter = directory.locator("a[data-chapter-number]").nth(1);
    const href = await chapter.getAttribute("href");
    await chapter.click();
    await page.waitForURL(`**${href}`);
    await page.locator("main h1:visible").first().waitFor();
    assert.deepEqual(errors, []);
    console.log(
      `PASS ${width}px ${language} ${theme}: all five act summaries, 130% desktop preview, edge-to-edge art, direct chapter navigation`,
    );
    await context.close();
  }
} finally {
  await browser.close();
}
