"use client";

import { useEffect, useRef, type ReactNode } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePreferences } from '@/components/site/preferences-provider';
import { Button, ButtonLink } from '@/components/ui/button';
import { knowledgeEntries } from './knowledge-entries';
import styles from './tree-reader.module.css';

export function useHandbookLanguage() {
  const {language,setLanguage} = usePreferences();
  const params = useSearchParams();
  const requested = params.get('lang');
  const applied = useRef<string | null>(null);
  useEffect(() => {
    if (requested !== applied.current && (requested === 'zh' || requested === 'en')) {
      applied.current = requested;
      setLanguage(requested);
    }
  }, [requested,setLanguage]);
  return {language, zh:language==='zh', text:(zh:string,en:string)=>language==='zh'?zh:en};
}

export function HandbookShell({module,children}:{module:string;children:ReactNode}) {
  const {language,text} = useHandbookLanguage();
  const {setLanguage} = usePreferences();
  const router = useRouter();
  const params = useSearchParams();
  function changeLanguage(next: 'zh' | 'en') {
    setLanguage(next);
    const query = new URLSearchParams(params.toString());
    query.set('lang', next);
    router.replace(`/thoth/${module}?${query.toString()}`, {scroll:false});
  }
  const entry = knowledgeEntries.find(item=>item.slug===module)!;
  return <main className={`${styles.reader} min-h-screen bg-[var(--bg)] text-[var(--text)]`}>
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ButtonLink href="/" variant="ghost" size="sm">{text('返回首页','Back to home')}</ButtonLink>
        <div role="group" aria-label={text('阅读语言','Reading language')} className="flex gap-1">
          <Button size="sm" variant={language==='zh'?'primary':'secondary'} aria-pressed={language==='zh'} onClick={()=>changeLanguage('zh')}>中文</Button>
          <Button size="sm" variant={language==='en'?'primary':'secondary'} aria-pressed={language==='en'} onClick={()=>changeLanguage('en')}>English</Button>
        </div>
      </div>
      <header className="my-5"><h1 className="text-3xl font-semibold">{text(entry.zh,entry.en)}</h1><p className="mt-3 text-sm leading-6 text-[var(--text-soft)]">{text(entry.description.zh,entry.description.en)}</p></header>
      <nav aria-label={text('透特知识库','Thoth handbook')} className="mb-6 flex flex-wrap gap-2">
        {knowledgeEntries.map(item=><ButtonLink key={item.slug} size="sm" variant={module===item.slug?'primary':'secondary'} href={`/thoth/${item.slug}?lang=${language}`} aria-current={module===item.slug?'page':undefined}>{text(item.zh,item.en)}</ButtonLink>)}
      </nav>
      {children}
      <footer className="mt-8 border-t border-[var(--border)] pt-4 text-xs text-[var(--text-faint)]"><a href="https://github.com/ctrlaltjakub/Toth-Tarot-Handbook" target="_blank" rel="noopener noreferrer" className="underline">Thoth Tarot Handbook</a> · © 2026 Jakub Fleites-Jonczyk · <ButtonLink href="/thoth/license" size="sm" variant="ghost">MIT License</ButtonLink></footer>
    </div>
  </main>;
}
