import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import ts from "typescript";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const source = JSON.parse(
  read("../features/tarot-novel/lib/novel-source.json"),
);
const result = {};
const compiled = ts.transpileModule(
  read("../features/tarot-novel/lib/novel-world.ts"),
  {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  },
).outputText;
new Function("exports", "require", compiled)(result, (name) => {
  assert.equal(name, "./novel-source.json");
  return source;
});

test("five acts contain fifty unique ordered bilingual chapter outlines", () => {
  assert.equal(result.acts.length, 5);
  assert.equal(result.plannedChapters.length, 50);
  assert.deepEqual(
    result.plannedChapters.map((c) => c.number),
    Array.from({ length: 50 }, (_, i) => i + 1),
  );
  assert.equal(new Set(result.plannedChapters.map((c) => c.slug)).size, 50);
  for (const act of result.acts) {
    assert.equal(act.chapters.length, 10);
    assert.ok(act.chapters.every((c) => c.act === act.number));
    assert.ok(existsSync(new URL(`../public${act.image}`, import.meta.url)));
  }
  for (const chapter of result.plannedChapters) {
    assert.ok(
      chapter.title.zh &&
        chapter.title.en &&
        chapter.summary.zh &&
        chapter.summary.en,
    );
    assert.doesNotMatch(
      chapter.title.en + chapter.summary.en,
      /[\u3400-\u9fff]/,
    );
    assert.equal(result.plannedChapterForSlug(chapter.slug), chapter);
  }
  for (const invalid of [
    "chapter-0",
    "chapter-51",
    "chapter-01",
    "act-1",
    "bogus",
    "__proto__",
  ])
    assert.equal(result.plannedChapterForSlug(invalid), undefined);
});

test("twenty-two distinct portrait characters preserve the eleven trial marks and completion order", () => {
  const characters = [
    ...result.protagonists,
    ...result.guardians,
    ...result.trials,
  ];
  assert.equal(characters.length, 22);
  assert.equal(new Set(characters.map((c) => c.image)).size, 22);
  for (const character of characters) {
    assert.ok(
      existsSync(new URL(`../public${character.image}`, import.meta.url)),
    );
    assert.ok(
      character.content.zh.length > 30 && character.content.en.length > 100,
    );
    assert.doesNotMatch(character.content.en, /[\u3400-\u9fff]/);
  }
  assert.deepEqual(
    result.trials.map((t) => t.chapter),
    [41, 34, 35, 25, 17, 26, 27, 42, 43, 38, 44],
  );
  assert.equal(result.trials[10].token.zh, "新纪元之门");
  assert.match(result.plannedChapters[48].summary.en, /judg|scrutiny/i);
  assert.ok(
    result.protagonists.every(
      (p) => p.arc.length === 5 && p.arc.every((a) => a.zh && a.en),
    ),
  );
});

test("all major narrative sections have complete bilingual copy and original document artwork", () => {
  for (const key of [
    "novelTitle",
    "synopsis",
    "appleLore",
    "closing",
    "promotion",
    "guardianIntroduction",
  ]) {
    assert.ok(result[key].zh && result[key].en);
    assert.doesNotMatch(result[key].en, /[\u3400-\u9fff]/);
  }
  assert.ok(result.synopsis.en.length > 4000);
  assert.match(result.appleLore.en, /cannot force a soul/);
  assert.match(result.appleLore.en, /self-examination/);
  for (let i = 1; i <= 10; i++)
    assert.ok(
      existsSync(
        new URL(
          `../public/novel/image${i}.${i === 10 ? "jpeg" : "png"}`,
          import.meta.url,
        ),
      ),
    );
});

test("published database chapters take priority; outlines cannot post database comments", () => {
  const route = read("../app/tarot-novel/[slug]/page.tsx");
  assert.match(route, /chapters.find\(item => item.slug === slug\)/);
  assert.match(route, /item.chapter_number === planned.number/);
  assert.match(route, /NovelPlannedChapter chapter=\{planned\}/);
  assert.match(route, /novelComments\(chapter.id\)/);
  const component = read(
    "../features/tarot-novel/components/novel-experience.tsx",
  );
  const plannedView = component.slice(
    component.indexOf("export function NovelPlannedChapter"),
  );
  assert.doesNotMatch(plannedView, /ReaderComments|chapterId=/);
  assert.match(plannedView, /正文尚未发布/);
  assert.match(component, /prefers-reduced-motion/);
  assert.doesNotMatch(
    component,
    /dangerouslySetInnerHTML|Math.random|Date.now/,
  );
});
