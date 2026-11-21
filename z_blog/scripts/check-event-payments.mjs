import { readFile } from "node:fs/promises";
import { parseEnv } from "node:util";
import { createClient } from "@supabase/supabase-js";

// Read-only diagnostics. Never invoke purchase RPCs or print credentials.
const env = { ...parseEnv(await readFile(new URL("../.env.local", import.meta.url), "utf8")), ...process.env };
const client = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
console.log("Payment mode:", env.STRIPE_SECRET_KEY?.startsWith("sk_test_") ? "test" : "not-test");
const { data, error } = await client.from("events")
  .select("slug,title_zh,starts_at,ends_at,location_zh,price_cents,is_demo,is_published,registration_open")
  .eq("slug", "demo-next-month-salon").maybeSingle();
console.log("Direct event read:", error ? { error: error.code } : data);
for (const schema of ["public", "stardust_sandbox"]) {
  for (const table of ["stardust_event_tickets", "stardust_event_inventory"]) {
    const { error } = await client.schema(schema).from(table).select("event_id", { head: true }).limit(1);
    console.log(`${schema}.${table}:`, error ? `NOT READY (${error.code})` : "READY");
  }
}
