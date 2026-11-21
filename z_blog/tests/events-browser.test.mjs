import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { join, resolve } from "node:path";
import { build } from "/tmp/zblog-billing-test/node_modules/esbuild/lib/main.js";
import { chromium } from "/tmp/zblog-browser-check/node_modules/playwright-core/index.mjs";

const directory = await mkdtemp("/tmp/zblog-events-browser-");
const bundle = join(directory, "events.js");
await build({
  entryPoints: ["tests/fixtures/events.tsx"], outfile: bundle, bundle: true, platform: "browser", format: "iife",
  define: { "process.env.NODE_ENV": '"production"' },
  alias: { "next/navigation": "./tests/fixtures/event-navigation.ts", "next/link": "./tests/fixtures/wallet-link.tsx" },
  plugins: [{ name: "isolated-event-actions", setup(builder) {
    builder.onResolve({ filter: /event-(?:ticket-)?actions$/ }, () => ({ path: resolve("tests/fixtures/event-actions.ts") }));
  } }],
});
const browser = await chromium.launch({ executablePath: "/usr/bin/google-chrome", args: ["--no-sandbox", "--no-zygote", "--disable-gpu"] });
try {
  const probe = await browser.newPage();
  await probe.goto("http://localhost:3001/admin/events", { waitUntil: "networkidle" });
  assert.match(probe.url(), /\/login\?next=/);
  await probe.goto("http://localhost:3001/events/my-registrations", { waitUntil: "networkidle" });
  assert.match(probe.url(), /\/login\?next=/);
  const css = await probe.evaluate(() => Array.from(document.styleSheets).flatMap((sheet) => {
    try { return Array.from(sheet.cssRules).map((rule) => rule.cssText); }
    catch { return []; }
  }).join("\n"));
  assert.ok(css.includes("--bg"), "Use the actual application stylesheet and tokens in fixtures");
  await probe.close();
  console.log("PASS unauthenticated visitors cannot access event administration or personal records");
  for (const [width, language, theme] of [[390, "zh", "dark"], [1440, "en", "light"]]) {
    for (const mode of ["new", "admin", "review", "register", "history", "pay", "pay-zero", "pay-retry", "tickets"]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: "reduce" });
      await context.addInitScript(({ language, theme }) => {
        localStorage.setItem("site-language", language);
        localStorage.setItem("site-theme", theme);
      }, { language, theme });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("dialog", (dialog) => dialog.accept());
      await page.route("http://localhost:39999/**", (route) => route.fulfill({ contentType: "text/html", body: `<!doctype html><html><head><style>${css}</style></head><body><div id="root"></div></body></html>` }));
      await page.goto(`http://localhost:39999/?mode=${mode}`);
      await page.addScriptTag({ path: bundle });
      await page.waitForFunction(() => !!window.eventTest);
      await page.waitForTimeout(100);
      assert.equal(await page.locator("main").evaluate((element) => getComputedStyle(element).paddingTop), "16px");
      if (mode === "new") assert.equal(await page.getByLabel("价格（AUD）").inputValue(), "50.00");
      if (mode === "admin") {
        await page.getByLabel("价格（AUD）").fill("65.50");
        await page.getByRole("button", { name: "保存活动", exact: true }).click();
        await page.getByRole("status").waitFor();
        assert.equal(await page.evaluate(() => window.eventTest.calls[0].args.price_aud), "65.50");
      }
      if (mode === "review") {
        await page.getByLabel("给用户的说明").fill("欢迎参加");
        await page.getByRole("button", { name: "保存审核" }).click();
        await page.getByRole("status").waitFor();
        assert.equal(await page.evaluate(() => window.eventTest.calls[0].args.status), "confirmed");
      }
      if (mode === "register") {
        await page.getByLabel(language === "zh" ? "报名姓名" : "Attendee name").fill("Alice");
        await page.getByRole("button", { name: language === "zh" ? "提交报名申请" : "Submit registration request" }).click();
        await page.getByRole("status").waitFor();
        assert.equal(await page.evaluate(() => window.eventTest.calls.length), 1);
        assert.equal(await page.getByRole("button").isDisabled(), true);
      }
      if (mode === "history") {
        await page.getByRole("button", { name: language === "zh" ? "撤回申请" : "Withdraw request" }).click();
        await page.getByRole("status").waitFor();
        assert.equal(await page.evaluate(() => window.eventTest.calls[0].action), "cancel");
      }
      if (mode === "pay" || mode === "pay-retry") {
        await page.getByLabel(language === "zh" ? "报名姓名" : "Attendee name").fill("Alice");
        const pay = page.getByRole("button", { name: language === "zh" ? "支付 5,000 STARS 并报名" : "Pay 5,000 STARS & book" });
        await pay.click();
        assert.equal(await page.evaluate(() => window.eventTest.calls.length), 0, "Explicit consent is required");
        await page.locator('input[name="confirm"]').check();
        if (mode === "pay-retry") await page.evaluate(() => { window.eventTest.fail = true; });
        await pay.click();
        if (mode === "pay-retry") {
          await page.getByRole("alert").waitFor();
          await page.evaluate(() => { window.eventTest.fail = false; });
          await pay.click();
          await page.getByText(language === "zh" ? "测试支付成功，测试门票已生成。" : "Test payment complete. Your test ticket is ready.", { exact: true }).waitFor();
          assert.equal(await page.evaluate(() => window.eventTest.calls[0].args.requestId === window.eventTest.calls[1].args.requestId), true);
        } else await page.getByText(language === "zh" ? "测试支付成功，测试门票已生成。" : "Test payment complete. Your test ticket is ready.", { exact: true }).waitFor();
        assert.equal(await page.evaluate(() => window.eventTest.calls[0].args.expectedPrice), 5000);
        assert.equal(await page.evaluate(() => window.eventTest.calls[0].args.confirm), true);
      }
      if (mode === "pay-zero") {
        assert.equal(await page.getByRole("button").isDisabled(), true);
        assert.equal(await page.locator('a[href="/wallet"]').count(), 1);
      }
      if (mode === "tickets") assert.equal(await page.getByText(language === "zh" ? "测试门票 · 非正式入场凭证" : "Test ticket · Not valid for admission", { exact: true }).count(), 1);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${mode} has no horizontal overflow`);
      assert.deepEqual(errors, []);
      await page.screenshot({ path: `/tmp/events-${mode}-${width}-${theme}.png`, fullPage: true });
      await context.close();
      console.log(`PASS ${mode} ${width}px ${language} ${theme}: functional controls, no overflow or runtime errors`);
    }
  }
} finally {
  await browser.close();
  await rm(directory, { recursive: true, force: true });
}
