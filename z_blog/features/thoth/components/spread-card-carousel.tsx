"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cardImagePath, cardMeaning, cardSlug, catalogCards } from '../lib/card-catalog';
import { cardNameZh } from '../data/card-translations';
import type { Language } from '@/components/site/preferences-provider';

export function SpreadCardCarousel({cardIds,language,label}:{cardIds:string[];language:Language;label:string}) {
  const track=useRef<HTMLDivElement>(null);
  const id=useId();
  const [edges,setEdges]=useState({start:true,end:true});
  const zh=language==='zh';
  function updateEdges() {
    const element=track.current;
    if (!element) return;
    const start=element.scrollLeft<=1;
    const end=element.scrollLeft+element.clientWidth>=element.scrollWidth-1;
    setEdges(current=>current.start===start && current.end===end?current:{start,end});
  }
  useEffect(()=>{
    const element=track.current;
    if (!element) return;
    const frame=requestAnimationFrame(updateEdges);
    const observer=new ResizeObserver(updateEdges);
    observer.observe(element);
    return ()=>{cancelAnimationFrame(frame);observer.disconnect();};
  },[cardIds]);
  function move(direction:number) {
    const element=track.current;
    if (!element) return;
    const step=208*Math.max(1,Math.floor(element.clientWidth/208));
    const behavior=window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth';
    element.scrollBy({left:direction*step,behavior});
  }
  return <div role="region" aria-roledescription={zh?'轮播':'carousel'} aria-label={label} className="min-w-0 border-b border-[var(--border)] bg-[var(--surface-accent)]">
    <div className="flex items-center justify-between gap-3 px-4 pt-3">
      <span className="text-xs text-[var(--text-soft)]">{cardIds.length} {zh?'张牌':'cards'}</span>
      <div className="flex gap-2">
        <Button type="button" size="icon" variant="secondary" aria-controls={id} aria-label={zh?'上一组牌':'Previous cards'} title={zh?'上一组牌':'Previous cards'} disabled={edges.start} onClick={()=>move(-1)}>←</Button>
        <Button type="button" size="icon" variant="secondary" aria-controls={id} aria-label={zh?'下一组牌':'Next cards'} title={zh?'下一组牌':'Next cards'} disabled={edges.end} onClick={()=>move(1)}>→</Button>
      </div>
    </div>
    <div id={id} ref={track} onScroll={updateEdges} tabIndex={0} aria-label={zh?'牌面预览':'Card previews'} className="flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto overscroll-x-contain p-4 focus-visible:outline-2 focus-visible:outline-[var(--ring)]" onKeyDown={event=>{
      if (event.key==='ArrowLeft'||event.key==='ArrowRight') {event.preventDefault();move(event.key==='ArrowLeft'?-1:1);}
    }}>
      {cardIds.map(cardId=>{
        const card=catalogCards.find(card=>card.id===cardId);
        if (!card) return null;
        const name=zh?cardNameZh(card):cardMeaning(card).title;
        return <Link key={cardId} href={`/thoth-tarot/${cardSlug(card)}?lang=${language}`} className="w-48 shrink-0 snap-start rounded-[var(--radius-sm)] focus-visible:outline-2 focus-visible:outline-[var(--ring)]">
          <div className="relative aspect-[3/5] overflow-hidden rounded-[var(--radius-sm)] bg-[var(--card)]"><Image src={cardImagePath(card)} alt={name} fill sizes="192px" className="object-contain" /></div>
          <p className="mt-2 line-clamp-2 min-h-10 break-words text-center text-sm leading-5 text-[var(--text)]">{name}</p>
        </Link>;
      })}
    </div>
  </div>;
}
