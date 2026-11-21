"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen, Globe, Hash, Heart, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { usePreferences, type LocalizedCopy } from "./preferences-provider";
import archiveStyles from "@/features/thoth/components/knowledge-entries.module.css";
import { ReflectionEntry } from "./categories-section";
import styles from "./home-tool-sections.module.css";

type Entry = {
  title: LocalizedCopy;
  description: LocalizedCopy;
  href: string;
  icon: typeof Sparkles;
  guide?: string;
  image?: string;
};
import { tarotCollections, tarotSectionCopy } from '@/features/tarot/lib/entry-catalog';
const calculatorEntries: Entry[] = [
  {
    title: { en: "NATAL CHART", zh: "本命星图" },
    description: {
      en: "Explore Your Key Planets, Houses, and Cosmic Rhythms — Discover a Clearer Path to Self-Understanding.",
      zh: "探索核心星体、宫位与宇宙能量节奏，开启更清晰的自我认知之旅。",
    },
    href: "/astroplate",
    icon: Globe,
    image: "/knowledge/benmingxingtu.png",
  },
  {
    title: { en: "SYNASTRY", zh: "双人合盘" },
    description: {
      en: "Explore Two Birth Charts — Discover Emotional Patterns and Cosmic Connections in Love, Business, Family, Friendship, and Work.",
      zh: "探索双人星盘，解读情感模式与星象连接，发现恋爱、商业合作、亲子、友谊及职场关系中的互动奥秘。",
    },
    href: "/synastry",
    icon: Heart,
    image: "/knowledge/shuangrenhepan.png",
  },
  {
    title: { en: "STELLAR BIRTH CHART", zh: "星辰命盘" },
    description: {
      en: "Explore Your Natal Planets, Houses, and Aspects — Deepen Your Cosmic Understanding with Our Birth Chart Guide.",
      zh: "探索本命行星、宫位与相位，结合星盘指南，深入理解属于你的星辰密码。",
    },
    href: "/stella",
    guide: "/stella/birth-chart",
    icon: Globe,
    image: "/knowledge/xingchenmingpan.png",
  },
  {
    title: { en: "NUMEROLOGY", zh: "生命灵数" },
    description: {
      en: "Explore the Numbers Hidden in Your Birth Date — Discover Personal Insights and the Secrets of Your Life Path.",
      zh: "探索出生日期中隐藏的生命数字，发现个人特质与人生轨迹的神秘线索。",
    },
    href: "/stella/numerology",
    icon: Hash,
    image: "/knowledge/shengminglingshu.png",
  },
];

function EntryCard({ entry }: { entry: Entry }) {
  const { t } = usePreferences(),
    Icon = entry.icon;
  return (
    <Card className={styles.entry}>
      <CardContent className={styles.entryContent}>
        <Icon size={24} aria-hidden />
        <h3>{t(entry.title)}</h3>
        <p>{t(entry.description)}</p>
        <div className={styles.actions}>
          <ButtonLink href={entry.href} variant="secondary" size="sm">
            {t({ en: "Open", zh: "进入" })}
          </ButtonLink>
          {entry.guide && (
            <Link href={entry.guide}>
              {t({ en: "Chart Guide", zh: "星盘指南" })}
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
export function TarotCollection({ kind }: { kind: keyof typeof tarotCollections }) {
  const { t, language } = usePreferences();
  const collection = tarotCollections[kind];
  return (
    <section className={styles.section} id={`tarot-${kind}-collection`}>
      <header>
        <h1 className={styles.goldHeading}>{t(collection.title)}</h1>
        <div className={`${archiveStyles.subtitle} mt-3`}>{t(tarotSectionCopy.description)}</div>
      </header>
      <div className={`${archiveStyles.grid} ${styles.collectionGrid}`}>
        {collection.entries.map((entry) => <Link key={entry.href} href={entry.href === "/thoth-tarot/readings" ? `${entry.href}?lang=${language}` : entry.href} className="group block h-full" data-tarot-entry={entry.href}>
          <Card className={`${archiveStyles.card} transition-colors group-hover:border-[var(--primary)]`}>
            <div className={archiveStyles.media}><Image src={entry.image!} alt="" fill sizes="(max-width: 1023px) 100vw, 25vw" className={archiveStyles.image} /></div>
            <CardContent className={archiveStyles.copy}>
              <h3 className="break-words text-lg font-semibold">{t(entry.title)}</h3>
              <p className="flex-1 text-base leading-7 sm:text-lg sm:leading-8">{t(entry.description)}</p>
              <span className="text-sm font-medium">{t({ zh: "进入", en: "Explore" })} →</span>
            </CardContent>
          </Card>
        </Link>)}
      </div>
    </section>
  );
}
export function CalculatorsHomeSection() {
  const { t } = usePreferences();
  return (
    <section className={styles.section} id="home-calculators">
      <header>
        <h2 className={styles.goldHeading}>
          {t({ en: "COSMIC BLUEPRINTS", zh: "星图与命数" })}
        </h2>
        <div className={`${archiveStyles.subtitle} mt-3`}>{t({ en: "Discover the patterns written in your stars and numbers.", zh: "星辰记录诞生的瞬间，数字映照生命的轨迹。" })}</div>
      </header>
      <div className={archiveStyles.grid}>
        {calculatorEntries.map((entry) => (
          <Card key={entry.href} className={`${archiveStyles.card} transition-colors hover:border-[var(--primary)]`}>
            <Link href={entry.href} className={archiveStyles.media} aria-label={t(entry.title)}><Image src={entry.image!} alt="" fill sizes="(max-width: 1023px) 100vw, 25vw" className={archiveStyles.image} /></Link>
            <CardContent className={archiveStyles.copy}>
              <h3 className="break-words text-lg font-semibold"><Link href={entry.href}>{t(entry.title)}</Link></h3>
              <p className="flex-1 text-base leading-7 sm:text-lg sm:leading-8">{t(entry.description)}</p>
              <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-[var(--archive-heading)]">
                <Link href={entry.href}>{t({ zh: "进入", en: "Explore" })} →</Link>
                {entry.guide && <Link href={entry.guide}>{t({ zh: "星盘指南", en: "Chart Guide" })}</Link>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
export function ExistingAdditionalEntries() {
  const { t } = usePreferences();
  return (
    <section className={styles.section} id="home-additional">
      <header>
        <h2>{t({ en: "More from the Collection", zh: "更多阅读" })}</h2>
      </header>
      <div className={styles.additionalGrid}>
        <EntryCard
          entry={{
            title: { en: "Tarot Library", zh: "塔罗牌库" },
            description: {
              en: "The symbolism, meanings and stories of 78 tarot cards.",
              zh: "78张塔罗牌的象征、牌义与解读线索。",
            },
            href: "/tarot",
            icon: BookOpen,
          }}
        />
        <ReflectionEntry />
      </div>
    </section>
  );
}
