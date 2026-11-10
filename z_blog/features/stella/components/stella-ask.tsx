"use client";

import Link from "next/link";
import { Send } from "lucide-react";
import { usePreferences } from "@/components/site/preferences-provider";
import { STELLA_CONSULTATION_HREF } from "../lib/consultation";
import styles from "./stella.module.css";

export default function StellaAsk({
  hasBirth,
  enterBirth,
}: {
  hasBirth: boolean;
  enterBirth: () => void;
}) {
  const { t } = usePreferences();
  return (
    <section className={styles.section}>
      <h2>
        {t({ en: "Ask a Professional Astrologer", zh: "咨询专业占星师" })}
      </h2>
      <p>
        {t({
          en: "Explore your birth chart, relationships and life direction in a one-to-one consultation with a professional astrologer.",
          zh: "与专业占星师一对一交流，深入探索你的出生星盘、情感关系与人生方向。",
        })}
      </p>
      <Link className={styles.primary} href={STELLA_CONSULTATION_HREF}>
        <Send size={14} aria-hidden="true" />
        {t({ en: "Request personal reading", zh: "获取个人解读" })}
      </Link>
      {!hasBirth && (
        <button type="button" className={styles.secondary} onClick={enterBirth}>
          {t({ en: "Enter My Chart", zh: "输入我的星盘" })}
        </button>
      )}
    </section>
  );
}
