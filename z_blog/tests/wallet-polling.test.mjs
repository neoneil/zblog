import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const { build } = await import(
  pathToFileURL(
    process.env.ESBUILD_MODULE ||
      "/tmp/zblog-billing-test/node_modules/esbuild/lib/main.js",
  )
);
const { chromium } = await import(
  pathToFileURL(
    process.env.PLAYWRIGHT_MODULE ||
      "/tmp/zblog-browser-check/node_modules/playwright-core/index.mjs",
  )
);
await mkdir(".next", { recursive: true });
const directory = await mkdtemp(
  join(process.cwd(), ".next", "wallet-poll-test-"),
);
const bundle = join(directory, "wallet.js");
await build({
  entryPoints: ["tests/fixtures/wallet-polling.tsx"],
  outfile: bundle,
  bundle: true,
  platform: "browser",
  format: "iife",
  define: { "process.env.NODE_ENV": '"production"' },
  alias: {
    "next/navigation": "./tests/fixtures/wallet-navigation.ts",
    "next/link": "./tests/fixtures/wallet-link.tsx",
  },
  plugins: [
    {
      name: "isolated-wallet-actions",
      setup(builder) {
        builder.onResolve({ filter: /stardust-actions$/ }, () => ({
          path: resolve("tests/fixtures/wallet-actions.ts"),
        }));
      },
    },
  ],
});
const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox"],
});
try {
  for (const state of ["pending", "paid", "failed", "expired", "review"]) {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.route("http://wallet.fixture/**", (route) =>
      route.fulfill({
        contentType: "text/html",
        body: '<div id="root"></div>',
      }),
    );
    await page.goto(
      `http://wallet.fixture/?topup=00000000-0000-4000-8000-000000000001&state=${state}`,
    );
    await page.evaluate(() => {
      localStorage.setItem("site-language", "zh");
      const original = window.setInterval.bind(window);
      window.setInterval = (handler, delay, ...args) =>
        original(handler, delay === 4000 ? 5 : delay, ...args);
    });
    await page.addScriptTag({ path: bundle });
    await page.waitForFunction(() => !!window.walletFixture);
    if (state === "pending") {
      await page.getByText(/支付确认延迟/).waitFor();
      assert.equal(
        await page.evaluate(() => window.walletFixture.stats.refreshes),
        15,
      );
      await page.waitForTimeout(250);
      assert.equal(
        await page.evaluate(() => window.walletFixture.stats.refreshes),
        15,
      );
      await page.evaluate(() => window.walletFixture.markPaid());
      await page
        .getByText("充值成功，STARS 已到账。", { exact: true })
        .waitFor();
      assert.equal(await page.getByText(/支付确认延迟/).count(), 0);
    } else {
      await page.waitForTimeout(250);
      assert.equal(
        await page.evaluate(() => window.walletFixture.stats.refreshes),
        0,
      );
    }
    assert.deepEqual(errors, []);
    console.log(
      `PASS ${state}: bounded polling with unstable router; terminal states never poll`,
    );
    await page.close();
  }
} finally {
  await browser.close();
  await rm(directory, { recursive: true, force: true });
}
