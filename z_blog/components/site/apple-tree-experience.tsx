"use client";

import { useRef, useState, useTransition, type FormEvent } from "react";
import Image from "next/image";
import { Button, ButtonLink } from "@/components/ui/button";
import { saveAppleTreeMessage } from "@/features/apple-tree/actions";
import { limitWish, wishLimit } from "@/features/apple-tree/wish-limit";
import { usePreferences } from "@/components/site/preferences-provider";

export default function AppleTreeExperience() {
  const { t } = usePreferences();
  const [wish, setWish] = useState("");
  const composing = useRef(false);
  const submission = useRef<{ body: string; id: string } | null>(null);
  const [status, setStatus] = useState<"saved" | "login" | "invalid" | "unavailable">();
  const [pending, startTransition] = useTransition();

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = wish.trim();
    if (!body || pending || composing.current) return;
    if (submission.current?.body !== body) submission.current = { body, id: crypto.randomUUID() };
    const { id } = submission.current;
    startTransition(async () => {
      try {
        const result = await saveAppleTreeMessage(id, body);
        setStatus(result);
        if (result === "saved") {
          setWish("");
          submission.current = null;
        }
      } catch {
        setStatus("unavailable");
      }
    });
  }
  const placeholder = t({ zh: "写下我的心声", en: "Write what’s on my heart" });

  return (
    <section aria-labelledby="apple-tree-title" className="py-6 sm:py-10">
      <div className="relative">
        <Image
          src="/appletree.png"
          data-brand-art
          alt={t({
            zh: "星空湖畔两棵挂满心愿卡的苹果树",
            en: "Two apple trees filled with wish cards beside a starlit lake",
          })}
          width={1755}
          height={896}
          sizes="(max-width: 1280px) 100vw, 1280px"
          priority
          className="block h-auto w-full rounded-[var(--radius-md)]"
        />
        <header className="pointer-events-none absolute inset-x-0 top-1/4 -translate-y-1/2 px-3 text-center text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
          <h1 id="apple-tree-title" className="text-base font-semibold leading-tight text-white min-[360px]:text-lg sm:text-3xl lg:text-4xl">
            {t({ zh: "种下我的苹果树", en: "Plant My Apple Tree" })}
          </h1>
          <p className="mt-1 text-[10px] leading-snug text-white/95 min-[360px]:text-xs sm:mt-2 sm:text-base">
            {t({ zh: "让每一份心声，都在星光下生根。", en: "Let every heartfelt word take root beneath the stars." })}
          </p>
        </header>
      </div>
      <div className="mx-auto mt-7 max-w-3xl space-y-3 px-1 text-center sm:mt-10">
        <h2 className="text-xl font-semibold text-[var(--heading)] sm:text-2xl">
          {t({ zh: "种下一棵属于自己的苹果树", en: "Plant an apple tree of your own" })}
        </h2>
        <p className="leading-7 text-[var(--text-soft)]">
          {t({
            zh: "在这里，你可以写下心中最真实的感受--悲伤，欢乐，遗憾，心愿，目标，没有说出口的话，祝福，祈愿，道歉，或给我的建议。。。。。。",
            en: "Here, you can write what’s truly in your heart, whether it’s sorrow, joy, regret, a wish, a goal, words left unsaid, a blessing, a prayer, an apology, or something you’d like to suggest to me.",
          })}
        </p>
        <p className="leading-7 text-[var(--text-soft)]">
          {t({
            zh: "让每一份心声，都化作一颗星光苹果，在星辰之巢中生根，开花，结果。",
            en: "Let every heartfelt word become a starlit apple, taking root, blossoming, and bearing fruit in Stellarnests.",
          })}
        </p>
      </div>
      <form id="write-apple-message" onSubmit={save} className="mx-auto mt-6 flex w-full scroll-mt-24 justify-center sm:mt-8">
        <div className="w-full max-w-3xl rounded-xl border border-white/40 bg-slate-950/45 px-3 py-2 shadow-xl backdrop-blur-md transition-colors focus-within:border-white/75 sm:px-5 sm:py-4">
          <textarea
            aria-label={placeholder}
            aria-describedby="apple-wish-limit"
            placeholder={placeholder}
            rows={3}
            maxLength={4000}
            disabled={pending}
            value={wish}
            onCompositionStart={() => { composing.current = true; }}
            onCompositionEnd={(event) => {
              composing.current = false;
              setWish(limitWish(event.currentTarget.value).value);
            }}
            onChange={(event) => {
              const value = event.target.value;
              setWish(composing.current ? value : limitWish(value).value);
            }}
            className="block w-full resize-none rounded-md bg-transparent px-1 py-0.5 text-base text-white outline-none placeholder:text-white/80 sm:text-lg"
          />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <Button type="submit" size="sm" disabled={pending || !wish.trim()}>
              {pending ? t({ zh: "保存中…", en: "Saving…" }) : t({ zh: "保存我的心声", en: "Save my message" })}
            </Button>
            <p id="apple-wish-limit" className="text-right text-xs tabular-nums text-white/85">
              <span className="sr-only">{t({ zh: "最多 100 个中文字或 100 个英文单词。", en: "Up to 100 Chinese characters or 100 English words." })}</span>
              {limitWish(wish).count} / {wishLimit}
            </p>
          </div>
          {status && (
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white">
              <p role="status">{t({
                saved: { zh: "心声已保存到我的星巢。", en: "Your message is saved in My Account." },
                login: { zh: "登录后即可保存自己的心声。", en: "Sign in to save your message." },
                invalid: { zh: "请检查心声的长度后重试。", en: "Check the length of your message and try again." },
                unavailable: { zh: "暂时无法保存，心声仍留在输入框里。", en: "Saving is unavailable. Your message is still in the field." },
              }[status])}</p>
              {status === "saved" && <ButtonLink href="/account#my-apple-tree" size="sm">{t({ zh: "查看我的心声", en: "View my messages" })}</ButtonLink>}
              {status === "login" && <ButtonLink href="/login?next=%2Fapple-tree%23write-apple-message" size="sm">{t({ zh: "登录账户", en: "Sign in" })}</ButtonLink>}
            </div>
          )}
        </div>
      </form>
      <div aria-hidden="true" data-wish-card-grid className="mt-8 grid grid-cols-8 gap-1 sm:mt-10 sm:gap-3">
        {Array.from({ length: 24 }, (_, index) => (
          <Image
            key={index}
            src="/apple-wish-card.png"
            alt=""
            width={1196}
            height={1315}
            sizes="(max-width: 1439px) 12vw, 165px"
            className="block h-auto w-full"
          />
        ))}
      </div>
    </section>
  );
}
