import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export function billingSchema(): "public" | "stardust_sandbox" {
  const key = process.env.STRIPE_SECRET_KEY;
  if (key?.startsWith("sk_test_")) return "stardust_sandbox";
  if (key && !key.startsWith("sk_live_"))
    throw new Error("INVALID_STRIPE_KEY_MODE");
  return "public";
}

export function createBillingAdminClient() {
  return createAdminClient().schema(billingSchema());
}
