import { readFileSync } from "node:fs";
import { parseEnv } from "node:util";

const env = { ...parseEnv(readFileSync(".env.local", "utf8")), ...process.env };
for (const key of [
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "NEXT_PUBLIC_SITE_URL",
  "STARDUST_CHECKOUT_ENABLED",
  "CRON_SECRET",
  "RESEND_API_KEY",
  "CONTACT_FROM_EMAIL",
]) {
  const value = env[key];
  let status = value ? "configured" : "missing";
  if (value && key === "STRIPE_SECRET_KEY")
    status = value.startsWith("sk_test_")
      ? "test"
      : value.startsWith("sk_live_")
        ? "live"
        : "unknown key mode";
  if (key === "STARDUST_CHECKOUT_ENABLED")
    status = value === "true" ? "enabled" : "disabled";
  console.log(`${key}: ${status}`);
}
