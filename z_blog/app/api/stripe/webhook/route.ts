import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/features/billing/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

function getStringMetadata(
  metadata: Stripe.Metadata | null | undefined,
  key: string,
) {
  return metadata?.[key] ? String(metadata[key]) : "";
}

async function markOrderFailed(session: Stripe.Checkout.Session) {
  const orderId = getStringMetadata(session.metadata, "order_id");

  if (!orderId) return;

  const supabase = createAdminClient();

  await supabase
    .from("ai_checkout_orders")
    .update({
      status: "failed",
      stripe_payment_intent_id:
        typeof session.payment_intent === "string" ? session.payment_intent : null,
      stripe_customer_id:
        typeof session.customer === "string" ? session.customer : null,
    })
    .eq("id", orderId);
}

async function fulfillCheckoutSession(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") return;

  const orderId = getStringMetadata(session.metadata, "order_id");
  const userId = getStringMetadata(session.metadata, "user_id");
  const productScope = getStringMetadata(session.metadata, "product_scope");
  const packageDays = Number(getStringMetadata(session.metadata, "package_days"));

  if (!orderId || !userId || !productScope || !Number.isFinite(packageDays)) {
    throw new Error("Stripe session metadata is incomplete.");
  }

  const supabase = createAdminClient();

  const { data: existingOrder } = await supabase
    .from("ai_checkout_orders")
    .select("status")
    .eq("id", orderId)
    .single();

  if (existingOrder?.status === "paid") return;

  const { data: validUntil, error: entitlementError } = await supabase.rpc(
    "extend_ai_entitlement",
    {
      p_user_id: userId,
      p_product_scope: productScope,
      p_days: packageDays,
    },
  );

  if (entitlementError) {
    throw entitlementError;
  }

  await supabase
    .from("ai_checkout_orders")
    .update({
      status: "paid",
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id:
        typeof session.payment_intent === "string" ? session.payment_intent : null,
      stripe_customer_id:
        typeof session.customer === "string" ? session.customer : null,
      entitlement_started_at: new Date().toISOString(),
      entitlement_valid_until: validUntil,
    })
    .eq("id", orderId);
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Missing STRIPE_WEBHOOK_SECRET." },
      { status: 500 },
    );
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header." },
      { status: 400 },
    );
  }

  const rawBody = await request.text();
  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid Stripe webhook signature.";

    return NextResponse.json({ error: message }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error: eventInsertError } = await supabase
    .from("stripe_webhook_events")
    .insert({
      stripe_event_id: event.id,
      event_type: event.type,
      payload: event as unknown as Record<string, unknown>,
    });

  if (eventInsertError?.code === "23505") {
    return NextResponse.json({ received: true, duplicate: true });
  }

  if (eventInsertError) {
    console.error("Stripe webhook event insert failed:", eventInsertError);

    return NextResponse.json(
      { error: "Failed to record webhook event." },
      { status: 500 },
    );
  }

  try {
    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      await fulfillCheckoutSession(event.data.object as Stripe.Checkout.Session);
    }

    if (event.type === "checkout.session.async_payment_failed") {
      await markOrderFailed(event.data.object as Stripe.Checkout.Session);
    }
  } catch (error) {
    console.error("Stripe webhook fulfillment failed:", error);

    return NextResponse.json(
      { error: "Webhook fulfillment failed." },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
}
