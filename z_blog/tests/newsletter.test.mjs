import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
const source = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const exports = {};
new Function("exports", ts.transpileModule(source("../features/newsletter/lib/template.ts"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(exports);
test("welcome email escapes content and provides absolute clickable image and chart links", () => {
  const template = { ...exports.defaultTemplate, heading_en: '<script>bad</script>', image_url: '/hero.png', image_link: '/stella' };
  const mail = exports.welcomeContent(template, 'en', 'https://example.com');
  assert.ok(mail.html.includes('&lt;script&gt;'));
  assert.ok(mail.html.includes('https://example.com/astroplate'));
  assert.ok(mail.html.includes('<a href="https://example.com/stella"><img'));
  assert.ok(mail.html.includes('https://example.com/hero.png'));
});
test("link validation rejects executable and protocol-relative links", () => {
  for (const link of ['javascript:alert(1)', '//evil.com', '/\\evil.com', 'data:text/html,test', 'http://evil.com']) assert.equal(exports.safeLink(link), false);
  for (const link of ['/astroplate', 'https://example.com/image.png']) assert.equal(exports.safeLink(link), true);
});
test("subscriber privacy, admin guard and confirmation tokens are enforced in code", () => {
  assert.match(source('../supabase/newsletter.sql'), /revoke all on public.newsletter_subscribers from anon, authenticated/);
  assert.match(source('../app/admin/newsletter/actions.ts'), /await requireAdmin/);
  assert.match(source('../app/api/newsletter/route.ts'), /randomBytes\(32\)/);
  assert.match(source('../app/api/newsletter/route.ts'), /createHash\("sha256"\).update\(token\)/);
  assert.match(source('../features/newsletter/lib/server.ts'), /newsletter-welcome-\$\{subscriber.id\}/);
});
