import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/features/billing/lib/stripe";
import {
  billingSchema,
  createBillingAdminClient,
} from "@/features/billing/lib/billing-db";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature)
    return NextResponse.json({ error: "Signature required" }, { status: 400 });
  if (!process.env.STRIPE_WEBHOOK_SECRET)
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 503 },
    );
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      await request.text(),
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
  try {
    if (event.livemode !== (billingSchema() === "public"))
      return NextResponse.json(
        { error: "Payment environment mismatch" },
        { status: 400 },
      );
    const db = createBillingAdminClient();
    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      const session = event.data.object as Stripe.Checkout.Session;
      // Old time-pack checkouts cannot grant access. Their historical records remain intact.
      if (session.metadata?.flow !== "stardust_topup")
        return NextResponse.json({ received: true, retired: true });
      if (session.payment_status !== "paid")
        return NextResponse.json({ received: true, pending: true });
      if (
        session.mode !== "payment" ||
        session.currency !== "aud" ||
        !session.metadata.user_id ||
        session.client_reference_id !== session.metadata.user_id ||
        !session.metadata.order_id ||
        typeof session.payment_intent !== "string" ||
        !Number.isSafeInteger(session.amount_total) ||
        !session.amount_total ||
        session.amount_total < 0
      )
        throw new Error("PAYMENT_MISMATCH");
      const { error } = await db.rpc("stardust_credit_topup", {
        p_event: event.id,
        p_type: event.type,
        p_order: session.metadata.order_id,
        p_user: session.metadata.user_id,
        p_session: session.id,
        p_intent: session.payment_intent,
        p_amount: session.amount_total,
        p_currency: session.currency,
      });
      if (error) throw error;
    } else if (
      event.type === "checkout.session.expired" ||
      event.type === "checkout.session.async_payment_failed"
    ) {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.metadata?.flow === "stardust_topup") {
        const { error } = await db
          .from("stardust_topups")
          .update({
            status:
              event.type === "checkout.session.expired" ? "expired" : "failed",
          })
          .eq("id", session.metadata.order_id)
          .eq("user_id", session.metadata.user_id)
          .eq("session_id", session.id)
          .eq("status", "pending");
        if (error) throw error;
      }
    } else if (
      event.type === "charge.refunded" ||
      event.type === "charge.dispute.created"
    ) {
      const charge = event.data.object as Stripe.Charge | Stripe.Dispute;
      const intent =
        typeof charge.payment_intent === "string"
          ? charge.payment_intent
          : charge.payment_intent?.id;
      if (intent) {
        const { error } = await db.rpc("stardust_risk_event", {
          p_event: event.id,
          p_type: event.type,
          p_intent: intent,
        });
        if (error) throw error;
      }
    }
    return NextResponse.json({ received: true });
  } catch {
    console.error(
      "STARDUST webhook transaction failed; Stripe retry is required",
    );
    return NextResponse.json(
      { error: "Fulfillment pending; retry required" },
      { status: 500 },
    );
  }
}
