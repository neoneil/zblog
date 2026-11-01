import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";

const require = createRequire(import.meta.url);
function load(path, imports = {}) {
  const source = readFileSync(new URL(path, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  });
  const exports = {};
  new Function("require", "exports", outputText)(
    (name) => imports[name] ?? require(name),
    exports,
  );
  return exports;
}
const plan = load("../features/site-plan/lib/plan.ts");
const pricing = load("../features/site-plan/lib/pricing.ts");

test("homepage preview has ten ordered bands and five four-item module groups", () => {
  assert.equal(plan.homeSections.length, 10);
  assert.deepEqual(
    plan.homeSections.map((s) => s.id),
    Array.from({ length: 10 }, (_, i) => String(i + 1).padStart(2, "0")),
  );
  assert.equal(plan.homeSections[0].en, "FEATURED NOVEL");
  assert.equal(plan.homeSections[9].en, "FOOTER");
  assert.ok(plan.homeSections.slice(1, 6).every((s) => s.items.length === 4));
  assert.equal(plan.moduleRequirements.length, 10);
  assert.ok(
    plan.moduleRequirements.some(([name]) => name.includes("Resources")),
  );
});

test("STELLAR has exactly the requested eight features, separate from chart and numerology entrances", () => {
  assert.deepEqual(
    plan.stellarTools.map(([name]) => name),
    [
      "Compatibility",
      "Today's Sky",
      "Moon Calendar",
      "Retrograde Tracker",
      "Void of Course Moon",
      "Planets in Signs",
      "Birthday Horoscope",
      "Eclipses",
    ],
  );
  assert.equal(plan.homeSections[3].items.length, 4);
  assert.ok(
    plan.homeSections[3].items.some((item) => item.includes("Numerology")),
  );
  assert.deepEqual(plan.proposedNavigation, [
    "HOME",
    "NOVEL",
    "KNOWLEDGE",
    "TAROT",
    "ASTROLOGY",
    "SHOP",
    "ABOUT",
    "CONTACT",
  ]);
});

test("free and paid rights retain shared tarot quota, one-time natal chart and separate service sales", () => {
  assert.equal(plan.membershipPlans.length, 2);
  assert.equal(plan.membershipPlans[1].price, "价格待定");
  assert.ok(
    plan.membershipPlans[0].benefits.some((text) => text.includes("共用")),
  );
  assert.ok(
    plan.membershipPlans[0].benefits.some((text) =>
      text.includes("非每周重置"),
    ),
  );
  const services = plan.permissions.find(([name]) => name.includes("付费课程"));
  assert.equal(services[1], "单独购买");
  assert.equal(services[2], "仍需单独购买");
  assert.ok(
    plan.permissions
      .find(([name]) => name.includes("双人合盘"))[1]
      .includes("不包含"),
  );
});

test("pricing examples are exact cents, draft-only and respect selected billing period", () => {
  assert.deepEqual(pricing.createPricingDraft("both", "9.90", "89"), {
    mode: "both",
    monthlyCents: 990,
    yearlyCents: 8900,
  });
  assert.deepEqual(pricing.createPricingDraft("monthly", "9.90", "invalid"), {
    mode: "monthly",
    monthlyCents: 990,
    yearlyCents: null,
  });
  assert.deepEqual(pricing.createPricingDraft("yearly", "invalid", "89"), {
    mode: "yearly",
    monthlyCents: null,
    yearlyCents: 8900,
  });
  assert.equal(pricing.parseAmount("0.01"), 1);
  for (const value of [
    "",
    "0",
    "-1",
    "NaN",
    "Infinity",
    "9.999",
    "1e2",
    "1000000",
  ])
    assert.equal(pricing.parseAmount(value), null, value);
  assert.equal(pricing.createPricingDraft("invalid", "9.90", "89"), null);
  assert.equal(pricing.createPricingDraft("both", "0", "89"), null);
  assert.match(pricing.displayAUD(2980), /29\.80/);
});

function authFor(user, role, error = null) {
  const supabase = {
    auth: { getUser: async () => ({ data: { user } }) },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: role ? { role } : null, error }),
        }),
      }),
    }),
  };
  const redirect = (path) => {
    throw Object.assign(new Error("REDIRECT"), { path });
  };
  return load("../lib/auth/require-admin.ts", {
    "next/navigation": { redirect },
    "@/lib/supabase/server": { createClient: async () => supabase },
  });
}
test("real shared admin guard rejects anonymous, editor and regular users and accepts admins", async () => {
  await assert.rejects(
    () => authFor(null, null).requireAdmin("/admin/site-plan"),
    (e) => e.path === "/login?next=%2Fadmin%2Fsite-plan",
  );
  for (const role of [null, "editor", "member"])
    await assert.rejects(
      () => authFor({ id: "user" }, role).requireAdmin("/admin/site-plan"),
      (e) => e.path === "/",
    );
  await assert.rejects(
    () =>
      authFor({ id: "user" }, "admin", {
        message: "query failed",
      }).requireAdmin(),
    (e) => e.path === "/",
  );
  const result = await authFor({ id: "admin" }, "admin").requireAdmin(
    "/admin/site-plan",
  );
  assert.equal(result.profile.role, "admin");
});

test("server page awaits admin authorisation before returning the private document", async () => {
  let called = false;
  const doc = () => null;
  const page = load("../app/admin/site-plan/page.tsx", {
    "@/lib/auth/require-admin": {
      requireAdmin: async (path) => {
        called = true;
        assert.equal(path, "/admin/site-plan");
        throw Error("DENIED");
      },
    },
    "@/features/site-plan/components/site-plan-document": {
      default: doc,
      __esModule: true,
    },
  });
  await assert.rejects(() => page.default(), /DENIED/);
  assert.equal(called, true);
  assert.deepEqual(page.metadata.robots, { index: false, follow: false });
  const index = readFileSync(
    new URL("../app/admin/page.tsx", import.meta.url),
    "utf8",
  );
  assert.match(index, /profile\.role === "admin" &&/);
  assert.match(index, /href="\/admin\/site-plan"/);
});

test("private plan is server-rendered and pricing preview has no persistence, email or payment calls", () => {
  const doc = readFileSync(
    new URL(
      "../features/site-plan/components/site-plan-document.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  const form = readFileSync(
    new URL(
      "../features/site-plan/components/pricing-preview.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  assert.doesNotMatch(doc, /^["']use client/m);
  assert.doesNotMatch(
    form,
    /\bfetch\s*\(|localStorage|sessionStorage|supabase|stripe|resend/i,
  );
  assert.match(doc, /FILL YOUR CHART/);
  assert.match(doc, /href="\/"/);
  assert.match(doc, /不会更改公开首页/);
  assert.match(form, /不保存方案/);
});
