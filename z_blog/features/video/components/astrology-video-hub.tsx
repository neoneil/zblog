"use client";

import Image from "next/image";
import { ArrowRight, ExternalLink, Film, Play, Clapperboard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { usePreferences } from "@/components/site/preferences-provider";
import archiveStyles from "@/features/thoth/components/knowledge-entries.module.css";

const modules = [
  {
    id: "channel", icon: Play, image: "/video-hub/xingchenyingyuan01.png",
    alt: { zh: "Stellarnests YouTube 频道", en: "Stellarnests YouTube channel" },
    category: "STELLARNESTS",
    title: { zh: "星空下的频道", en: "A CHANNEL UNDER THE STARS" },
    description: { zh: "走进 Stellarnests 的 YouTube 频道，跟随影像探索占星、星空与内在世界。", en: "Visit Stellarnests on YouTube and explore astrology, the sky and the inner world through video." },
    action: { zh: "前往 YouTube 频道", en: "Visit YouTube Channel" },
    href: "https://www.youtube.com/@Stellarnests", external: true,
  },
  {
    id: "stories", icon: Film, image: "/video-hub/xingchenyingyuan02.png",
    alt: { zh: "让我们再死一次小说影像", en: "Let Us Die Once More story videos" },
    category: "ASTROLOGY STORIES",
    title: { zh: "星尘物语", en: "STARDUST STORIES" },
    description: { zh: "从星象与塔罗的象征出发，进入小说影像，让故事成为理解命运与自我的另一种视角。", en: "Explore novel videos inspired by astrology and tarot symbolism, where stories offer another perspective on fate and the self." },
    action: { zh: "探索小说视频", en: "Explore Novel Videos" },
    href: "/tarot-novel", external: false,
  },
  {
    id: "waite-course", icon: Clapperboard, image: "/video-hub/xingxueyingyuan03.png",
    alt: { zh: "韦特塔罗课程", en: "Rider–Waite tarot course" },
    category: "RIDER–WAITE TAROT",
    title: { zh: "韦特塔罗课程", en: "Rider–Waite Tarot Course" },
    description: { zh: "探索韦特塔罗牌面、象征与解读方法。", en: "Explore Rider–Waite tarot imagery, symbolism and reading methods." },
    action: { zh: "筹备中", en: "In Development" },
  },
  {
    id: "thoth-course", icon: Clapperboard, image: "/video-hub/xingchenyingyuan04.png",
    alt: { zh: "透特塔罗课程", en: "Thoth tarot course" },
    category: "THOTH TAROT",
    title: { zh: "透特塔罗课程", en: "Thoth Tarot Course" },
    description: { zh: "探索透特塔罗的牌义、生命之树与秘学象征。", en: "Explore Thoth tarot meanings, the Tree of Life and esoteric symbolism." },
    action: { zh: "筹备中", en: "In Development" },
  },
  {
    id: "astrology-course", icon: Clapperboard, image: "/video-hub/xingchenyingyuan05.png",
    alt: { zh: "占星术课程", en: "Astrology course" },
    category: "ASTROLOGY",
    title: { zh: "占星术课程", en: "Astrology Course" },
    description: { zh: "从星座、行星与宫位出发，学习本命盘与行运的解读。", en: "Study signs, planets and houses, and explore natal charts and transits." },
    action: { zh: "筹备中", en: "In Development" },
  },
] as const;

export default function AstrologyVideoHub() {
  const { t } = usePreferences();
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text-soft)]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <header className="mb-10 max-w-2xl">
          <h1 className="text-3xl font-semibold leading-tight text-[var(--archive-heading)] sm:text-4xl">{t({ zh: "星学影苑", en: "LEARNING VIDEOS" })}</h1>
          <p className={`${archiveStyles.subtitle} mt-3`}>{t({ zh: "探索塔罗与占星课程，沉浸于星尘原创故事，在精彩影像中开启神秘学智慧之旅。", en: "Explore Tarot and Astrology Courses, Immerse Yourself in Stardust Stories, and Discover Ancient Wisdom Through Inspiring Videos." })}</p>
        </header>
        <div className="divide-y divide-[var(--border)]">
          {modules.map((item, index) => {
            return (
              <section key={item.id} aria-labelledby={item.id} className="grid gap-6 py-8 first:pt-0 sm:py-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:items-center md:gap-12">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card)]">
                  <Image src={item.image} alt={t(item.alt)} fill sizes="(min-width: 768px) 480px, 100vw" className="object-contain" priority={index === 0} />
                </div>
                <div className="min-w-0">
                  <h2 id={item.id} className="text-2xl leading-snug text-[var(--heading)]">{t(item.title)}</h2>
                  <p className={`${archiveStyles.subtitle} mt-4`}>{t(item.description)}</p>
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
