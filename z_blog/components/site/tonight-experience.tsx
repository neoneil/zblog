"use client";

import Image from "next/image";
import { usePreferences } from "@/components/site/preferences-provider";
import { Button, ButtonLink } from "@/components/ui/button";
import styles from "./tonight-experience.module.css";

export default function TonightExperience() {
  const { t } = usePreferences();
  return (
    <section aria-labelledby="tonight-title" className="py-6 sm:py-10">
      <h1 id="tonight-title" className="sr-only">
        {t({ zh: "今夜星辰想对你说", en: "Tonight, the Stars Speak" })}
      </h1>
      <div className={styles.artwork}>
        <Image
        src="/tonight.png"
        data-brand-art
        alt={t({ zh: "月光、银河与湖畔的苹果", en: "Moonlight, the Milky Way, and apples beside the lake" })}
        width={2103}
        height={748}
        sizes="(max-width: 1280px) 100vw, 1280px"
        priority
        className="block h-auto w-full rounded-[var(--radius-md)]"
      />
        <div className={styles.actions}>
          <ButtonLink href="/tonight/star-message" variant="secondary">
            {t({ zh: "阅读今夜的星语", en: "Read Tonight's Star Message" })}
          </ButtonLink>
          <Button variant="secondary" disabled>
            {t({ zh: "抽取一张反思卡", en: "Draw a Reflection Card" })}
          </Button>
        </div>
      </div>
    </section>
  );
}
