import { createHash, randomBytes } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { createContactLimiter } from "@/lib/contact/server";
import { newsletterMail, newsletterOrigin, newsletterReady } from "@/features/newsletter/lib/server";
import { defaultTemplate, welcomeContent } from "@/features/newsletter/lib/template";

const limit = createContactLimiter();
export async function POST(request: Request) {
  const result = (status: number) => Response.json({ ok: status === 200 }, { status, headers: { "Cache-Control": "no-store" } });
  if (request.headers.get("origin") !== new URL(request.url).origin || !request.headers.get("content-type")?.startsWith("application/json")) return result(403);
  const ip = createHash("sha256").update(request.headers.get("x-forwarded-for") || "unknown").digest("hex");
  if (!limit(ip, Date.now())) return result(429);
  if (!newsletterReady()) return result(503);
  try {
    if (Number(request.headers.get("content-length")) > 2048) return result(400);
    const reader = request.body?.getReader();
    if (!reader) return result(400);
    let raw = "", size = 0;
    const decoder = new TextDecoder();
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 2048) { await reader.cancel(); return result(400); }
      raw += decoder.decode(value, { stream: true });
    }
    const body = JSON.parse(raw + decoder.decode());
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) || email.length > 254 || body.website) return result(400);
    const language = body.language === "zh" ? "zh" : "en";
    const token = randomBytes(32).toString("hex"), token_hash = createHash("sha256").update(token).digest("hex");
    const db = createAdminClient();
    const { data: settings, error: settingsError } = await db.from("newsletter_settings").select("template").eq("id", 1).single();
    if (settingsError) return result(503);
    const { error } = await db.from("newsletter_subscribers").upsert({ email, language, token_hash, expires_at: new Date(Date.now() + 86400000).toISOString(), confirmed_at: new Date().toISOString() }, { onConflict: "email" });
    if (error) return result(503);
    await newsletterMail(email, welcomeContent({ ...defaultTemplate, ...settings.template }, language, newsletterOrigin()), `newsletter-direct-${token_hash}`);
    await db.from("newsletter_subscribers").update({ welcome_sent_at: new Date().toISOString() }).eq("email", email).eq("token_hash", token_hash);
    return result(200);
  } catch { return result(502); }
}
