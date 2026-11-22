"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { usePreferences } from "@/components/site/preferences-provider";
import { Button } from "@/components/ui/button";
import { situationCatalogs, situationSlotWidth, type SituationCategory } from "@/lib/tarot/situation-spreads";

const previewCount = 12;

export function SituationCatalog({ category }: { category: SituationCategory }) {
  const { title, introduction, back, situations } = situationCatalogs[category];
  const idPrefix = category === "relationships" ? "relationship" : "finance";
  const titleId = `${idPrefix}-catalog-title`;
  const listId = `${idPrefix}-situations`;
  const { language, t } = usePreferences();
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const search = query.trim().toLocaleLowerCase();
  const filtered = search ? situations.filter((item) =>
    [item.question.zh, item.question.en, item.sourceTitle].some((value) => value.toLocaleLowerCase().includes(search)),
  ) : situations;
  const visible = expanded || search ? filtered : filtered.slice(0, previewCount);

  return (
    <section className="space-y-7 py-8 sm:py-12" aria-labelledby={titleId}>
      <header className="space-y-3">
        <Link href={back.href} className="text-sm text-[var(--primary)] underline underline-offset-4">
          {t(back.label)}
        </Link>
        <h1 id={titleId} className="text-3xl font-semibold sm:text-4xl">
          {t(title)}
        </h1>
        <p className="text-[var(--text-soft)]">
          {t(introduction)}
        </p>
      </header>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <label className="block w-full max-w-lg space-y-1.5 text-sm font-medium">
          <span>{t({ zh: "搜索情境", en: "Search situations" })}</span>
          <span className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 focus-within:border-[var(--primary)]">
            <Search className="size-4 shrink-0 text-[var(--text-soft)]" aria-hidden="true" />
            <input type="search" className="min-h-11 w-full bg-transparent outline-none" value={query} onChange={(e) => setQuery(e.target.value)} />
          </span>
        </label>
        {!search && (
          <Button variant="secondary" aria-expanded={expanded} aria-controls={listId} onClick={() => setExpanded(!expanded)}>
            {expanded ? t({ zh: "收起情境", en: "Show fewer situations" })
              : t({ zh: `查看全部 ${situations.length} 种情境`, en: `Show all ${situations.length} situations` })}
          </Button>
        )}
      </div>
      <p role="status" className="text-sm text-[var(--text-soft)]">
        {t({ zh: `显示 ${visible.length} / ${filtered.length} 个情境`, en: `Showing ${visible.length} of ${filtered.length} situations` })}
      </p>
      <ul id={listId} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item) => (
          <li key={item.id}>
            <Link href={item.href} prefetch={false} className="flex h-full min-h-24 items-center gap-4 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 hover:border-[var(--primary)] focus-visible:outline-2 focus-visible:outline-[var(--primary)]">
              <span aria-hidden="true" className="relative block w-14 shrink-0 text-[var(--primary)]" style={{ aspectRatio: item.layout.ratio }}>
                {item.layout.cards.map((slot, index) => (
                  <span key={index} className="absolute aspect-[5/8] -translate-x-1/2 -translate-y-1/2 rounded-[1px] border border-current"
                    style={{ left: `${slot.x}%`, top: `${slot.y}%`, width: `${situationSlotWidth(item.layout, index)}%`, rotate: `${slot.rotation}deg` }} />
                ))}
              </span>
              <span className="min-w-0 space-y-1.5">
                <span className="block break-words font-semibold">{item.question[language]}</span>
                <span className="block text-sm text-[var(--text-soft)]">
                  {t({ zh: `${item.positions.length} 张牌`, en: `${item.positions.length} cards` })}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
