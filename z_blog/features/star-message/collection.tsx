"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";
import { usePreferences } from "@/components/site/preferences-provider";
import { ButtonLink } from "@/components/ui/button";
import { getStarCard } from "./cards";

export type SavedStarImage = {
  drawId: string;
  cardId: number;
  drawDay: string;
  image: string;
  download: string;
  saved: boolean;
};

export function StarMessageCollection({ items, unavailable }: {
  items: SavedStarImage[];
  unavailable: boolean;
}) {
  const { t } = usePreferences();
  const dialog = useRef<HTMLDialogElement>(null);
  const [preview, setPreview] = useState<{ image: string; title: string } | null>(null);

  function openPreview(image: string, title: string) {
    setPreview({ image, title });
    dialog.current?.showModal();
  }

  const ordered = [...items].sort((a, b) => a.drawDay.localeCompare(b.drawDay));

  return (
    <section id="star-messages" aria-labelledby="star-collection-title" className="scroll-mt-24 space-y-5">
      <h2 id="star-collection-title" className="text-2xl font-semibold">{t({ zh: "我的星语收藏", en: "My Stardust Messages" })}</h2>
      {unavailable && <p role="status">{t({ zh: "部分星语暂时无法读取。", en: "Some messages are temporarily unavailable." })}</p>}
      {!unavailable && ordered.length === 0 && (
        <p>{t({ zh: "还没有抽卡记录。", en: "You haven’t drawn a card yet." })}</p>
      )}
      {ordered.length > 0 && (
        <ol className="flex flex-wrap items-start gap-3 sm:gap-4">
          {ordered.map(({ drawId, cardId, drawDay, image, download, saved }) => {
            const card = getStarCard(cardId);
            if (!card) return null;
            return (
              <li key={drawId} className="group relative w-32 max-w-full rounded-lg bg-[var(--card)] ring-1 ring-[var(--border)] hover:z-10 sm:w-36">
                <button
                  type="button"
                  aria-haspopup="dialog"
                  aria-label={t({ zh: `放大查看 ${card.title.zh}`, en: `Enlarge ${card.title.en}` })}
                  className="block w-full cursor-zoom-in rounded-t-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
                  onClick={() => openPreview(image, t(card.title))}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- The card uses an expiring R2 URL. */}
                  <img src={image} alt="" loading="lazy" className="relative block h-auto w-full origin-bottom rounded-t-lg group-hover:shadow-[0_0_24px_rgba(251,191,36,0.42)] motion-safe:transition-[transform,scale,rotate,box-shadow] motion-safe:duration-300 motion-safe:ease-out motion-safe:group-hover:-rotate-2 motion-safe:group-hover:scale-125" />
                </button>
                <div className="space-y-1.5 px-2 py-2 text-center">
                  <h3 className="break-words text-sm font-semibold leading-snug">{t(card.title)}</h3>
                  {saved && <p className="text-xs text-[var(--text-soft)]">{t({ zh: "已保存图片", en: "Image saved" })}</p>}
                  <ButtonLink href={download} variant="secondary" size="sm" fullWidth className="px-1 text-xs">
                    {t({ zh: "下载 PNG", en: "Download PNG" })}
                  </ButtonLink>
                  <time dateTime={drawDay} className="block text-xs tabular-nums text-[var(--text-soft)]">{drawDay}</time>
                </div>
              </li>
            );
          })}
        </ol>
      )}
      <ButtonLink href="/tonight#reflection" variant="secondary">{t({ zh: "抽取一张反思卡", en: "Draw a Reflection Card" })}</ButtonLink>
      <dialog
        ref={dialog}
        aria-label={preview?.title}
        onClose={() => setPreview(null)}
        className="fixed inset-0 m-0 h-dvh w-screen max-h-none max-w-none overflow-hidden bg-black/95 text-white"
      >
        <div
          className="grid h-full w-full place-items-center"
          onClick={(event) => {
            if (event.target === event.currentTarget) dialog.current?.close();
          }}
        >
          <button
            type="button"
            aria-label={t({ zh: "关闭图片预览", en: "Close image preview" })}
            className="absolute right-4 top-4 z-10 grid size-11 cursor-pointer place-items-center rounded-full border border-white/40 bg-black/75 text-white hover:bg-white/20"
            onClick={() => dialog.current?.close()}
          >
            <X className="size-5" aria-hidden="true" />
          </button>
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element -- The card uses an expiring R2 URL.
            <img src={preview.image} alt={preview.title} className="block max-h-[92dvh] w-[50vw] object-contain" />
          )}
        </div>
      </dialog>
    </section>
  );
}
