import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";

const { build } = await import(
  pathToFileURL(
    process.env.ESBUILD_MODULE ||
      "/tmp/zblog-billing-test/node_modules/esbuild/lib/main.js",
  )
);
async function dataModule(file) {
  const result = await build({
    entryPoints: [file],
    bundle: true,
    write: false,
    format: "esm",
    platform: "node",
    packages: "external",
  });
  return import(
    `data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString("base64")}`
  );
}
const { tarotEntries, tarotCollections, tarotSectionCopy } = await dataModule(
  "features/tarot/lib/entry-catalog.ts",
);
const { products, productHref } = await dataModule(
  "features/services/lib/catalog.ts",
);
const email = products.find((product) => product.id === "personal-tarot-email");
const voice = products.find((product) => product.id === "tarot-reading");
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
  for (const { width, language, theme } of [
    { width: 320, language: "zh", theme: "dark" },
    { width: 1440, language: "en", theme: "light" },
  ]) {
    const context = await browser.newContext({
      viewport: { width, height: 1000 },
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
    await page.goto(base, { waitUntil: "networkidle" });
    const home = page.locator("#home-tarot:visible");
    const portals = home.locator("[data-tarot-portal]");
    await portals.first().waitFor();
    assert.equal(await portals.count(), 4);
    assert.equal(
      await home.locator("h2").textContent(),
      tarotSectionCopy.title[language],
    );
    assert.deepEqual(
      await portals.evaluateAll((items) =>
        items.map((item) => item.getAttribute("href")),
      ),
      [
        tarotCollections.readings.href,
        productHref(email),
        productHref(voice),
        tarotCollections.library.href,
      ],
    );
    assert.deepEqual(await portals.locator("h3").allTextContents(), [
      tarotCollections.readings.title[language],
      email.title[language],
      voice.title[language],
      tarotCollections.library.title[language],
    ]);
    assert.equal(
      await home.locator('[data-tarot-portal="email"] p').textContent(),
      email.intro[language],
    );
    assert.equal(
      await home.locator('[data-tarot-portal="voice"] p').textContent(),
      voice.intro[language],
    );
    for (const entry of tarotEntries)
      assert.equal(await home.locator(`a[href="${entry.href}"]`).count(), 0);
    const bounds = await portals.evaluateAll((items) =>
      items.map((item) => {
        const r = item.getBoundingClientRect();
        return { top: r.top, overflow: item.scrollWidth > item.clientWidth };
      }),
    );
    assert.ok(bounds.every((item) => !item.overflow));
    assert.equal(
      new Set(bounds.map((item) => Math.round(item.top))).size,
      width === 1440 ? 1 : 4,
    );
    await home.screenshot({
      path: `/tmp/home-tarot-portals-${width}-${language}.png`,
      style: "aside { display:none !important; }",
    });
    console.log(
      `PASS ${language}: four home entries, original product copy, direct product links and no old four cards`,
    );

    for (const [kind, indices] of [
      ["readings", [0, 2]],
      ["library", [1, 3]],
    ]) {
      await page.goto(base, { waitUntil: "networkidle" });
      await page
        .locator(
          `[data-tarot-portal="${kind === "readings" ? "online" : "library"}"]:visible`,
        )
        .click();
      await page.waitForURL(`**${tarotCollections[kind].href}`);
      const collection = page.locator(`#tarot-${kind}-collection:visible`);
      await collection.waitFor();
      const cards = collection.locator("[data-tarot-entry]");
      await cards.first().waitFor();
      assert.equal(await cards.count(), 2);
      assert.equal(
        await collection.locator("h1").textContent(),
        tarotCollections[kind].title[language],
      );
      assert.ok(
        (await collection.innerText()).includes(
          tarotSectionCopy.description[language],
        ),
      );
      for (let index = 0; index < indices.length; index++) {
        const original = tarotEntries[indices[index]];
        const card = cards.nth(index);
        assert.equal(
          await card.locator("h3").textContent(),
          original.title[language],
        );
        assert.equal(
          await card.locator("p").textContent(),
          original.description[language],
        );
        assert.equal(
          await card.getAttribute("href"),
          original.href === "/thoth-tarot/readings"
            ? `${original.href}?lang=${language}`
            : original.href,
        );
        assert.ok(
          decodeURIComponent(
            await card.locator("img").getAttribute("src"),
          ).includes(original.image),
        );
      }
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
      );
      await collection.screenshot({
        path: `/tmp/tarot-${kind}-${width}-${language}.png`,
        style: "aside { display:none !important; }",
      });
      console.log(
        `PASS ${language}: ${kind} contains precisely the original two cards, titles, full subtitles and destinations`,
      );
    }
    for (const [id, product] of [
      ["email", email],
      ["voice", voice],
    ]) {
      await page.goto(base, { waitUntil: "networkidle" });
      await page.locator(`[data-tarot-portal="${id}"]:visible`).click();
      await page.waitForURL(`**${productHref(product)}`);
      await page
        .getByRole("heading", {
          name: product.title[language],
          exact: true,
          level: 1,
        })
        .waitFor();
      console.log(
        `PASS ${language}: ${id} goes straight to its existing shop detail page`,
      );
    }
    assert.deepEqual(errors, []);
    await context.close();
  }
} finally {
  await browser.close();
}
