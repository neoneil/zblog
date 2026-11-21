import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";

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
const labels = {
  zh: ["秘学之源", "星象与天机", "星学影院", "星魂社区", "奥秘商店"],
  en: [
    "Esoteric Archive",
    "Celestial Insights",
    "Stellar Cinema",
    "Stellar Community",
    "Mystic Shop",
  ],
};
try {
  for (const width of [320, 1440])
    for (const theme of ["light", "dark"])
      for (const language of ["zh", "en"]) {
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
        const section = page.locator("#home-explore:visible");
        await section.waitFor();
        await page.waitForFunction(
          ({ theme, language }) =>
            document.documentElement.dataset.theme === theme &&
            Array.from(document.querySelectorAll("#home-explore")).some(
              (element) =>
                element.getClientRects().length &&
                element.dataset.language === language,
            ),
          { theme, language },
        );
        assert.deepEqual(
          await section.locator("h2").allTextContents(),
          labels[language],
        );
        assert.equal(await section.locator("li").count(), 5);
        assert.deepEqual(
          await section
            .locator("a")
            .evaluateAll((links) =>
              links.map((link) => link.getAttribute("href")),
            ),
          [
            "/esoteric-archive",
            "/categories/understanding-children",
            "/parentinglab/healingdaily/videos?category=general",
            "/community",
            "/services",
          ],
        );
        assert.equal(
          await page
            .locator(
              "#home-knowledge, #home-astrology, #home-services, #home-stellar-houses",
            )
            .count(),
          0,
        );
        assert.equal(
          await section.evaluate((element) => {
            const probe = document.createElement("span");
            probe.style.color = "var(--home-explore-ink)";
            element.append(probe);
            const matches =
              getComputedStyle(probe).color ===
              getComputedStyle(element.querySelector("h2")).color;
            probe.remove();
            return matches;
          }),
          true,
        );
        assert.deepEqual(
          await section.evaluate((element) => [
            element.previousElementSibling.id,
            element.nextElementSibling.id,
          ]),
          ["home-novel", "home-tarot"],
        );
        const sizes = await section.locator("li").evaluateAll((items) =>
          items.map((item) => {
            const r = item.getBoundingClientRect();
            return {
              left: r.left,
              top: r.top,
              width: r.width,
              overflow: item.scrollWidth > item.clientWidth,
            };
          }),
        );
        assert.ok(sizes.every((item) => !item.overflow));
        assert.equal(
          new Set(sizes.map((item) => Math.round(item.top))).size,
          width === 1440 ? 1 : 3,
        );
        assert.equal(
          await section.evaluate(
            (element) => element.scrollWidth > element.clientWidth,
          ),
          false,
        );
        assert.deepEqual(errors, []);
        await section.screenshot({
          path: `/tmp/home-explore-${width}-${theme}-${language}.png`,
          style: "aside { display: none !important; }",
        });
        console.log(
          `PASS ${width}px ${theme} ${language}: five entries, placement, wrapping, no placeholder links`,
        );
        await context.close();
      }
} finally {
  await browser.close();
}
