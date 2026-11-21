export type RegistrationStatus = "requested" | "confirmed" | "cancelled" | "rejected";
export type EventSnapshot = {
  title_zh: string; title_en: string; slug: string; starts_at: string; ends_at: string;
  timezone: string; location_zh: string; location_en: string; price_cents: number; is_demo: boolean;
};
export type EventRegistration = {
  id: string; event_id: string; user_id: string; contact_name: string; contact_email: string;
  status: RegistrationStatus; admin_note: string; event_snapshot: EventSnapshot;
  created_at: string; updated_at: string;
};
export type EventActionResult = { ok: boolean; message: string; id?: string };
export const registrationCopy = {
  requested: { zh: "申请已提交 · 待确认", en: "Request submitted · Awaiting confirmation" },
  confirmed: { zh: "名额已确认", en: "Place confirmed" },
  cancelled: { zh: "已取消", en: "Cancelled" },
  rejected: { zh: "申请未通过", en: "Request declined" },
};
