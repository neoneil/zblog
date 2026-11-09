"use client";

import { usePreferences } from "@/components/site/preferences-provider";
import { ButtonLink } from "@/components/ui/button";
import glassStyles from "@/components/ui/glass-action.module.css";
import styles from "./home-hero.module.css";

const actions = [
  { en: "STARDUST STORIES", zh: "星尘物语", href: "/tarot-novel" },
  { en: "STELLAR BIRTH CHART", zh: "星辰命盘", href: "/stella" },
  { en: "RIDER–WAITE READING", zh: "韦特占卜", href: "/tarot-ai" },
  { en: "MEMBERSHIP", zh: "成为会员", href: "/pricing" },
  { en: "CHART CONSULTATION", zh: "星盘咨询", href: "/services/natal-chart-interpretation-masterclass" },
  { en: "TAROT CONSULTATION", zh: "塔罗咨询", href: "/services/tarot-reading" },
];

export default function HomeHeroActions() {
  const { t } = usePreferences();

  return (
    <div className={styles.actions}>
      {actions.map((action) => (
        <ButtonLink key={action.en} href={action.href} variant="ghost" size="lg" className={glassStyles.action}>
          {t(action)}
        </ButtonLink>
      ))}
    </div>
  );
}
