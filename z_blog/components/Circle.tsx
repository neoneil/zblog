"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { usePreferences } from "@/components/site/preferences-provider";

const items = [
  { zh: "托特塔罗牌阵", en: "Thoth Tarot Spreads" },
  { zh: "生命之树探索", en: "Tree of Life" },
  { zh: "元素状态解读", en: "Elemental Dignities" },
  { zh: "静观与自我反思", en: "Contemplation & Reflection" },
];

export default function Circle() {
  const { language, t } = usePreferences();
  return (
    <Link href={`/thoth-tarot/readings?lang=${language}`} className="relative block min-h-[230px] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-md)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)] sm:p-6">
      <div className="absolute inset-0 bg-[var(--section-gradient)]" />

      <div className="relative z-10 flex h-full flex-col justify-between gap-5">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-soft)]">
            THOTH TAROT
          </p>

          <h2 className="text-xl font-semibold leading-snug text-[var(--text)] sm:text-2xl">
            {t({ zh: "托特塔罗 · 牌阵解读", en: "Thoth Tarot Readings" })}
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--text-soft)]">
            {t({ zh: "选择适合此刻问题的牌阵，探索托特塔罗的象征、元素与生命之树，留下一段静观与自我反思的时间。", en: "Choose a spread for your question and explore the symbols, elements and Tree of Life of Thoth Tarot, with space for contemplation and self-reflection." })}
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {items.slice(0, 4).map((item) => (
            <div
              key={item.en}
              className="flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[color:var(--card)]/70 px-3 py-2 text-xs font-medium text-[var(--text-soft)]"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--primary)]" />
              <span>{t(item)}</span>
            </div>
          ))}
        </div>

        <div>
          <span className={buttonVariants({ variant: "secondary", size: "sm" })}>
            {t({ zh: "选择牌阵", en: "Choose Your Spread" })}
          </span>
        </div>
      </div>
    </Link>
  );
}
