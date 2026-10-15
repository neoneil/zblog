import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { CardMeanings } from '@/features/thoth/components/card-meanings';
import { catalogCards, cardSlug } from '@/features/thoth/lib/card-catalog';

export function generateStaticParams() {
  return catalogCards.map(card => ({slug:cardSlug(card)}));
}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}) {
  const {slug} = await params;
  const card = catalogCards.find(card => cardSlug(card) === slug);
  return {title:card ? `${card.name} · Thoth tarot` : 'Thoth tarot'};
}

export default async function Page({params}:{params:Promise<{slug:string}>}) {
  const {slug} = await params;
  const card = catalogCards.find(card => cardSlug(card) === slug);
  if (!card) notFound();
  return <Suspense fallback={<main className="min-h-screen bg-[var(--bg)]" />}><CardMeanings cardId={card.id} /></Suspense>;
}
