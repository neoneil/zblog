import assert from "node:assert/strict";
import { chromium } from "/tmp/zblog-browser-check/node_modules/playwright-core/index.mjs";

const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  args: ["--no-sandbox"],
});
try {
  for (const [width, language, theme] of [
    [320, "zh", "dark"],
    [320, "en", "light"],
    [1440, "zh", "dark"],
    [1440, "en", "light"],
  ]) {
    const context = await browser.newContext({
      viewport: { width, height: 1000 },
      reducedMotion: "reduce",
    });
    await context.addInitScript(({ language, theme }) => {
      localStorage.setItem("site-language", language);
      localStorage.setItem("site-theme", theme);
    }, { language, theme });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("http://localhost:3001/", { waitUntil: "networkidle" });
    const homeImage = page.locator("#home-novel img");
    assert.match(await homeImage.getAttribute("src"), /hero2111/);
    await homeImage.evaluate((element) => element.decode());
    const homeBounds = await homeImage.boundingBox();
    assert.ok(Math.abs(homeBounds.width / homeBounds.height - 2) < 0.01);
    const tonightLink = page.locator('#home-novel a[href="/tonight"]');
    const appleButton = page.locator('#home-novel a[href="/apple-tree"]');
    assert.equal(await page.locator("#home-novel a, #home-novel button").count(), 2);
    assert.equal(await appleButton.count(), 1);
    const firstButton = await tonightLink.boundingBox();
    const secondButton = await appleButton.boundingBox();
    assert.ok(Math.abs(firstButton.y - secondButton.y) < 1);
    assert.ok(secondButton.x + secondButton.width <= homeBounds.x + homeBounds.width / 2 + 1);
    const heading = await page.locator("#home-novel h1").textContent();
    assert.equal(heading.trim(), language === "zh" ? "星辰之巢" : "STELLARNESTC");
    await appleButton.click();
    await page.waitForURL("**/apple-tree");
    const appleImage = page.locator('section[aria-labelledby="apple-tree-title"] img');
    await appleImage.evaluate((element) => element.decode());
    assert.match(await appleImage.getAttribute("src"), /appletree/);
    const appleBounds = await appleImage.boundingBox();
    assert.ok(Math.abs(appleBounds.width / appleBounds.height - 1755 / 896) < 0.01);
    assert.equal(await page.locator("#apple-tree-title").textContent().then((value) => value.trim()), language === "zh" ? "种下我的苹果树" : "Plant My Apple Tree");
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.screenshot({ path: `/tmp/apple-tree-${width}-${language}-${theme}.png`, fullPage: true });
    await page.goBack({ waitUntil: "networkidle" });
    await tonightLink.click();
    await page.waitForURL("**/tonight");
    const tonightImage = page.locator('img[alt]').last();
    assert.match(await tonightImage.getAttribute("src"), /tonight/);
    await tonightImage.evaluate((element) => element.decode());
    const messageLink = page.locator('a[href="/tonight/star-message"]');
    const reflectionButton = page.getByRole("button", { name: language === "zh" ? "抽取一张反思卡" : "Draw a Reflection Card" });
    assert.ok(await reflectionButton.isDisabled());
    const messageBounds = await messageLink.boundingBox();
    const reflectionBounds = await reflectionButton.boundingBox();
    const tonightBounds = await tonightImage.boundingBox();
    assert.ok(Math.abs(messageBounds.y - reflectionBounds.y) < 1);
    assert.ok(Math.abs(messageBounds.y + messageBounds.height / 2 - tonightBounds.y - tonightBounds.height / 2) < 1);
    await messageLink.click();
    await page.waitForURL("**/tonight/star-message");
    await page.locator("article img").evaluate((element) => element.decode());
    assert.match(await page.locator("article img").getAttribute("src"), /tonight-community/);
    assert.equal(await page.locator("article h1").textContent(), language === "zh" ? "写给每一位来到这里的你" : "A LETTER FROM ME TO YOU");
    assert.equal(await page.locator("article footer p").count(), 2);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.goto("http://localhost:3001/aboutus", { waitUntil: "networkidle" });
    assert.equal(await page.locator("#a-letter-for-you").count(), 0);
    assert.equal(await page.getByText("03 · STELLARNESTS", { exact: true }).count(), 0);
    await page.goto("http://localhost:3001/tarot-novel", { waitUntil: "networkidle" });
    const section = page.locator("#synopsis");
    await section.scrollIntoViewIfNeeded();
    const image = section.locator("img");
    await image.scrollIntoViewIfNeeded();
    await image.evaluate((element) => element.decode());
    assert.match(await image.getAttribute("src"), /home-stellarnests-hero/);
    const art = await image.boundingBox();
    const title = await section.locator("h2").boundingBox();
    assert.ok(title.x >= art.x && title.x + title.width <= art.x + art.width / 2);
    const metrics = await section.locator("h2").evaluate((element) => ({
      height: element.clientHeight,
      scrollHeight: element.scrollHeight,
    }));
    assert.ok(metrics.scrollHeight <= metrics.height + 1, "Title must fit inside the image");
    const copy = section.locator(":scope > div").first().locator("div");
    assert.equal(await copy.locator("p").count(), 3);
    const copyBounds = await copy.boundingBox();
    assert.ok(copyBounds.y >= art.y && copyBounds.y + copyBounds.height <= art.y + art.height + 1);
    const paragraphs = section.locator(":scope > div").last().locator("p");
    assert.ok(await paragraphs.count() > 10);
    const firstParagraph = await paragraphs.first().boundingBox();
    assert.ok(firstParagraph.y >= art.y + art.height);
    assert.equal(await paragraphs.first().evaluate((element) => getComputedStyle(element).textAlign), "center");
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.deepEqual(errors, []);
    await section.screenshot({ path: `/tmp/novel-synopsis-${width}-${language}-${theme}.png` });
    console.log(`PASS ${width}px ${language} ${theme}: new homepage image, original artwork, overlaid title, centered story`);
    await context.close();
  }
} finally {
  await browser.close();
}
