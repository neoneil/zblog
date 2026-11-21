import "server-only";
import { createClient } from "@/lib/supabase/server";
import { billingSchema, createBillingAdminClient } from "@/features/billing/lib/billing-db";
import { billingReadiness } from "@/features/billing/lib/billing-readiness";
import type { EventSnapshot } from "./registration-types";

export type EventTicket = {
  id: string; user_id: string; event_id: string; status: "paid" | "refunded";
  amount_stars: number; paid_stars: number; reward_stars: number;
  event_snapshot: EventSnapshot; created_at: string;
};

export async function eventTicketContext(eventId?: string) {
  const readiness = billingReadiness();
  const sandbox = billingSchema() === "stardust_sandbox";
  const client = await createClient();
  const { data: { user } } = await client.auth.getUser();
  if (!user) return { tickets: [] as EventTicket[], available: true, enabled: false, sandbox, balance: 0 };
  const admin = createBillingAdminClient();
  // Head-only check makes missing payment SQL fail closed even before a first purchase.
  const installed = await admin.from("stardust_event_inventory").select("event_id", { head: true }).limit(1);
  let query = client.schema(billingSchema()).from("stardust_event_tickets")
    .select("id,user_id,event_id,status,amount_stars,paid_stars,reward_stars,event_snapshot,created_at")
    .eq("user_id", user.id).order("created_at", { ascending: false }).limit(200);
  if (eventId) query = query.eq("event_id", eventId);
  const { data, error } = await query;
  const wallet = await client.schema(billingSchema()).from("stardust_wallets")
    .select("paid,reward,blocked").eq("user_id", user.id).maybeSingle();
  return {
    tickets: (data ?? []) as EventTicket[], available: !error && !installed.error && !wallet.error,
    enabled: readiness.canCheckout, sandbox,
    balance: wallet.data && !wallet.data.blocked ? Number(wallet.data.paid) + Number(wallet.data.reward) : 0,
  };
}
