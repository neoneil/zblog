import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

// PGlite is a temporary test dependency, never a production database client.
const { PGlite } = await import(
  pathToFileURL(
    process.env.PGLITE_MODULE ||
      "/tmp/zblog-billing-test/node_modules/@electric-sql/pglite/dist/index.js",
  )
);
const db = new PGlite();
const user = "00000000-0000-4000-8000-000000000001";
const admin = "00000000-0000-4000-8000-000000000002";
let sequence = 10;
const id = () =>
  `00000000-0000-4000-8000-${String(sequence++).padStart(12, "0")}`;
const rpc = async (name, args) =>
  (
    await db.query(
      `select public.${name}(${args.map((_, i) => `$${i + 1}`).join(",")}) as value`,
      args,
    )
  ).rows[0].value;
const wallet = async () =>
  (await db.query("select * from stardust_wallets where user_id=$1", [user]))
    .rows[0];

try {
  await db.exec(`
    create role anon; create role authenticated; create role service_role bypassrls;
    create schema auth;
    create table auth.users(id uuid primary key, created_at timestamptz default now(), email_confirmed_at timestamptz);
    create function auth.uid() returns uuid language sql as $$select null::uuid$$;
    create table public.profiles(id uuid primary key,role text);
  `);
  await db.query(
    "insert into auth.users(id,email_confirmed_at) values($1,now()),($2,now())",
    [user, admin],
  );
  await db.query("insert into profiles values($1,$2)", [admin, "admin"]);
  const sql = await readFile(
    new URL("../supabase/stardust.sql", import.meta.url),
    "utf8",
  );
  const supplement = await readFile(
    new URL("../supabase/stardust-functions.sql", import.meta.url),
    "utf8",
  );
  await db.exec(
    sql.slice(
      0,
      sql.indexOf("create or replace function public.stardust_bootstrap"),
    ) + "commit;",
  );
  await db.exec(supplement);
  await db.exec(sql);
  await rpc("stardust_bootstrap", [user]);
  assert.equal(
    (
      await db.query(
        "select sum(remaining)::integer as n from stardust_allowances where user_id=$1",
        [user],
      )
    ).rows[0].n,
    3,
  );
  await rpc("stardust_bootstrap", [user]);
  assert.equal(
    (
      await db.query(
        "select count(*)::integer as n from stardust_allowances where user_id=$1",
        [user],
      )
    ).rows[0].n,
    1,
  );
  console.log("PASS migration rerun and idempotent free grant");

  for (const amount of [1000, 2500, 5000, 10000, 20000, 50000]) {
    const order = await rpc("stardust_create_topup", [user, id(), amount]);
    assert.equal(order.amount_cents, amount);
  }
  await assert.rejects(
    rpc("stardust_create_topup", [user, id(), 1234]),
    /INVALID_AMOUNT/,
  );
  const order = await rpc("stardust_create_topup", [user, id(), 1000]);
  const event = `evt_${id()}`;
  await assert.rejects(
    rpc("stardust_credit_topup", [
      event,
      "checkout.session.completed",
      order.id,
      user,
      "cs_test",
      "pi_test",
      999,
      "aud",
    ]),
    /PAYMENT_MISMATCH/,
  );
  assert.equal(
    (await db.query("select count(*)::integer as n from stardust_webhooks"))
      .rows[0].n,
    0,
  );
  await rpc("stardust_credit_topup", [
    event,
    "checkout.session.completed",
    order.id,
    user,
    "cs_test",
    "pi_test",
    1000,
    "aud",
  ]);
  await rpc("stardust_credit_topup", [
    event,
    "checkout.session.completed",
    order.id,
    user,
    "cs_test",
    "pi_test",
    1000,
    "aud",
  ]);
  await rpc("stardust_credit_topup", [
    `${event}_retry`,
    "checkout.session.async_payment_succeeded",
    order.id,
    user,
    "cs_test",
    "pi_test",
    1000,
    "aud",
  ]);
  assert.equal(Number((await wallet()).paid), 1000);
  console.log(
    "PASS fixed top-ups, rejected mismatches, atomic webhook retry and duplicate credit",
  );

  const request = id();
  assert.equal(
    (
      await rpc("stardust_reserve", [
        user,
        request,
        "waite-multi",
        "payload",
        false,
      ])
    ).status,
    "reserved",
  );
  assert.equal(
    (
      await rpc("stardust_reserve", [
        user,
        request,
        "waite-multi",
        "payload",
        false,
      ])
    ).status,
    "processing",
  );
  await assert.rejects(
    rpc("stardust_reserve", [user, request, "waite-multi", "other", false]),
    /REQUEST_CONFLICT/,
  );
  await rpc("stardust_complete", [
    user,
    request,
    { reading: "Complete report" },
  ]);
  assert.equal(
    (
      await rpc("stardust_reserve", [
        user,
        request,
        "waite-multi",
        "payload",
        false,
      ])
    ).result.reading,
    "Complete report",
  );
  assert.equal(
    (
      await db.query(
        "select remaining from stardust_allowances where user_id=$1",
        [user],
      )
    ).rows[0].remaining,
    2,
  );
  assert.equal(Number((await wallet()).paid), 1000);
  console.log(
    "PASS allowance-first, cached complete report and conflicting idempotency key",
  );

  await db.query(
    "update stardust_allowances set remaining=0 where user_id=$1",
    [user],
  );
  await db.query("update stardust_wallets set reward=200 where user_id=$1", [
    user,
  ]);
  const paidRequest = id();
  assert.equal(
    (
      await rpc("stardust_reserve", [
        user,
        paidRequest,
        "waite-multi",
        "paid",
        false,
      ])
    ).status,
    "confirmation_required",
  );
  assert.equal(Number((await wallet()).paid), 1000);
  await rpc("stardust_reserve", [
    user,
    paidRequest,
    "waite-multi",
    "paid",
    true,
  ]);
  assert.equal(Number((await wallet()).reward), 0);
  assert.equal(Number((await wallet()).paid), 900);
  await rpc("stardust_release", [paidRequest, user]);
  await rpc("stardust_release", [paidRequest, user]);
  assert.equal(Number((await wallet()).reward), 200);
  assert.equal(Number((await wallet()).paid), 1000);
  assert.equal(
    (await rpc("stardust_reserve", [user, id(), "natal", "unpriced", true]))
      .status,
    "unpriced",
  );
  console.log(
    "PASS explicit consent, reward-first, exact-source refund and unconfirmed price refusal",
  );

  const expired = id();
  await rpc("stardust_reserve", [user, expired, "thoth", "expired", true]);
  await db.query(
    "update stardust_requests set expires_at=now()-interval '1 minute' where id=$1",
    [expired],
  );
  assert.equal(
    (await rpc("stardust_reserve", [user, expired, "thoth", "expired", true]))
      .status,
    "released",
  );
  assert.equal(Number((await wallet()).reward), 200);
  console.log("PASS expired holds release on retry");

  await db.query(
    "update stardust_wallets set paid=1000000,reward=0 where user_id=$1",
    [user],
  );
  const member = id();
  await rpc("stardust_reserve", [
    user,
    member,
    "membership-annual",
    "annual",
    true,
  ]);
  await rpc("stardust_complete", [user, member, { purchased: true }]);
  const oldExpiry = (
    await db.query(
      "select valid_until from stardust_memberships where user_id=$1 and plan='annual'",
      [user],
    )
  ).rows[0].valid_until;
  const renewal = id();
  await rpc("stardust_reserve", [
    user,
    renewal,
    "membership-annual",
    "renew",
    true,
  ]);
  await rpc("stardust_complete", [user, renewal, { purchased: true }]);
  const annual = (
    await db.query(
      "select sum(remaining)::integer as n,count(distinct expires_at)::integer as expiries from stardust_allowances where user_id=$1 and family='annual' and service='tarot'",
      [user],
    )
  ).rows[0];
  assert.equal(annual.n, 72);
  assert.equal(annual.expiries, 1);
  const newExpiry = (
    await db.query(
      "select valid_until from stardust_memberships where user_id=$1 and plan='annual'",
      [user],
    )
  ).rows[0].valid_until;
  assert.ok(new Date(newExpiry) > new Date(oldExpiry));
  const monthly = id();
  await rpc("stardust_reserve", [
    user,
    monthly,
    "membership-monthly",
    "monthly",
    true,
  ]);
  await rpc("stardust_complete", [user, monthly, { purchased: true }]);
  assert.equal(
    (
      await db.query(
        "select count(*)::integer as n from stardust_memberships where user_id=$1",
        [user],
      )
    ).rows[0].n,
    2,
  );
  await assert.rejects(
    rpc("stardust_reserve", [user, id(), "course-waite", "course", true]),
    /ALREADY_INCLUDED/,
  );
  console.log(
    "PASS renewal grants immediately, extends active allowances, coexisting memberships and included courses",
  );

  const adminRequest = id();
  await rpc("stardust_reserve", [admin, adminRequest, "natal", "admin", false]);
  await rpc("stardust_complete", [
    admin,
    adminRequest,
    { reading: "Admin result" },
  ]);
  assert.equal(
    (
      await db.query(
        "select remaining from stardust_allowances where user_id=$1",
        [admin],
      )
    ).rows[0].remaining,
    3,
  );
  await rpc("stardust_risk_event", [
    "evt_refund",
    "charge.refunded",
    "pi_test",
  ]);
  await assert.rejects(
    rpc("stardust_reserve", [user, id(), "thoth", "blocked", true]),
    /ACCOUNT_REVIEW/,
  );
  console.log("PASS admin unlimited and refund/dispute spending block");

  assert.equal(
    (
      await db.query(
        "select has_function_privilege('authenticated','public.stardust_reserve(uuid,uuid,text,text,boolean)','execute') as allowed",
      )
    ).rows[0].allowed,
    false,
  );
  assert.equal(
    (
      await db.query(
        "select has_table_privilege('authenticated','public.stardust_wallets','update') as allowed",
      )
    ).rows[0].allowed,
    false,
  );
  console.log("PASS browser cannot mutate wallets or invoke financial RPCs");

  await rpc("stardust_maintenance", []);
  const mail = await db.query("select * from stardust_claim_mail()");
  assert.ok(mail.rows.length > 0);
  assert.equal(
    (await db.query("select * from stardust_claim_mail()")).rows.length,
    0,
  );
  console.log("PASS supplemental migration and non-overlapping mail leases");

  const veteran = id();
  await db.query(
    "update stardust_settings set launch_at=now()-interval '8 months'",
  );
  await db.query(
    "insert into auth.users(id,created_at,email_confirmed_at) values($1,now()-interval '6 months',now()-interval '6 months')",
    [veteran],
  );
  await rpc("stardust_bootstrap", [veteran]);
  const grants = (
    await db.query(
      "select count(*)::integer as batches,sum(remaining)::integer as total from stardust_allowances where user_id=$1",
      [veteran],
    )
  ).rows[0];
  assert.equal(grants.batches, 7);
  assert.equal(grants.total, 21);
  assert.equal(
    (
      await db.query(
        "select sum(remaining)::integer as total from stardust_allowances where user_id=$1 and expires_at>now()",
        [veteran],
      )
    ).rows[0].total,
    3,
  );
  console.log(
    "PASS seven Sydney calendar-month grants, 21 total and expired months unavailable",
  );
  const futureUser=id();
  await db.query("update stardust_settings set launch_at=now()+interval '1 hour'");
  await db.query('insert into auth.users(id,email_confirmed_at) values($1,now())',[futureUser]);
  await rpc('stardust_bootstrap',[futureUser]);
  assert.equal((await db.query('select count(*)::integer as n from stardust_allowances where user_id=$1',[futureUser])).rows[0].n,0);
  await db.query('update stardust_settings set launch_at=now()');
  console.log('PASS no free grants before the configured launch time');

  const earlyRefundUser=id();
  await db.query('insert into auth.users(id,email_confirmed_at) values($1,now())',[earlyRefundUser]);
  const earlyOrder=await rpc('stardust_create_topup',[earlyRefundUser,id(),1000]);
  await rpc('stardust_risk_event',['evt_early_refund','charge.refunded','pi_early_refund']);
  await rpc('stardust_credit_topup',['evt_late_paid','checkout.session.completed',earlyOrder.id,earlyRefundUser,'cs_early','pi_early_refund',1000,'aud']);
  await rpc('stardust_credit_topup',['evt_late_paid_retry','checkout.session.completed',earlyOrder.id,earlyRefundUser,'cs_early','pi_early_refund',1000,'aud']);
  const reviewed=(await db.query('select paid,blocked from stardust_wallets where user_id=$1',[earlyRefundUser])).rows[0];
  assert.equal(Number(reviewed.paid),0);
  assert.equal(reviewed.blocked,true);
  assert.equal((await db.query('select status from stardust_topups where id=$1',[earlyOrder.id])).rows[0].status,'review');
  console.log('PASS refund-before-paid webhook ordering never creates spendable credit');
} finally {
  await db.close();
}
