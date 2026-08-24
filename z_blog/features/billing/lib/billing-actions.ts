"use server";

import { headers } from "next/headers";
import { AI_PRODUCTS, getAiPlan } from "@/features/billing/lib/plans";
import { getStripe } from "@/features/billing/lib/stripe";
import type { AiProductScope } from "@/features/billing/lib/types";
import { requireUser } from "@/lib/auth/require-user";

type CreateCheckoutResult =
  | {
      ok: true;
      url: string;
    }
  | {
      ok: false;
      message: string;
    };

function isAiProductScope(value: string): value is AiProductScope {
  return value === "tarot" || value === "astroplate";
}

async function getSiteOrigin() {
  const headerStore = await headers();
  const origin = headerStore.get("origin");

  return origin ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";
}

export async function createAiCheckoutSession(
  productScope: string,
  planId: string,
): Promise<CreateCheckoutResult> {
  if (!isAiProductScope(productScope)) {
    return {
      ok: false,
      message: "无效的 AI 产品。",
    };
  }

  const plan = getAiPlan(planId);

  if (!plan) {
    return {
      ok: false,
      message: "无效的时间包。",
    };
  }

  const { supabase, user } = await requireUser(
    `/pricing?scope=${encodeURIComponent(productScope)}`,
  );
  const product = AI_PRODUCTS[productScope];
  const origin = await getSiteOrigin();

  const { data: order, error: orderError } = await supabase
    .from("ai_checkout_orders")
    .insert({
      user_id: user.id,
      product_scope: productScope,
      package_days: plan.days,
      amount_cents: plan.amountCents,
      currency: plan.currency,
      status: "pending",
      metadata: {
        plan_id: plan.id,
      },
    })
    .select("id")
    .single();

  if (orderError || !order) {
    console.error("Create AI checkout order failed:", orderError);

    return {
      ok: false,
      message: "创建订单失败，请稍后再试。",
    };
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card", "alipay", "wechat_pay"],
    client_reference_id: user.id,
    customer_email: user.email ?? undefined,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: plan.currency,
          unit_amount: plan.amountCents,
          product_data: {
            name: `${product.label} ${plan.days} 天权限包`,
            description: `${product.description}，一次性购买，不自动续费。`,
          },
        },
      },
    ],
    metadata: {
      order_id: order.id,
      user_id: user.id,
      product_scope: productScope,
      package_days: String(plan.days),
      plan_id: plan.id,
    },
    success_url: `${origin}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/pricing?scope=${productScope}&cancelled=1`,
  });

  const { error: updateError } = await supabase
    .from("ai_checkout_orders")
    .update({
      stripe_checkout_session_id: session.id,
      stripe_customer_id:
        typeof session.customer === "string" ? session.customer : null,
    })
    .eq("id", order.id);

  if (updateError) {
    console.error("Update AI checkout order session failed:", updateError);
  }

  if (!session.url) {
    return {
      ok: false,
      message: "Stripe Checkout 创建失败，请稍后再试。",
    };
  }

  return {
    ok: true,
    url: session.url,
  };
}
