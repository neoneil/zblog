"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, MapPin, Pause, Play, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePreferences } from '@/components/site/preferences-provider';
import { eventDate, eventStatus, monthKey, statusCopy, visibleEvents, type EventRecord } from '@/features/events/lib/events';
import styles from './event-announcement.module.css';

export default function EventAnnouncement() {
  const {t,language}=usePreferences();
  const [open,setOpen]=useState(true);
  const [boardOpen,setBoardOpen]=useState(false);
  const [data,setData]=useState<{events:EventRecord[];available:boolean;loading:boolean}>({events:[],available:true,loading:true});
  const [now,setNow]=useState(0);
  const [index,setIndex]=useState(0);
  const [page,setPage]=useState(0);
  const [paused,setPaused]=useState(false);
  const [hovered,setHovered]=useState(false);
  const [focused,setFocused]=useState(false);
  const [reducedMotion,setReducedMotion]=useState(false);
  const dialog=useRef<HTMLDialogElement>(null);
  const id=useId();

  useEffect(()=>{
    let controller:AbortController|undefined;
    let live=true;
    async function refresh() {
      controller?.abort();controller=new AbortController();setNow(Date.now());
      try {
        const response=await fetch('/api/events',{cache:'no-store',signal:controller.signal});
        const result=await response.json();
        if (live) setData({events:response.ok&&Array.isArray(result.events)?result.events:[],available:response.ok&&result.available===true,loading:false});
      } catch(error) {
        if (live && !(error instanceof DOMException && error.name==='AbortError')) setData({events:[],available:false,loading:false});
      }
    }
    const start=window.setTimeout(()=>void refresh(),0);
    const timer=window.setInterval(()=>void refresh(),60000);
    const clock=window.setInterval(()=>setNow(Date.now()),1000);
    const visible=()=>{if(document.visibilityState==='visible') void refresh();};
    document.addEventListener('visibilitychange',visible);
    return ()=>{live=false;controller?.abort();window.clearTimeout(start);window.clearInterval(timer);window.clearInterval(clock);document.removeEventListener('visibilitychange',visible);};
  },[]);
  useEffect(()=>{
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');
    const update=()=>setReducedMotion(media.matches);
    const frame=requestAnimationFrame(update);media.addEventListener('change',update);
    return ()=>{cancelAnimationFrame(frame);media.removeEventListener('change',update);};
  },[]);
  const events=useMemo(()=>visibleEvents(data.events,now),[data.events,now]);
  const stopped=paused||hovered||focused||reducedMotion||boardOpen||!open;
  useEffect(()=>{
    if (stopped||events.length<2) return;
    const timer=window.setInterval(()=>setIndex(current=>current+1),6000);
    return ()=>window.clearInterval(timer);
  },[stopped,events.length]);
  useEffect(()=>{
    const element=dialog.current;
    if (boardOpen && element && !element.open) element.showModal();
    if (!boardOpen && element?.open) element.close();
    if (!boardOpen) return;
    const previous=document.body.style.overflow;document.body.style.overflow='hidden';
    return ()=>{document.body.style.overflow=previous;};
  },[boardOpen]);

  const active=events.length?events[index%events.length]:null;
  const pages=Math.max(1,Math.ceil(events.length/3));
  const safePage=page%pages;
  const nextMonth=events.length>0&&monthKey(Date.parse(events[0].starts_at))!==monthKey(now);
  const heading=t(nextMonth?{zh:'下一场活动',en:'Upcoming events'}:{zh:'本月活动',en:'This month’s events'});
  const empty=t(data.loading?{zh:'正在读取活动…',en:'Loading events…'}:!data.available?{zh:'活动资料暂不可用，请稍后重试。',en:'Events are temporarily unavailable. Please try again later.'}:{zh:'下一场活动待公布。',en:'The next event is to be announced.'});

  return <>
    {!open?<Button className={styles.reopen} variant="secondary" aria-expanded={false} onClick={()=>setOpen(true)}><CalendarDays size={18} aria-hidden />{t({zh:'活动公告',en:'Events'})}</Button>:
      <aside className={styles.announcement} aria-labelledby={`${id}-title`} onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)} onFocusCapture={()=>setFocused(true)} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget)) setFocused(false);}}>
        <header className={styles.header}><CalendarDays size={20} aria-hidden /><h2 id={`${id}-title`}>{heading}</h2><Button variant="ghost" size="icon" aria-label={t({zh:'收起活动公告',en:'Minimise events'})} title={t({zh:'收起活动公告',en:'Minimise events'})} onClick={()=>setOpen(false)}><X size={17} /></Button></header>
        <Button variant="ghost" className={styles.preview} aria-haspopup="dialog" aria-controls={`${id}-board`} onClick={()=>setBoardOpen(true)}>
          {active?<><strong>{active[language==='zh'?'title_zh':'title_en']}</strong><span><CalendarDays size={14} aria-hidden />{eventDate(active,language)}</span><span><MapPin size={14} aria-hidden />{active[language==='zh'?'location_zh':'location_en']}</span><span className={styles.status}>{t(statusCopy[eventStatus(active,now)])}</span></>:<span>{empty}</span>}
        </Button>
        <footer className={styles.controls}>
          <Button variant="secondary" size="sm" aria-haspopup="dialog" onClick={()=>setBoardOpen(true)}>{t({zh:'查看活动公告',en:'View events'})}</Button>
          {events.length>1&&<div className={styles.arrows}><Button variant="ghost" size="icon" aria-label={t({zh:'上一场活动',en:'Previous event'})} title={t({zh:'上一场活动',en:'Previous event'})} onClick={()=>setIndex(current=>(current%events.length+events.length-1)%events.length)}><ChevronLeft size={16}/></Button><Button variant="ghost" size="icon" aria-label={t(paused?{zh:'播放活动轮播',en:'Play events'}:{zh:'暂停活动轮播',en:'Pause events'})} title={t(paused?{zh:'播放活动轮播',en:'Play events'}:{zh:'暂停活动轮播',en:'Pause events'})} onClick={()=>setPaused(value=>!value)}>{paused?<Play size={14}/>:<Pause size={14}/>}</Button><Button variant="ghost" size="icon" aria-label={t({zh:'下一场活动',en:'Next event'})} title={t({zh:'下一场活动',en:'Next event'})} onClick={()=>setIndex(current=>current+1)}><ChevronRight size={16}/></Button></div>}
        </footer>
      </aside>}
    <dialog id={`${id}-board`} ref={dialog} className={styles.dialog} aria-labelledby={`${id}-board-title`} onClose={()=>setBoardOpen(false)} onCancel={()=>setBoardOpen(false)} onClick={event=>{if(event.target===event.currentTarget){const bounds=event.currentTarget.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)setBoardOpen(false);}}}>
      <div className={styles.boardHeader}><h2 id={`${id}-board-title`}>{t({zh:'星辰活动公告',en:'Stellar events'})}</h2><Button variant="secondary" size="icon" aria-label={t({zh:'关闭活动公告',en:'Close events'})} title={t({zh:'关闭活动公告',en:'Close events'})} onClick={()=>setBoardOpen(false)}><X size={20}/></Button></div>
      <div className={styles.artwork}>
        <div className={styles.posterFrame}><Image src="/events/monthly-events-board.png" alt={t({zh:'星夜湖畔两位女子举起魔杖，右侧为活动公告。',en:'Two women raise their wands beside a starlit lake, with the events board to the right.'})} width={1670} height={941} sizes="(min-width:1000px) 1200px, 100vw" className={styles.poster}/></div>
        <section className={styles.eventList} aria-label={heading}>
          <h3>{heading}</h3>
          {events.length?<ol>{events.slice(safePage*3,safePage*3+3).map(event=><li key={event.id}><Link href={`/events/${encodeURIComponent(event.slug)}`} className={styles.eventRow}>
            <div><strong>{event[language==='zh'?'title_zh':'title_en']}</strong><span>{event[language==='zh'?'location_zh':'location_en']}</span><span className={styles.rowStatus}>{t(statusCopy[eventStatus(event,now)])}</span></div><time dateTime={event.starts_at}>{eventDate(event,language)}<small>{event.timezone}</small></time>
          </Link></li>)}</ol>:<p className={styles.empty}>{empty}</p>}
        </section>
      </div>
      <footer className={styles.boardFooter}><span>{events.some(event=>event.is_demo)?t({zh:'演示活动 · 不接受真实付款',en:'Demo events · No real payments'}):t({zh:'活动时间以悉尼时区为准',en:'Event times are shown in Sydney time'})}</span><div><Button variant="secondary" size="icon" disabled={pages===1||safePage===0} aria-label={t({zh:'上一页活动',en:'Previous events page'})} onClick={()=>setPage(value=>value-1)}><ChevronLeft size={18}/></Button><span>{safePage+1} / {pages}</span><Button variant="secondary" size="icon" disabled={pages===1||safePage===pages-1} aria-label={t({zh:'下一页活动',en:'Next events page'})} onClick={()=>setPage(value=>value+1)}><ChevronRight size={18}/></Button></div></footer>
    </dialog>
  </>;
}
