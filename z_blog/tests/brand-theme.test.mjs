import assert from "node:assert/strict";
import { chromium } from "/tmp/zblog-browser-check/node_modules/playwright-core/index.mjs";

const browser = await chromium.launch({ executablePath: "/usr/bin/google-chrome", args: ["--no-sandbox", "--no-zygote", "--disable-gpu"] });
try {
  for (const [width, language, theme] of [
    [320, "zh", "dark"], [390, "en", "light"], [768, "en", "dark"],
    [1024, "en", "light"], [1440, "zh", "dark"], [1440, "en", "light"],
  ]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: "reduce" });
    await context.addInitScript(({ language, theme }) => {
      localStorage.setItem("site-language", language); localStorage.setItem("site-theme", theme);
    }, { language, theme });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("http://localhost:3001/", { waitUntil: "networkidle" });
    const banner = page.locator("#home-novel-banner");
    const bannerImage = banner.locator("img");
    await bannerImage.scrollIntoViewIfNeeded();
    await bannerImage.evaluate((image) => image.decode());
    const band = await banner.boundingBox();
    const previous = await page.locator("#home-tarot").boundingBox();
    const next = await page.locator("#home-calculators").boundingBox();
    assert.ok(previous.y + previous.height <= band.y);
    assert.ok(band.y + band.height <= next.y);
    const link = banner.locator('a[href="/tarot-novel"]');
    const button = await link.boundingBox();
    assert.ok(button.y >= band.y && button.y + button.height <= band.y + band.height);
    assert.ok(button.x >= band.x && button.x + button.width <= band.x + band.width);
    assert.equal(await banner.locator("h2").textContent(), language === "zh" ? "死神禁果" : "Death's Forbidden Apple");
    const colors = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      const canvas = document.createElement("canvas");
      canvas.width = 1; canvas.height = 1;
      const context = canvas.getContext("2d");
      function color(token, parent = document.body) {
        const element = document.createElement("span");
        element.style.color = `var(${token})`; parent.append(element);
        context.fillStyle = getComputedStyle(element).color; context.fillRect(0, 0, 1, 1);
        const rgb = Array.from(context.getImageData(0, 0, 1, 1).data).slice(0, 3);
        element.remove(); return rgb;
      }
      const lower = document.querySelector(".brand-home-lower");
      return {
        bg: color("--bg"), primary: color("--primary"), text: color("--text"),
        lowerText: color("--text", lower), lowerBg: color("--bg", lower),
        upperGradient: getComputedStyle(document.querySelector(".brand-home-upper")).backgroundImage,
        seeds: ["--brand-space", "--brand-gold", "--brand-moon", "--brand-midnight"].map((token) => root.getPropertyValue(token).trim()),
      };
    });
    assert.deepEqual(colors.seeds, ["#30203f", "#e7c49b", "#f4e5d9", "#1c3554"]);
    if (theme === "dark") assert.deepEqual(colors.bg, [48, 32, 63]);
    const luminance = (rgb) => rgb.map((value) => { const v = value / 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
    const contrast = (a, b) => (Math.max(luminance(a), luminance(b)) + 0.05) / (Math.min(luminance(a), luminance(b)) + 0.05);
    assert.ok(contrast(colors.text, colors.bg) >= 4.5);
    assert.ok(contrast(colors.primary, colors.bg) >= 4.5);
    assert.ok(colors.upperGradient.includes("linear-gradient"));
    assert.deepEqual(colors.lowerBg, [244, 229, 217]);
    assert.ok(contrast(colors.lowerText, colors.lowerBg) >= 4.5);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.notEqual(await page.locator("#home-novel img").evaluate((image) => getComputedStyle(image).filter), "none");
    assert.deepEqual(errors, []);
    await banner.screenshot({ path: `/tmp/brand-novel-banner-${width}-${language}-${theme}.png` });
    await page.screenshot({ path: `/tmp/brand-home-${width}-${language}-${theme}.png`, fullPage: true });
    await link.click(); await page.waitForURL("**/tarot-novel");
    await page.locator("main h1").first().waitFor({ state: "visible" });
    if (width === 1440 && theme === "dark") {
      for (const path of ["/tonight", "/apple-tree", "/aboutus", "/services"]) {
        await page.goto(`http://localhost:3001${path}`, { waitUntil: "networkidle" });
        assert.equal(await page.locator("body").evaluate((element) => getComputedStyle(element).backgroundColor), "rgb(48, 32, 63)");
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      }
    }
    await context.close();
    console.log(`PASS ${width}px ${language} ${theme}: brand palette, readable contrast, novel banner placement and navigation`);
  }
} finally { await browser.close(); }
