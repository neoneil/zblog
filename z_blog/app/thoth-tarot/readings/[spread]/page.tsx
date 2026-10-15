import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { ThothReadings } from '@/features/thoth/components/thoth-readings';
import { readingSpreads } from '@/features/thoth/data/reading-spreads';

export function generateStaticParams() {
  return readingSpreads.map(spread=>({spread:spread.id}));
}

export async function generateMetadata({params}:{params:Promise<{spread:string}>}) {
  const {spread}=await params;
  const entry=readingSpreads.find(item=>item.id===spread);
  return {title:entry?`${entry.name.zh} · ${entry.name.en}`:'Thoth Tarot Readings'};
}

export default async function Page({params}:{params:Promise<{spread:string}>}) {
  const {spread}=await params;
  if (!readingSpreads.some(item=>item.id===spread)) notFound();
  return <Suspense fallback={<main className="min-h-screen bg-[var(--bg)]" />}><ThothReadings key={spread} spreadId={spread} /></Suspense>;
}
