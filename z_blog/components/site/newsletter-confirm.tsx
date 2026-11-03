"use client";
import { useState, useTransition } from "react";
import { usePreferences } from "./preferences-provider";
import { Button } from "@/components/ui/button";
import { confirmNewsletter } from "@/app/newsletter/confirm/actions";
export default function NewsletterConfirm({ token }: { token: string }) {
  const { t } = usePreferences();
  const [pending, startTransition] = useTransition(), [status, setStatus] = useState("");
  return <div className="grid gap-5"><h1 className="text-2xl text-[var(--heading)]">{t({ zh: "确认订阅星辰来信", en: "Confirm your subscription" })}</h1>
    <Button disabled={pending || status === "ok"} onClick={() => startTransition(async () => { try { setStatus(await confirmNewsletter(token) ? "ok" : "error"); } catch { setStatus("error"); } })}>{t({ zh: "确认订阅", en: "Confirm subscription" })}</Button>
    <p role="status">{status && t(status === "ok" ? { zh: "订阅成功，欢迎邮件已发送，请查收。", en: "Subscribed! Your welcome email is on its way." } : { zh: "链接已过期或暂时发送失败，请重新订阅或稍后重试。", en: "The link has expired or delivery failed. Subscribe again or retry later." })}</p></div>;
}
