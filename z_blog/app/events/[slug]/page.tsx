import { notFound } from 'next/navigation';
import { getEvent } from '@/features/events/lib/event-data';
import EventProduct from '@/features/events/components/event-product';

export const dynamic='force-dynamic';
export default async function Page({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const result=await getEvent(slug);
  if(result.available&&!result.event) notFound();
  return <EventProduct initialEvent={result.event} initialNow={result.checkedAt}/>;
}
