import { Suspense } from 'react';
import { TreeReader } from '@/features/thoth/components/tree-reader';

export const metadata = { title: '生命之树 · Tree of Life' };

export default function TreePage() {
  return <Suspense fallback={<main className="min-h-screen bg-[var(--bg)]" />}><TreeReader /></Suspense>;
}
