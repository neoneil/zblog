"use server";
import { createHash } from "node:crypto";
import { welcomeSubscriber, newsletterReady } from "@/features/newsletter/lib/server";
export async function confirmNewsletter(token: string) {
  if (!newsletterReady() || !/^[a-f0-9]{64}$/.test(token)) return false;
  try { return await welcomeSubscriber(createHash("sha256").update(token).digest("hex")); }
  catch { return false; }
}
