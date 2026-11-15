"use client";

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { CalendarDays, MapPin, Users } from 'lucide-react';
import { Button, ButtonLink } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePreferences } from '@/components/site/preferences-provider';
import { eventDate, eventStatus, statusCopy, type EventRecord } from '../lib/events';

export default function EventProduct({initialEvent,initialNow}:{initialEvent:EventRecord|null;initialNow:number}) {
  const {t,language}=usePreferences();
  const [event,setEvent]=useState(initialEvent);
  const [now,setNow]=useState(initialNow);
  const [available,setAvailable]=useState(!!initialEvent);
  useEffect(()=>{
    let live=true;
    let controller:AbortController|undefined;
    const clock=window.setInterval(()=>setNow(Date.now()),1000);
    async function refresh() {
      if(!initialEvent) return;
      controller?.abort();controller=new AbortController();
      try {
        const response=await fetch(`/api/events/${encodeURIComponent(initialEvent.slug)}`,{cache:'no-store',signal:controller.signal});
        const result=await response.json();
        if(live) {setAvailable(response.ok&&result.available);if(response.ok)setEvent(result.event);}
      } catch(error) {if(live&&!(error instanceof DOMException&&error.name==='AbortError'))setAvailable(false);}
    }
    const timer=window.setInterval(()=>void refresh(),60000);
    const visibility=()=>{if(document.visibilityState==='visible')void refresh();};
    document.addEventListener('visibilitychange',visibility);
    return ()=>{live=false;controller?.abort();window.clearInterval(timer);window.clearInterval(clock);document.removeEventListener('visibilitychange',visibility);};
  },[initialEvent]);
  const status=event?eventStatus(event,now):'closed';
  return <main className="mx-auto w-full max-w-6xl px-4 py-8 text-[var(--reading-ink)] sm:px-6">
    <ButtonLink href="/" variant="ghost">← {t({zh:'返回首页',en:'Back to home'})}</ButtonLink>
    {!event?<p role="status" className="py-12">{t({zh:'活动资料暂不可用，请稍后重试。',en:'Event details are temporarily unavailable. Please try again later.'})}</p>:<div className="mt-6 grid items-start gap-8 lg:grid-cols-2">
      <Image src="/events/monthly-events-board.png" alt={t({zh:'星辰活动主题海报',en:'Stellar event poster'})} width={1670} height={941} sizes="(min-width:1024px) 530px, 100vw" className="h-auto w-full rounded-[var(--radius-sm)]" priority/>
      <article className="min-w-0"><div className="mb-4 flex flex-wrap gap-2"><Badge variant={status==='open'?'success':status==='full'?'warning':'secondary'}>{t(statusCopy[status])}</Badge>{event.is_demo&&<Badge variant="outline">{t({zh:'演示活动',en:'DEMO EVENT'})}</Badge>}</div>
        <h1 className="text-2xl font-semibold text-[var(--title-ink)]">{event[language==='zh'?'title_zh':'title_en']}</h1>
        <p className="my-5 text-xl font-semibold">{new Intl.NumberFormat(language==='zh'?'zh-CN':'en-AU',{style:'currency',currency:'AUD',currencyDisplay:'code'}).format(event.price_cents/100)}</p>
        <dl className="space-y-4 border-y border-[var(--border)] py-5 text-sm"><div><dt className="mb-1 flex items-center gap-2"><CalendarDays size={17}/>{t({zh:'活动时间',en:'Date & time'})}</dt><dd>{eventDate(event,language)} · {event.timezone}</dd></div><div><dt className="mb-1 flex items-center gap-2"><MapPin size={17}/>{t({zh:'地点',en:'Location'})}</dt><dd>{event[language==='zh'?'location_zh':'location_en']}</dd></div><div><dt className="mb-1 flex items-center gap-2"><Users size={17}/>{t({zh:'名额',en:'Places'})}</dt><dd>{Math.max(0,event.capacity-event.booked_count)} / {event.capacity}</dd></div></dl>
        <p className="my-6 whitespace-pre-line text-sm leading-7">{event[language==='zh'?'description_zh':'description_en']}</p>
        {!available&&<p role="alert" className="mb-4 text-sm text-[var(--danger)]">{t({zh:'暂时无法确认最新名额，报名已暂停。',en:'Availability cannot be confirmed. Registration is paused.'})}</p>}
        <Button disabled>{!available?t({zh:'暂不可报名',en:'Registration unavailable'}):status!=='open'?t(statusCopy[status]):event.is_demo?t({zh:'演示活动 · 不接受付款',en:'Demo event · No payments'}):t({zh:'在线报名即将开放',en:'Online registration coming soon'})}</Button>
        <div className="mt-5"><ButtonLink href="/#home-events" variant="secondary">{t({zh:'查看其他活动',en:'Other events'})}</ButtonLink></div>
      </article>
    </div>}
  </main>;
}
