"use client";

import Link from 'next/link';
import { usePreferences } from '@/components/site/preferences-provider';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const knowledgeEntries = [
  { slug: 'tree-of-life', en: 'Tree of Life', zh: '互动生命之树', description: { zh: '探索十个质点、二十二条路径与塔罗的对应关系。', en: 'Explore ten Sephiroth, twenty-two paths and their tarot correspondences.' } },
  { slug: 'tarot', en: 'Thoth Tarot', zh: '透特塔罗', description: { zh: '以透特体系阅读牌面象征与秘传关联。', en: 'Study symbolism and esoteric correspondences in the Thoth system.' } },
  { slug: 'astrology', en: 'Astrology', zh: '占星术', description: { zh: '连接星座、行星、元素与塔罗路径。', en: 'Connect signs, planets and elements with tarot paths.' } },
  { slug: 'library', en: 'Library', zh: '资料库', description: { zh: '查阅历史、方法与基础知识。', en: 'Discover history, methods and foundational knowledge.' } },
];

export function KnowledgeEntries() {
  const { t, language } = usePreferences();
  return <section className="mb-14" aria-labelledby="thoth-heading">
    <div className="mb-6"><p className="text-sm text-[var(--text-soft)]">{t({zh:'透特知识体系',en:'Thoth Knowledge'})}</p>
      <h2 id="thoth-heading" className="mt-2 text-2xl font-semibold">{t({zh:'从符号到连接',en:'Explore the correspondences'})}</h2></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {knowledgeEntries.map(entry => <Link key={entry.slug} href={`/thoth/${entry.slug}?lang=${language}`} className="group block h-full">
        <Card className="h-full transition-colors group-hover:border-[var(--primary)]"><CardContent className="flex h-full flex-col gap-3">
          <Badge variant="secondary" className="self-start">{entry.en}</Badge>
          <h3 className="text-lg font-semibold">{t(entry)}</h3>
          <p className="flex-1 text-sm leading-6 text-[var(--text-soft)]">{t(entry.description)}</p>
          <span className="text-sm font-medium text-[var(--primary)]">{t({zh:'进入',en:'Explore'})} →</span>
        </CardContent></Card>
      </Link>)}
    </div>
  </section>;
}
