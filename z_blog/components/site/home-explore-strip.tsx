"use client";

import Link from "next/link";
import {
  Circle,
  LockKeyhole,
  ShoppingBag,
  Sparkle,
  Star,
  TreeDeciduous,
  UsersRound,
} from "lucide-react";
import { usePreferences } from "./preferences-provider";
import styles from "./home-explore-strip.module.css";

const entries = [
  {
    id: "archive",
    href: "/esoteric-archive",
    title: { zh: "秘学之源", en: "Esoteric Archive" },
    subtitle: { zh: "探索智慧的起点", en: "Where wisdom begins" },
  },
  {
    id: "celestial",
    href: "/categories/understanding-children",
    title: { zh: "星象与天机", en: "Celestial Insights" },
    subtitle: {
      zh: "行星流转 · 宇宙节律",
      en: "Planetary paths · Cosmic rhythms",
    },
  },
  {
    id: "cinema",
    href: "/parentinglab/healingdaily/videos?category=general",
    title: { zh: "星学影院", en: "Stellar Cinema" },
    subtitle: {
      zh: "神秘影像 · 系统教学",
      en: "Mystic films · Guided learning",
    },
  },
  {
    id: "community",
    href: "/community",
    title: { zh: "星魂社区", en: "Stellar Community" },
    subtitle: { zh: "你的星辰同行", en: "Your companions among the stars" },
  },
  {
    id: "shop",
    href: "/services",
    title: { zh: "奥秘商店", en: "Mystic Shop" },
    subtitle: {
      zh: "课程 · 解读 · 魔法珍藏",
      en: "Courses · Readings · Treasures",
    },
  },
] as const;

function EntryIcon({ id }: { id: (typeof entries)[number]["id"] }) {
  if (id === "archive")
    return <TreeDeciduous strokeWidth={1.25} className={styles.tree} />;
  if (id === "celestial")
    return (
      <span className={styles.planet}>
        <Circle strokeWidth={1.1} />
        <span className={styles.planetRing} />
        <span className={styles.planetRingOuter} />
      </span>
    );
  if (id === "cinema")
    return (
      <span className={styles.reel}>
        <Circle strokeWidth={1.3} />
        {[0, 1, 2, 3, 4].map((index) => (
          <span
            key={index}
            className={styles.reelSpoke}
            style={{ transform: `rotate(${index * 72}deg)` }}
          >
            <Circle strokeWidth={2} />
          </span>
        ))}
        <Circle strokeWidth={2} className={styles.reelCenter} />
      </span>
    );
  if (id === "community")
    return (
      <span className={styles.community}>
        <UsersRound strokeWidth={1.25} />
        <LockKeyhole strokeWidth={1.6} className={styles.keyhole} />
      </span>
    );
  return (
    <span className={styles.shop}>
      <ShoppingBag strokeWidth={1.25} />
      <Star strokeWidth={1.2} className={styles.shopStar} />
    </span>
  );
}

export default function HomeExploreStrip() {
  const { t, language } = usePreferences();
  return (
    <section
      id="home-explore"
      className={styles.section}
      data-language={language}
      aria-label={t({ zh: "探索星辰之巢", en: "Explore Stellarnests" })}
    >
      <ul className={styles.entries}>
        {entries.map((entry) => (
          <li key={entry.id} className={styles.entry}>
            <Link href={entry.href} className={styles.entryLink}>
              <div className={styles.icon} aria-hidden="true">
                <EntryIcon id={entry.id} />
              </div>
              <h2 className={styles.title}>{t(entry.title)}</h2>
              <p className={styles.subtitle}>{t(entry.subtitle)}</p>
            </Link>
          </li>
        ))}
      </ul>
      <Sparkle
        aria-hidden="true"
        className={styles.sparkle}
        strokeWidth={1.25}
      />
    </section>
  );
}
