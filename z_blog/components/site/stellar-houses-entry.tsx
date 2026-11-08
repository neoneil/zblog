"use client";

import Image from "next/image";
import Link from "next/link";
import { usePreferences } from "@/components/site/preferences-provider";
import { Card, CardContent } from "@/components/ui/card";
import styles from "@/features/thoth/components/knowledge-entries.module.css";

export default function StellarHousesEntry() {
  const { t } = usePreferences();
  return (
    <section id="home-stellar-houses" className="grid gap-6 py-8 sm:py-10 lg:grid-cols-2">
      <Link href="/community" className="group block">
      <Card className={`${styles.card} group-hover:border-[var(--primary)] group-hover:shadow-[0_0_20px_var(--button-glow)]`}>
        <div className={styles.media}>
          <Image
            src="/knowledge/stellar-houses.png"
            alt={t({ en: "Twelve zodiac guardians surrounding a celestial castle", zh: "十二星座守护者环绕星辰城堡" })}
            fill
            sizes="(max-width: 1023px) 100vw, 640px"
            className={styles.image}
          />
        </div>
        <CardContent className={styles.copy}>
          <h2 className="text-xl font-semibold text-[var(--heading)]">
            {t({ en: "STELLAR COMMUNITY", zh: "星辰社区" })}
          </h2>
          <p>{t({ en: "Your Sign. Your Guardian. Your People.", zh: "你的星座，你的守护者，你的星辰同伴。" })}</p>
        </CardContent>
      </Card>
      </Link>
    </section>
  );
}
