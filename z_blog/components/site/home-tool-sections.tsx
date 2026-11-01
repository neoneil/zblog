"use client";

import Link from "next/link";
import { BookOpen, Globe, Hash, Heart, Layers, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { usePreferences, type LocalizedCopy } from "./preferences-provider";
import Circle from "@/components/Circle";
import Astroplate from "@/components/Astroplate";
import { ReflectionEntry } from "./categories-section";
import styles from "./home-tool-sections.module.css";

type Entry = {
  title: LocalizedCopy;
  description: LocalizedCopy;
  href: string;
  icon: typeof Sparkles;
  guide?: string;
};
const tarotEntries: Entry[] = [
  {
    title: { en: "Rider–Waite Reading", zh: "韦特塔罗占卜" },
    description: {
      en: "A reflective reading for questions, relationships and choices.",
      zh: "在牌面之间梳理问题、关系与当下的选择。",
    },
    href: "/tarot-ai",
    icon: Sparkles,
  },
  {
    title: { en: "Waite Knowledge Base", zh: "韦特飞书知识库" },
    description: {
      en: "Card meanings, symbolism and a foundation for reflective study.",
      zh: "牌义、象征与塔罗学习的知识基础。",
    },
    href: "/feishu-docs",
    icon: BookOpen,
  },
  {
    title: { en: "Thoth Card Guide", zh: "透特牌解释" },
    description: {
      en: "The symbols, archetypes and meanings of the Thoth deck.",
      zh: "透特塔罗的象征、原型与牌面含义。",
    },
    href: "/thoth-tarot",
    icon: Layers,
  },
];
const calculatorEntries: Entry[] = [
  {
    title: { en: "Synastry", zh: "双人合盘" },
    description: {
      en: "Two birth charts, emotional patterns and relationship connections.",
      zh: "从两个人的星盘出发，观察情感模式与关系连接。",
    },
    href: "/synastry",
    icon: Heart,
  },
  {
    title: { en: "Stellar Birth Chart", zh: "Stellar 出生星盘" },
    description: {
      en: "Natal planets, houses and aspects, with a companion chart guide.",
      zh: "观察本命行星、宫位与相位，结合星盘指南加深理解。",
    },
    href: "/stella",
    guide: "/stella/birth-chart",
    icon: Globe,
  },
  {
    title: { en: "Numerology", zh: "生命数字" },
    description: {
      en: "Life-path numbers and the patterns of your birth date.",
      zh: "出生日期中的生命数字与个人线索。",
    },
    href: "/stella/numerology",
    icon: Hash,
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
export function TarotHomeSection() {
  const { t } = usePreferences();
  return (
    <section className={styles.section} id="home-tarot">
      <header>
        <p>{t({ en: "Tarot System", zh: "塔罗系统" })}</p>
        <h2>{t({ en: "Readings & Tarot Knowledge", zh: "塔罗占卜与知识" })}</h2>
      </header>
      <div className={styles.grid}>
        <EntryCard entry={tarotEntries[0]} />
        <EntryCard entry={tarotEntries[1]} />
        <Circle compact />
        <EntryCard entry={tarotEntries[2]} />
      </div>
    </section>
  );
}
export function CalculatorsHomeSection() {
  const { t } = usePreferences();
  return (
    <section className={styles.section} id="home-calculators">
      <header>
        <p>{t({ en: "Personal Calculators", zh: "个人测算" })}</p>
        <h2>
          {t({ en: "Birth Charts & Personal Insights", zh: "星盘与个人探索" })}
        </h2>
      </header>
      <div className={styles.grid}>
        <Astroplate imageSrc="/astroplate3.png" compact />
        {calculatorEntries.map((entry) => (
          <EntryCard entry={entry} key={entry.href} />
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
