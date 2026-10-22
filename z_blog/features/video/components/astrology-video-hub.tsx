"use client";

import Image from "next/image";
import { ArrowRight, ExternalLink, Film, Play, Clapperboard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { usePreferences } from "@/components/site/preferences-provider";

const modules = [
  {
    id: "channel", icon: Play, image: "/NEW CARDS/The Sun.png",
    alt: { zh: "太阳牌插画", en: "The Sun tarot illustration" },
    category: "STELLARNESTS",
    title: { zh: "星空下的频道", en: "A Channel Under the Stars" },
    description: { zh: "走进 Stellarnests 的 YouTube 频道，跟随影像探索占星、星空与内在世界。", en: "Visit Stellarnests on YouTube and explore astrology, the sky and the inner world through video." },
    action: { zh: "前往 YouTube 频道", en: "Visit YouTube Channel" },
    href: "https://www.youtube.com/@Stellarnests", external: true,
  },
  {
    id: "stories", icon: Film, image: "/NEW CARDS/The Moon.png",
    alt: { zh: "月亮牌插画", en: "The Moon tarot illustration" },
    category: "ASTROLOGY STORIES",
    title: { zh: "星象与故事", en: "Stars & Stories" },
    description: { zh: "从星象与塔罗的象征出发，进入小说影像，让故事成为理解命运与自我的另一种视角。", en: "Explore novel videos inspired by astrology and tarot symbolism, where stories offer another perspective on fate and the self." },
    action: { zh: "探索小说视频", en: "Explore Novel Videos" },
    href: "/tarot-novel", external: false,
  },
  {
    id: "originals", icon: Clapperboard, image: "/NEW CARDS/The Star.png",
    alt: { zh: "星星牌插画", en: "The Star tarot illustration" },
    category: "ORIGINAL FILMS",
    title: { zh: "原创占星影像", en: "Original Astrology Films" },
    description: { zh: "为星象、灵感与个人表达留下一处空间。原创视频正在构思中，未来将在这里与你相见。", en: "A space for the stars, inspiration and personal expression. Original videos are taking shape and will find their home here." },
    action: { zh: "筹备中", en: "In Development" },
  },
] as const;

export default function AstrologyVideoHub() {
  const { t } = usePreferences();
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text-soft)]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <header className="mb-10 max-w-2xl">
          <p className="mb-3 text-xs font-semibold text-[var(--primary)]">STELLARNESTS · {t({ zh: "占星影像", en: "ASTROLOGY IN MOTION" })}</p>
          <h1 className="text-3xl leading-tight text-[var(--heading)] sm:text-4xl">{t({ zh: "星空、故事与影像", en: "Stars, Stories & Film" })}</h1>
          <p className="mt-4 text-base leading-7">{t({ zh: "循着星光，探索频道里的灵感、故事里的象征，以及正在诞生的原创影像。", en: "Follow the stars through channel discoveries, symbolic stories and original films in the making." })}</p>
        </header>
        <div className="divide-y divide-[var(--border)]">
          {modules.map((item, index) => {
            const Icon = item.icon;
            return (
              <section key={item.id} aria-labelledby={item.id} className="grid gap-6 py-8 first:pt-0 sm:py-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:items-center md:gap-12">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card)]">
                  <Image src={item.image} alt={t(item.alt)} fill sizes="(min-width: 768px) 480px, 100vw" className="object-contain p-4" priority={index === 0} />
                </div>
                <div className="min-w-0">
                  <p className="mb-3 flex items-center gap-2 text-xs text-[var(--primary)]"><Icon size={18} aria-hidden="true" />{item.category}</p>
                  <h2 id={item.id} className="text-2xl leading-snug text-[var(--heading)]">{t(item.title)}</h2>
                  <p className="mt-4 text-base leading-7">{t(item.description)}</p>
                  <div className="mt-6">
                    {"href" in item ? (
                      <ButtonLink href={item.href} target={item.external ? "_blank" : undefined} rel={item.external ? "noopener noreferrer" : undefined} className="max-w-full gap-2 whitespace-normal">
                        {t(item.action)}
                        {item.external ? <ExternalLink size={16} className="shrink-0" aria-hidden="true" /> : <ArrowRight size={16} className="shrink-0" aria-hidden="true" />}
                      </ButtonLink>
                    ) : <Badge variant="outline">{t(item.action)}</Badge>}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
