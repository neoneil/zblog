"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { articles } from '../data/libraryData';
import { libraryTranslations } from '../data/library-translations';
import { HandbookShell, useHandbookLanguage } from './handbook-shell';

const categories:Record<string,string>={History:'历史',Qabalah:'卡巴拉',Astrology:'占星术',Methods:'方法', 'Golden Dawn':'黄金黎明',Alchemy:'炼金术',Psychology:'心理学'};

export function LibraryReader() {
  const {zh,language,text}=useHandbookLanguage();
  const router=useRouter();
  const params=useSearchParams();
  const [query,setQuery]=useState('');
  const [category,setCategory]=useState('all');
  const pane=useRef<HTMLDivElement>(null);
  const requested=params.get('article');
  const article=articles.find(item=>item.id===requested)??(requested?undefined:articles[0]);
  const translation=article?libraryTranslations[article.id]:undefined;
  const source=zh?translation?.content??article?.content??'':article?.content??'';
  const headings=source.split('\n').flatMap((line,index)=>{const match=line.match(/^#{1,6}\s+(.+)$/);return match?[{line:index+1,title:match[1]}]:[];});
  const filtered=articles.filter(item=>(category==='all'||item.category===category)&&`${item.title} ${item.summary} ${libraryTranslations[item.id]?.title??''} ${libraryTranslations[item.id]?.summary??''}`.toLowerCase().includes(query.trim().toLowerCase()));
  useEffect(()=>{pane.current?.scrollTo({top:0});},[article?.id,language]);
  const select=(id:string)=>{const next=new URLSearchParams(params.toString());next.set('article',id);router.push(`/thoth/library?${next}`,{scroll:false});};
  const jump=(line:number)=>{const target=pane.current?.querySelector<HTMLElement>(`#article-line-${line}`);if(target&&pane.current)pane.current.scrollTo({top:target.offsetTop-pane.current.offsetTop-20,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});};

  return <HandbookShell module="library">
    <div className="grid items-start gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-24"><Card><CardContent className="p-4">
        <label htmlFor="article-search" className="mb-2 block text-sm font-medium">{text('搜索文章','Search articles')}</label><Input id="article-search" type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder={text('标题或主题','Title or topic')}/>
        <label className="mt-3 block text-sm">{text('分类','Category')}<select value={category} onChange={e=>setCategory(e.target.value)} className="mt-2 w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card)] p-2"><option value="all">{text('全部','All')}</option>{Object.keys(categories).map(value=><option key={value} value={value}>{zh?categories[value]:value}</option>)}</select></label>
        <nav className="mt-4 max-h-72 space-y-2 overflow-y-auto lg:max-h-[55vh]" aria-label={text('文章目录','Article directory')}>{filtered.map(item=><button key={item.id} type="button" onClick={()=>select(item.id)} aria-current={article?.id===item.id?'true':undefined} className={`w-full rounded-[var(--radius-sm)] p-3 text-left ${article?.id===item.id?'bg-[var(--primary-soft)] text-[var(--primary)]':'hover:bg-[var(--bg-soft)]'}`}><span className="block text-sm font-medium">{zh?libraryTranslations[item.id]?.title??item.title:item.title}</span><span className="mt-1 block text-xs text-[var(--text-faint)]">{zh?categories[item.category]:item.category}</span></button>)}{!filtered.length&&<p className="text-sm text-[var(--text-soft)]">{text('没有匹配文章。','No matching articles.')}</p>}</nav>
      </CardContent></Card></aside>
      <Card><CardContent className="p-0"><div ref={pane} className="relative max-h-[80vh] overflow-y-auto p-5 sm:p-7">
        {!article?<p>{text('没有找到文章，请重新选择。','Article not found. Select another article.')}</p>:<>
          <Badge variant="secondary">{zh?categories[article.category]:article.category}</Badge><h2 className="mt-4 text-2xl font-semibold">{zh?translation?.title??article.title:article.title}</h2><p className="mt-3 text-sm leading-7 text-[var(--text-soft)]">{zh?translation?.summary??article.summary:article.summary}</p>
          <div className="my-5 flex flex-wrap gap-2"><ButtonLink size="sm" variant="secondary" href={`/thoth/tree-of-life?lang=${language}`}>{text('生命之树','Tree of Life')}</ButtonLink><ButtonLink size="sm" variant="secondary" href={`/thoth/tarot?lang=${language}`}>{text('透特牌库','Thoth cards')}</ButtonLink><ButtonLink size="sm" variant="secondary" href={`/thoth/astrology?lang=${language}`}>{text('占星对应','Astrology')}</ButtonLink></div>
          <details className="mb-6 border-y border-[var(--border)] py-4" open><summary className="cursor-pointer text-sm font-semibold">{text('本篇目录','Contents')}</summary><nav className="mt-3 space-y-2" aria-label={text('本篇目录','Contents')}>{headings.map(heading=><button key={heading.line} type="button" onClick={()=>jump(heading.line)} className="block text-left text-sm text-[var(--primary)] hover:underline">{heading.title}</button>)}</nav></details>
          <div className="prose prose-sm max-w-none text-[var(--text-soft)] prose-headings:text-[var(--text)] prose-strong:text-[var(--text)] prose-a:text-[var(--primary)]">
            <Markdown remarkPlugins={[remarkGfm]} components={{h1:({children,node})=><h3 id={`article-line-${node?.position?.start.line}`}>{children}</h3>,h2:({children,node})=><h3 id={`article-line-${node?.position?.start.line}`}>{children}</h3>,h3:({children,node})=><h3 id={`article-line-${node?.position?.start.line}`}>{children}</h3>,h4:({children,node})=><h4 id={`article-line-${node?.position?.start.line}`}>{children}</h4>,h5:({children,node})=><h5 id={`article-line-${node?.position?.start.line}`}>{children}</h5>,h6:({children,node})=><h6 id={`article-line-${node?.position?.start.line}`}>{children}</h6>}}>{source}</Markdown>
          </div>
          {zh&&<details className="mt-8 border-t border-[var(--border)] pt-4"><summary className="cursor-pointer text-sm text-[var(--primary)]">完整英文版本 · Full English text</summary><div className="prose prose-sm mt-4 max-w-none text-[var(--text-soft)] prose-headings:text-[var(--text)] prose-strong:text-[var(--text)]"><Markdown remarkPlugins={[remarkGfm]}>{article.content}</Markdown></div></details>}
        </>}
      </div></CardContent></Card>
    </div>
  </HandbookShell>;
}
