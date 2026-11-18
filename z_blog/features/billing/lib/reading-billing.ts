import "server-only";
import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { billingUser } from "./stardust-server";
import { createBillingAdminClient } from "./billing-db";
import { billingMessage, isRequestId } from "./stardust-config";

export type ReadingLease = {
  response?: NextResponse;
  complete: (result: unknown) => Promise<NextResponse>;
  release: () => Promise<void>;
};
function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, item]) => [key, canonical(item)]),
    );
  return value;
}
export async function beginReading(
  request: Request,
  sku: string,
  payload: unknown,
): Promise<ReadingLease> {
  const idle = (response: NextResponse): ReadingLease => ({
    response,
    complete: async () => response,
    release: async () => {},
  });
  const context = await billingUser();
  if (!context)
    return idle(
      NextResponse.json(
        { error: "请先登录。 / Please sign in.", code: "login_required" },
        { status: 401 },
      ),
    );
  const id = request.headers.get("idempotency-key");
  if (!isRequestId(id))
    return idle(
      NextResponse.json(
        {
          error: "请刷新页面后重试。 / Refresh the page and try again.",
          code: "request_id_required",
        },
        { status: 400 },
      ),
    );
  const db = createBillingAdminClient();
  const user = context.user.id;
  const fingerprint = createHash("sha256")
    .update(JSON.stringify(canonical(payload)))
    .digest("hex");
  const enabled = process.env.STARDUST_CHECKOUT_ENABLED === "true";
  const { data, error } = await db.rpc("stardust_reserve", {
    p_user: user,
    p_id: id,
    p_sku: sku,
    p_fingerprint: fingerprint,
    p_confirm: enabled && request.headers.get("x-stardust-confirm") === "yes",
  });
  if (error)
    return idle(
      NextResponse.json(
        {
          error: billingMessage(error),
          code: error.message.includes("REQUEST_RELEASED")
            ? "released"
            : "billing_unavailable",
        },
        { status: error.message.includes("REQUEST_RELEASED") ? 409 : 503 },
      ),
    );
  if (data.status === "completed") return idle(NextResponse.json(data.result));
  if (data.status === "processing")
    return idle(
      NextResponse.json(
        {
          error: "正在生成，请稍候。 / Reading in progress.",
          code: "processing",
        },
        { status: 409, headers: { "Retry-After": "2" } },
      ),
    );
  if (data.status === "confirmation_required")
    return idle(
      NextResponse.json(
        enabled
          ? {
              error: "请确认使用STARS。 / Confirm STARS payment.",
              code: "confirm_stars",
              stars: data.stars,
            }
          : {
              error: "积分支付暂未开放。 / STARS payments are not open yet.",
              code: "billing_closed",
            },
        { status: 402 },
      ),
    );
  if (data.status !== "reserved")
    return idle(
      NextResponse.json(
        {
          error:
            data.status === "unpriced"
              ? "该服务价格尚未确认，暂不开放积分购买。 / STARS pricing is not yet available."
              : "余额不足，请前往星尘钱包充值。 / Insufficient STARS.",
          code: data.status,
          upgradeUrl: "/wallet",
        },
        { status: 402 },
      ),
    );
  return {
    complete: async (result) => {
      const { data: stored, error: settleError } = await db.rpc(
        "stardust_complete",
        { p_user: user, p_id: id, p_result: result },
      );
      if (settleError)
        throw new Error(
          "结算暂未完成，请前往钱包检查报告，勿重复付款。 / Settlement incomplete. Check your wallet before retrying.",
        );
      return NextResponse.json(stored);
    },
    release: async () => {
      const { error: releaseError } = await db.rpc("stardust_release", {
        p_user: user,
        p_id: id,
      });
      if (releaseError)
        console.error("Reading reservation release needs retry");
    },
  };
}
