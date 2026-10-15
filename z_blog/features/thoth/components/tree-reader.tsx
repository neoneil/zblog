"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Markdown from 'react-markdown';
import Link from 'next/link';
import { usePreferences } from '@/components/site/preferences-provider';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import TreeOfLifeSVG from './TreeOfLifeSVG';
import { sephiroth, paths, daath, abyss, worlds, pillars } from '../data/treeOfLifeData';
import { descriptionsZh, translateTerm } from '../data/translations';
import styles from './tree-reader.module.css';

type Selection = 'sephirah' | 'path' | 'world' | 'pillar' | 'daath' | 'abyss';

export function TreeReader() {
  const { language, setLanguage } = usePreferences();
  const params = useSearchParams();
  const router = useRouter();
  const requestedLanguage = params.get('lang');
  const appliedLanguage = useRef<string | null>(null);
  useEffect(() => {
    if (appliedLanguage.current !== requestedLanguage && (requestedLanguage === 'zh' || requestedLanguage === 'en')) {
      appliedLanguage.current = requestedLanguage;
      setLanguage(requestedLanguage);
    }
  }, [requestedLanguage, setLanguage]);
  const locale = language;
  const zh = locale === 'zh';
  const text = (cn: string, en: string) => zh ? cn : en;
  const term = (value: string) => zh ? translateTerm(value) : value;
  const [showWorlds, setShowWorlds] = useState(true);
  const [showAbyssDaath, setShowAbyssDaath] = useState(true);
  const [showPillars, setShowPillars] = useState(true);
  const [zoomed, setZoomed] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const type = params.get('view');
  const id = Number(params.get('id'));
  const name = params.get('name');
  const seph = type === 'sephirah' ? sephiroth.find(s => s.number === id) : undefined;
  const path = type === 'path' ? paths.find(p => p.number === id) : undefined;
  const world = type === 'world' ? worlds.find(w => w.name === name) : undefined;
  const pillar = type === 'pillar' ? pillars.find(p => p.name === `Pillar of ${name}`) : undefined;
  const item = seph ?? world ?? pillar ?? (type === 'daath' ? daath : undefined);
  const title = item?.name ?? (path ? path.cardName : type === 'abyss' ? 'The Abyss' : '');
  const description = item?.description ?? (type === 'abyss' ? abyss.description : '');
  const valid = !!title;
  const select = (view?: Selection, value?: number | string) => {
    const next = new URLSearchParams(params.toString());
    ['view', 'id', 'name'].forEach(key => next.delete(key));
    if (view) next.set('view', view);
    if (typeof value === 'number') next.set('id', String(value));
    if (typeof value === 'string') next.set('name', value);
    router.push(`/thoth/tree-of-life?${next}`, { scroll: false });
  };
  const changeLanguage = (next: 'zh' | 'en') => {
    setLanguage(next);
    const query = new URLSearchParams(params.toString());
    query.set('lang', next);
    router.replace(`/thoth/tree-of-life?${query}`, {scroll:false});
  };
  const related = seph ? paths.filter(p => p.from === seph.number || p.to === seph.number) : [];
  const members = world?.sephiroth ?? pillar?.sephiroth ?? [];

  return <main className={`${styles.reader} min-h-screen bg-[var(--bg)] text-[var(--text)]`}>
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ButtonLink href="/" variant="ghost" size="sm">{text('返回首页','Back to home')}</ButtonLink>
        <div className="inline-flex gap-1" role="group" aria-label={text('语言','Language')}>
          <Button size="sm" variant={zh ? 'primary' : 'secondary'} onClick={() => changeLanguage('zh')} aria-pressed={zh}>中文</Button>
          <Button size="sm" variant={!zh ? 'primary' : 'secondary'} onClick={() => changeLanguage('en')} aria-pressed={!zh}>English</Button>
        </div>
      </div>
      <header className="my-5"><h1 className="text-3xl font-semibold">{text('互动生命之树','The Tree of Life')}</h1>
        <p className="mt-3 text-sm text-[var(--text-soft)]">{text('10 个质点 · 22 条路径 · 四个世界','10 Sephiroth · 22 paths · Four worlds')}</p>
      </header>
      <div className="mb-5 flex flex-wrap items-center gap-4 text-sm">
        {[[text('四个世界','Worlds'), showWorlds, setShowWorlds], [text('深渊与知识','Abyss & Daath'), showAbyssDaath, setShowAbyssDaath], [text('三根柱','Pillars'), showPillars, setShowPillars]] .map(([label, checked, setter]) => <label key={String(label)} className="flex cursor-pointer items-center gap-2"><input type="checkbox" checked={checked as boolean} onChange={e => (setter as (v:boolean)=>void)(e.target.checked)} className="accent-[var(--primary)]" />{label as string}</label>)}
        <Button variant="secondary" size="sm" onClick={() => setZoomed(!zoomed)} aria-pressed={zoomed}>{text(zoomed?'恢复视图':'放大图形',zoomed?'Reset view':'Expand diagram')}</Button>
        <Button variant="ghost" size="sm" onClick={() => setShowInfo(!showInfo)} aria-expanded={showInfo}>{text('阅读说明','Read me')}</Button>
      </div>
      {showInfo && <p className="mb-6 max-w-3xl text-sm leading-7 text-[var(--text-soft)]">{text('卡巴拉生命之树是透特塔罗对应体系的地图。十个质点对应数字牌，二十二条路径对应大阿尔卡那、希伯来字母及占星属性。图中与目录中的元素都可以选择，详情会显示在旁侧；浏览器返回键可回到之前的选择。','The Kabbalistic Tree of Life maps the Thoth Tarot: ten Sephiroth hold the numbered cards and twenty-two paths correspond to the Major Arcana, Hebrew letters and astrological attributions. Select an element to explore its details. Browser back returns to your previous selection.')}</p>}
      <div className={`grid items-start gap-6 ${zoomed ? '' : 'lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]'}`}>
        <div>
          <div className={`mx-auto w-full ${zoomed ? 'max-w-3xl' : 'max-w-xl'}`}>
            <TreeOfLifeSVG language={locale} onSephirahClick={n => select('sephirah',n)} onPathClick={n => select('path',n)} onWorldClick={n => select('world',n)} onPillarClick={n => select('pillar',n)} onDaathClick={() => select('daath')} onAbyssClick={() => select('abyss')} selectedSephirah={seph?.number ?? null} selectedPath={path?.number ?? null} showWorlds={showWorlds} showAbyssDaath={showAbyssDaath} showPillars={showPillars} mobileMode />
          </div>
          <details className="mt-5 border-t border-[var(--border)] pt-4"><summary className="cursor-pointer text-sm font-medium">{text('元素目录','Element directory')}</summary>
            <div className="mt-3 flex flex-wrap gap-2">
              {sephiroth.map(s => <Button key={s.number} size="sm" variant="secondary" onClick={() => select('sephirah',s.number)}>{s.number}. {term(s.name)}</Button>)}
              {paths.map(p => <Button key={p.number} size="sm" variant="ghost" onClick={() => select('path',p.number)}>{p.romanNumeral} {term(p.cardName)}</Button>)}
              {worlds.map(w => <Button key={w.name} size="sm" variant="secondary" onClick={() => select('world',w.name)}>{term(w.name)}</Button>)}
              {pillars.map(p => <Button key={p.name} size="sm" variant="secondary" onClick={() => select('pillar',p.name.replace('Pillar of ',''))}>{term(p.name)}</Button>)}
              <Button size="sm" variant="secondary" onClick={() => select('daath')}>{term('Daath')}</Button><Button size="sm" variant="secondary" onClick={() => select('abyss')}>{term('The Abyss')}</Button>
            </div>
          </details>
        </div>
        <Card className={zoomed ? '' : 'lg:sticky lg:top-24'}>
          <CardContent className="max-h-[75vh] overflow-y-auto p-5 sm:p-6" aria-live="polite">
            {!valid ? <div className="py-8"><h2 className="text-xl font-semibold">{text('生命之树','Tree of Life')}</h2><p className="mt-4 text-sm leading-7 text-[var(--text-soft)]">{text('选择一个质点、路径、世界或柱，探索它的象征与对应关系。','Select a Sephirah, path, world or pillar to explore its symbolism and correspondences.')}</p></div> : <>
              <div className="flex items-start justify-between gap-4"><div><p className="text-sm text-[var(--text-soft)]">{seph ? `${seph.number} · ${term(seph.meaning)}` : path ? `${text('路径','Path')} ${path.number}` : ''}</p><h2 className="mt-1 text-2xl font-semibold text-[var(--primary)]">{term(title)}</h2>{zh && <p className="mt-1 text-sm text-[var(--text-soft)]">{title}</p>}{item && 'hebrew' in item && <p className="mt-2">{item.hebrew}</p>}</div><Button variant="ghost" size="sm" onClick={() => select()}>{text('关闭','Close')}</Button></div>
              {seph && <dl className="my-5 grid gap-3 text-sm"><div><dt className="text-[var(--text-faint)]">{text('行星','Planet')}</dt><dd>{term(seph.planet)}</dd></div><div><dt className="text-[var(--text-faint)]">{text('柱 / 世界','Pillar / World')}</dt><dd><Button variant="ghost" size="sm" onClick={() => select('pillar',seph.pillar)}>{term(`Pillar of ${seph.pillar}`)}</Button><Button variant="ghost" size="sm" onClick={() => select('world',seph.world)}>{term(seph.world)}</Button></dd></div></dl>}
              {path && <div className="my-5 space-y-4 text-sm"><p>{path.hebrewLetter} · {term(path.letterMeaning)}</p><p>{term(path.astrology)}</p><div className="flex flex-wrap items-center gap-2">{[path.from,path.to].map(n => <Button key={n} size="sm" variant="secondary" onClick={() => select('sephirah',n)}>{term(sephiroth.find(s=>s.number===n)!.name)}</Button>)}</div><ButtonLink variant="secondary" size="sm" href={`/thoth/tarot?card=${path.cardId}&lang=${locale}`}>{text('阅读完整牌义','Read card details')}</ButtonLink></div>}
              {world && <p className="my-4 text-sm">{term(world.meaning)} · {term(world.element)} {world.elementSymbol}</p>}
              {description && <div className="prose prose-sm max-w-none text-[var(--text-soft)] prose-headings:text-[var(--text)] prose-strong:text-[var(--text)]"><Markdown>{zh ? descriptionsZh[title] ?? description : description}</Markdown></div>}
              {zh && description && <details className="mt-5 border-t border-[var(--border)] pt-4"><summary className="cursor-pointer text-sm text-[var(--primary)]">英文原文 · English source</summary><div className="prose prose-sm mt-4 max-w-none text-[var(--text-soft)] prose-strong:text-[var(--text)]"><Markdown>{description}</Markdown></div></details>}
              {!!related.length && <section className="mt-6 border-t border-[var(--border)] pt-4"><h3 className="mb-3 font-semibold">{text('相连路径','Connected paths')}</h3><div className="flex flex-wrap gap-2">{related.map(p => <Button key={p.number} variant="secondary" size="sm" onClick={() => select('path',p.number)}>{p.romanNumeral} · {term(p.cardName)}</Button>)}</div></section>}
              {seph && <section className="mt-6"><h3 className="mb-3 font-semibold">{text('对应数字牌','Cards on this Sephirah')}</h3><div className="grid grid-cols-2 gap-2">{seph.pipCards.map((card,index) => <Link key={card} href={`/thoth/tarot?card=${card}&lang=${locale}`} className="rounded-[var(--radius-sm)] border border-[var(--border)] px-3 py-2 text-sm text-[var(--primary)]">{term(['Wands','Cups','Swords','Disks'][index])} · {seph.number}</Link>)}</div></section>}
              {!!members.length && <section className="mt-6"><h3 className="mb-3 font-semibold">{text('所属质点','Sephiroth')}</h3><div className="flex flex-wrap gap-2">{members.map(n => <Button key={n} size="sm" variant="secondary" onClick={() => select('sephirah',n)}>{n} · {term(sephiroth.find(s=>s.number===n)!.name)}</Button>)}</div></section>}
            </>}
          </CardContent>
        </Card>
      </div>
      <footer className="mt-8 border-t border-[var(--border)] pt-4 text-xs leading-6 text-[var(--text-faint)]"><a href="https://github.com/ctrlaltjakub/Toth-Tarot-Handbook" target="_blank" rel="noopener noreferrer" className="underline">Thoth Tarot Handbook</a> · © 2026 Jakub Fleites-Jonczyk · <Link href="/thoth/license" className="underline">MIT License</Link></footer>
    </div>
  </main>;
}
