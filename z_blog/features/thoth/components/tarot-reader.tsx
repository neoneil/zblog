"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ButtonLink } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { tarotData } from '../data/tarotData';
import { paths, sephiroth } from '../data/treeOfLifeData';
import { cardNameZh, cardNotesZh } from '../data/card-translations';
import { translateTerm } from '../data/translations';
import { HandbookShell, useHandbookLanguage } from './handbook-shell';
import { HandbookContent } from './handbook-content';

const astroNames=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces','Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto','Fire','Water','Air','Earth'];

export function TarotReader() {
  const {zh,language,text} = useHandbookLanguage();
  const params=useSearchParams();
  const router=useRouter();
  const [query,setQuery]=useState('');
  const [arcana,setArcana]=useState('all');
  const [suit,setSuit]=useState('all');
  const content=useRef<HTMLDivElement>(null);
  const selected=params.get('card');
  const card=tarotData.find(item=>item.id===selected) ?? (selected ? undefined : tarotData[0]);
  const filtered=tarotData.filter(item=>(arcana==='all'||item.arcana===arcana)&&(suit==='all'||item.suit===suit)&&`${item.name} ${cardNameZh(item)} ${item.astrology??''} ${item.number}`.toLowerCase().includes(query.trim().toLowerCase()));
  const select=(id:string)=>{
    const next=new URLSearchParams(params.toString()); next.set('card',id);
    router.push(`/thoth/tarot?${next}`,{scroll:false});
  };
  useEffect(()=>{content.current?.scrollTo({top:0});},[card?.id]);
  const path=card ? paths.find(item=>item.cardId===card.id) : undefined;
  const node=card ? sephiroth.find(item=>item.pipCards.includes(card.id)) : undefined;
  const notes=card ? cardNotesZh(card) : [];

  return <HandbookShell module="tarot">
    <div className="grid items-start gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-24">
        <Card><CardContent className="p-4">
          <label htmlFor="tarot-search" className="mb-2 block text-sm font-medium">{text('搜索 78 张牌','Search 78 cards')}</label>
          <Input id="tarot-search" type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder={text('牌名、编号或占星属性','Name, number or attribution')} />
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <label>{text('牌组','Arcana')}<select value={arcana} onChange={e=>setArcana(e.target.value)} className="mt-1 w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card)] p-2"><option value="all">{text('全部','All')}</option><option value="Major">{text('大阿尔卡那','Major')}</option><option value="Minor">{text('数字牌','Numbered')}</option><option value="Court">{text('宫廷牌','Court')}</option></select></label>
            <label>{text('花色','Suit')}<select value={suit} onChange={e=>setSuit(e.target.value)} className="mt-1 w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card)] p-2"><option value="all">{text('全部','All')}</option>{['Wands','Cups','Swords','Disks'].map(value=><option key={value} value={value}>{zh?translateTerm(value):value}</option>)}</select></label>
          </div>
          <p className="mt-3 text-xs text-[var(--text-faint)]" aria-live="polite">{filtered.length} / 78</p>
          <nav aria-label={text('牌目录','Card directory')} className="mt-3 max-h-72 space-y-1 overflow-y-auto lg:max-h-[55vh]">
            {filtered.map(item=><button type="button" key={item.id} onClick={()=>select(item.id)} aria-current={card?.id===item.id?'true':undefined} className={`block w-full rounded-[var(--radius-sm)] px-3 py-3 text-left text-sm transition-colors ${card?.id===item.id?'bg-[var(--primary-soft)] text-[var(--primary)]':'hover:bg-[var(--bg-soft)]'}`}><span className="mr-2 text-[var(--text-faint)]">{item.number}</span>{zh?cardNameZh(item):item.name}</button>)}
            {!filtered.length && <p className="py-4 text-sm text-[var(--text-soft)]">{text('没有找到匹配的牌。','No matching cards.')}</p>}
          </nav>
        </CardContent></Card>
      </aside>
      <Card><CardContent className="p-0">
        <div ref={content} className="p-5 sm:p-7 lg:max-h-[80vh] lg:overflow-y-auto">
          {!card ? <p>{text('没有找到这张牌，请从目录重新选择。','Card not found. Select a card from the directory.')}</p> : <>
            <div className="flex flex-wrap gap-2"><Badge variant="secondary">{card.number}</Badge><Badge variant="secondary">{text(card.arcana==='Major'?'大阿尔卡那':card.arcana==='Court'?'宫廷牌':'数字牌',card.arcana)}</Badge>{card.suit && <Badge variant="secondary">{zh?translateTerm(card.suit):card.suit}</Badge>}</div>
            <h2 className="mt-4 text-2xl font-semibold text-[var(--primary)]">{zh?cardNameZh(card):card.name}</h2>{zh&&<p className="mt-2 text-sm text-[var(--text-soft)]">{card.name}</p>}
            <div className="my-5 flex flex-wrap gap-2">
              {path && <ButtonLink size="sm" variant="secondary" href={`/thoth/tree-of-life?view=path&id=${path.number}&lang=${language}`}>{text('生命之树路径','Tree path')} {path.number}</ButtonLink>}
              {node && <ButtonLink size="sm" variant="secondary" href={`/thoth/tree-of-life?view=sephirah&id=${node.number}&lang=${language}`}>{text('对应质点','Sephirah')} · {zh?translateTerm(node.name):node.name}</ButtonLink>}
              {astroNames.filter(name=>card.astrology?.includes(name)).map(name=><ButtonLink key={name} size="sm" variant="ghost" href={`/thoth/astrology?view=${astroNames.indexOf(name)<12?'sign':astroNames.indexOf(name)<22?'planet':'element'}&name=${name}&lang=${language}`}>{zh?translateTerm(name):name}</ButtonLink>)}
            </div>
            {card.hebrewLetter && <p className="mb-5 text-sm text-[var(--text-soft)]">{text('希伯来字母','Hebrew letter')} · {card.hebrewLetter}</p>}
            {[[text('画面与符号','Visual symbolism'),card.visualDescription,notes[0]],[text('秘传含义','Esoteric meaning'),card.esotericMeaning,notes[1]],[text('荣格视角','Jungian interpretation'),card.jungianMeaning,notes[2]]].map(([heading,english,chinese])=><section key={heading} className="mt-6 border-t border-[var(--border)] pt-5"><h3 className="mb-4 text-lg font-semibold">{heading}</h3><HandbookContent english={english} chinese={chinese} /></section>)}
            <div className="mt-8 flex justify-between gap-3 border-t border-[var(--border)] pt-4">{tarotData.indexOf(card)>0?<ButtonLink variant="secondary" size="sm" href={`/thoth/tarot?card=${tarotData[tarotData.indexOf(card)-1].id}&lang=${language}`}>{text('上一张','Previous')}</ButtonLink>:<span/>}{tarotData.indexOf(card)<tarotData.length-1&&<ButtonLink variant="secondary" size="sm" href={`/thoth/tarot?card=${tarotData[tarotData.indexOf(card)+1].id}&lang=${language}`}>{text('下一张','Next')}</ButtonLink>}</div>
          </>}
        </div>
      </CardContent></Card>
    </div>
  </HandbookShell>;
}
