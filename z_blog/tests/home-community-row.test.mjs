import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL(path, import.meta.url), "utf8");

test("community, contact and newsletter share a three-column desktop grid", () => {
  const home = read("../app/page.tsx");
  assert.match(home, /lg:grid-cols-3">\s*<StellarHousesEntry\s*\/>\s*<ContactEntry\s*\/>\s*<section\s+id="home-newsletter"/);
  const community = read("../components/site/stellar-houses-entry.tsx");
  assert.doesNotMatch(community, /lg:grid-cols-2/);
  assert.match(community, /className="flex w-full min-w-0 flex-col py-8 sm:py-10"/);
  assert.match(community, /className="group block w-full flex-1"/);
  assert.match(community, /href="\/community"/);
  assert.match(read("../features/contact/components/contact-entry.tsx"), /href="\/contact"/);
  assert.match(home, /<ParentingNewsletter\s*\/>/);
});
