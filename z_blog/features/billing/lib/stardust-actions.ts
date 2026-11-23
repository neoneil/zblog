"use server";

import { createBillingAdminClient } from "./billing-db";
import { requireUser } from "@/lib/auth/require-user";
import { getStripe } from "./stripe";
import {
  billingMessage,
  isRequestId,
  siteOrigin,
  TOPUP_CENTS,
} from "./stardust-config";
import { revalidatePath } from "next/cache";
import { billingReadiness } from "./billing-readiness";

export async function createStardustCheckout(
  amount: number,
  requestId: string,
  returnTo?: "/recharge",
) {
  const returnPath = returnTo === "/recharge" ? "/recharge" : "/wallet";
  const { user } = await requireUser(returnPath);
  if (
    !isRequestId(requestId) ||
    !(TOPUP_CENTS as readonly number[]).includes(amount)
  )
    return {
      ok: false as const,
      message: "无效的充值金额。 / Invalid amount.",
    };
  if (process.env.STARDUST_CHECKOUT_ENABLED !== "true")
    return {
      ok: false as const,
      message: "充值尚未开放。 / Top-ups are not open yet.",
    };
  if (!billingReadiness().canCheckout)
    return {
      ok: false as const,
      message:
        "支付配置尚未完成，请联系管理员。 / Payment setup is incomplete. Please contact support.",
    };
  try {
    const db = createBillingAdminClient();
    const { data: order, error } = await db.rpc("stardust_create_topup", {
      p_user: user.id,
      p_key: requestId,
      p_amount: amount,
    });
    if (error) throw error;
    if (order.status !== "pending")
      return {
        ok: false as const,
        message:
          "此订单已处理，请刷新钱包。 / This order has already been processed.",
      };
    const stripe = getStripe();
    if (order.session_id) {
      const existing = await stripe.checkout.sessions.retrieve(
        order.session_id,
      );
      if (existing.status === "open" && existing.url)
        return { ok: true as const, url: existing.url };
      return {
        ok: false as const,
        message:
          "此支付链接已结束，请刷新后重新充值。 / Checkout closed. Refresh and start again.",
      };
    }
    const origin = siteOrigin();
    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        payment_method_types: ["card", "alipay"],
        client_reference_id: user.id,
        customer_email: user.email,
        expires_at:
          Math.floor(new Date(order.created_at).getTime() / 1000) + 86400,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "aud",
              unit_amount: order.amount_cents,
              product_data: { name: `STARDUST · ${order.amount_cents} STARS` },
            },
          },
        ],
        metadata: {
          flow: "stardust_topup",
          order_id: order.id,
          user_id: user.id,
        },
        payment_intent_data: {
          metadata: {
            flow: "stardust_topup",
            order_id: order.id,
            user_id: user.id,
          },
        },
        success_url: `${origin}${returnPath}?topup=${order.id}`,
        cancel_url: `${origin}${returnPath}?cancelled=1`,
      },
      { idempotencyKey: `stardust-topup-${order.id}` },
    );
    const { error: bindError } = await db
      .from("stardust_topups")
      .update({ session_id: session.id })
      .eq("id", order.id)
      .is("session_id", null);
    if (bindError) throw bindError;
    if (!session.url) throw new Error("CHECKOUT_FAILED");
    return { ok: true as const, url: session.url };
  } catch (error) {
    return { ok: false as const, message: billingMessage(error) };
  }
}

export async function purchaseStardustProduct(sku: string, requestId: string) {
  const { user } = await requireUser("/wallet");
  if (process.env.STARDUST_CHECKOUT_ENABLED !== "true")
    return {
      ok: false as const,
      message: "购买尚未开放。 / Purchases are not open yet.",
    };
  if (
    !isRequestId(requestId) ||
    !["membership-annual", "membership-monthly"].includes(sku)
  )
    return {
      ok: false as const,
      message: "商品尚未开放。 / Product unavailable.",
    };
  const db = createBillingAdminClient();
  try {
    const { data: hold, error } = await db.rpc("stardust_reserve", {
      p_user: user.id,
      p_id: requestId,
      p_sku: sku,
      p_fingerprint: `purchase:${sku}`,
      p_confirm: true,
    });
    if (error) throw error;
    if (hold.status === "processing")
      return {
        ok: false as const,
        message: "订单处理中，请稍后刷新。 / Order processing.",
      };
    if (hold.status === "insufficient")
      return {
        ok: false as const,
        message: "STARS余额不足，请先充值。 / Insufficient STARS.",
      };
    if (hold.status !== "completed") {
      if (hold.status !== "reserved") throw new Error("PURCHASE_UNAVAILABLE");
      const { error: completeError } = await db.rpc("stardust_complete", {
        p_user: user.id,
        p_id: requestId,
        p_result: { sku, purchased: true },
      });
      if (completeError) throw completeError;
    }
    revalidatePath("/wallet");
    revalidatePath("/pricing");
    return {
      ok: true as const,
      message: "购买成功，权益已到账。 / Purchase complete.",
    };
  } catch (error) {
    await db.rpc("stardust_release", { p_user: user.id, p_id: requestId });
    return { ok: false as const, message: billingMessage(error) };
  }
}
