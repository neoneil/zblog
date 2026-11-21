"use client";

import Image from "next/image";
import { usePreferences } from "@/components/site/preferences-provider";
import { aboutUsContent } from "@/features/contact/aboutus-content";

export default function TonightStarMessage() {
  const { t } = usePreferences();
  const letter = aboutUsContent.letter;
  return (
    <article className="py-6 sm:py-10" aria-labelledby="star-message-title">
      <Image
        src="/tonight-community.png"
        data-brand-art
        alt={t({ zh: "苹果树下，静望星空与湖面的女孩", en: "A girl beneath an apple tree gazing across the lake and stars" })}
        width={1672}
        height={941}
        sizes="(max-width: 1280px) 100vw, 1280px"
        priority
        className="block h-auto w-full rounded-[var(--radius-md)]"
      />
      <div className="mx-auto max-w-3xl py-8 sm:py-12">
        <h1 id="star-message-title" className="mb-8 text-2xl sm:text-3xl">{t(letter.title)}</h1>
        <p className="mb-6 font-bold">{t(letter.salutation)}</p>
        <div className="space-y-6 text-base leading-loose text-[var(--text)]">
          {letter.paragraphs.map((copy, index) => <p key={index}>{t(copy)}</p>)}
        </div>
        <footer className="mt-8 space-y-3">
          <p>{t(letter.signoff)}</p>
          <p className="font-bold">{t(letter.signature)}</p>
        </footer>
      </div>
    </article>
  );
}
