"use client";

import Image from "next/image";
import Link from "next/link";
import { usePreferences } from "@/components/site/preferences-provider";
import { Card, CardContent } from "@/components/ui/card";
import styles from "@/features/thoth/components/knowledge-entries.module.css";

export default function StellarHousesEntry() {
  const { t } = usePreferences();
  return (
    <section id="home-stellar-houses" className="flex w-full min-w-0 flex-col py-8 sm:py-10">
      <Link href="/community" className="group block w-full flex-1">
      <Card className={`${styles.card} group-hover:border-[var(--primary)] group-hover:shadow-[0_0_20px_var(--button-glow)]`}>
        <div className={styles.media}>
          <Image
            src="/knowledge/starplate.png"
            alt={t({ en: "A celestial chart of planets and glowing orbital paths", zh: "行星与发光轨道交织的星辰图" })}
            fill
            sizes="(max-width: 1023px) 100vw, 33vw"
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
