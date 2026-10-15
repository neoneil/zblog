"use client";
import { usePreferences } from '@/components/site/preferences-provider';
import { ButtonLink } from '@/components/ui/button';
import { knowledgeEntries } from './knowledge-entries';

export function ModulePreview({slug}:{slug:string}) {
  const {t} = usePreferences();
  const entry = knowledgeEntries.find(item=>item.slug===slug)!;
  return <main className="min-h-screen bg-[var(--bg)] px-5 py-10 text-[var(--text)]"><div className="mx-auto max-w-3xl"><h1 className="text-3xl font-semibold">{t(entry)}</h1><p className="mt-4 text-[var(--text-soft)]">{t({zh:'此模块即将接入。现在可以先探索互动生命之树。',en:'This module is coming soon. Explore the interactive Tree of Life now.'})}</p><ButtonLink className="mt-6" href="/thoth/tree-of-life">{t({zh:'互动生命之树',en:'Tree of Life'})}</ButtonLink></div></main>;
}
