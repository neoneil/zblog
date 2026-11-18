import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import Stripe from "stripe";

const { build } = await import(
  pathToFileURL(
    process.env.ESBUILD_MODULE ||
      "/tmp/zblog-billing-test/node_modules/esbuild/lib/main.js",
  )
);
const { PGlite } = await import(
  pathToFileURL(
    process.env.PGLITE_MODULE ||
      "/tmp/zblog-billing-test/node_modules/@electric-sql/pglite/dist/index.js",
  )
);
await mkdir(join(process.cwd(), ".next"), { recursive: true });
const directory = await mkdtemp(
  join(process.cwd(), ".next", "stardust-webhook-test-"),
);
const db = new PGlite();
const user = "00000000-0000-4000-8000-000000000001";
const secret = "whsec_isolated_test_fixture";
process.env.STRIPE_SECRET_KEY = "sk_test_isolated_fixture";
process.env.STRIPE_WEBHOOK_SECRET = secret;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const argumentsFor = {
  stardust_credit_topup: [
    "p_event",
    "p_type",
    "p_order",
    "p_user",
    "p_session",
    "p_intent",
    "p_amount",
    "p_currency",
  ],
  stardust_risk_event: ["p_event", "p_type", "p_intent"],
};
try {
  await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;
    create schema auth;create table auth.users(id uuid primary key,created_at timestamptz default now(),email_confirmed_at timestamptz);
    create function auth.uid() returns uuid language sql as $$select null::uuid$$;
    create table public.profiles(id uuid primary key,role text);`);
  await db.exec(
    await readFile(
      new URL("../supabase/stardust.sql", import.meta.url),
      "utf8",
    ),
  );
  await db.exec(
    await readFile(
      new URL("../supabase/stardust-sandbox.sql", import.meta.url),
      "utf8",
    ),
  );
  await db.query(
    "insert into auth.users(id,email_confirmed_at) values($1,now())",
    [user],
  );
  const order = (
    await db.query(
      "select stardust_sandbox.stardust_create_topup($1,$2,1000) as value",
      [user, "00000000-0000-4000-8000-000000000002"],
    )
  ).rows[0].value;
  let calls = 0;
  globalThis.stardustTestAdmin = {
    schema(name) {
      assert.equal(name, "stardust_sandbox");
      return {
        async rpc(name, params) {
          calls++;
          const keys = argumentsFor[name];
          assert.ok(keys, "Only expected financial RPCs can be invoked");
          try {
            await db.query(
              `select stardust_sandbox.${name}(${keys.map((_, i) => `$${i + 1}`).join(",")})`,
              keys.map((key) => params[key]),
            );
            return { data: null, error: null };
          } catch (error) {
            return { data: null, error: { message: error.message } };
          }
        },
      };
    },
  };
  const output = join(directory, "webhook.cjs");
  await build({
    entryPoints: ["app/api/stripe/webhook/route.ts"],
    outfile: output,
    bundle: true,
    platform: "node",
    format: "cjs",
    packages: "external",
    alias: {
      "@/lib/supabase/admin": "./tests/fixtures/billing-admin.ts",
      "server-only": "./tests/fixtures/server-only.ts",
    },
  });
  const bundle = await import(pathToFileURL(output));
  const { POST } = bundle.default || bundle;
  let sequence = 0;
  const event = (object, type = "checkout.session.completed") => ({
    id: `evt_fixture_${++sequence}`,
    type,
    livemode: false,
    object: "event",
    data: { object },
  });
  const send = async (body, override) => {
    const payload = JSON.stringify(body);
    return POST(
      new Request("http://localhost/api/stripe/webhook", {
        method: "POST",
        body: payload,
        headers: {
          "stripe-signature":
            override ||
            stripe.webhooks.generateTestHeaderString({ payload, secret }),
        },
      }),
    );
  };
  const session = {
    object: "checkout.session",
    mode: "payment",
    currency: "aud",
    client_reference_id: user,
    payment_status: "paid",
    payment_intent: "pi_fixture",
    id: "cs_fixture",
    amount_total: 1000,
    metadata: { flow: "stardust_topup", order_id: order.id, user_id: user },
  };
  assert.equal(
    (
      await POST(
        new Request("http://localhost/api/stripe/webhook", {
          method: "POST",
          body: "{}",
        }),
      )
    ).status,
    400,
  );
  assert.equal((await send(event(session), "invalid-signature")).status, 400);
  assert.equal(calls, 0);
  const wrongMode = event(session);
  wrongMode.livemode = true;
  assert.equal((await send(wrongMode)).status, 400);
  assert.equal(calls, 0);
  console.log(
    "PASS missing/invalid signatures and cross-environment events rejected before database calls",
  );
  assert.equal(
    (await send(event({ ...session, payment_status: "unpaid" }))).status,
    200,
  );
  assert.equal(
    (await send(event({ ...session, metadata: { flow: "old_time_pack" } })))
      .status,
    200,
  );
  assert.equal(calls, 0);
  const mismatched = event({ ...session, amount_total: 999 });
  assert.equal((await send(mismatched)).status, 500);
  assert.equal(
    (
      await db.query(
        "select count(*)::integer as n from stardust_sandbox.stardust_webhooks",
      )
    ).rows[0].n,
    0,
  );
  mismatched.data.object = session;
  assert.equal((await send(mismatched)).status, 200);
  assert.equal((await send(mismatched)).status, 200);
  assert.equal(
    (await send(event(session, "checkout.session.async_payment_succeeded")))
      .status,
    200,
  );
  assert.equal(
    Number(
      (
        await db.query(
          "select paid from stardust_sandbox.stardust_wallets where user_id=$1",
          [user],
        )
      ).rows[0].paid,
    ),
    1000,
  );
  assert.equal(
    (
      await db.query(
        "select count(*)::integer as n from public.stardust_wallets",
      )
    ).rows[0].n,
    0,
  );
  console.log(
    "PASS signed paid callback, rejected amount rollback, retry, duplicate and delayed callback: one sandbox credit, no live wallet",
  );
  assert.equal(
    (
      await send(
        event(
          { object: "charge", payment_intent: "pi_fixture" },
          "charge.refunded",
        ),
      )
    ).status,
    200,
  );
  assert.equal(
    (
      await db.query(
        "select blocked from stardust_sandbox.stardust_wallets where user_id=$1",
        [user],
      )
    ).rows[0].blocked,
    true,
  );
  console.log("PASS verified refund callback blocks sandbox spending only");
} finally {
  delete globalThis.stardustTestAdmin;
  await db.close();
  await rm(directory, { recursive: true, force: true });
}
