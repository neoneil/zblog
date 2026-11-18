import "server-only";
import { createClient } from "@/lib/supabase/server";
import { billingSchema, createBillingAdminClient } from "./billing-db";

export async function billingUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  return { user, isAdmin: profile?.role === "admin", supabase };
}

export async function walletSnapshot() {
  const context = await billingUser();
  if (!context) return null;
  const { user, supabase: userClient } = context;
  try {
    const supabase = userClient.schema(billingSchema());
    const admin = createBillingAdminClient();
    const { error } = await admin.rpc("stardust_bootstrap", {
      p_user: user.id,
    });
    if (error)
      return {
        ready: false,
        verified: !!user.email_confirmed_at,
        wallet: null,
        memberships: [],
        allowances: [],
        courses: [],
        ledger: [],
        topups: [],
        reports: [],
      };
    const now = new Date().toISOString();
    const results = await Promise.all([
      supabase
        .from("stardust_wallets")
        .select("paid,reward,blocked")
        .eq("user_id", user.id)
        .single(),
      supabase
        .from("stardust_memberships")
        .select("plan,valid_until")
        .eq("user_id", user.id)
        .gt("valid_until", now),
      supabase
        .from("stardust_allowances")
        .select("service,family,remaining,expires_at")
        .eq("user_id", user.id)
        .gt("expires_at", now)
        .gt("remaining", 0)
        .order("expires_at"),
      supabase
        .from("stardust_access")
        .select("course,valid_until")
        .eq("user_id", user.id)
        .gt("valid_until", now),
      supabase
        .from("stardust_ledger")
        .select("id,kind,paid_delta,reward_delta,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(30),
      supabase
        .from("stardust_topups")
        .select("id,status,amount_cents,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("stardust_requests")
        .select("id,sku,result,created_at")
        .eq("user_id", user.id)
        .eq("state", "completed")
        .not("result", "is", null)
        .order("created_at", { ascending: false })
        .limit(20),
    ]);
    if (results.some((result) => result.error))
      throw new Error("SNAPSHOT_FAILED");
    return {
      ready: true,
      verified: true,
      wallet: results[0].data as unknown as {
        paid: number;
        reward: number;
        blocked: boolean;
      },
      memberships: results[1].data as unknown as {
        plan: "annual" | "monthly";
        valid_until: string;
      }[],
      allowances: results[2].data as unknown as {
        service: string;
        family: string;
        remaining: number;
        expires_at: string;
      }[],
      courses: results[3].data as unknown as {
        course: string;
        valid_until: string;
      }[],
      ledger: results[4].data as unknown as {
        id: number;
        kind: string;
        paid_delta: number;
        reward_delta: number;
        created_at: string;
      }[],
      topups: results[5].data as unknown as {
        id: string;
        status: string;
        amount_cents: number;
        created_at: string;
      }[],
      reports: results[6].data as unknown as {
        id: string;
        sku: string;
        result: unknown;
        created_at: string;
      }[],
    };
  } catch {
    return {
      ready: false,
      verified: !!user.email_confirmed_at,
      wallet: null,
      memberships: [],
      allowances: [],
      courses: [],
      ledger: [],
      topups: [],
      reports: [],
    };
  }
}
export type WalletSnapshot = NonNullable<
  Awaited<ReturnType<typeof walletSnapshot>>
>;
