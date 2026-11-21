"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, MapPin } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePreferences } from "@/components/site/preferences-provider";
import { cancelEventRequest } from "../lib/event-actions";
import { registrationCopy, type EventActionResult, type EventRegistration } from "../lib/registration-types";

export default function MyEventRegistrations({ registrations, available }: { registrations: EventRegistration[]; available: boolean }) {
  const { t, language } = usePreferences();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<EventActionResult | null>(null);
  return <section className="py-8 sm:py-12">
    <h1 className="mb-6 text-2xl">{t({ zh: "我的活动报名", en: "My event registrations" })}</h1>
    <p className="mb-6 text-sm text-[var(--text-soft)]">{t({ zh: "最近200条报名记录。待确认的申请不代表已付款或已保留名额。", en: "Your latest 200 registrations. Pending requests do not indicate payment or a reserved place." })}</p>
    {!available ? <p role="alert">{t({ zh: "报名记录暂不可用，请稍后重试。", en: "Registration records are unavailable. Please try again later." })}</p>
      : registrations.length === 0 ? <p>{t({ zh: "你还没有活动报名记录。", en: "You have no event registrations yet." })}</p>
      : <div className="grid gap-4 lg:grid-cols-2">{registrations.map((registration) => {
        const event = registration.event_snapshot;
        return <Card key={registration.id}><CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2"><Badge variant={registration.status === "confirmed" ? "success" : "secondary"}>{t(registrationCopy[registration.status])}</Badge>{event.is_demo && <Badge variant="outline">{t({ zh: "演示", en: "Demo" })}</Badge>}</div>
          <h2 className="text-lg">{language === "zh" ? event.title_zh : event.title_en}</h2>
          <p className="flex items-start gap-2 text-sm"><CalendarDays size={17} className="shrink-0" />{new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en-AU", { timeZone: event.timezone, dateStyle: "medium", timeStyle: "short" }).format(new Date(event.starts_at))} · {event.timezone}</p>
          <p className="flex items-start gap-2 text-sm"><MapPin size={17} className="shrink-0" />{language === "zh" ? event.location_zh : event.location_en}</p>
          <p className="text-sm">{t({ zh: "报名时标价", en: "Price at application" })}: A${(event.price_cents / 100).toFixed(2)}</p>
          {registration.admin_note && <p className="whitespace-pre-line text-sm">{registration.admin_note}</p>}
          <div className="flex flex-wrap gap-3"><ButtonLink href={`/events/${event.slug}`} variant="secondary">{t({ zh: "查看活动", en: "View event" })}</ButtonLink>
            {registration.status === "requested" && <Button disabled={pending} variant="ghost" onClick={() => {
              if (!window.confirm(t({ zh: "确定撤回这条报名申请？", en: "Withdraw this registration request?" }))) return;
              startTransition(async () => {
                try { setResult(await cancelEventRequest(registration.id)); router.refresh(); }
                catch { setResult({ ok: false, message: "撤回失败，请稍后重试。" }); }
              });
            }}>{t({ zh: "撤回申请", en: "Withdraw request" })}</Button>}
          </div>
        </CardContent></Card>;
      })}</div>}
    {result && <p className="mt-5 text-sm" role={result.ok ? "status" : "alert"}>{language === "zh" ? result.message : result.ok ? "Request withdrawn." : "Unable to withdraw. Please try again."}</p>}
  </section>;
}
