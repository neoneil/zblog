"use client";

import { useRef, useState, useTransition } from "react";
import { Sparkles } from "lucide-react";
import { usePreferences } from "@/components/site/preferences-provider";
import { Button, ButtonLink } from "@/components/ui/button";
import { MembershipActions } from "@/features/billing/components/membership-actions";
import { drawStarCard, saveStarCard } from "./actions";
import { getStarCard, starCards } from "./cards";

export type ReflectionResult = { cardId: number; drawId: string; image: string };

export function Reflection({ result, backImage, onDraw }: {
  result: ReflectionResult | null;
  backImage: string | null;
  onDraw: (result: ReflectionResult) => void;
}) {
  const { t } = usePreferences();
  const [resultLanguage, setResultLanguage] = useState<"en" | "zh">("en");
  const resultText = (copy: { en: string; zh: string }) => copy[resultLanguage];
  const [pending, startTransition] = useTransition();
  const [download, setDownload] = useState("");
  const [feedback, setFeedback] = useState("");
  const authDialog = useRef<HTMLDialogElement>(null);
  const drawing = useRef(false);
  const card = result && getStarCard(result.cardId);

  function draw(position: number) {
    if (drawing.current) return;
    drawing.current = true;
    setFeedback("");
    startTransition(async () => {
      try {
        // Tabs on this origin share the daily cookie.
        const next = navigator.locks
          ? await navigator.locks.request("stellarnests-star-draw", () => drawStarCard(position))
          : await drawStarCard(position);
        if (!next.ok) throw new Error("Draw failed");
        onDraw(next);
      } catch {
        setFeedback(t({ zh: "暂时无法翻牌，请再试一次。", en: "The card could not be revealed. Please try again." }));
      } finally {
        drawing.current = false;
      }
    });
  }

  function save() {
    if (!result) return;
    setFeedback("");
    startTransition(async () => {
      const response = await saveStarCard(result.drawId).catch(() => ({ status: "error" as const }));
      if (response.status === "login") authDialog.current?.showModal();
      else if (response.status === "saved") {
        setDownload(response.download);
        setFeedback(resultText({ zh: "图片已保存到我的星语收藏。", en: "The image is saved to My Stardust Messages." }));
      } else {
        setFeedback(resultText({ zh: "暂时无法保存图片，请稍后再试。", en: "The image could not be saved. Please try again shortly." }));
      }
    });
  }

  async function copy() {
    if (!card) return;
    try {
      await navigator.clipboard.writeText([
        resultText(card.title), resultText(card.message), resultText(card.question), resultText(card.action),
        `${window.location.origin}/tonight`,
      ].join("\n\n"));
      setFeedback(resultText({ zh: "星语已复制。", en: "Message copied." }));
    } catch {
      setFeedback(resultText({ zh: "无法自动复制，请选中星语文字手动复制。", en: "Select the message text to copy it manually." }));
    }
  }

  return (
    <section id="reflection" aria-labelledby="reflection-title" className="w-full scroll-mt-24 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] px-4 py-8 sm:px-10 sm:py-12">
      <header className="mx-auto mb-8 max-w-xl space-y-3 text-center">
        <Sparkles aria-hidden="true" className="mx-auto size-6 text-[var(--primary)]" />
        <h2 id="reflection-title" className="text-2xl sm:text-3xl">
          {t({ zh: "每日星语", en: "Daily Stardust Message" })}
        </h2>
        {!card && <p className="text-[var(--text-soft)]">
          {t({
            zh: "慢慢呼吸，选一张你想翻开的卡。每天一张，免费抽取。",
            en: "Take a slow breath and choose a card to turn over. One free card each day.",
          })}
        </p>}
      </header>

      {card && result ? (
        <div className="grid items-center gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-12">
          {/* eslint-disable-next-line @next/next/no-img-element -- The card uses an expiring R2 URL. */}
          <img src={result.image} alt={resultText(card.title)} className="block h-auto w-full rounded-xl object-contain shadow-lg" />
          <div lang={resultLanguage} className="space-y-5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              lang={resultLanguage === "en" ? "zh" : "en"}
              onClick={() => setResultLanguage(resultLanguage === "en" ? "zh" : "en")}
            >
              {resultLanguage === "en" ? "中文" : "English"}
            </Button>
            <h3 className="text-2xl text-[var(--primary)]">{resultText(card.title)}</h3>
            <p className="text-lg leading-relaxed">{resultText(card.message)}</p>
            <dl className="space-y-4 border-y border-[var(--border)] py-4">
              <div>
                <dt className="font-semibold">{resultText({ zh: "反思问题", en: "Reflection question" })}</dt>
                <dd className="mt-1 text-[var(--text-soft)]">{resultText(card.question)}</dd>
              </div>
              <div>
                <dt className="font-semibold">{resultText({ zh: "今日的小行动", en: "A small action for today" })}</dt>
                <dd className="mt-1 text-[var(--text-soft)]">{resultText(card.action)}</dd>
              </div>
            </dl>
            <div className="flex flex-wrap gap-2">
              {download ? (
                <>
                  <ButtonLink href={download}>{resultText({ zh: "下载 PNG", en: "Download PNG" })}</ButtonLink>
                  <ButtonLink href="/account#star-messages" variant="secondary">{resultText({ zh: "我的星语收藏", en: "My Stardust Messages" })}</ButtonLink>
                </>
              ) : (
                <Button disabled={pending} onClick={save}>{t({ zh: "保存星语图片", en: "Save card image" })}</Button>
              )}
              <Button variant="secondary" onClick={copy}>{t({ zh: "复制星语", en: "Copy message" })}</Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto grid max-w-3xl grid-cols-6 gap-2 sm:gap-3">
          {starCards.map(({ id }, position) => (
            <button
              type="button"
              key={id}
              aria-label={t({ zh: `翻开第 ${id} 张卡`, en: `Reveal card ${id}` })}
              disabled={pending}
              onClick={() => draw(position)}
              className="group flex aspect-[2/3] cursor-pointer overflow-hidden items-center justify-center rounded-md border border-amber-200/45 bg-slate-950 text-amber-200 shadow-sm transition hover:border-amber-100 hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] disabled:cursor-wait motion-safe:hover:-translate-y-1"
            >
              {backImage ? (
                // eslint-disable-next-line @next/next/no-img-element -- All cards share the same signed R2 image.
                <img src={backImage} alt="" width={1024} height={1536} loading="lazy" className="block h-full w-full object-contain" />
              ) : (
                <span aria-hidden="true" className="flex h-[82%] w-[78%] items-center justify-center rounded-sm border border-amber-200/25">
                  <Sparkles className="size-4 sm:size-7" strokeWidth={1.2} />
                </span>
              )}
            </button>
          ))}
        </div>
      )}
      {(feedback || pending) && (
        <p role="status" className="mt-4 text-center text-sm text-[var(--text-soft)]">
          {pending ? t({ zh: "请稍候…", en: "One moment…" }) : feedback}
        </p>
      )}
      <dialog ref={authDialog} aria-labelledby="star-save-title" className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 text-[var(--text)] backdrop:bg-black/60">
        <div className="space-y-4">
          <h3 id="star-save-title" className="text-xl font-semibold">{t({ zh: "把这张星语留在我的星巢", en: "Keep this image in My Account" })}</h3>
          <p className="text-sm text-[var(--text-soft)]">{t({
            zh: "免费注册或登录后，就能把这张图片保存到我的星语收藏。",
            en: "Sign up for free or sign in to save this image to My Stardust Messages.",
          })}</p>
          <MembershipActions signedIn={false} returnTo="/tonight#reflection" />
          <form method="dialog">
            <Button type="submit" variant="ghost">{t({ zh: "关闭", en: "Close" })}</Button>
          </form>
        </div>
      </dialog>
    </section>
  );
}
