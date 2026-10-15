import { Suspense } from 'react';
import { ThothReadings } from '@/features/thoth/components/thoth-readings';
import { readingSpreads } from '@/features/thoth/data/reading-spreads';
import { catalogCards } from '@/features/thoth/lib/card-catalog';
import { shuffleCards } from '@/lib/tarot/shuffle';

export const metadata={title:'透特塔罗 · 六种牌阵 | Thoth Tarot Readings'};

export default function Page() {
  const previewCards=Object.fromEntries(readingSpreads.map(spread=>[
    spread.id,shuffleCards(catalogCards).slice(0,spread.positions.length).map(card=>card.id),
  ]));
  return <Suspense fallback={<main className="min-h-screen bg-[var(--bg)]" />}><ThothReadings previewCards={previewCards} /></Suspense>;
}
