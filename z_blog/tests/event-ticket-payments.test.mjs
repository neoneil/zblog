import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "/tmp/zblog-billing-test/node_modules/@electric-sql/pglite/dist/index.js";

const db = new PGlite();
const alice = "00000000-0000-4000-8000-000000000001";
const bob = "00000000-0000-4000-8000-000000000002";
const admin = "00000000-0000-4000-8000-000000000003";
let sequence = 10;
const id = () => `00000000-0000-4000-8000-${String(sequence++).padStart(12,"0")}`;
const sql = async (name) => readFile(new URL(`../supabase/${name}`, import.meta.url), "utf8");
async function buy(schema, user, event, request = id(), price = 5000) {
  return (await db.query(`select ${schema}.stardust_buy_event_ticket($1,$2,$3,'Attendee',$4) as value`, [user,event,request,price])).rows[0].value;
}
async function event(capacity = 1) {
  const key = id();
  await db.query(`insert into events(id,slug,title_zh,title_en,starts_at,ends_at,location_zh,location_en,capacity,is_demo,is_published,registration_open,price_cents)
    values($1,$2,'线上沙龙','Online Salon',now()+interval '2 days',now()+interval '2 days 2 hours','线上','Online',$3,false,true,true,5000)`, [key,`event-${key}`,capacity]);
  return key;
}
async function balance(schema, user) {
  const row = (await db.query(`select paid,reward from ${schema}.stardust_wallets where user_id=$1`, [user])).rows[0];
  return [Number(row.paid), Number(row.reward)];
}
try {
  await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;
    create schema auth;
    create table auth.users(id uuid primary key,email text,created_at timestamptz default now(),email_confirmed_at timestamptz);
    create function auth.jwt() returns jsonb language sql as $$select coalesce(nullif(current_setting('request.jwt.claims',true),''),'{}')::jsonb$$;
    create function auth.uid() returns uuid language sql as $$select (auth.jwt()->>'sub')::uuid$$;
    create table public.profiles(id uuid primary key,role text);
    grant usage on schema auth to anon,authenticated;
    grant select on profiles to anon,authenticated;
  `);
  await db.query("insert into auth.users(id,email,email_confirmed_at) values($1,'alice@example.test',now()),($2,'bob@example.test',now()),($3,'admin@example.test',now())", [alice,bob,admin]);
  await db.query("insert into profiles values($1,'user'),($2,'user'),($3,'admin')", [alice,bob,admin]);
  await db.exec(await sql("events.sql"));
  await db.exec(await sql("event-registrations.sql"));
  await db.exec(await sql("stardust.sql"));
  await db.exec(await sql("stardust-functions.sql"));
  await db.exec(await sql("stardust-sandbox.sql"));
  await db.exec(await sql("event-ticket-payments.sql"));
  await db.exec(await sql("event-ticket-payments.sql"));
  for (const schema of ["public","stardust_sandbox"]) {
    await db.query(`select ${schema}.stardust_bootstrap($1),${schema}.stardust_bootstrap($2)`, [alice,bob]);
    await db.query(`update ${schema}.stardust_wallets set paid=10000,reward=1500`);
  }
  const sandboxEvent = await event();
  const request = id();
  assert.equal((await buy("stardust_sandbox",alice,sandboxEvent,request)).status,"paid");
  assert.deepEqual(await balance("stardust_sandbox",alice),[6500,0]);
  assert.deepEqual(await balance("public",alice),[10000,1500]);
  assert.equal((await db.query("select booked_count from events where id=$1",[sandboxEvent])).rows[0].booked_count,0);
  assert.equal((await db.query("select count(*)::int as n from event_registrations")).rows[0].n,0);
  await buy("stardust_sandbox",alice,sandboxEvent,request);
  await buy("stardust_sandbox",alice,sandboxEvent);
  assert.deepEqual(await balance("stardust_sandbox",alice),[6500,0]);
  await assert.rejects(()=>buy("stardust_sandbox",bob,sandboxEvent),/EVENT_FULL/);
  assert.deepEqual(await balance("stardust_sandbox",bob),[10000,1500]);
  console.log("PASS sandbox isolation, reward-first spending, one ticket per user, full means no debit");

  const productionEvent = await event();
  const paid = await buy("public",alice,productionEvent);
  assert.equal(paid.status,"paid");
  assert.deepEqual(await balance("public",alice),[6500,0]);
  assert.equal((await db.query("select booked_count from events where id=$1",[productionEvent])).rows[0].booked_count,1);
  assert.equal((await db.query("select status from event_registrations where event_id=$1",[productionEvent])).rows[0].status,"confirmed");
  assert.equal((await db.query("select count(*)::int as n from public.stardust_ledger where kind='event_purchase'")).rows[0].n,1);
  const insufficientEvent = await event();
  await db.query("update public.stardust_wallets set paid=0,reward=0 where user_id=$1",[bob]);
  assert.equal((await buy("public",bob,insufficientEvent)).status,"insufficient");
  assert.equal((await db.query("select booked_count from events where id=$1",[insufficientEvent])).rows[0].booked_count,0);
  await assert.rejects(()=>buy("public",alice,insufficientEvent,id(),4999),/PRICE_CHANGED/);
  assert.deepEqual(await balance("public",alice),[6500,0]);
  console.log("PASS atomic live-ledger purchase, confirmed registration, insufficient balance and stale price rejection (isolated DB)");

  const rollbackEvent = await event();
  await db.exec(`create function reject_test_registration() returns trigger language plpgsql as $$begin raise exception 'TEST_DOWNSTREAM_FAILURE';end$$;
    create trigger reject_test_registration before insert on event_registrations for each row execute function reject_test_registration();`);
  await assert.rejects(()=>buy("public",alice,rollbackEvent),/TEST_DOWNSTREAM_FAILURE/);
  assert.deepEqual(await balance("public",alice),[6500,0]);
  assert.equal((await db.query("select booked_count from events where id=$1",[rollbackEvent])).rows[0].booked_count,0);
  assert.equal((await db.query("select count(*)::int as n from public.stardust_event_tickets where event_id=$1",[rollbackEvent])).rows[0].n,0);
  await db.exec("drop trigger reject_test_registration on event_registrations;drop function reject_test_registration();");
  await db.query("select set_config('request.jwt.claims',$1,false)",[JSON.stringify({sub:admin,email:"admin@example.test"})]);
  await db.exec("set role authenticated");
  await assert.rejects(()=>buy("public",alice,insufficientEvent),/permission denied/);
  await assert.rejects(()=>db.query("select public.event_submit_registration($1,'Admin')",[insufficientEvent]),/PAYMENT_REQUIRED/);
  const registration = (await db.query("select id from event_registrations where event_id=$1",[productionEvent])).rows[0].id;
  await assert.rejects(()=>db.query("select public.event_review_registration($1,'cancelled','')",[registration]),/PAID_TICKET_CONTACT_SUPPORT/);
  await db.exec("reset role");
  console.log("PASS rollback on downstream failure, service-only spending, no manual bypass or unrefunded cancellation");

  await db.exec(await sql("event-salon-open.sql"));
  const salon=(await db.query("select * from events where slug='demo-next-month-salon'")).rows[0];
  assert.equal(salon.is_demo,false);assert.equal(salon.price_cents,5000);assert.equal(salon.location_zh,"线上活动");
  assert.equal(salon.booked_count,0);assert.equal(salon.registration_open,true);
  console.log("PASS requested salon promotion, A$50, online, seed-only occupancy cleared");
} finally { await db.close(); }
