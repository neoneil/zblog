"use client";

import { useRef, useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { usePreferences } from "@/components/site/preferences-provider";
import { Button, ButtonLink } from "@/components/ui/button";
import { isTarotReadingMode, tarotModes } from "@/lib/tarot/reading-modes";
import { getMyReading } from "./actions";
import type { ArchivedReadingSku, ReadingDetail, ReadingSummary } from "./reading-archive";

const ReadingDetailPanel = dynamic(() => import("./reading-detail-panel"));
const groups = [
  { id: "tarot-collection", title: { zh: "我的塔罗收藏", en: "My Tarot Collection" },
    href: "/tarot-ai", open: { zh: "去塔罗解读", en: "Open Tarot Readings" }, skus: ["waite-single", "waite-multi"] },
  { id: "natal-collection", title: { zh: "我的星盘收藏（个人）", en: "My Natal Chart Collection" },
    href: "/astroplate", open: { zh: "去个人星盘", en: "Open Natal Charts" }, skus: ["natal"] },
  { id: "synastry-collection", title: { zh: "我的星盘收藏（双人）", en: "My Synastry Collection" },
    href: "/synastry", open: { zh: "去双人合盘", en: "Open Synastry" }, skus: ["synastry"] },
] satisfies { id: string; title: { zh: string; en: string }; href: string; open: { zh: string; en: string }; skus: ArchivedReadingSku[] }[];

function ReadingEntry({ record, title }: { record: ReadingSummary; title: string }) {
  const { language, t } = usePreferences();
  const [detail, setDetail] = useState<ReadingDetail | null>(null);
  const [failed, setFailed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [pending, startTransition] = useTransition();
  const requested = useRef(false);
  const time = record.completed_at ?? record.created_at;
  const date = new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en-AU", {
    timeZone: "Australia/Sydney", dateStyle: "medium", timeStyle: "short",
  }).format(new Date(time));

  function load() {
    if (requested.current) return;
    requested.current = true;
    setFailed(false);
    startTransition(async () => {
      try {
        const report = await getMyReading(record.id);
        if (!report) throw new Error("Reading unavailable");
        setDetail(report);
      } catch {
        requested.current = false;
        setFailed(true);
      }
    });
  }

  return (
    <details
      className="group rounded-lg border border-[var(--border)] bg-[var(--card)]"
      onToggle={(event) => {
        const open = event.currentTarget.open;
        setExpanded(open);
        if (open) load();
      }}
    >
      <summary className="cursor-pointer px-4 py-3 focus-visible:outline-2 focus-visible:outline-[var(--primary)] sm:px-5">
        <span className="ml-2 font-semibold">{title}</span>
        <span className="ml-2 inline-block text-sm text-[var(--text-soft)]">
          {record.completed_at ? t({ zh: "解读完成", en: "Reading completed" }) : t({ zh: "记录日期", en: "Record date" })}
          {" · "}<time dateTime={time}>{date}</time>
        </span>
      </summary>
      <div className="min-w-0 border-t border-[var(--border)] p-4 sm:p-6">
        {pending && <p role="status">{t({ zh: "正在读取解读…", en: "Loading reading…" })}</p>}
        {failed && <div className="space-y-3">
          <p role="status">{t({ zh: "暂时无法读取这次解读。", en: "This reading could not be loaded." })}</p>
          <Button size="sm" variant="secondary" onClick={load}>{t({ zh: "重试", en: "Retry" })}</Button>
        </div>}
        {expanded && detail && <ReadingDetailPanel detail={detail} />}
      </div>
    </details>
  );
}

export function ReadingCollections({
  records,
  unavailable = records === undefined,
}: {
  records?: ReadingSummary[];
  unavailable?: boolean;
}) {
  const { t } = usePreferences();
  return (
    <>
      {groups.map((group) => {
        const entries = (records ?? []).filter((item) => group.skus.some((sku) => sku === item.sku));
        return (
          <section key={group.id} id={group.id} aria-labelledby={`${group.id}-title`} className="scroll-mt-24 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id={`${group.id}-title`} className="text-2xl font-semibold">{t(group.title)}</h2>
              <ButtonLink href={group.href} size="sm" variant="secondary">{t(group.open)}</ButtonLink>
            </div>
            {unavailable && <p role="status" className="text-sm text-[var(--text-soft)]">
              {t({ zh: "部分解读记录暂时无法读取。", en: "Some readings are temporarily unavailable." })}
            </p>}
            {!unavailable && !entries.length && <p className="text-sm text-[var(--text-soft)]">
              {t({ zh: "还没有生成过解读。", en: "No readings yet." })}
            </p>}
            {entries.map((record) => {
              const title = isTarotReadingMode(record.mode) ? t(tarotModes[record.mode].title)
                : record.sku === "natal" ? t({ zh: "个人星盘解读", en: "Natal chart reading" })
                : record.sku === "synastry" ? t({ zh: "双人合盘解读", en: "Synastry reading" })
                : t({ zh: "塔罗解读", en: "Tarot reading" });
              return <ReadingEntry key={record.id} record={record} title={title} />;
            })}
          </section>
        );
      })}
    </>
  );
}
