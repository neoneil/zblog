import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { AiAccessStatus, AiProductScope } from "@/features/billing/lib/types";

export type AiAccessCheck =
  | {
      allowed: true;
      status: AiAccessStatus;
    }
  | {
      allowed: false;
      httpStatus: number;
      code: "login_required" | "daily_limit_reached" | "usage_check_failed";
      message: string;
      status?: AiAccessStatus;
    };

const TIME_ZONE = "Australia/Sydney";
const DAILY_FREE_LIMIT = 1;

function getTodayInSydney() {
  const parts = new Intl.DateTimeFormat("en-AU", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

function isFutureDate(value: string | null | undefined) {
  return value ? new Date(value).getTime() > Date.now() : false;
}

export async function getAiAccessStatus(
  productScope: AiProductScope,
): Promise<AiAccessStatus> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      authenticated: false,
      isAdmin: false,
      isPaid: false,
      usedToday: false,
      remainingToday: 0,
      validUntil: null,
    };
  }

  const [{ data: profile }, { data: entitlement }, { data: usage }] =
    await Promise.all([
      supabase.from("profiles").select("role").eq("id", user.id).single(),
      supabase
        .from("ai_entitlements")
        .select("valid_until")
        .eq("user_id", user.id)
        .eq("product_scope", productScope)
        .maybeSingle(),
      supabase
        .from("ai_daily_usage")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_scope", productScope)
        .eq("usage_date", getTodayInSydney())
        .maybeSingle(),
    ]);

  const isAdmin = profile?.role === "admin";
  const validUntil = entitlement?.valid_until ?? null;
  const isPaid = isFutureDate(validUntil);
  const usedToday = Boolean(usage);

  return {
    authenticated: true,
    isAdmin,
    isPaid,
    usedToday,
    remainingToday: isAdmin || isPaid || !usedToday ? DAILY_FREE_LIMIT : 0,
    validUntil,
  };
}

export async function consumeAiAccess(
  productScope: AiProductScope,
): Promise<AiAccessCheck> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      allowed: false,
      httpStatus: 401,
      code: "login_required",
      message: "请先登录后再使用 AI 功能。",
    };
  }

  const status = await getAiAccessStatus(productScope);

  if (status.isAdmin || status.isPaid) {
    return {
      allowed: true,
      status,
    };
  }

  const { error } = await supabase.from("ai_daily_usage").insert({
    user_id: user.id,
    product_scope: productScope,
    usage_date: getTodayInSydney(),
  });

  if (!error) {
    return {
      allowed: true,
      status: {
        ...status,
        usedToday: true,
        remainingToday: 0,
      },
    };
  }

  if (error.code === "23505") {
    return {
      allowed: false,
      httpStatus: 429,
      code: "daily_limit_reached",
      message: "今日免费 AI 使用次数已用完。购买时间包后可无限使用对应功能。",
      status: {
        ...status,
        usedToday: true,
        remainingToday: 0,
      },
    };
  }

  console.error("AI usage check failed:", error);

  return {
    allowed: false,
    httpStatus: 500,
    code: "usage_check_failed",
    message: "AI 使用权限检查失败，请稍后再试。",
    status,
  };
}
