"use client";

import Link from 'next/link';
import Image from 'next/image';
import styles from './knowledge-entries.module.css';
import { usePreferences } from '@/components/site/preferences-provider';
import { Card, CardContent } from '@/components/ui/card';

export const knowledgeEntries = [
  { slug: 'tree-of-life', en: 'TREE OF LIFE', zh: '生命之树', description: { zh: '探索十大质点与二十二条路径，揭开生命之树的智慧奥秘。', en: 'Explore the Ten Sephiroth and Twenty-Two Paths — Discover the Wisdom of the Tree of Life.' } },
  { slug: 'tarot', en: 'THOTH WISDOM', zh: '透特奥义', description: { zh: '探索牌面象征、秘传含义与荣格视角，解锁透特塔罗的深层智慧。', en: 'Explore Card Symbolism, Esoteric Meanings, and Jungian Insights — Unlock the Wisdom of Thoth Tarot.' } },
  { slug: 'astrology', en: 'ASTROLOGY', zh: '占星术', description: { zh: '探索星座、行星与四大元素，揭开它们与透特塔罗路径的神秘联系。', en: 'Explore Zodiac Signs, Planets, and Elements — Discover Their Connections to the Paths of Thoth Tarot.' } },
  { slug: 'library', en: 'ESOTERIC LIBRARY', zh: '秘学藏书阁', description: { zh: '探索神秘学历史、古老方法与基础知识，揭开秘传智慧的奥秘。', en: 'Explore Esoteric History, Ancient Practices, and Essential Knowledge — Unlock the Secrets of Mystical Wisdom.' } },
];

export function KnowledgeEntries() {
  const { t, language } = usePreferences();
  return <section id="home-knowledge" className="mb-14" aria-labelledby="thoth-heading">
    <div className="mb-6">
      <h2 id="thoth-heading" className="text-2xl font-semibold">{t({zh:'秘学之源',en:'THE ESOTERIC ARCHIVE'})}</h2>
      <p className={`${styles.subtitle} mt-3`}>{t({
        en: 'Journey through the Tree of Life and the timeless wisdom of the mysteries.',
        zh: '循生命之树的路径，探索古老智慧与宇宙的隐秘秩序。',
      })}</p>
    </div>
    <div className={styles.grid}>
      {knowledgeEntries.map(entry => <Link key={entry.slug} href={`/thoth/${entry.slug}?lang=${language}`} className="group block h-full">
        <Card className={`${styles.card} transition-colors group-hover:border-[var(--primary)]`}>
          <div className={styles.media}>
            <Image src={`/knowledge/${({ 'tree-of-life': 'shengmingzhishu', tarot: 'thoth-wisdom', astrology: 'zhanxingshu', library: 'esoteric-library' })[entry.slug]}.png`} alt="" fill sizes="(max-width: 1023px) 100vw, 25vw" className={styles.image} />
          </div>
          <CardContent className={styles.copy}>
          <h3 className="break-words text-lg font-semibold">{t(entry)}</h3>
          <p className="flex-1 text-base leading-7 text-[var(--text-soft)] sm:text-lg sm:leading-8">{t(entry.description)}</p>
          <span className="text-sm font-medium text-[var(--primary)]">{t({zh:'进入',en:'Explore'})} →</span>
        </CardContent></Card>
      </Link>)}
    </div>
  </section>;
}
