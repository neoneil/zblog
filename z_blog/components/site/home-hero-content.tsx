"use client";

import { usePreferences } from "@/components/site/preferences-provider";
import { ButtonLink } from "@/components/ui/button";
import styles from "./home-hero-entry.module.css";

export default function HomeHeroContent() {
  const { t } = usePreferences();

  return (
    <div className={styles.content}>
      <h1 className={styles.title}>
        {t({ en: "STELLARNESTC", zh: "星辰之巢" })}
      </h1>
      <p className={styles.motto}>
        {t({ en: "AMIDST CHAOS, ALWAYS CENTERED", zh: "在混沌之中，始终回归中心" })}
      </p>
      <div className={styles.actions}>
        <ButtonLink href="/tonight" variant="secondary">
          {t({ zh: "今夜星辰想对你说", en: "Tonight, the Stars Speak" })}
        </ButtonLink>
        <ButtonLink href="/apple-tree" variant="secondary">
          {t({ zh: "种下我的苹果树", en: "Plant My Apple Tree" })}
        </ButtonLink>
      </div>
    </div>
  );
}
