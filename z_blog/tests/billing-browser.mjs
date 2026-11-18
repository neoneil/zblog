import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";

const { chromium } = await import(
  pathToFileURL(
    process.env.PLAYWRIGHT_MODULE ||
      "/tmp/zblog-browser-check/node_modules/playwright-core/index.mjs",
  )
);
const base = process.env.BILLING_TEST_URL || "http://localhost:3001";
const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox"],
});
try {
  for (const width of [390, 1440])
    for (const theme of ["light", "dark"]) {
      const context = await browser.newContext({
        viewport: { width, height: 1000 },
      });
      await context.addInitScript(
        ({ theme }) => {
          localStorage.setItem("site-language", "zh");
          localStorage.setItem("site-theme", theme);
        },
        { theme },
      );
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(`${base}/pricing`, { waitUntil: "networkidle" });
      await page.getByRole("heading", { name: "会员与星尘钱包" }).waitFor();
      assert.equal(
        await page.getByRole("button", { name: "充值", exact: true }).count(),
        6,
      );
      assert.equal(
        await page
          .getByRole("button", { name: "充值", exact: true })
          .first()
          .isDisabled(),
        true,
      );
      assert.equal(
        await page.evaluate(() => document.documentElement.dataset.theme),
        theme,
      );
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > window.innerWidth,
        ),
        false,
      );
      assert.deepEqual(errors, []);
      await page.screenshot({
        path: `/tmp/stardust-${width}-${theme}.png`,
        fullPage: true,
      });
      if (width === 390 && theme === "dark") {
        await page.goto(`${base}/wallet`, { waitUntil: "networkidle" });
        assert.ok(new URL(page.url()).pathname === "/login");
        await page.goto(`${base}/admin/billing`, { waitUntil: "networkidle" });
        assert.ok(new URL(page.url()).pathname === "/login");
        assert.equal(
          (
            await context.request.get(`${base}/api/billing/maintenance`)
          ).status(),
          401,
        );
        assert.equal(
          (
            await context.request.post(`${base}/api/stripe/webhook`, {
              data: {},
            })
          ).status(),
          400,
        );
      }
      console.log(
        `PASS ${width}px ${theme}: catalogue, disabled payments, no overflow or hydration errors`,
      );
      await context.close();
    }
} finally {
  await browser.close();
}
