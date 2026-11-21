import { createRoot } from "react-dom/client";
import { PreferencesProvider } from "@/components/site/preferences-provider";
import AdminEventEditor, { RegistrationReview } from "@/features/events/components/admin-event-editor";
import EventRegistrationForm from "@/features/events/components/event-registration-form";
import MyEventRegistrations from "@/features/events/components/my-event-registrations";
import type { EventRegistration } from "@/features/events/lib/registration-types";
import type { EventRecord } from "@/features/events/lib/events";
import EventTicketCheckout from "@/features/events/components/event-ticket-checkout";
import MyEventTickets from "@/features/events/components/my-event-tickets";

const mode = new URLSearchParams(location.search).get("mode");
const event: EventRecord = {
  id: "00000000-0000-4000-8000-000000000004", slug: "salon", title_zh: "星辰主题沙龙", title_en: "Stellar Salon",
  description_zh: "一起探索星辰的故事。", description_en: "Explore the stories of the stars.",
  starts_at: "2027-06-04T09:00:00Z", ends_at: "2027-06-04T11:00:00Z", timezone: "Australia/Sydney",
  location_zh: "悉尼", location_en: "Sydney", price_cents: 5000, capacity: 15, booked_count: 2,
  registration_open: true, is_published: true, is_demo: false,
};
const registration: EventRegistration = {
  id: "00000000-0000-4000-8000-000000000005", event_id: event.id, user_id: "00000000-0000-4000-8000-000000000002",
  contact_name: "测试用户", contact_email: "customer@example.test", status: "requested", admin_note: "",
  event_snapshot: event, created_at: "2026-11-21T03:00:00Z", updated_at: "2026-11-21T03:00:00Z",
};
createRoot(document.getElementById("root")!).render(<PreferencesProvider><main className="min-h-screen bg-[var(--bg)] p-4 text-[var(--text)]">
  {mode === "admin" ? <AdminEventEditor event={event} />
    : mode === "new" ? <AdminEventEditor />
    : mode === "review" ? <RegistrationReview registration={registration} />
    : mode === "history" ? <MyEventRegistrations registrations={[registration]} available />
    : mode === "tickets" ? <MyEventTickets tickets={[{ id: registration.id, user_id: registration.user_id, event_id: event.id, status: "paid", amount_stars: 5000, paid_stars: 3500, reward_stars: 1500, event_snapshot: event, created_at: registration.created_at }]} available sandbox />
    : mode?.startsWith("pay") ? <EventTicketCheckout eventId={event.id} slug={event.slug} price={5000} signedIn available enabled sandbox balance={mode === "pay-zero" ? 0 : 10000} paid={false} />
    : <EventRegistrationForm eventId={event.id} slug={event.slug} isDemo={false} open signedIn registration={null} available />}
</main></PreferencesProvider>);
