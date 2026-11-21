"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createBillingAdminClient } from "@/features/billing/lib/billing-db";
import { billingReadiness } from "@/features/billing/lib/billing-readiness";
import { billingMessage } from "@/features/billing/lib/stardust-config";
import { validEventId } from "./event-validation";
import type { EventActionResult } from "./registration-types";

export async function buyEventTicket(eventId: string, name: string, requestId: string, expectedPrice: number, confirm: boolean): Promise<EventActionResult> {
  if (!billingReadiness().canCheckout) return { ok: false, message: "付费报名尚未开放或支付配置不完整。" };
  if (!validEventId(eventId) || !validEventId(requestId) || typeof name !== "string" || !name.trim() || name.length > 120 || !Number.isSafeInteger(expectedPrice) || expectedPrice < 0 || confirm !== true) return { ok: false, message: "请填写姓名并确认本次 STARS 支付。" };
  const client = await createClient();
  const { data: { user } } = await client.auth.getUser();
  if (!user) return { ok: false, message: "请先登录。" };
  try {
    const { data, error } = await createBillingAdminClient().rpc("stardust_buy_event_ticket", {
      p_user: user.id, p_event: eventId, p_request: requestId, p_name: name.trim(), p_expected_price: expectedPrice,
    });
    if (error) {
      const messages: Record<string, string> = {
        EVENT_FULL: "名额已满，本次没有扣分。", PRICE_CHANGED: "活动价格已变化，请刷新并重新确认。",
        REGISTRATION_CLOSED: "报名已关闭或活动已开始。", EVENT_UNAVAILABLE: "此活动尚未开放正式付费报名。",
        REQUEST_CONFLICT: "订单标识冲突，请刷新重试。", TICKET_REFUNDED: "原门票已退款，请刷新后重新报名。",
      };
      const key = Object.keys(messages).find((key) => error.message.includes(key));
      return { ok: false, message: key ? messages[key] : error.code === "PGRST202" ? "付费报名数据库尚未就绪，请联系管理员执行补充 SQL。" : billingMessage(error) };
    }
    if (data?.status === "insufficient") return { ok: false, message: "STARS 余额不足，请先到钱包充值。本次没有扣分。" };
    if (data?.status !== "paid") return { ok: false, message: "无法确认订单，请到我的报名查看记录，不要重复付款。" };
    revalidatePath("/wallet"); revalidatePath("/events", "layout"); revalidatePath("/admin/events"); revalidatePath("/");
    return { ok: true, message: "支付成功，活动名额已确认。", id: data.ticket_id };
  } catch { return { ok: false, message: "暂时无法确认结果，请刷新我的报名核对，重试同一订单不会重复扣费。" }; }
}
