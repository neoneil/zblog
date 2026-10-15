"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button, ButtonLink } from '@/components/ui/button';
import { zodiacSigns, planets, elements } from '../data/astrologyData';
import { astrologyNotesZh } from '../data/astrology-translations';
import { translateTerm } from '../data/translations';
import { cardNameZh } from '../data/card-translations';
import { HandbookShell, useHandbookLanguage } from './handbook-shell';
import { HandbookContent } from './handbook-content';
import ZodiacWheelSVG from './ZodiacWheelSVG';

export function AstrologyReader() {
  const {zh,language,text}=useHandbookLanguage();
  const params=useSearchParams();
  const router=useRouter();
  const [lines,setLines]=useState(true);
  const [showElements,setShowElements]=useState(true);
  const [qualities,setQualities]=useState(false);
  const [moving,setMoving]=useState(true);
  const [directory,setDirectory]=useState('sign');
  const view=params.get('view')??'sign';
  const name=params.get('name')??'Aries';
  const sign=view==='sign'?zodiacSigns.find(item=>item.name===name):undefined;
  const planet=view==='planet'?planets.find(item=>item.name===name):undefined;
  const element=view==='element'?elements.find(item=>item.name===name):undefined;
  const quality=view==='quality'&&['Cardinal','Fixed','Mutable'].includes(name)?name:undefined;
  const earth=view==='element'&&name==='Earth-Planet';
  const item=sign??planet??element;
  const term=(value:string)=>zh?translateTerm(value):value;
  const select=(type:string,value:string)=>{const next=new URLSearchParams(params.toString());next.set('view',type);next.set('name',value);router.push(`/thoth/astrology?${next}`,{scroll:false});};
  const members=quality?zodiacSigns.filter(item=>item.quality===quality):element?zodiacSigns.filter(item=>item.element===element.name):[];
  const cardLink=(id:string,label:string)=><ButtonLink key={id} variant="secondary" size="sm" href={`/thoth/tarot?card=${id}&lang=${language}`}>{zh?cardNameZh({id,name:label}):label}</ButtonLink>;

  return <HandbookShell module="astrology">
    <div className="mb-5 flex flex-wrap items-center gap-4 text-sm">
      <label className="flex items-center gap-2"><input type="checkbox" checked={lines} onChange={e=>setLines(e.target.checked)} className="accent-[var(--primary)]"/>{text('行星连线','Planet connections')}</label>
      <label className="flex items-center gap-2"><input type="checkbox" checked={showElements} onChange={e=>setShowElements(e.target.checked)} className="accent-[var(--primary)]"/>{text('元素','Elements')}</label>
      <label className="flex items-center gap-2"><input type="checkbox" checked={qualities} onChange={e=>setQualities(e.target.checked)} className="accent-[var(--primary)]"/>{text('性质','Qualities')}</label>
      <Button size="sm" variant="secondary" onClick={()=>setMoving(!moving)} aria-pressed={!moving}>{text(moving?'暂停动画':'继续动画',moving?'Pause animation':'Resume animation')}</Button>
    </div>
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <div className="min-w-0"><ZodiacWheelSVG language={language} animated={moving} onSignClick={n=>select('sign',n)} onPlanetClick={n=>select('planet',n)} onElementClick={n=>select('element',n)} onQualityClick={n=>select('quality',n)} selectedSign={sign?.name??null} showPlanetLines={lines} showElements={showElements} showQualities={qualities} mobileMode />
        <p className="mt-3 text-xs text-[var(--text-faint)]">{text('象征对应图；动画不代表实时天体位置。','Symbolic correspondence diagram; animation does not represent live planetary positions.')}</p>
        <div className="mt-5"><div className="flex flex-wrap gap-2" role="group" aria-label={text('目录类型','Directory type')}>{['sign','planet','element','quality'].map(type=><Button key={type} size="sm" variant={directory===type?'primary':'secondary'} onClick={()=>setDirectory(type)} aria-pressed={directory===type}>{text({sign:'星座',planet:'行星',element:'元素',quality:'性质'}[type]!,{sign:'Signs',planet:'Planets',element:'Elements',quality:'Qualities'}[type]!)}</Button>)}</div>
          <div className="mt-3 flex flex-wrap gap-2">{(directory==='sign'?zodiacSigns.map(s=>s.name):directory==='planet'?planets.map(p=>p.name):directory==='element'?elements.map(e=>e.name):['Cardinal','Fixed','Mutable']).map(n=><Button key={n} size="sm" variant="ghost" onClick={()=>select(directory,n)}>{term(n)}</Button>)}</div>
        </div>
      </div>
      <Card className="lg:sticky lg:top-24"><CardContent key={`${view}-${name}`} className="max-h-[80vh] overflow-y-auto p-5 sm:p-6">
        {!item&&!quality&&!earth ? <p>{text('没有找到该条目，请从目录选择。','Entry not found. Select from the directory.')}</p>:<>
          <h2 className="text-2xl font-semibold text-[var(--primary)]">{earth?text('地球','Earth'):term(name)}</h2>{zh&&<p className="mt-2 text-sm text-[var(--text-soft)]">{name}</p>}
          {sign&&<div className="my-5 space-y-3 text-sm"><p>{term(sign.element)} · {term(sign.quality)}</p><div>{text('守护星','Ruler')} <Button size="sm" variant="ghost" onClick={()=>select('planet',sign.ruler)}>{term(sign.ruler)}</Button>{sign.exaltation&&<>{text('擢升','Exaltation')} <Button size="sm" variant="ghost" onClick={()=>select('planet',sign.exaltation!)}>{term(sign.exaltation)}</Button></>}</div></div>}
          {planet&&<div className="my-5 flex flex-wrap gap-2"><ButtonLink size="sm" variant="secondary" href={`/thoth/tree-of-life?view=${planet.sephirahNumber===0?'daath':'sephirah'}&id=${planet.sephirahNumber}&lang=${language}`}>{term(planet.sephirah)}</ButtonLink>{planet.rules.map(n=><Button key={n} size="sm" variant="ghost" onClick={()=>select('sign',n)}>{term(n)}</Button>)}</div>}
          {element&&<p className="my-4 text-sm">{element.symbol} · {term(element.suits)}</p>}
          <div className="mt-5"><HandbookContent english={item?.description??(earth?'Earth is the reference point of the symbolic zodiac wheel. This is not a real-time sky chart.':`${name} describes a mode of expressing elemental energy. Its signs share a pattern of initiating, sustaining or adapting.`)} chinese={astrologyNotesZh[name]} /></div>
          {item?.majorArcana&&<section className="mt-6"><h3 className="mb-3 font-semibold">{text('对应大阿尔卡那','Major Arcana')}</h3>{cardLink(item.majorArcana.cardId,item.majorArcana.cardName)}</section>}
          {sign&&<><section className="mt-6"><h3 className="mb-3 font-semibold">{text('三个旬','Three decans')}</h3><div className="space-y-4">{sign.decans.map(decan=><div key={decan.degrees} className="border-t border-[var(--border)] pt-3"><p className="mb-2 text-sm">{decan.degrees} · <Button variant="ghost" size="sm" onClick={()=>select('planet',decan.subRuler)}>{term(decan.subRuler)}</Button></p>{cardLink(decan.cardId,decan.cardName)}</div>)}</div></section><section className="mt-6"><h3 className="mb-3 font-semibold">{text('宫廷牌区间','Court card ranges')}</h3>{sign.courtCards.map(card=><div key={card.cardId} className="mb-3">{cardLink(card.cardId,card.cardName)}<p className="mt-1 text-xs text-[var(--text-soft)]">{term(card.range)}</p></div>)}</section></>}
          {!!members.length&&<section className="mt-6"><h3 className="mb-3 font-semibold">{text('所属星座','Associated signs')}</h3><div className="flex flex-wrap gap-2">{members.map(s=><Button key={s.name} size="sm" variant="secondary" onClick={()=>select('sign',s.name)}>{term(s.name)}</Button>)}</div></section>}
        </>}
      </CardContent></Card>
    </div>
  </HandbookShell>;
}
