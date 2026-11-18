import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const { PGlite } = await import(
  pathToFileURL(
    process.env.PGLITE_MODULE ||
      "/tmp/zblog-billing-test/node_modules/@electric-sql/pglite/dist/index.js",
  )
);
const db = new PGlite();
const user = "00000000-0000-4000-8000-000000000001";
const key = "00000000-0000-4000-8000-000000000002";
try {
  await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;
    create schema auth;create table auth.users(id uuid primary key,created_at timestamptz default now(),email_confirmed_at timestamptz);
    create function auth.uid() returns uuid language sql as $$select null::uuid$$;
    create table public.profiles(id uuid primary key,role text);`);
  await db.query(
    "insert into auth.users(id,email_confirmed_at) values($1,now())",
    [user],
  );
  const production = await readFile(
    new URL("../supabase/stardust.sql", import.meta.url),
    "utf8",
  );
  const sandbox = await readFile(
    new URL("../supabase/stardust-sandbox.sql", import.meta.url),
    "utf8",
  );
  await db.exec(production);
  await db.exec(sandbox);
  await db.exec(sandbox);
  await db.query("select public.stardust_bootstrap($1)", [user]);
  await db.query("select stardust_sandbox.stardust_bootstrap($1)", [user]);
  const order = (
    await db.query(
      "select stardust_sandbox.stardust_create_topup($1,$2,1000) as value",
      [user, key],
    )
  ).rows[0].value;
  await db.query(
    "select stardust_sandbox.stardust_credit_topup('evt_test','checkout.session.completed',$1,$2,'cs_test','pi_test',1000,'aud')",
    [order.id, user],
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
    Number(
      (
        await db.query(
          "select paid from public.stardust_wallets where user_id=$1",
          [user],
        )
      ).rows[0].paid,
    ),
    0,
  );
  assert.equal(
    (
      await db.query(
        "select count(*)::integer as n from public.stardust_topups",
      )
    ).rows[0].n,
    0,
  );
  assert.equal(
    (
      await db.query(
        "select count(*)::integer as n from public.stardust_ledger",
      )
    ).rows[0].n,
    0,
  );
  assert.equal(
    (
      await db.query(
        "select count(*)::integer as n from public.stardust_webhooks",
      )
    ).rows[0].n,
    0,
  );
  console.log(
    "PASS same user, separate wallets, orders, ledger and Stripe event records",
  );
  await db.query(
    "select stardust_sandbox.stardust_reserve($1,$2,'waite-multi','test',false)",
    [user, "00000000-0000-4000-8000-000000000003"],
  );
  assert.equal(
    (
      await db.query(
        "select remaining from public.stardust_allowances where user_id=$1",
        [user],
      )
    ).rows[0].remaining,
    3,
  );
  assert.equal(
    (
      await db.query(
        "select remaining from stardust_sandbox.stardust_allowances where user_id=$1",
        [user],
      )
    ).rows[0].remaining,
    2,
  );
  assert.equal(
    (
      await db.query(
        "select has_function_privilege('authenticated','stardust_sandbox.stardust_reserve(uuid,uuid,text,text,boolean)','execute') as allowed",
      )
    ).rows[0].allowed,
    false,
  );
  assert.equal(
    (
      await db.query(
        "select has_table_privilege('authenticated','stardust_sandbox.stardust_wallets','update') as allowed",
      )
    ).rows[0].allowed,
    false,
  );
  console.log(
    "PASS sandbox allowance use does not consume production allowance; financial RPCs remain server-only",
  );
} finally {
  await db.close();
}
