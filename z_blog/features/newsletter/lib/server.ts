import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { defaultTemplate, welcomeContent, type WelcomeTemplate } from "./template";

export function newsletterOrigin() {
  const url = new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001");
  if (url.protocol !== "https:" && !(url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname))) throw new Error("Invalid site origin");
  return url.origin;
}
export function newsletterReady() {
  return Boolean(process.env.SUPABASE_SECRET_KEY && process.env.RESEND_API_KEY && process.env.CONTACT_FROM_EMAIL && process.env.NEXT_PUBLIC_SITE_URL);
}
export async function newsletterMail(to: string, content: { subject: string; text: string; html?: string }, key: string) {
  const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: {
    Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": key,
  }, body: JSON.stringify({ from: process.env.CONTACT_FROM_EMAIL, to: [to], ...content }), signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error("Mail failed");
  const data = await response.json();
  if (!data.id) throw new Error("Mail failed");
}
export async function welcomeSubscriber(tokenHash: string) {
  const db = createAdminClient();
  const { data: subscriber, error } = await db.from("newsletter_subscribers").select("id,email,language,expires_at,welcome_sent_at").eq("token_hash", tokenHash).single();
  if (error || !subscriber) return false;
  if (subscriber.welcome_sent_at) return true;
  if (new Date(subscriber.expires_at).getTime() < Date.now()) return false;
  const { data, error: templateError } = await db.from("newsletter_settings").select("template").eq("id", 1).single();
  if (templateError) return false;
  const template = { ...defaultTemplate, ...data.template } as WelcomeTemplate;
  await newsletterMail(subscriber.email, welcomeContent(template, subscriber.language === "zh" ? "zh" : "en", newsletterOrigin()), `newsletter-welcome-${subscriber.id}`);
  const { error: updateError } = await db.from("newsletter_subscribers").update({ confirmed_at: new Date().toISOString(), welcome_sent_at: new Date().toISOString() }).eq("id", subscriber.id);
  return !updateError;
}
