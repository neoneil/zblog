import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const TarotReader = dynamic(() => import('@/features/thoth/components/tarot-reader').then(module => module.TarotReader));
const AstrologyReader = dynamic(() => import('@/features/thoth/components/astrology-reader').then(module => module.AstrologyReader));
const LibraryReader = dynamic(() => import('@/features/thoth/components/library-reader').then(module => module.LibraryReader));

export default async function ModulePage({params}:{params:Promise<{module:string}>}) {
  const {module} = await params;
  if (!['tarot','astrology','library'].includes(module)) notFound();
  return <Suspense fallback={<main className="min-h-screen bg-[var(--bg)]" />}>{module==='tarot'?<TarotReader/>:module==='astrology'?<AstrologyReader/>:<LibraryReader/>}</Suspense>;
}
