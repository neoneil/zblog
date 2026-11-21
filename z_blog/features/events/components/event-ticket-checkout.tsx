"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Ticket } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { usePreferences } from "@/components/site/preferences-provider";
import { buyEventTicket } from "../lib/event-ticket-actions";
import type { EventActionResult } from "../lib/registration-types";

export default function EventTicketCheckout({ eventId, slug, price, signedIn, available, enabled, sandbox, balance, paid }: {
  eventId: string; slug: string; price: number; signedIn: boolean; available: boolean;
  enabled: boolean; sandbox: boolean; balance: number; paid: boolean;
}) {
  const { t, language } = usePreferences();
  const router = useRouter();
  const request = useRef<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<EventActionResult | null>(null);
  return <div className="space-y-4 border-t border-[var(--border)] pt-5">
    {sandbox && <Badge variant="warning">{t({ zh: "测试购票 · 不占正式名额", en: "Test purchase · No live seat reserved" })}</Badge>}
    {paid || result?.ok ? <p className="font-semibold text-[var(--success)]">{t({ zh: sandbox ? "测试支付成功，测试门票已生成。" : "已支付，活动名额已确认。", en: sandbox ? "Test payment complete. Your test ticket is ready." : "Payment complete. Your place is confirmed." })}</p>
      : !signedIn ? <ButtonLink href={`/login?next=${encodeURIComponent(`/events/${slug}`)}`} variant="secondary">{t({ zh: "登录并报名", en: "Sign in to book" })}</ButtonLink>
      : !available ? <p role="alert">{t({ zh: "付费报名尚未就绪，请联系管理员完成数据库配置。", en: "Ticket payments are not ready. Please contact the administrator." })}</p>
      : !enabled ? <p role="status">{t({ zh: "付费报名暂未开放。", en: "Paid bookings are not open yet." })}</p>
      : <form className="space-y-4" onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        request.current ??= crypto.randomUUID();
        const id = request.current;
        setResult(null);
        startTransition(async () => {
          try {
            setResult(await buyEventTicket(eventId, String(form.get("name") ?? ""), id, price, form.get("confirm") === "on"));
            router.refresh();
          } catch { setResult({ ok: false, message: "结果暂时无法确认，请先查看我的报名；不要重复付款。" }); }
        });
      }}>
        <p className="text-sm">{t({ zh: "可用余额", en: "Available balance" })}：{balance.toLocaleString()} STARS</p>
        <label className="block space-y-2 text-sm"><span>{t({ zh: "报名姓名", en: "Attendee name" })}</span><Input name="name" required maxLength={120} autoComplete="name" disabled={pending} /></label>
        <label className="flex items-start gap-3 text-sm leading-6"><input name="confirm" type="checkbox" required disabled={pending} className="mt-1 accent-[var(--primary)]" /><span>{t({ zh: `我确认支付 ${price.toLocaleString()} STARS，支付成功后确认名额。`, en: `I agree to pay ${price.toLocaleString()} STARS to confirm my place.` })}</span></label>
        <p className="text-sm text-[var(--text-soft)]">{t({ zh: "优先使用奖励积分。满员或扣款失败不会生成门票；已付门票退改需联系管理员审核。", en: "Reward STARS are used first. Failed or sold-out bookings do not issue tickets. Contact support about paid-ticket changes or refunds." })}</p>
        <div className="flex flex-wrap gap-3"><Button type="submit" className="gap-2" disabled={pending || balance < price}><Ticket size={17} aria-hidden />{t(pending ? { zh: "正在确认…", en: "Confirming…" } : { zh: `支付 ${price.toLocaleString()} STARS 并报名`, en: `Pay ${price.toLocaleString()} STARS & book` })}</Button>
          <ButtonLink href="/wallet" variant="secondary">{t({ zh: "充值 STARS", en: "Top up STARS" })}</ButtonLink></div>
        {balance < price && <p className="text-sm text-[var(--text-soft)]">{t({ zh: "余额不足，请先充值，再返回此页面报名。", en: "Insufficient balance. Top up, then return here to book." })}</p>}
      </form>}
    {result && !result.ok && <p role="alert" className="text-sm text-[var(--danger)]">{language === "zh" ? result.message : "Unable to confirm payment. Check My registrations before retrying; no duplicate ticket will be charged."}</p>}
    {signedIn && <ButtonLink href="/events/my-registrations" variant="ghost">{t({ zh: "查看我的报名与门票", en: "My registrations & tickets" })}</ButtonLink>}
  </div>;
}
