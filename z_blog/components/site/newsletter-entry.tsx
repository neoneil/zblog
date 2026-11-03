"use client";

import Image from "next/image";
import { usePreferences } from "./preferences-provider";
import { Card, CardContent } from "@/components/ui/card";
import NewsletterForm from "./newsletter-form";
import styles from "@/features/thoth/components/knowledge-entries.module.css";

export default function NewsletterEntry() {
  const { t } = usePreferences();
  return <Card className={styles.card}>
    <div className={styles.media}>
      <Image src="/knowledge/letters-from-the-stars.png" alt="" fill sizes="(max-width: 639px) 100vw, 672px" className={styles.image} />
    </div>
    <CardContent className={styles.copy}>
      <h2 className="text-xl font-semibold text-[var(--heading)]">{t({ en: "NEWSLETTER", zh: "星辰来信" })}</h2>
      <p>{t({ zh: "订阅宇宙的低语，开启属于你的灵魂探索之旅。", en: "Receive celestial insights and begin your journey of self-discovery." })}</p>
      <NewsletterForm />
    </CardContent>
  </Card>;
}
