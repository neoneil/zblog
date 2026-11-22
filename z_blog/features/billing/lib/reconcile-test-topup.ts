import "server-only";
import type { createBillingAdminClient } from "./billing-db";
import { getStripe } from "./stripe";

export async function reconcileTestTopup(
  db: ReturnType<typeof createBillingAdminClient>,
  userId: string,
  orderId: string,
) {
  if (!/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(orderId)) return;

  const { data: order, error: orderError } = await db
    .from("stardust_topups")
    .select("session_id,amount_cents")
    .eq("id", orderId)
    .eq("user_id", userId)
    .eq("status", "pending")
    .maybeSingle();
  if (orderError) throw orderError;
  if (!order?.session_id) return;

  const session = await getStripe().checkout.sessions.retrieve(
    order.session_id,
    { expand: ["payment_intent.latest_charge"] },
    { timeout: 5000, maxNetworkRetries: 0 },
  );
  const intent = session.payment_intent;
  if (
    session.livemode ||
    session.mode !== "payment" ||
    session.status !== "complete" ||
    session.payment_status !== "paid" ||
    session.currency !== "aud" ||
    session.amount_total !== order.amount_cents ||
    session.client_reference_id !== userId ||
    session.metadata?.flow !== "stardust_topup" ||
    session.metadata.order_id !== orderId ||
    session.metadata.user_id !== userId ||
    !intent ||
    typeof intent === "string" ||
    intent.livemode ||
    intent.status !== "succeeded" ||
    intent.currency !== "aud" ||
    intent.amount_received !== order.amount_cents ||
    intent.metadata.flow !== "stardust_topup" ||
    intent.metadata.order_id !== orderId ||
    intent.metadata.user_id !== userId
  ) return;

  const charge = intent.latest_charge;
  if (
    !charge ||
    typeof charge === "string" ||
    !charge.paid ||
    !charge.captured ||
    charge.disputed ||
    charge.refunded ||
    charge.amount_refunded !== 0
  ) return;

  const { error } = await db.rpc("stardust_credit_topup", {
    p_event: `checkout-return:${session.id}`,
    p_type: "checkout.return.reconciled",
    p_order: orderId,
    p_user: userId,
    p_session: session.id,
    p_intent: intent.id,
    p_amount: order.amount_cents,
    p_currency: session.currency,
  });
  if (error) throw error;
}
