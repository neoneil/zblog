"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { usePreferences } from "./preferences-provider";
import { tarotHomePortals } from "@/features/tarot/lib/home-portals";
import { tarotSectionCopy } from "@/features/tarot/lib/entry-catalog";
import archiveStyles from "@/features/thoth/components/knowledge-entries.module.css";
import styles from "./home-tarot-portals.module.css";

export default function HomeTarotPortals() {
  const { t } = usePreferences();
  return (
    <section
      id="home-tarot"
      className={styles.section}
      aria-labelledby="home-tarot-heading"
    >
      <header className={styles.header}>
        <h2 id="home-tarot-heading" className="text-2xl font-semibold">
          {t(tarotSectionCopy.title)}
        </h2>
        <p className={`${archiveStyles.subtitle} mt-3`}>
          {t(tarotSectionCopy.description)}
        </p>
      </header>
      <div className={styles.grid}>
        {tarotHomePortals.map((entry) => (
          <Link
            key={entry.id}
            href={entry.href}
            className={styles.cardLink}
            data-tarot-portal={entry.id}
            aria-labelledby={`tarot-portal-${entry.id}`}
          >
            <Card className={styles.card}>
              <div className={styles.media}>
                <Image
                  src={entry.image}
                  alt=""
                  fill
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                  className={
                    entry.containImage ? styles.contained : styles.cover
                  }
                />
              </div>
              <CardContent className={styles.copy}>
                <h3 id={`tarot-portal-${entry.id}`} className={styles.title}>
                  {t(entry.title)}
                </h3>
                <p className={styles.description}>{t(entry.description)}</p>
                <span
                  className={`${buttonVariants({ variant: "primary", size: "sm" })} ${styles.action}`}
                >
                  {t(entry.action)}
                  <ChevronRight size={16} aria-hidden="true" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
