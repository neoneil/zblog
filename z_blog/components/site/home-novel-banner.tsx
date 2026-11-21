"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { usePreferences } from "./preferences-provider";
import styles from "./home-novel-banner.module.css";

export default function HomeNovelBanner() {
  const { t } = usePreferences();
  return (
    <section id="home-novel-banner" className={styles.section} aria-labelledby="home-novel-banner-title">
      <div className={styles.artwork}>
        <Image
          src="/novel/forbidden-apple-banner-champagne.png"
          alt={t({ zh: "白雪公主与银发男子之间，一颗禁果映照命运", en: "Snow White and a silver-haired man face a forbidden apple" })}
          width={2170}
          height={725}
          sizes="(max-width: 1440px) 100vw, 1312px"
          className={styles.image}
        />
      </div>
      <div className={styles.copy}>
        <h2 id="home-novel-banner-title" className={styles.title}>
          {t({ zh: "死神禁果", en: "Death's Forbidden Apple" })}
        </h2>
        <p className={styles.subtitle}>{t({ zh: "诸神的审判", en: "Judgment of the Gods" })}</p>
        <p className={styles.description}>{t({ zh: "原创奇幻小说 · 正在连载", en: "An original fantasy · Read the ongoing story" })}</p>
        <ButtonLink href="/tarot-novel" className={styles.action}>
          {t({ zh: "立即阅读", en: "Read the story" })}<ArrowRight size={16} aria-hidden />
        </ButtonLink>
      </div>
    </section>
  );
}
