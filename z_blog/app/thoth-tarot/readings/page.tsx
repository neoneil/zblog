import { Suspense } from 'react';
import { ThothReadings } from '@/features/thoth/components/thoth-readings';

export const metadata={title:'透特塔罗 · 六种牌阵 | Thoth Tarot Readings'};

export default function Page() {
  return <Suspense fallback={<main className="min-h-screen bg-[var(--bg)]" />}><ThothReadings /></Suspense>;
}
