"use client";

import Image from "next/image";
import Link from "next/link";
import { usePreferences } from "@/components/site/preferences-provider";
import { Card, CardContent } from "@/components/ui/card";
import styles from "@/features/thoth/components/knowledge-entries.module.css";

export default function ContactEntry() {
  const { t } = usePreferences();
  return <section id="home-contact" className="flex min-w-0 flex-col py-8 sm:py-10">
    <Link href="/contact" className="group block w-full flex-1">
      <Card className={`${styles.card} transition-colors group-hover:border-[var(--primary)]`}>
        <div className={styles.media}>
          <Image src="/knowledge/send-a-message.png" alt="" fill sizes="(max-width: 639px) 100vw, 576px" className={styles.image} />
        </div>
        <CardContent className={styles.copy}>
          <h2 className="text-xl font-semibold text-[var(--heading)]">{t({ en: "SEND A MESSAGE", zh: "星语传讯" })}</h2>
          <p>{t({ zh: "让每一次相遇，都从一封星辰来信开始。", en: "Every connection begins with a message beneath the stars." })}</p>
          <p>{t({ zh: "预约咨询前请先说明你想解决的问题，隔天就会回复。", en: "Before booking a consultation, tell us what you would like to explore. We will reply the following day." })}</p>
          <span className="text-sm font-medium">{t({ zh: "发送留言", en: "Send a message" })} →</span>
        </CardContent>
      </Card>
    </Link>
  </section>;
}
