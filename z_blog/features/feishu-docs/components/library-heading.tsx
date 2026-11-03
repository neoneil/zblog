"use client";
import { usePreferences } from "@/components/site/preferences-provider";
import styles from "@/features/thoth/components/knowledge-entries.module.css";
export function FeishuLibraryHeading() {
  const { t } = usePreferences();
  return <header className="py-8 sm:py-12">
    <h1 className="text-3xl font-semibold text-[var(--heading)] sm:text-4xl">{t({ en: "RIDER–WAITE LIBRARY", zh: "韦特秘典" })}</h1>
    <p className={`${styles.subtitle} mt-4 max-w-3xl`}>{t({ en: "Explore All 78 Tarot Cards — Discover Their Imagery, Decode Hidden Symbols, Learn Through Real Examples, and Master Practical Readings.", zh: "探索韦特塔罗78张牌的画面奥秘，解读隐藏符号，结合真实案例，掌握实战占卜技巧。" })}</p>
  </header>;
}
