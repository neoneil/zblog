import Container from "@/components/site/container";
import { PageShell } from "@/components/site/page-shell";
import MyEventRegistrations from "@/features/events/components/my-event-registrations";
import { getMyEventRegistrations } from "@/features/events/lib/registration-data";
import { eventTicketContext } from "@/features/events/lib/event-ticket-data";
import MyEventTickets from "@/features/events/components/my-event-tickets";

export const metadata = { title: "我的活动报名 · My registrations" };
export default async function MyRegistrationsPage() {
  const result = await getMyEventRegistrations();
  const tickets = await eventTicketContext();
  return <PageShell><Container><MyEventRegistrations {...result} /><MyEventTickets {...tickets} /></Container></PageShell>;
}
