"use client";

import { usePreferences } from "@/components/site/preferences-provider";
import HomeHeroActions from "./home-hero-actions";
import styles from "./home-hero.module.css";

export default function HomeHeroContent() {
  const { t } = usePreferences();

  return (
    <div className={styles.content}>
      <p className={styles.eyebrow}>
        {t({ en: "POLARIS · THE GUIDING STAR", zh: "北极星 · 指引之星" })}
      </p>
      <h1 className={styles.title}>
        {t({ en: "STELLARNESTS", zh: "星辰之巢" })}
      </h1>
      <div className={styles.rule} aria-hidden="true" />
      <p className={styles.motto}>
        {t({ en: "Amidst Chaos, Always Centered.", zh: "身处混沌，始终自有中心。" })}
      </p>
      <HomeHeroActions />
    </div>
  );
}
