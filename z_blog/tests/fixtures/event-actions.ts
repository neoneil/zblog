import type { EventActionResult } from "@/features/events/lib/registration-types";

export const eventTest = { calls: [] as { action: string; args: unknown }[], fail: false };
Object.assign(window, { eventTest });
async function action(name: string, args: unknown): Promise<EventActionResult> {
  eventTest.calls.push({ action: name, args });
  return { ok: !eventTest.fail, message: eventTest.fail ? "测试失败，请重试。" : "已保存。" };
}
export const saveEvent = (form: FormData) => action("save", Object.fromEntries(form));
export const deleteEvent = (id: string) => action("delete", id);
export const submitEventRegistration = (id: string, name: string) => action("submit", { id, name });
export const cancelEventRequest = (id: string) => action("cancel", id);
export const reviewEventRegistration = (form: FormData) => action("review", Object.fromEntries(form));
export const buyEventTicket = (eventId: string, name: string, requestId: string, expectedPrice: number, confirm: boolean) => action("buy", { eventId, name, requestId, expectedPrice, confirm });
