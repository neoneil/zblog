"use client";

import { usePreferences } from "@/components/site/preferences-provider";
import { Button, ButtonLink } from "@/components/ui/button";
import styles from "./home-hero.module.css";

const actions = [
  { en: "STARDUST STORIES", zh: "星尘物语", href: "/tarot-novel" },
  { en: "STELLAR BIRTH CHART", zh: "星辰命盘" },
  { en: "RIDER–WAITE READING", zh: "韦特占卜" },
  { en: "MEMBERSHIP", zh: "成为会员" },
  { en: "CHART CONSULTATION", zh: "星盘咨询" },
  { en: "TAROT CONSULTATION", zh: "塔罗咨询" },
];

export default function HomeHeroActions() {
  const { t } = usePreferences();

  return (
    <div className={styles.actions}>
      {actions.map((action) => (
        action.href ? (
          <ButtonLink key={action.en} href={action.href} variant="hero" size="lg">
            {t(action)}
          </ButtonLink>
        ) : (
        <Button
          key={action.en}
          type="button"
          variant="hero"
          size="lg"
          disabled
          title={t({ en: "Link coming soon", zh: "链接待设置" })}
        >
          {t(action)}
        </Button>
        )
      ))}
    </div>
  );
}
