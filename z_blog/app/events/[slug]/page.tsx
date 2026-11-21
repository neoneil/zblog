import { notFound } from 'next/navigation';
import { getEvent } from '@/features/events/lib/event-data';
import EventProduct from '@/features/events/components/event-product';
import { getRegistrationContext } from '@/features/events/lib/registration-data';
import EventRegistrationForm from '@/features/events/components/event-registration-form';
import { eventStatus } from '@/features/events/lib/events';
import { eventTicketContext } from '@/features/events/lib/event-ticket-data';
import EventTicketCheckout from '@/features/events/components/event-ticket-checkout';

export const dynamic='force-dynamic';
export default async function Page({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const result=await getEvent(slug);
  if(result.available&&!result.event) notFound();
  const context = result.event ? await getRegistrationContext(result.event.id) : null;
  const ticketContext = result.event && !result.event.is_demo && result.event.price_cents > 0 ? await eventTicketContext(result.event.id) : null;
  return <EventProduct key={`${result.event?.id}-${result.event?.booked_count}-${result.event?.price_cents}-${result.event?.starts_at}-${result.event?.registration_open}`} initialEvent={result.event} initialNow={result.checkedAt}
    registration={result.event && context ? ticketContext ? <EventTicketCheckout
      key={`${result.event.id}-${result.event.price_cents}-${ticketContext.tickets[0]?.id ?? 'new'}`}
      eventId={result.event.id} slug={result.event.slug} price={result.event.price_cents}
      signedIn={context.signedIn} {...ticketContext}
      paid={ticketContext.tickets.some((ticket) => ticket.status === 'paid')}
    /> : <EventRegistrationForm
      key={`${context.registration?.id ?? 'new'}-${context.registration?.updated_at ?? ''}`}
      eventId={result.event.id} slug={result.event.slug} isDemo={result.event.is_demo}
      open={eventStatus(result.event, result.checkedAt) === 'open'} {...context}
    /> : null} />;
}
