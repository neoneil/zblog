"use client";

import { useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { saveEvent, deleteEvent, reviewEventRegistration } from "../lib/event-actions";
import { sydneyInput } from "../lib/event-validation";
import { registrationCopy, type EventActionResult, type EventRegistration } from "../lib/registration-types";
import type { EventRecord } from "../lib/events";

function Field({ title, children }: { title: string; children: ReactNode }) {
  return <label className="block min-w-0 space-y-2 text-sm"><span>{title}</span>{children}</label>;
}

function Feedback({ result }: { result: EventActionResult | null }) {
  return result && <p role={result.ok ? "status" : "alert"} className={`text-sm ${result.ok ? "text-[var(--success)]" : "text-[var(--danger)]"}`}>{result.message}</p>;
}

export default function AdminEventEditor({ event }: { event?: EventRecord }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<EventActionResult | null>(null);
  return <form className="space-y-6" onSubmit={(submit) => {
    submit.preventDefault();
    const form = new FormData(submit.currentTarget);
    setResult(null);
    startTransition(async () => {
      try {
        const response = await saveEvent(form);
        setResult(response);
        if (response.ok) {
          if (!event && response.id) router.push(`/admin/events?edit=${response.id}`);
          else router.refresh();
        }
      }
      catch { setResult({ ok: false, message: "保存失败，请检查网络后重试。" }); }
    });
  }}>
    <input type="hidden" name="id" value={event?.id ?? ""} />
    <fieldset disabled={pending} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field title="中文标题"><Input name="title_zh" required maxLength={200} defaultValue={event?.title_zh} /></Field>
        <Field title="英文标题"><Input name="title_en" required maxLength={200} defaultValue={event?.title_en} /></Field>
        <Field title="链接标识"><Input name="slug" required maxLength={120} pattern="[a-z0-9]+(-[a-z0-9]+)*" defaultValue={event?.slug} /></Field>
        <Field title="价格（AUD）"><Input type="number" name="price_aud" required min="0" max="999999.99" step="0.01" defaultValue={event ? (event.price_cents / 100).toFixed(2) : "50.00"} /></Field>
        <Field title="开始时间 · 悉尼"><Input type="datetime-local" name="starts_at" required defaultValue={event ? sydneyInput(event.starts_at) : ""} /></Field>
        <Field title="结束时间 · 悉尼"><Input type="datetime-local" name="ends_at" required defaultValue={event ? sydneyInput(event.ends_at) : ""} /></Field>
        <Field title="中文地点"><Input name="location_zh" required maxLength={300} defaultValue={event?.location_zh} /></Field>
        <Field title="英文地点"><Input name="location_en" required maxLength={300} defaultValue={event?.location_en} /></Field>
        <Field title={`总名额${event ? `（已确认 ${event.booked_count}）` : ""}`}><Input type="number" name="capacity" min={event?.booked_count || 1} max={100000} step={1} required defaultValue={event?.capacity ?? 15} /></Field>
      </div>
      <Field title="中文活动介绍"><Textarea name="description_zh" rows={5} maxLength={10000} defaultValue={event?.description_zh} /></Field>
      <Field title="英文活动介绍"><Textarea name="description_en" rows={5} maxLength={10000} defaultValue={event?.description_en} /></Field>
      <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" name="is_published" defaultChecked={event?.is_published ?? false} className="accent-[var(--primary)]" />已发布</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="registration_open" defaultChecked={event?.registration_open ?? false} className="accent-[var(--primary)]" />开放报名</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="is_demo" defaultChecked={event?.is_demo ?? true} className="accent-[var(--primary)]" />演示活动</label>
      </div>
    </fieldset>
    <Feedback result={result} />
    <div className="flex flex-wrap gap-3">
      <Button type="submit" disabled={pending} className="gap-2"><Save size={17} aria-hidden />{pending ? "正在处理…" : "保存活动"}</Button>
      {event && <Button type="button" variant="danger" disabled={pending} className="gap-2" onClick={() => {
        if (!window.confirm("确定删除此活动？有报名记录的活动不能删除，请改为取消发布。")) return;
        startTransition(async () => {
          try { const response = await deleteEvent(event.id); setResult(response); if (response.ok) router.push("/admin/events"); }
          catch { setResult({ ok: false, message: "删除失败，请稍后重试。" }); }
        });
      }}><Trash2 size={17} aria-hidden />删除活动</Button>}
    </div>
  </form>;
}

export function RegistrationReview({ registration }: { registration: EventRegistration }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<EventActionResult | null>(null);
  const editable = registration.status === "requested" || registration.status === "confirmed";
  return <div className="space-y-4 border-t border-[var(--border)] py-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0"><p className="font-semibold">{registration.contact_name}</p><p className="break-all text-sm text-[var(--text-soft)]">{registration.contact_email}</p></div>
      <Badge variant={registration.status === "confirmed" ? "success" : "secondary"}>{registrationCopy[registration.status].zh}</Badge>
    </div>
    <p className="text-xs text-[var(--text-soft)]">{new Intl.DateTimeFormat("zh-CN", { timeZone: "Australia/Sydney", dateStyle: "medium", timeStyle: "short" }).format(new Date(registration.created_at))} · 报名时标价 A${(registration.event_snapshot.price_cents / 100).toFixed(2)}</p>
    {editable ? <form className="grid gap-3 sm:grid-cols-[180px_minmax(0,1fr)_auto] sm:items-end" onSubmit={(event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      if (form.get("status") === "confirmed" && !window.confirm("确认名额将占用一个席位。此操作不会收款，也不表示已付款。确定继续？")) return;
      if (form.get("status") === "cancelled" && registration.status === "confirmed" && !window.confirm("取消后将释放名额，但不会自动退款。确定继续？")) return;
      startTransition(async () => {
        try { setResult(await reviewEventRegistration(form)); router.refresh(); }
        catch { setResult({ ok: false, message: "审核失败，请稍后重试。" }); }
      });
    }}>
      <input type="hidden" name="id" value={registration.id} />
      <Field title="审核结果"><Select name="status" disabled={pending} defaultValue={registration.status === "confirmed" ? "cancelled" : "confirmed"}>
        {registration.status === "requested" && <><option value="confirmed">确认名额</option><option value="rejected">拒绝申请</option></>}
        <option value="cancelled">取消报名</option>
      </Select></Field>
      <Field title="给用户的说明"><Input name="note" maxLength={1000} disabled={pending} defaultValue={registration.admin_note} /></Field>
      <Button type="submit" variant="secondary" disabled={pending}>保存审核</Button>
    </form> : registration.admin_note && <p className="whitespace-pre-line text-sm">{registration.admin_note}</p>}
    <Feedback result={result} />
  </div>;
}
