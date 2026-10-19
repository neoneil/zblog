"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "@/components/site/container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePreferences } from "@/components/site/preferences-provider";
import { tarotModeOrder, tarotModes } from "@/lib/tarot/reading-modes";
import styles from "./tarot-overview.module.css";

export default function TarotOverview() {
  const { t } = usePreferences();
  return <main className={styles.overview}>
    <Container>
      <header className={styles.heading}>
        <Link href="/parentinglab">{t({ zh: "亲子实验室", en: "Parenting Lab" })}</Link>
        <h1>Ask Tarot <span lang="zh-CN">问问塔罗</span></h1>
        <p>{t({ zh: "此刻，你想探索什么？", en: "What would you like to explore today?" })}</p>
      </header>
      <section className={styles.grid} aria-label={t({ zh: "选择塔罗牌阵", en: "Choose a tarot reading" })}>
        {tarotModeOrder.map(mode => {
          const config = tarotModes[mode];
          return <Link key={mode} href={config.href} className={styles.modeLink}>
            <Card className={styles.modeCard}>
              <div className={styles.art}>
                <Image src={encodeURI(config.image)} alt={`${config.title.zh} / ${config.title.en}`} fill
                  sizes="(min-width: 1024px) 220px, 180px" className={styles.image} />
              </div>
              <CardContent className={styles.details}>
                <Badge variant="secondary">{config.positions.length} {t({ zh: "张牌", en: config.positions.length === 1 ? "card" : "cards" })}</Badge>
                <h2>{config.title.en}<span lang="zh-CN">{config.title.zh}</span></h2>
                <p>{t(config.description)}</p>
                <span className={styles.begin}>{t({ zh: "开始抽牌", en: "Begin reading" })} →</span>
              </CardContent>
            </Card>
          </Link>;
        })}
      </section>
    </Container>
  </main>;
}
