import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";

const require = createRequire(import.meta.url);
const source = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const home = source("../app/page.tsx");

test("homepage assembles existing modules in plan order without nesting page mains", () => {
  const order = [
    "home-novel",
    "<KnowledgeEntries",
    "<TarotHomeSection",
    "<CalculatorsHomeSection",
    "<CategoriesSection homeLayout",
    "<ServicesList embedded",
    "<ContactSection",
    "home-newsletter",
    "<AboutSection embedded",
  ];
  let cursor = -1;
  for (const item of order) {
    const index = home.indexOf(item);
    assert.ok(index > cursor, item);
    cursor = index;
  }
  assert.equal((home.match(/<main\b/g) || []).length, 1);
  assert.match(
    home,
    /<ParentingLabSection isAdmin=\{isAdmin\} includeNewsletter=\{false\}/,
  );
  assert.match(home, /<ParentingNewsletter/);
  assert.match(home, /getCurrentUserWithRole\(\)/);
  assert.match(home, /href="\/pricing"/);
});

test("all eleven existing Stella tools survive regrouping into eight explorer tools and three calculator links", () => {
  const { outputText } = ts.transpileModule(
    source("../features/stella/lib/explore-config.ts"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    },
  );
  const exports = {};
  new Function("require", "exports", outputText)(require, exports);
  assert.equal(exports.stellaTools.length, 11);
  assert.equal(exports.stellaExplorerTools.length, 8);
  assert.deepEqual(
    exports.stellaTools
      .filter((tool) => !exports.stellaExplorerTools.includes(tool))
      .map((tool) => tool.slug),
    ["", "birth-chart", "numerology"],
  );
  const entries = source("../components/site/home-tool-sections.tsx");
  for (const href of [
    "/stella",
    "/stella/birth-chart",
    "/stella/numerology",
    "/synastry",
    "/tarot-ai",
    "/feishu-docs",
    "/thoth-tarot",
    "/tarot",
  ])
    assert.ok(entries.includes(`"${href}"`), href);
  assert.match(entries, /<ReflectionEntry/);
});

test("homepage reuses the existing contact, service catalog and newsletter rather than new business endpoints", () => {
  const contact = source("../features/contact/components/about-contact.tsx");
  const services = source("../features/services/components/services-list.tsx");
  assert.match(contact, /export function ContactSection/);
  assert.match(contact, /export function AboutSection/);
  assert.match(contact, /<AboutSection \/>/);
  assert.match(contact, /<ContactSection \/>/);
  assert.match(contact, /<NewsletterPlaceholder \/>/);
  assert.match(services, /embedded = false/);
  assert.match(services, /selectProducts\(filter, sort\)/);
  assert.doesNotMatch(home, /fetch\(|stripe|resend|\.from\(/i);
  assert.match(
    source("../components/ParentingLabSection.tsx"),
    /href="\/newsletter"/,
  );
});
