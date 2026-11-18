import { readFileSync } from "node:fs";
import { parseEnv } from "node:util";
import Stripe from "stripe";

const env = { ...parseEnv(readFileSync(".env.local", "utf8")), ...process.env };
const key = env.STRIPE_SECRET_KEY;
const secret = env.STRIPE_WEBHOOK_SECRET;
if (!key?.startsWith("sk_test_") || !secret?.startsWith("whsec_")) {
  throw new Error(
    "Configure a Stripe TEST key and webhook secret. Live keys are never accepted by this check.",
  );
}
const origin = new URL(env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001");
if (!["localhost", "127.0.0.1"].includes(origin.hostname)) {
  throw new Error("This check only sends webhook requests to localhost.");
}
const stripe = new Stripe(key, { timeout: 15000, maxNetworkRetries: 0 });
try {
  const balance = await stripe.balance.retrieve();
  if (balance.livemode) throw new Error("Expected test mode.");
  console.log("PASS Stripe test key accepted; no payment was created.");

  // A deliberately retired flow is acknowledged without writing any order or balance.
  const payload = JSON.stringify({
    id: `evt_local_configuration_check_${Date.now()}`,
    object: "event",
    type: "checkout.session.completed",
    livemode: false,
    data: {
      object: {
        object: "checkout.session",
        metadata: { flow: "local_configuration_check" },
      },
    },
  });
  const signature = stripe.webhooks.generateTestHeaderString({
    payload,
    secret,
  });
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
  if (!response.ok || !result.received || !result.retired) {
    throw new Error(
      `Local webhook configuration check failed (HTTP ${response.status}). Restart the dev server and verify its webhook secret.`,
    );
  }
  console.log(
    "PASS Local webhook verifies the configured signature; no database mutation was requested.",
  );
  console.log(
    "NEXT Stripe must forward actual test events to this route via Stripe CLI or a public tunnel. This check does not prove event forwarding.",
  );
} catch (error) {
  // Provider messages can contain credentials or account details; do not print them.
  const status =
    typeof error?.statusCode === "number" ? ` HTTP ${error.statusCode}` : "";
  const safe =
    error instanceof Error &&
    error.message.startsWith("Local webhook configuration check failed")
      ? error.message
      : `Stripe connectivity or test-key verification failed.${status}`;
  console.error(safe);
  process.exitCode = 1;
}
