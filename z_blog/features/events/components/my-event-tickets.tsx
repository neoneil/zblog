"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { usePreferences } from "@/components/site/preferences-provider";
import type { EventTicket } from "../lib/event-ticket-data";

export default function MyEventTickets({ tickets, available, sandbox }: { tickets: EventTicket[]; available: boolean; sandbox: boolean }) {
  const { t, language } = usePreferences();
  return <section className="pb-10" aria-labelledby="my-tickets-title">
    <h2 id="my-tickets-title" className="mb-5 text-xl">{t({ zh: sandbox ? "测试门票" : "付费活动门票", en: sandbox ? "Test tickets" : "Paid event tickets" })}</h2>
    {!available ? <p role="alert">{t({ zh: "门票记录暂不可用，请联系管理员检查付费报名 SQL。", en: "Tickets are unavailable. Please contact support." })}</p>
      : !tickets.length ? <p className="text-sm text-[var(--text-soft)]">{t({ zh: "暂无付费门票。", en: "No paid tickets yet." })}</p>
      : <div className="grid gap-4 lg:grid-cols-2">{tickets.map((ticket) => <Card key={ticket.id}><CardContent className="space-y-4">
        <Badge variant={sandbox ? "warning" : "success"}>{t({ zh: sandbox ? "测试门票 · 非正式入场凭证" : ticket.status === "paid" ? "已支付 · 名额已确认" : "已退款", en: sandbox ? "Test ticket · Not valid for admission" : ticket.status === "paid" ? "Paid · Place confirmed" : "Refunded" })}</Badge>
        <h3 className="text-lg">{language === "zh" ? ticket.event_snapshot.title_zh : ticket.event_snapshot.title_en}</h3>
        <p className="text-sm">{new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en-AU", { timeZone: ticket.event_snapshot.timezone, dateStyle: "medium", timeStyle: "short" }).format(new Date(ticket.event_snapshot.starts_at))} · {ticket.event_snapshot.timezone}</p>
        <p className="text-sm">{language === "zh" ? ticket.event_snapshot.location_zh : ticket.event_snapshot.location_en}</p>
        <p className="text-sm">{ticket.amount_stars.toLocaleString()} STARS</p>
        <p className="break-all text-xs text-[var(--text-soft)]">{t({ zh: "门票编号", en: "Ticket ID" })}：{ticket.id}</p>
        <ButtonLink href={`/events/${ticket.event_snapshot.slug}`} variant="secondary">{t({ zh: "查看活动", en: "View event" })}</ButtonLink>
      </CardContent></Card>)}</div>}
  </section>;
}
