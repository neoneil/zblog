import { readFile } from "node:fs/promises";
import { parseEnv } from "node:util";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const env = {
  ...parseEnv(
    await readFile(new URL("../.env.local", import.meta.url), "utf8"),
  ),
  ...process.env,
};
const orderId = process.argv
  .find((arg) => arg.startsWith("--order="))
  ?.slice(8);
function requireCheck(condition, message) {
  if (!condition) {
    const error = new Error(message);
    error.name = "SafeAuditError";
    throw error;
  }
}
try {
  requireCheck(
    env.STRIPE_SECRET_KEY?.startsWith("sk_test_"),
    "Only Stripe TEST keys are accepted.",
  );
  requireCheck(
    /^[0-9a-f-]{36}$/i.test(orderId || ""),
    "Provide --order=<approved test order UUID>.",
  );
  const origin = new URL(env.NEXT_PUBLIC_SITE_URL || "");
  requireCheck(
    ["localhost", "127.0.0.1"].includes(origin.hostname),
    "Only localhost webhook replay is allowed.",
  );
  const admin = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SECRET_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
  const db = admin.schema("stardust_sandbox");
  const { data: order, error } = await db
    .from("stardust_topups")
    .select("id,user_id,session_id,amount_cents,status,created_at")
    .eq("id", orderId)
    .single();
  requireCheck(
    !error && order?.session_id,
    "The test order or its Checkout session was not found.",
  );
  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    timeout: 15000,
    maxNetworkRetries: 0,
  });
  const session = await stripe.checkout.sessions.retrieve(order.session_id);
  requireCheck(
    !session.livemode &&
      session.mode === "payment" &&
      session.status === "complete" &&
      session.payment_status === "paid",
    "Stripe has not confirmed a completed TEST payment.",
  );
  requireCheck(
    session.amount_total === order.amount_cents && session.currency === "aud",
    "Checkout amount/currency mismatch.",
  );
  requireCheck(
    session.metadata?.flow === "stardust_topup" &&
      session.metadata.order_id === order.id &&
      session.metadata.user_id === order.user_id &&
      session.client_reference_id === order.user_id,
    "Checkout ownership or flow mismatch.",
  );
  requireCheck(
    typeof session.payment_intent === "string",
    "PaymentIntent is missing.",
  );
  const intent = await stripe.paymentIntents.retrieve(session.payment_intent, {
    expand: ["latest_charge"],
  });
  const charge = intent.latest_charge;
  requireCheck(
    !intent.livemode &&
      intent.status === "succeeded" &&
      intent.currency === "aud" &&
      intent.amount_received === order.amount_cents,
    "PaymentIntent is not fully settled.",
  );
  requireCheck(
    intent.metadata.flow === "stardust_topup" &&
      intent.metadata.order_id === order.id &&
      intent.metadata.user_id === order.user_id,
    "PaymentIntent ownership mismatch.",
  );
  requireCheck(
    charge &&
      typeof charge === "object" &&
      charge.paid &&
      charge.captured &&
      !charge.refunded &&
      !charge.disputed &&
      charge.amount_refunded === 0,
    "Refunded, disputed or uncaptured payments cannot be replayed by this tool.",
  );
  let event;
  let cursor;
  for (let page = 0; page < 5 && !event; page++) {
    const events = await stripe.events.list({
      type: "checkout.session.completed",
      created: {
        gte: Math.floor(new Date(order.created_at).getTime() / 1000) - 60,
      },
      limit: 100,
      ...(cursor ? { starting_after: cursor } : {}),
    });
    event = events.data.find(
      (candidate) =>
        !candidate.livemode && candidate.data.object.id === session.id,
    );
    if (!events.has_more || !events.data.length) break;
    cursor = events.data.at(-1).id;
  }
  requireCheck(
    event,
    "No original paid event found in the bounded audit window.",
  );
  console.log(
    JSON.stringify({
      order: order.id,
      amountAUD: order.amount_cents / 100,
      stripePaid: true,
      event: event.id,
      apiVersion: event.api_version,
      eventHasAmount: Number.isSafeInteger(event.data.object.amount_total),
      eventHasFlow: event.data.object.metadata?.flow === "stardust_topup",
      databaseStatus: order.status,
      execute: process.argv.includes("--execute"),
    }),
  );
  if (process.argv.includes("--execute")) {
    requireCheck(
      order.status === "pending" || order.status === "paid",
      "Only pending or already-paid test orders can be recovered.",
    );
    const payload = JSON.stringify(event);
    const signature = stripe.webhooks.generateTestHeaderString({
      payload,
      secret: env.STRIPE_WEBHOOK_SECRET,
    });
    // Re-deliver only the genuine event retrieved from Stripe; never create a payment or edit its payload.
    const response = await fetch(`${origin.origin}/api/stripe/webhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Stripe-Signature": signature,
      },
      body: payload,
      signal: AbortSignal.timeout(30000),
    });
    const result = await response.json();
    requireCheck(
      response.ok && result.received && !result.retired && !result.pending,
      `Webhook did not complete fulfillment (HTTP ${response.status}); do not pay again.`,
    );
    const { data: confirmed, error: readError } = await db
      .from("stardust_topups")
      .select("status")
      .eq("id", order.id)
      .single();
    requireCheck(
      !readError && confirmed?.status === "paid",
      "The replay was acknowledged but the order is not paid; manual review is required.",
    );
    console.log(
      "PASS Original test event replayed; order is paid. No new payment was created.",
    );
  } else
    console.log("READ ONLY: No event was replayed and no balance was changed.");
} catch (error) {
  console.error(
    error.name === "SafeAuditError"
      ? error.message
      : "Test-payment audit failed. No new payment was created.",
  );
  process.exitCode = 1;
}
