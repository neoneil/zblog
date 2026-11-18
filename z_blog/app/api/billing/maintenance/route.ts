import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { siteOrigin } from "@/features/billing/lib/stardust-config";
import {
  createBillingAdminClient,
  billingSchema,
} from "@/features/billing/lib/billing-db";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const expected = Buffer.from(`Bearer ${secret || ""}`);
  const actual = Buffer.from(request.headers.get("authorization") || "");
  if (
    !secret ||
    actual.length !== expected.length ||
    !timingSafeEqual(actual, expected)
  )
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const admin = createAdminClient();
    const db = createBillingAdminClient();
    const { error } = await db.rpc("stardust_maintenance");
    if (error) throw error;
    if (billingSchema() === "stardust_sandbox")
      return NextResponse.json({
        maintenance: true,
        mail: "sandbox_mail_disabled",
      });
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.CONTACT_FROM_EMAIL;
    if (!apiKey || !from)
      return NextResponse.json({ maintenance: true, mail: "not_configured" });
    const origin = siteOrigin();
    const { data: messages, error: claimError } = await db.rpc(
      "stardust_claim_mail",
    );
    if (claimError) throw claimError;
    let sent = 0;
    for (const message of messages || []) {
      try {
        const {
          data: { user },
          error: userError,
        } = await admin.auth.admin.getUserById(message.user_id);
        if (userError || !user?.email || !user.email_confirmed_at)
          throw new Error("RECIPIENT_UNAVAILABLE");
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "Idempotency-Key": `stardust-mail-${message.id}`,
          },
          body: JSON.stringify({
            from,
            to: [user.email],
            subject: message.subject,
            text: `${message.body}\n\n${origin}/wallet`,
          }),
          signal: AbortSignal.timeout(15000),
        });
        if (!response.ok) throw new Error("MAIL_PROVIDER_FAILED");
        const { error: sentError } = await db
          .from("stardust_mail")
          .update({ state: "sent" })
          .eq("id", message.id)
          .eq("state", "sending")
          .eq("locked_at", message.locked_at);
        if (sentError) throw sentError;
        sent++;
      } catch {
        await db
          .from("stardust_mail")
          .update({ state: "pending" })
          .eq("id", message.id)
          .eq("state", "sending")
          .eq("locked_at", message.locked_at);
      }
    }
    return NextResponse.json({ maintenance: true, sent });
  } catch {
    return NextResponse.json(
      { error: "Maintenance failed; retry required" },
      { status: 500 },
    );
  }
}
