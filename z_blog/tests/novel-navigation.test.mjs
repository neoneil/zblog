import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = path => readFileSync(new URL(path, import.meta.url), "utf8");

test("cover introduction precedes the directory and single-column acts", () => {
  const source = read("../features/tarot-novel/components/novel-experience.tsx");
  const start = source.indexOf("{introduction}");
  const landing = source.slice(start, source.indexOf("export function NovelArchive"));
  const acts = landing.indexOf('id="acts"');
  const chapters = landing.indexOf("<ChapterDirectory chapters={chapters}");
  const introduction = landing.indexOf("{introduction}");
  assert.ok(introduction === 0 && acts > introduction && chapters > acts);
  assert.ok(landing.indexOf('id="synopsis"') > chapters);
  assert.equal((landing.match(/id="acts"/g) ?? []).length, 1);
  assert.doesNotMatch(landing, /protagonists\.map/);
  assert.match(landing, /href=\{`\/tarot-novel\/world\/\$\{slug\}`\}/);
  const css=read("../features/tarot-novel/components/novel-world.module.css");
  assert.doesNotMatch(css,/\.actGrid\s*,\s*\.archiveGrid\s*\{\s*grid-template-columns: repeat\(2/);
  assert.match(css,/height: 25%/);
  assert.match(css,/novelOverlayRise/);
});

test("directory return control is bilingual, keyboard accessible and fixed to viewport", () => {
  const component = read("../features/tarot-novel/components/novel-experience.tsx");
  assert.match(component, /返回目录", "Back to directory/);
  assert.match(component, /role="tooltip"/);
  assert.match(component, /aria-describedby=\{tooltipId\}/);
  const css = read("../features/tarot-novel/components/novel-world.module.css");
  assert.match(css, /\.world \.backToDirectory\s*\{\s*position: fixed/);
  assert.match(css, /:is\(:hover, :focus-visible\) \.directoryTooltip/);
  assert.match(css, /\.jumpNav a\s*\{\s*font-size: 18px/);
});

test("archives validate their routes and trial narratives use native disclosures", () => {
  const route = read("../app/tarot-novel/world/[section]/page.tsx");
  assert.match(route, /section !== "relationships" && section !== "characters"/);
  assert.match(route, /notFound\(\)/);
  const component = read("../features/tarot-novel/components/novel-experience.tsx");
  assert.match(component, /styles\.trialDisclosure/);
  assert.match(component, /展开试炼故事/);
  assert.match(component, /<p>\{t\(trial.content\)\}<\/p>/);
});

test("footer and main navigation share the same blue shine treatment and updated slogan", () => {
  for (const file of ["site-navigation.tsx", "footer-navigation.tsx"])
    assert.match(read(`../components/site/${file}`), /navigation-link.module.css/);
  const css = read("../components/site/navigation-link.module.css");
  assert.match(css, /navigationShine/);
  assert.match(css, /var\(--title-ink\)/);
  assert.doesNotMatch(read("../components/site/footer-navigation.module.css"), /var\(--primary\)/);
  const copy = read("../lib/i18n/copy.ts");
  const footer = copy.slice(copy.indexOf("footerDescription:"), copy.indexOf("footerRights:"));
  assert.match(footer, /Amidst Chaos, Always Centered/);
  assert.match(footer, /身处混沌，始终自有中心/);
  assert.doesNotMatch(footer, /童年|childhood/);
});
