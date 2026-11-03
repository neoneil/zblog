"use client";
import { useState, type FormEvent } from "react";
import { usePreferences } from "./preferences-provider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function NewsletterForm() {
  const { t, language } = usePreferences();
  const [busy, setBusy] = useState(false), [status, setStatus] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return;
    const form = event.currentTarget, data = new FormData(form);
    setBusy(true); setStatus("");
    try {
      const response = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: data.get("email"), website: data.get("website"), language }), signal: AbortSignal.timeout(15000) });
      if (response.status === 429) {
        setStatus(t({ zh: "发送次数过多，请在 15 分钟后重试。", en: "Too many requests. Please try again in 15 minutes." }));
        return;
      }
      if (!response.ok) throw new Error();
      setStatus(t({ zh: "欢迎邮件已发送，请查看收件箱或垃圾邮件。", en: "Your welcome email has been sent. Please check your inbox or spam folder." }));
    } catch { setStatus(t({ zh: "暂时无法订阅，请稍后重试。", en: "Could not subscribe. Please try again later." })); }
    finally { setBusy(false); }
  }
  return <form onSubmit={submit} className="grid gap-3">
    <label><span className="sr-only">{t({ zh: "邮箱地址", en: "Email address" })}</span><Input name="email" type="email" required maxLength={254} autoComplete="email" disabled={busy} placeholder={t({ zh: "你的邮箱", en: "Your email" })} /></label>
    <div hidden aria-hidden="true"><Input name="website" tabIndex={-1} autoComplete="off" /></div>
    <Button type="submit" disabled={busy}>{t({ zh: busy ? "提交中…" : "订阅", en: busy ? "Submitting…" : "Subscribe" })}</Button>
    <p role="status" aria-live="polite">{status}</p>
  </form>;
}
