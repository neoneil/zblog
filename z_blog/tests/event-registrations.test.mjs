import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "/tmp/zblog-billing-test/node_modules/@electric-sql/pglite/dist/index.js";
import { build } from "/tmp/zblog-billing-test/node_modules/esbuild/lib/main.js";

const db = new PGlite();
const admin = "00000000-0000-4000-8000-000000000001";
const alice = "00000000-0000-4000-8000-000000000002";
const bob = "00000000-0000-4000-8000-000000000003";
const eventId = "00000000-0000-4000-8000-000000000004";
async function login(id, role = "authenticated") {
  await db.exec("reset role");
  await db.query("select set_config('request.jwt.claims',$1,false)", [JSON.stringify({ sub: id, email: `${id}@example.test` })]);
  await db.exec(`set role ${role}`);
}
async function rpc(name, args) {
  const placeholders = args.map((_, index) => `$${index + 1}`).join(",");
  return (await db.query(`select public.${name}(${placeholders}) as value`, args)).rows[0].value;
}
const count = async () => Number((await db.query("select booked_count from events where id=$1", [eventId])).rows[0].booked_count);

try {
  await db.exec(`
    create role anon;
    create role authenticated;
    create schema auth;
    create table auth.users(id uuid primary key);
    create table public.profiles(id uuid primary key,role text);
    create function auth.jwt() returns jsonb language sql as $$select coalesce(nullif(current_setting('request.jwt.claims',true),''),'{}')::jsonb$$;
    create function auth.uid() returns uuid language sql as $$select (auth.jwt()->>'sub')::uuid$$;
    grant usage on schema auth to authenticated,anon;
    grant select on profiles to authenticated,anon;
  `);
  await db.query("insert into auth.users values($1),($2),($3)", [admin, alice, bob]);
  await db.query("insert into profiles values($1,'admin'),($2,'user'),($3,'user')", [admin, alice, bob]);
  const base = await readFile(new URL("../supabase/events.sql", import.meta.url), "utf8");
  const migration = await readFile(new URL("../supabase/event-registrations.sql", import.meta.url), "utf8");
  await db.exec(base);
  await db.exec(migration);
  await db.exec(migration);
  await db.query(`insert into events(id,slug,title_zh,title_en,starts_at,ends_at,location_zh,location_en,capacity,registration_open,is_published,is_demo)
    values($1,'test-event','测试活动','Test event',now()+interval '2 days',now()+interval '2 days 2 hours','悉尼','Sydney',1,true,true,false)`, [eventId]);
  assert.equal((await db.query("select price_cents from events where id=$1", [eventId])).rows[0].price_cents, 5000);
  await login(alice);
  const registration = await rpc("event_submit_registration", [eventId, "Alice"]);
  assert.equal(await rpc("event_submit_registration", [eventId, "Alice"]), registration);
  assert.equal(await count(), 0, "Applications do not claim a seat or imply payment");
  await assert.rejects(() => db.query("update event_registrations set status='confirmed' where id=$1", [registration]), /permission denied/);
  await assert.rejects(() => db.query("delete from event_registrations where id=$1", [registration]), /permission denied/);
  await assert.rejects(() => db.query("insert into event_registrations(event_id,user_id,contact_name,contact_email,event_snapshot) values($1,$2,'Fake','fake@example.test','{}')", [eventId, bob]), /permission denied/);
  await assert.rejects(() => rpc("event_review_registration", [registration, "confirmed", ""]), /ADMIN_REQUIRED/);
  console.log("PASS default A$50, idempotent applications, no direct writes or self-confirmation");

  await login(bob);
  assert.equal((await db.query("select * from event_registrations")).rows.length, 0);
  await assert.rejects(() => rpc("event_cancel_request", [registration]), /REGISTRATION_NOT_FOUND/);
  const bobRegistration = await rpc("event_submit_registration", [eventId, "Bob"]);
  await login(admin);
  await rpc("event_review_registration", [registration, "confirmed", "已确认名额"]);
  await rpc("event_review_registration", [registration, "confirmed", "重复请求"]);
  assert.equal(await count(), 1);
  await assert.rejects(() => rpc("event_review_registration", [bobRegistration, "confirmed", ""]), /EVENT_FULL/);
  await assert.rejects(() => db.query("delete from events where id=$1", [eventId]), /foreign key/);
  await login(alice);
  assert.equal((await db.query("select * from event_registrations")).rows.length, 1);
  await assert.rejects(() => rpc("event_cancel_request", [registration]), /CONTACT_ADMIN/);
  await login(admin);
  await rpc("event_review_registration", [registration, "cancelled", "联系管理员处理"]);
  await rpc("event_review_registration", [registration, "cancelled", "重复取消"]);
  assert.equal(await count(), 0);
  await rpc("event_review_registration", [bobRegistration, "confirmed", "名额已确认"]);
  assert.equal(await count(), 1);
  console.log("PASS owner isolation, capacity checks, idempotent confirmation/cancellation, retained history");

  await rpc("event_review_registration", [bobRegistration, "cancelled", ""]);
  await db.query("update events set registration_open=false where id=$1", [eventId]);
  await login(alice);
  await assert.rejects(() => rpc("event_submit_registration", [eventId, "Alice"]), /REGISTRATION_CLOSED/);
  await login(admin);
  await db.query("update events set registration_open=true,is_published=false where id=$1", [eventId]);
  await login(alice);
  await assert.rejects(() => rpc("event_submit_registration", [eventId, "Alice"]), /EVENT_UNAVAILABLE/);
  await login(admin);
  await db.query("update events set is_published=true,starts_at=now()-interval '1 hour' where id=$1", [eventId]);
  await login(alice);
  await assert.rejects(() => rpc("event_submit_registration", [eventId, "Alice"]), /REGISTRATION_CLOSED/);
  await login(admin);
  await db.query("update events set starts_at=now()+interval '2 days' where id=$1", [eventId]);
  await login(alice);
  assert.equal(await rpc("event_submit_registration", [eventId, "Alice Again"]), registration);
  await rpc("event_cancel_request", [registration]);
  await rpc("event_cancel_request", [registration]);
  await login(null, "anon");
  await assert.rejects(() => db.query("select * from event_registrations"), /permission denied/);
  await assert.rejects(() => rpc("event_submit_registration", [eventId, "Anonymous"]), /permission denied/);
  console.log("PASS closed, draft, started events; safe reapplication; anonymous access denied");

  const bundled = await build({ entryPoints: [new URL("../features/events/lib/event-validation.ts", import.meta.url).pathname], bundle: true, write: false, format: "esm", platform: "node" });
  const { parseSydneyInput, parseEventForm } = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString("base64")}`);
  assert.equal(parseSydneyInput("2026-12-04T19:00"), "2026-12-04T08:00:00.000Z");
  assert.equal(parseSydneyInput("2027-06-04T19:00"), "2027-06-04T09:00:00.000Z");
  assert.throws(() => parseSydneyInput("2026-10-04T02:30"));
  assert.throws(() => parseSydneyInput("2027-04-04T02:30"));
  assert.throws(() => parseSydneyInput("2026-02-30T19:00"));
  const form = new FormData();
  for (const [key, value] of Object.entries({ slug: "salon", title_zh: "沙龙", title_en: "Salon", location_zh: "悉尼", location_en: "Sydney", starts_at: "2026-12-04T19:00", ends_at: "2026-12-04T21:00", price_aud: "50.01", capacity: "15" })) form.set(key, value);
  assert.equal(parseEventForm(form).price_cents, 5001);
  form.set("price_aud", "1.001"); assert.throws(() => parseEventForm(form));
  console.log("PASS Sydney summer/winter time, DST ambiguity rejection, exact integer pricing");
} finally {
  await db.close();
}
