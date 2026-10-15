import { Suspense } from 'react';
import { CardMeanings } from '@/features/thoth/components/card-meanings';

export const metadata = {title:'Thoth tarot · 透特塔罗牌义'};

export default function Page() {
  return <Suspense fallback={<main className="min-h-screen bg-[var(--bg)]" />}><CardMeanings /></Suspense>;
}
