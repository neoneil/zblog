"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { parseEventForm, validEventId } from "./event-validation";
import type { EventActionResult } from "./registration-types";

function refreshEvents() {
  revalidatePath("/admin/events");
  revalidatePath("/events", "layout");
  revalidatePath("/");
}

function failure(error: { code?: string; message?: string } | null): EventActionResult {
  const messages: Record<string, string> = {
    LOGIN_REQUIRED: "请先登录后报名。", EMAIL_REQUIRED: "请先完善登录账户邮箱。",
    INVALID_NAME: "请填写姓名，最多120字。", EVENT_UNAVAILABLE: "活动不存在或尚未发布。",
    REGISTRATION_CLOSED: "活动报名已关闭或已经开始。", EVENT_FULL: "活动名额已满。",
    CONTACT_ADMIN: "已确认的报名请联系管理员处理。", ADMIN_REQUIRED: "仅管理员可操作。",
    REGISTRATION_NOT_FOUND: "报名记录不存在或无权访问。", INVALID_TRANSITION: "状态已变化，请刷新后重试。",
    INVALID_REVIEW: "审核状态或说明无效。",
    PAYMENT_REQUIRED: "此活动需要使用 STARS 付费报名，不能通过人工审核绕过支付。",
    PAID_TICKET_CONTACT_SUPPORT: "这是已付费门票，取消和退票需另行审核，不能直接取消报名。",
  };
  const key = Object.keys(messages).find((key) => error?.message?.includes(key));
  return { ok: false, message: key ? messages[key] : "暂时无法保存，请稍后重试；若首次使用，请确认沙龙报名 SQL 已执行。" };
}

export async function saveEvent(form: FormData): Promise<EventActionResult> {
  const { supabase } = await requireAdmin("/admin/events");
  const id = String(form.get("id") ?? "");
  if (id && !validEventId(id)) return { ok: false, message: "活动编号无效。" };
  let payload;
  try { payload = parseEventForm(form); }
  catch (error) { return { ok: false, message: error instanceof Error ? error.message : "表单格式错误。" }; }
  const result = id
    ? await supabase.from("events").update(payload).eq("id", id).select("id").single()
    : await supabase.from("events").insert(payload).select("id").single();
  if (result.error) return { ok: false, message: result.error.code === "23505" ? "链接标识已存在，请更换。" : result.error.code === "23514" ? "人数不能低于已确认名额，请检查日期和容量。" : "活动保存失败，请检查数据库连接和权限。" };
  refreshEvents();
  return { ok: true, message: "活动已保存。", id: result.data.id };
}

export async function deleteEvent(id: string): Promise<EventActionResult> {
  const { supabase } = await requireAdmin("/admin/events");
  if (!validEventId(id)) return { ok: false, message: "活动编号无效。" };
  const { error } = await supabase.from("events").delete().eq("id", id).select("id").single();
  if (error) return { ok: false, message: error.code === "23503" ? "活动已有报名记录，不能删除。请取消发布并关闭报名，以保留用户历史记录。" : "活动删除失败，请刷新重试。" };
  refreshEvents();
  return { ok: true, message: "活动已删除。" };
}

export async function submitEventRegistration(eventId: string, name: string): Promise<EventActionResult> {
  if (!validEventId(eventId) || typeof name !== "string" || !name.trim() || name.trim().length > 120) return { ok: false, message: "请填写有效的报名姓名。" };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "请先登录后报名。" };
  const { error } = await supabase.rpc("event_submit_registration", { p_event_id: eventId, p_contact_name: name.trim() });
  if (error) return failure(error);
  refreshEvents();
  return { ok: true, message: "报名申请已提交，等待管理员确认。本次没有扣款。" };
}

export async function cancelEventRequest(id: string): Promise<EventActionResult> {
  if (!validEventId(id)) return { ok: false, message: "报名编号无效。" };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "请先登录。" };
  const { error } = await supabase.rpc("event_cancel_request", { p_registration_id: id });
  if (error) return failure(error);
  refreshEvents();
  return { ok: true, message: "报名申请已撤回。" };
}

export async function reviewEventRegistration(form: FormData): Promise<EventActionResult> {
  const { supabase } = await requireAdmin("/admin/events");
  const id = String(form.get("id") ?? "");
  const status = String(form.get("status") ?? "");
  const note = String(form.get("note") ?? "").trim();
  if (!validEventId(id) || !["confirmed", "cancelled", "rejected"].includes(status) || note.length > 1000) return { ok: false, message: "审核信息无效。" };
  const { error } = await supabase.rpc("event_review_registration", { p_registration_id: id, p_status: status, p_note: note });
  if (error) return failure(error);
  refreshEvents();
  return { ok: true, message: "报名状态已更新；此操作不收款，也不触发退款。" };
}
