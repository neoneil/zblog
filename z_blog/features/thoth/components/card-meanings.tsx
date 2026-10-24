"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { usePreferences } from '@/components/site/preferences-provider';
import { cardNameZh } from '../data/card-translations';
import { translateTerm } from '../data/translations';
import { cardGroups, catalogCards, cardImagePath, cardSlug, cardElement, cardMeaning } from '../lib/card-catalog';
import { useHandbookLanguage } from './handbook-shell';

export function CardMeanings({cardId}:{cardId?:string}) {
  const {language,zh,text} = useHandbookLanguage();
  const {setLanguage} = usePreferences();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [query,setQuery] = useState('');
  const [group,setGroup] = useState('all');
  const card = catalogCards.find(item=>item.id===cardId);
  const href = (slug?:string) => `/thoth-tarot${slug ? `/${slug}` : ''}?lang=${language}`;
  const name = (item:typeof catalogCards[number]) => zh ? cardNameZh(item) : item.name;
  const changeLanguage = (next:'zh'|'en') => {
    setLanguage(next);
    const nextParams = new URLSearchParams(params.toString());
    nextParams.set('lang',next);
    router.replace(`${pathname}?${nextParams}`,{scroll:false});
  };
  const filtered = catalogCards.filter(item=>(group==='all' || (group==='Major'?item.arcana==='Major':item.suit===group))
    && `${item.name} ${cardNameZh(item)}`.toLowerCase().includes(query.trim().toLowerCase()));
  const index = card ? catalogCards.indexOf(card) : -1;
  const element = card ? cardElement(card) : '';
  const meaning = card ? cardMeaning(card, language) : null;

  return <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
        <nav aria-label={text('面包屑','Breadcrumb')} className="flex flex-wrap items-center gap-2 text-sm text-[var(--text-soft)]">
          <Link href="/" className="hover:text-[var(--primary)]">{text('首页','Home')}</Link><span>/</span>
          <Link href={href()} aria-current={!card?'page':undefined} className="hover:text-[var(--primary)]">Thoth tarot</Link>
          {card && <><span>/</span><span aria-current="page">{name(card)}</span></>}
        </nav>
        <div role="group" aria-label={text('阅读语言','Reading language')} className="flex gap-1">
          <Button size="sm" variant={zh?'primary':'secondary'} aria-pressed={zh} onClick={()=>changeLanguage('zh')}>中文</Button>
          <Button size="sm" variant={!zh?'primary':'secondary'} aria-pressed={!zh} onClick={()=>changeLanguage('en')}>English</Button>
        </div>
      </div>

      <nav aria-label={text('透特塔罗','Thoth tarot')} className="mt-5 flex flex-wrap gap-2">
        <ButtonLink href={href()} variant="primary" size="sm">{text('牌义目录','Card Meanings')}</ButtonLink>
        <ButtonLink href={`/thoth-tarot/readings?lang=${language}`} variant="secondary" size="sm">{text('抽牌解读','Readings')}</ButtonLink>
      </nav>

      {!card ? <>
        <header className="py-8 sm:py-12">
          <p className="mb-3 text-sm font-medium text-[var(--primary)]">{text('透特塔罗 · 78 张牌','THOTH TAROT · 78 CARDS')}</p>
          <h1 className="text-3xl font-semibold sm:text-4xl">{text('透特塔罗牌义','Thoth Tarot Card Meanings')}</h1>
          <p className="mt-4 max-w-2xl text-[var(--text-soft)]">{text('从牌面图像进入象征、元素与内在经验。探索大阿尔卡那与四组花色的完整目录。','Explore the imagery, symbolism and elemental language of the Major Arcana and the four suits.')}</p>
        </header>
        <div className="flex flex-col gap-4 border-y border-[var(--border)] py-4 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1"><label htmlFor="thoth-search" className="sr-only">{text('搜索牌名','Search cards')}</label><Input id="thoth-search" type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder={text('搜索中文或英文牌名','Search card names')} /></div>
          <div className="sm:w-52"><label htmlFor="thoth-group" className="sr-only">{text('牌组','Card group')}</label><select id="thoth-group" value={group} onChange={event=>setGroup(event.target.value)} className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] px-3 text-sm"><option value="all">{text('全部牌组','All groups')}</option>{cardGroups.map(item=><option key={item.id} value={item.id}>{text(item.zh,item.en)}</option>)}</select></div>
        </div>
        <p role="status" className="mt-4 text-sm text-[var(--text-faint)]">{filtered.length} {text('张牌','cards')}</p>
        {cardGroups.map(section=>{
          const cards = filtered.filter(item=>section.id==='Major'?item.arcana==='Major':item.suit===section.id);
          if (!cards.length) return null;
          return <section key={section.id} className="py-7" aria-labelledby={`group-${section.id}`}>
            <div className="mb-5 flex items-center gap-3"><h2 id={`group-${section.id}`} className="text-xl font-semibold">{text(section.zh,section.en)}</h2><Badge variant="secondary">{cards.length}</Badge></div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {cards.map(item=><Link key={item.id} href={href(cardSlug(item))} className="group min-w-0 rounded-[var(--radius-sm)] focus-visible:outline-2 focus-visible:outline-[var(--ring)]">
                <Card className="overflow-hidden p-2 group-hover:border-[var(--primary)]"><div className="relative aspect-[3/5] bg-[var(--card-soft)]"><Image src={cardImagePath(item)} alt={name(item)} fill sizes="(max-width:639px) 45vw, (max-width:1023px) 25vw, 160px" className="rounded-[var(--radius-sm)] object-contain transition-transform duration-200 motion-safe:group-hover:scale-[1.02]" /></div></Card>
                <h3 className="mt-3 break-words text-sm font-medium group-hover:text-[var(--primary)]">{name(item)}</h3>
                {zh && <p className="mt-1 break-words text-xs text-[var(--text-faint)]">{item.name}</p>}
              </Link>)}
            </div>
          </section>;
        })}
        {!filtered.length && <p className="py-16 text-center text-[var(--text-soft)]">{text('没有找到对应的牌，请换一个关键词。','No cards found. Try another search.')}</p>}
      </> : <div className="grid items-start gap-8 py-8 md:grid-cols-[280px_minmax(0,1fr)] md:gap-12">
        <aside className="mx-auto w-full max-w-[280px] md:sticky md:top-28">
          <div className="relative aspect-[3/5] overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-md)]"><Image src={cardImagePath(card)} alt={name(card)} fill priority sizes="280px" className="object-contain" /></div>
          <nav aria-label={text('相邻塔罗牌','Adjacent cards')} className="mt-4 grid grid-cols-2 gap-3 text-sm text-[var(--text-soft)]">
            <div>{index>0 && <Link className="inline-block hover:text-[var(--primary)]" href={href(cardSlug(catalogCards[index-1]))}>← {name(catalogCards[index-1])}</Link>}</div>
            <div className="text-right">{index<catalogCards.length-1 && <Link className="inline-block hover:text-[var(--primary)]" href={href(cardSlug(catalogCards[index+1]))}>{name(catalogCards[index+1])} →</Link>}</div>
          </nav>
        </aside>
        <article className="min-w-0">
          <h1 className="text-3xl font-semibold">{name(card)}</h1>
          {zh && <p className="mt-2 text-lg text-[var(--text-soft)]">{card.name}</p>}
          <div className="my-5 flex flex-wrap gap-2"><Badge>{text(card.arcana==='Major'?'大阿尔卡那':card.arcana==='Court'?'宫廷牌':'小阿尔卡那',card.arcana)}</Badge>{card.suit && <Badge variant="secondary">{text(translateTerm(card.suit),card.suit)}</Badge>}<Badge variant="outline">{text(({fire:'火',water:'水',air:'风',earth:'土'} as Record<string,string>)[element],element)}</Badge></div>
          <dl className="mb-7 grid gap-3 border-y border-[var(--border)] py-4 text-sm">
            {[{zh:'占星归属',en:'Astrology',value:card.astrology},{zh:'希伯来字母',en:'Hebrew letter',value:card.hebrewLetter},{zh:'生命之树',en:'Tree of Life',value:card.path}].filter(item=>item.value).map(item=><div key={item.en} className="grid gap-1 sm:grid-cols-[110px_1fr]"><dt className="text-[var(--text-faint)]">{text(item.zh,item.en)}</dt><dd className="break-words text-[var(--text-soft)]">{zh?translateTerm(item.value!):item.value}</dd></div>)}
          </dl>
          {!!meaning?.keywords.length && <div className="mb-7 flex flex-wrap gap-2" lang={zh?'zh-CN':'en'}>{meaning.keywords.map((keyword,index)=><Badge key={`${keyword}-${index}`} variant="secondary">{keyword}</Badge>)}</div>}
          <section><h2 className="mb-4 text-xl font-semibold">{text('牌义','Meaning')}</h2><div lang={zh?'zh-CN':'en'} className="space-y-4 text-sm leading-7 text-[var(--text-soft)]">{meaning?.meaning.map((paragraph,index)=><p key={index} className="whitespace-pre-line">{paragraph}</p>)}</div></section>
          <section className="mt-8"><h2 className="mb-4 text-xl font-semibold">{text('元素状态','Elemental Dignity')}</h2><Card><CardContent className="space-y-5"><div><Badge variant="success">{text('协调时','Well-Dignified')}</Badge><p lang={zh?'zh-CN':'en'} className="mt-3 whitespace-pre-line text-sm leading-7 text-[var(--text-soft)]">{meaning?.wellDignified}</p></div><div className="border-t border-[var(--border)] pt-5"><Badge variant="warning">{text('受阻时','Ill-Dignified')}</Badge><p lang={zh?'zh-CN':'en'} className="mt-3 whitespace-pre-line text-sm leading-7 text-[var(--text-soft)]">{meaning?.illDignified}</p></div></CardContent></Card></section>
          <div className="mt-8 flex flex-wrap gap-3 border-t border-[var(--border)] pt-6"><ButtonLink href={`/thoth-tarot/readings?lang=${language}`}>{text('抽牌解读','Draw a Reading')}</ButtonLink><ButtonLink href={href()} variant="secondary">{text('全部牌义','All Cards')}</ButtonLink></div>
        </article>
      </div>}
    </div>
  </main>;
}
