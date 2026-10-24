"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, type CSSProperties } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePreferences } from '@/components/site/preferences-provider';
import { readingSpreads } from '../data/reading-spreads';
import { cardNameZh } from '../data/card-translations';
import { catalogCards, cardImagePath, cardMeaning, cardSlug } from '../lib/card-catalog';
import { prepareThothDeck, readingDignities, type DrawnThothCard } from '../lib/reading-engine';
import { useHandbookLanguage } from './handbook-shell';
import styles from './thoth-reading.module.css';

type Session = {stage:'idle'|'shuffling'|'selecting'|'results';deck:DrawnThothCard[];picked:number[];complete:boolean};
const emptySession:Session = {stage:'idle',deck:[],picked:[],complete:false};
const thothCardBack = '/Thoth_Tarot/thoth_back.png';

export function ThothReadings({spreadId}:{spreadId?:string}) {
  const {language,zh,text} = useHandbookLanguage();
  const {setLanguage} = usePreferences();
  const router=useRouter();
  const pathname=usePathname();
  const params=useSearchParams();
  const spread=readingSpreads.find(item=>item.id===spreadId);
  const [allowReversals,setAllowReversals]=useState(false);
  const [session,setSession]=useState<Session>(emptySession);
  const href=(id?:string)=>`/thoth-tarot/readings${id?`/${id}`:''}?lang=${language}`;
  const cardName=(card:typeof catalogCards[number])=>zh?cardNameZh(card):cardMeaning(card).title;
  const drawn=session.picked.map(index=>session.deck[index]);
  const dignities=spread?readingDignities(drawn,spread):[];

  useEffect(()=>{
    if (session.stage!=='shuffling') return;
    const timer=window.setTimeout(()=>setSession(current=>current.stage==='shuffling'?{...current,stage:'selecting'}:current),900);
    return ()=>window.clearTimeout(timer);
  },[session.stage]);

  function changeLanguage(next:'zh'|'en') {
    setLanguage(next);
    const nextParams=new URLSearchParams(params.toString());
    nextParams.set('lang',next);
    router.replace(`${pathname}?${nextParams}`,{scroll:false});
  }
  function shuffle() {
    setSession({stage:'shuffling',deck:prepareThothDeck(catalogCards,allowReversals),picked:[],complete:false});
  }
  function pick(index:number) {
    if (!spread) return;
    setSession(current=>{
      const continuing=spread.successive && current.stage==='results' && !current.complete;
      if ((current.stage!=='selecting' && !continuing) || current.picked.includes(index) || !current.deck[index]) return current;
      const picked=[...current.picked,index];
      const complete=spread.successive?picked.length===current.deck.length:picked.length===spread.positions.length;
      return {...current,picked,complete,stage:spread.successive || complete?'results':'selecting'};
    });
  }

  return <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
        <nav aria-label={text('透特导航','Thoth navigation')} className="flex flex-wrap gap-2">
          <ButtonLink href={`/thoth-tarot?lang=${language}`} variant="ghost" size="sm">{text('牌义目录','Card Meanings')}</ButtonLink>
          <ButtonLink href={href()} variant="primary" size="sm" aria-current={!spread?'page':undefined}>{text('抽牌解读','Readings')}</ButtonLink>
        </nav>
        <div role="group" aria-label={text('语言','Language')} className="flex gap-1"><Button size="sm" variant={zh?'primary':'secondary'} aria-pressed={zh} onClick={()=>changeLanguage('zh')}>中文</Button><Button size="sm" variant={!zh?'primary':'secondary'} aria-pressed={!zh} onClick={()=>changeLanguage('en')}>English</Button></div>
      </div>
      <header className="py-8 sm:py-10">
        <p className="mb-3 text-sm font-medium text-[var(--primary)]">THOTH TAROT {spread && `· ${spread.positions.length} ${text('张牌','CARDS')}`}</p>
        <h1 className="text-3xl font-semibold">{spread?spread.name[language]:text('选择你的牌阵','Choose Your Spread')}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-soft)]">{spread?spread.description[language]:text('六种牌阵，从一张牌的静观到生命之树的完整探索。','Six spreads, from the contemplation of a single card to an exploration of the Tree of Life.')}</p>
      </header>

      {!spread ? <>
        <div className="grid gap-5 md:grid-cols-2">
          {readingSpreads.map(item=><Card key={item.id} className="flex min-w-0 flex-col overflow-hidden">
            <CardContent className="flex flex-1 flex-col">
              <div className="mb-3"><Badge variant="secondary">{item.positions.length} {text('张牌','cards')}</Badge></div>
              <h2 className="text-xl font-semibold">{item.name[language]}</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--text-soft)]">{item.description[language]}</p>
              <details className="mb-5 mt-4 text-sm"><summary className="cursor-pointer text-[var(--primary)]">{text('牌位含义','Spread positions')}</summary><ol className="mt-3 space-y-3">{item.positions.map((position,i)=><li key={i}><span className="font-medium">{i+1}. {position.name[language]}</span><p className="mt-1 leading-6 text-[var(--text-soft)]">{position.description[language]}</p></li>)}</ol></details>
              <ButtonLink href={href(item.id)} className="mt-auto self-start">{text('开始这次解读','Begin This Reading')} →</ButtonLink>
            </CardContent>
          </Card>)}
        </div>
        <section className="mt-10 border-t border-[var(--border)] py-6"><h2 className="text-lg font-semibold">{text('关于元素状态','About Elemental Dignity')}</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-soft)]">{text('相邻牌的元素可能互相支持、抵消或保持中性。此处按上下左右相邻关系判断；大阿尔卡那不参与元素加权。','Neighbouring elements may support, weaken or remain neutral to one another. This reading uses cardinal grid adjacency; Major Arcana neither receive nor contribute elemental weight.')}</p></section>
      </> : <>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><ButtonLink href={href()} size="sm" variant="ghost">← {text('其他牌阵','Other Spreads')}</ButtonLink><Badge variant="secondary">{text('本地牌义解读','Local card interpretation')}</Badge></div>
        <section className="border-y border-[var(--border)] py-6" aria-label={text('抽牌设置','Reading settings')}>
          <fieldset disabled={session.stage!=='idle'} className="flex flex-wrap gap-x-6 gap-y-2 text-sm"><legend className="mb-2 font-medium">{text('抽牌模式','Reading mode')}</legend><label className="flex items-center gap-2"><input type="radio" name="reading-mode" checked={!allowReversals} onChange={()=>setAllowReversals(false)} className="accent-[var(--primary)]" />{text('仅正位','Upright Only')}</label><label className="flex items-center gap-2"><input type="radio" name="reading-mode" checked={allowReversals} onChange={()=>setAllowReversals(true)} className="accent-[var(--primary)]" />{text('允许逆位','Allow Reversals')}</label></fieldset>
        </section>
        {(session.stage==='idle' || session.stage==='shuffling') && <section className="flex flex-col items-center gap-6 py-10">
          <div className={`relative h-44 w-28 ${session.stage==='shuffling'?styles.shuffling:''}`}><Image src={thothCardBack} alt={text('牌背','Card back')} fill sizes="112px" className="rounded-[var(--radius-sm)] object-cover shadow-[var(--shadow-md)]" /></div>
          <Button onClick={shuffle} disabled={session.stage==='shuffling'}>{session.stage==='shuffling'?text('正在洗牌…','Shuffling…'):text('洗牌','Shuffle the Deck')}</Button>
        </section>}
        {session.stage==='selecting' && <section className="overflow-hidden py-6" aria-label={text('选择塔罗牌','Select cards')}>
          <p role="status" aria-live="polite" className="text-center text-sm font-medium">{text('请选择牌背','Choose a card')} · {session.picked.length} / {spread.positions.length}</p>
          <div className={styles.fan}>{session.deck.slice(0,15).map((_,index)=><button key={index} type="button" disabled={session.picked.includes(index)} onClick={()=>pick(index)} aria-label={`${text('选择第','Choose card ')}${index+1}${text('张牌','')}`} className={`${styles.fanCard} cursor-pointer rounded-[var(--radius-sm)] border border-[var(--border-strong)] shadow-[var(--shadow-md)] outline-offset-4 focus-visible:outline-2 focus-visible:outline-[var(--ring)] disabled:cursor-default disabled:opacity-20`} style={{'--angle':`${-24+index*(48/14)}deg`} as CSSProperties}><Image src={thothCardBack} alt="" fill sizes="88px" className="rounded-[var(--radius-sm)] object-cover" /></button>)}</div>
          <div className="text-center"><Button variant="secondary" onClick={()=>{const next=session.deck.findIndex((_,index)=>!session.picked.includes(index));pick(next);}}>{text('抽取下一张','Draw Next Card')}</Button></div>
        </section>}

        {(session.stage==='selecting' || session.stage==='results') && <section className="border-t border-[var(--border)] py-6" aria-label={text('牌阵','Spread layout')}>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-semibold">{text('你的牌阵','Your Spread')}</h2><span role="status" className="text-sm text-[var(--text-soft)]">{drawn.length} {text('张已抽取','cards drawn')}</span></div>
          <div className={`${styles.board} ${spread.columns>3?styles.wideBoard:''} ${spread.successive?'mx-auto max-w-3xl':''}`} style={{'--columns':spread.successive?Math.min(Math.max(drawn.length,1),3):spread.columns,'--rows':spread.successive?Math.ceil(drawn.length/3):spread.rows} as CSSProperties}>
            {(spread.successive?drawn.map(()=>spread.positions[0]):spread.positions).map((position,index)=>{
              const selected=drawn[index];
              return <div key={index} className={`${styles.slot} w-full max-w-40 justify-self-center`} style={{'--column':spread.successive?index%3+1:position.col,'--row':spread.successive?Math.floor(index/3)+1:position.row} as CSSProperties}>
                {selected ? <Link href={session.stage==='results'?`#reading-card-${index}`:'#reading-progress'} aria-label={`${index+1}. ${position.name[language]}: ${cardName(selected.card)}`} className="relative block aspect-[3/5] overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card)]"><Image src={cardImagePath(selected.card)} alt={cardName(selected.card)} fill sizes="160px" className={`object-contain ${selected.reversed?'rotate-180':''}`} /></Link>
                  : <div className="flex aspect-[3/5] items-center justify-center rounded-[var(--radius-sm)] border border-dashed border-[var(--border-strong)] bg-[var(--card-soft)] text-[var(--text-faint)]">{index+1}</div>}
                <p className="mt-2 break-words text-center text-xs leading-5 text-[var(--text-soft)]">{index+1}. {position.name[language]}</p>
                {selected && <p className="mt-1 break-words text-center text-xs text-[var(--text)]">{cardName(selected.card)}{selected.reversed?` · ${text('逆位','Reversed')}`:''}</p>}
              </div>;
            })}
          </div>
          <div id="reading-progress" className="mt-6 text-center text-sm text-[var(--text-soft)]" role="status">{session.stage==='results'?text('抽牌完成。','Cards revealed.'):text('继续选择，牌阵完成后呈现解读。','Continue selecting to complete the spread.')}</div>
        </section>}

        {session.stage==='results' && <section className="border-t border-[var(--border)] py-8" aria-labelledby="reading-results">
          <h2 id="reading-results" className="text-2xl font-semibold">{text('你的解读','Your Reading')}</h2>
          {allowReversals && <p className="mt-4 text-sm leading-6 text-[var(--text-faint)]">{text('逆位牌保留其基础牌义，供你从阻力、内化或延迟的角度反思。','Reversed cards retain their base meaning for reflection on resistance, internalisation or delay.')}</p>}
          <div className="mt-6 space-y-5">{drawn.map(({card,reversed},index)=>{
            const position=spread.positions[spread.successive?0:index];
            const meaning=cardMeaning(card,language);
            const dignity=dignities[index];
            const interpretation=!reversed && dignity==='well'?[meaning.wellDignified]:!reversed && dignity==='ill'?[meaning.illDignified]:meaning.meaning;
            const dignityName={well:text('元素协调','Well-Dignified'),ill:text('元素受阻','Ill-Dignified'),neutral:text('元素中性','Neutral'),none:text('大阿尔卡那','Major Arcana')}[dignity];
            return <Card key={card.id} id={`reading-card-${index}`} className="scroll-mt-28"><CardContent className="grid items-start gap-6 md:grid-cols-[minmax(0,1fr)_minmax(240px,320px)] md:gap-8">
              <Link href={`/thoth-tarot/${cardSlug(card)}?lang=${language}`} aria-label={`${text('查看牌义','View meaning')}: ${cardName(card)}`} className="relative mx-auto block aspect-[3/5] w-full max-w-80 overflow-hidden rounded-[var(--radius-sm)] md:order-last"><Image src={cardImagePath(card)} alt={cardName(card)} fill sizes="(min-width:768px) 320px, 85vw" className={`object-contain ${reversed?'rotate-180':''}`} /></Link>
              <div className="min-w-0"><p className="text-sm font-medium text-[var(--primary)]">{index+1}. {position.name[language]}</p><p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">{position.description[language]}</p><h3 className="mt-4 text-lg font-semibold">{cardName(card)}</h3>
                <div className="my-3 flex flex-wrap gap-2"><Badge variant="secondary">{reversed?text('逆位','Reversed'):text('正位','Upright')}</Badge><Badge variant={dignity==='well'?'success':dignity==='ill'?'warning':'outline'}>{dignityName}</Badge></div>
                <div lang={zh?'zh-CN':'en'} className="space-y-4 text-sm leading-7 text-[var(--text-soft)]">{interpretation.map((paragraph,i)=><p key={i} className="whitespace-pre-line">{paragraph}</p>)}</div>
                {!reversed && (dignity==='well'||dignity==='ill') && <details className="mt-4 text-sm"><summary className="cursor-pointer text-[var(--primary)]">{text('基础牌义','Base Meaning')}</summary><div className="mt-3 space-y-3 leading-7 text-[var(--text-soft)]">{meaning.meaning.map((paragraph,i)=><p key={i} className="whitespace-pre-line">{paragraph}</p>)}</div></details>}
                <Link href={`/thoth-tarot/${cardSlug(card)}?lang=${language}`} className="mt-4 inline-block text-sm text-[var(--primary)] underline">{text('查看完整牌义','Full Card Meaning')} →</Link>
              </div>
            </CardContent></Card>;
          })}</div>
          {spread.successive && !session.complete && <div className="mt-6 flex flex-wrap gap-3"><Button onClick={()=>pick(session.deck.findIndex((_,index)=>!session.picked.includes(index)))}>{text('再抽一张','Draw Another Card')}</Button><Button variant="secondary" onClick={()=>setSession(current=>({...current,complete:true}))}>{text('完成本次解读','Complete the Reading')}</Button></div>}
          {spread.successive && session.complete && <p role="status" className="mt-5 text-sm text-[var(--text-soft)]">{text('本次解读已结束。','This reading is complete.')}</p>}
          <div className="mt-8 flex flex-wrap gap-3 border-t border-[var(--border)] pt-6"><Button onClick={()=>setSession(emptySession)}>{text('重新开始','Start Again')}</Button><ButtonLink href={href()} variant="secondary">{text('其他牌阵','Other Spreads')}</ButtonLink></div>
        </section>}
      </>}
    </div>
  </main>;
}
