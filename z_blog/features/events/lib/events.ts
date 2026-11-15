export type EventRecord = {
  id:string; slug:string; title_zh:string; title_en:string;
  description_zh:string; description_en:string; starts_at:string; ends_at:string;
  timezone:string; location_zh:string; location_en:string; price_cents:number;
  capacity:number; booked_count:number; registration_open:boolean;
  is_published:boolean; is_demo:boolean;
};
export type EventStatus = 'open'|'full'|'closed'|'ended';
export const EVENT_TIMEZONE='Australia/Sydney';

export function eventStatus(event:EventRecord, now:number=Date.now()):EventStatus {
  if (Date.parse(event.ends_at)<=now) return 'ended';
  if (event.booked_count>=event.capacity) return 'full';
  if (!event.registration_open || Date.parse(event.starts_at)<=now) return 'closed';
  return 'open';
}

export function monthKey(date:number,timezone=EVENT_TIMEZONE) {
  const parts=new Intl.DateTimeFormat('en-AU',{timeZone:timezone,year:'numeric',month:'2-digit'}).formatToParts(date);
  return `${parts.find(p=>p.type==='year')?.value}-${parts.find(p=>p.type==='month')?.value}`;
}

export function visibleEvents(events:readonly EventRecord[],now:number=Date.now()) {
  const upcoming=events.filter(event=>event.is_published && Date.parse(event.ends_at)>now)
    .sort((a,b)=>Date.parse(a.starts_at)-Date.parse(b.starts_at)||a.id.localeCompare(b.id));
  const month=monthKey(now);
  const current=upcoming.filter(event=>monthKey(Date.parse(event.starts_at))===month);
  if (current.length) return current;
  const next=upcoming.find(event=>Date.parse(event.starts_at)>now);
  return next?upcoming.filter(event=>monthKey(Date.parse(event.starts_at))===monthKey(Date.parse(next.starts_at))):[];
}

export function eventDate(event:EventRecord,language:'zh'|'en') {
  return new Intl.DateTimeFormat(language==='zh'?'zh-CN':'en-AU',{
    timeZone:event.timezone,month:'short',day:'numeric',hour:'2-digit',minute:'2-digit',
  }).format(new Date(event.starts_at));
}

export const statusCopy = {
  open:{zh:'报名开放',en:'REGISTRATION OPEN'},
  full:{zh:'FULLY BOOKED · 名额已满',en:'FULLY BOOKED'},
  closed:{zh:'报名已关闭',en:'REGISTRATION CLOSED'},
  ended:{zh:'活动已结束',en:'EVENT ENDED'},
};
