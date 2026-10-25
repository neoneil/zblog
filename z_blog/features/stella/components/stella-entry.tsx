"use client";

import dynamic from "next/dynamic";

const StellaClient = dynamic(() => import("./stella-client"), {
  ssr: false,
  loading: () => <main className="grid min-h-[80svh] place-items-center bg-[var(--stella-bg)] text-[var(--stella-muted)]" aria-busy="true"><span>Stella</span></main>,
});

export default function StellaEntry() {
  return <StellaClient />;
}
