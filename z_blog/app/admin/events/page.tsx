import { Plus, Pencil, ExternalLink } from "lucide-react";
import Container from "@/components/site/container";
import { PageShell } from "@/components/site/page-shell";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { requireAdmin } from "@/lib/auth/require-admin";
import AdminEventEditor, { RegistrationReview } from "@/features/events/components/admin-event-editor";
import { eventDate, type EventRecord } from "@/features/events/lib/events";
import { registrationFields } from "@/features/events/lib/registration-data";
import type { EventRegistration } from "@/features/events/lib/registration-types";
import { validEventId } from "@/features/events/lib/event-validation";
import { billingSchema } from "@/features/billing/lib/billing-db";

export const metadata = { title: "沙龙与活动管理" };
const pageNumber = (value?: string) => /^\d{1,5}$/.test(value ?? "") ? Math.max(1, Number(value)) : 1;

export default async function AdminEventsPage({ searchParams }: {
  searchParams: Promise<{ edit?: string; page?: string; registrationsPage?: string; ticketsPage?: string }>;
}) {
  const { supabase } = await requireAdmin("/admin/events");
  const query = await searchParams;
  const page = pageNumber(query.page);
  const registrationsPage = pageNumber(query.registrationsPage);
  const ticketsPage = pageNumber(query.ticketsPage);
  const sandbox = billingSchema() === "stardust_sandbox";
  const { data, error, count } = await supabase.from("events").select("*", { count: "exact" })
    .order("starts_at", { ascending: false }).order("id").range((page - 1) * 50, page * 50 - 1);
  const events = (data ?? []) as EventRecord[];
  const selected = query.edit && validEventId(query.edit)
    ? await supabase.from("events").select("*").eq("id", query.edit).maybeSingle() : null;
  const event = (selected?.data ?? undefined) as EventRecord | undefined;
  const registrations = event ? await supabase.from("event_registrations").select(registrationFields, { count: "exact" })
    .eq("event_id", event.id).order("created_at", { ascending: false }).order("id")
    .range((registrationsPage - 1) * 50, registrationsPage * 50 - 1) : null;
  const tickets = event ? await supabase.schema(billingSchema()).from("stardust_event_tickets")
    .select("id,contact_name,contact_email,status,amount_stars,created_at", { count: "exact" })
    .eq("event_id", event.id).order("created_at", { ascending: false }).order("id")
    .range((ticketsPage - 1) * 50, ticketsPage * 50 - 1) : null;
  const href = (changes: Record<string, string>) => `/admin/events?${new URLSearchParams({ page: String(page), ...(event ? { edit: event.id } : {}), ...changes })}`;
  return <PageShell><Container><div className="space-y-10 py-8 sm:py-12">
    <header className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-2xl">沙龙与活动管理</h1><p className="mt-2 text-sm text-[var(--text-soft)]">悉尼时间 · 默认 A$50 / 5,000 STARS · {sandbox ? "测试购票不占正式名额" : "正式活动通过 STARS 付费报名"}</p></div><div className="flex gap-3"><ButtonLink href="/admin" variant="ghost">管理后台</ButtonLink><ButtonLink href="/admin/events" variant="secondary" className="gap-2"><Plus size={17} />新建活动</ButtonLink></div></header>
    {error && <p role="alert">活动列表读取失败，请检查 events 表和管理员权限。</p>}
    {query.edit && !event && <p role="alert">未找到要编辑的活动，请从列表重新选择。</p>}
    <section aria-labelledby="event-editor-title"><h2 id="event-editor-title" className="mb-5 text-xl">{event ? `编辑 · ${event.title_zh}` : "新建活动"}</h2><AdminEventEditor key={event?.id ?? "new"} event={event} /></section>
    {event && <section aria-labelledby="event-tickets-title"><h2 id="event-tickets-title" className="mb-4 text-xl">{sandbox ? "测试购票名单" : "付费门票"}（{tickets?.count ?? 0}）</h2>
      {tickets?.error ? <p role="alert">门票表尚未就绪，请执行 event-ticket-payments.sql。</p> : !tickets?.data?.length ? <p className="text-sm text-[var(--text-soft)]">暂无付费门票。</p> : tickets.data.map((ticket) => <div key={ticket.id} className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] py-4"><div className="min-w-0"><p>{ticket.contact_name}</p><p className="break-all text-sm text-[var(--text-soft)]">{ticket.contact_email}</p></div><div className="flex flex-wrap items-center gap-3"><span className="text-sm">{Number(ticket.amount_stars).toLocaleString()} STARS</span><Badge variant={sandbox ? "warning" : "success"}>{sandbox ? "测试票" : ticket.status === "paid" ? "已付款" : "已退款"}</Badge></div></div>)}
      <div className="mt-4 flex flex-wrap gap-3">{ticketsPage > 1 && <ButtonLink href={href({ ticketsPage: String(ticketsPage - 1) })} variant="secondary">上一页门票</ButtonLink>}{ticketsPage * 50 < (tickets?.count ?? 0) && <ButtonLink href={href({ ticketsPage: String(ticketsPage + 1) })} variant="secondary">下一页门票</ButtonLink>}</div>
    </section>}
    {event && <section aria-labelledby="event-applicants-title"><h2 id="event-applicants-title" className="text-xl">报名名单（{registrations?.count ?? 0}）</h2><p className="my-3 text-sm text-[var(--text-soft)]">正式收费活动由支付确认名额，不能人工绕过付款。已付票退改另行审核，不能直接取消。免费与演示申请可人工审核。</p>
      {registrations?.error ? <p role="alert">报名记录读取失败，请确认补充报名 SQL 已执行。</p>
        : registrations?.data?.length ? registrations.data.map((item) => <RegistrationReview key={`${item.id}-${item.updated_at}`} registration={item as EventRegistration} />) : <p className="py-5 text-sm">暂无报名。</p>}
      <div className="flex flex-wrap gap-3">{registrationsPage > 1 && <ButtonLink href={href({ registrationsPage: String(registrationsPage - 1) })} variant="secondary">上一页报名</ButtonLink>}{registrationsPage * 50 < (registrations?.count ?? 0) && <ButtonLink href={href({ registrationsPage: String(registrationsPage + 1) })} variant="secondary">下一页报名</ButtonLink>}</div>
    </section>}
    <section aria-labelledby="events-list-title"><h2 id="events-list-title" className="mb-4 text-xl">活动列表（{count ?? 0}）</h2>
      <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">{events.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 py-5">
        <div className="min-w-0 space-y-2"><div className="flex flex-wrap items-center gap-2"><h3 className="text-base">{item.title_zh}</h3><Badge variant={item.is_published ? "success" : "secondary"}>{item.is_published ? "已发布" : "草稿"}</Badge>{item.is_demo && <Badge variant="outline">演示</Badge>}</div><p className="text-sm text-[var(--text-soft)]">{eventDate(item, "zh")} · A${(item.price_cents / 100).toFixed(2)} · 已确认 {item.booked_count}/{item.capacity}</p></div>
        <div className="flex gap-3"><ButtonLink href={href({ edit: item.id })} variant="secondary" className="gap-2"><Pencil size={16} />编辑与报名</ButtonLink>{item.is_published && <ButtonLink href={`/events/${item.slug}`} variant="ghost" aria-label={`查看 ${item.title_zh}`} title="查看活动"><ExternalLink size={17} /></ButtonLink>}</div>
      </div>)}</div>
      <div className="mt-5 flex gap-3">{page > 1 && <ButtonLink href={href({ page: String(page - 1) })} variant="secondary">上一页</ButtonLink>}{page * 50 < (count ?? 0) && <ButtonLink href={href({ page: String(page + 1) })} variant="secondary">下一页</ButtonLink>}</div>
    </section>
  </div></Container></PageShell>;
}
