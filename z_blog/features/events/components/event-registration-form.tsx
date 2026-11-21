"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { usePreferences } from "@/components/site/preferences-provider";
import { submitEventRegistration } from "../lib/event-actions";
import { registrationCopy, type EventActionResult, type EventRegistration } from "../lib/registration-types";

export default function EventRegistrationForm({ eventId, slug, isDemo, open, signedIn, registration, available }: {
  eventId: string; slug: string; isDemo: boolean; open: boolean; signedIn: boolean;
  registration: EventRegistration | null; available: boolean;
}) {
  const { t, language } = usePreferences();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<EventActionResult | null>(null);
  const active = registration && ["requested", "confirmed"].includes(registration.status);
  return <div className="space-y-4 border-t border-[var(--border)] pt-5">
    {registration && <div className="space-y-2"><Badge variant={registration.status === "confirmed" ? "success" : "secondary"}>{t(registrationCopy[registration.status])}</Badge>
      {registration.admin_note && <p className="whitespace-pre-line text-sm">{registration.admin_note}</p>}
    </div>}
    {isDemo && <p className="text-sm text-[var(--text-soft)]">{t({ zh: "演示活动：仅测试报名记录，不收费。", en: "Demo event: registration testing only. No charge." })}</p>}
    {!signedIn ? <ButtonLink href={`/login?next=${encodeURIComponent(`/events/${slug}`)}`} variant="secondary">{t({ zh: "登录后报名", en: "Sign in to register" })}</ButtonLink>
      : !available ? <p role="alert">{t({ zh: "报名资料暂不可用，请刷新后重试。", en: "Registration is temporarily unavailable. Please refresh and try again." })}</p>
      : !active && open ? <form className="space-y-3" onSubmit={(event) => {
        event.preventDefault();
        const name = String(new FormData(event.currentTarget).get("name") ?? "");
        setResult(null);
        startTransition(async () => {
          try { setResult(await submitEventRegistration(eventId, name)); router.refresh(); }
          catch { setResult({ ok: false, message: "提交失败，请检查网络后重试。" }); }
        });
      }}>
        <label className="block space-y-2 text-sm"><span>{t({ zh: "报名姓名", en: "Attendee name" })}</span><Input name="name" autoComplete="name" required maxLength={120} disabled={pending || !!result?.ok} /></label>
        <p className="text-sm leading-6 text-[var(--text-soft)]">{t({ zh: "提交申请不扣款、不锁定名额，名额以管理员确认为准。", en: "Submitting a request does not charge you or reserve a place. Places require administrator confirmation." })}</p>
        <Button type="submit" disabled={pending || !!result?.ok}>{t(pending ? { zh: "正在提交…", en: "Submitting…" } : { zh: "提交报名申请", en: "Submit registration request" })}</Button>
      </form> : !active && <p>{t({ zh: "当前不可报名。", en: "Registration is currently closed." })}</p>}
    {result && <p role={result.ok ? "status" : "alert"} className={`text-sm ${result.ok ? "text-[var(--success)]" : "text-[var(--danger)]"}`}>{language === "zh" ? result.message : result.ok ? "Request submitted. No charge was made." : "Unable to submit your request. Please refresh and try again."}</p>}
    {signedIn && <ButtonLink href="/events/my-registrations" variant="ghost">{t({ zh: "查看我的报名", en: "My registrations" })}</ButtonLink>}
  </div>;
}
