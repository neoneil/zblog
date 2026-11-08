"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SIGN_NAMES, SIGN_SYMBOLS } from "../lib/sky";
import { signSlugs, type Copy } from "../lib/explore-config";
import { useExplore } from "./explore-shared";
import { ZodiacConstellation } from "./zodiac-constellation";
import styles from "./zodiac-pages.module.css";

export { styles, useExplore };
export const zodiacHref = (sign?: number) =>
  `/stella/zodiac${sign === undefined ? "" : `/${signSlugs[sign]}`}`;
export type HoroscopePeriod = "daily" | "monthly" | "yearly";
export const horoscopeHref = (
  period: HoroscopePeriod = "daily",
  sign?: number,
) =>
  `/stella/horoscope${period === "daily" ? "" : `/${period}`}${sign === undefined ? "" : `/${signSlugs[sign]}`}`;

export function ZodiacPageShell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <main className={`${styles.root} ${className}`}>
      <div className={styles.inner}>{children}</div>
    </main>
  );
}
export function ArticleSection({
  title,
  children,
  callout = false,
}: {
  title: Copy;
  children: React.ReactNode;
  callout?: boolean;
}) {
  const { t } = useExplore();
  return (
    <section className={callout ? styles.callout : styles.section}>
      <h2>{t(title)}</h2>
      {children}
    </section>
  );
}
export function SignFigure({ sign }: { sign: number }) {
  return (
    <div className={styles.figure}>
      <ZodiacConstellation sign={sign} size="table" />
    </div>
  );
}
export function ChartCTA({ title, label }: { title?: Copy; label?: Copy }) {
  const { t } = useExplore();
  return (
    <section className={styles.cta}>
      {title && <h2>{t(title)}</h2>}
      <p>
        {t({
          en: "Explore your Sun, Moon and Rising signs in your personal birth chart.",
          zh: "在个人出生星盘中探索你的太阳、月亮与上升星座。",
        })}
      </p>
      <Link className={styles.primary} href="/stella">
        {t(
          label ?? { en: "Calculate Your Birth Chart", zh: "计算你的出生星盘" },
        )}
        <ArrowRight size={16} aria-hidden />
      </Link>
    </section>
  );
}
export function OtherSigns({
  sign,
  period,
}: {
  sign: number;
  period?: HoroscopePeriod;
}) {
  const { language } = useExplore();
  return (
    <ArticleSection title={{ en: "Other Signs", zh: "其他星座" }}>
      <div className={styles.otherSigns}>
        {signSlugs.map((slug, index) =>
          index === sign ? null : (
            <Link
              key={slug}
              href={period ? horoscopeHref(period, index) : zodiacHref(index)}
            >
              <span aria-hidden>{SIGN_SYMBOLS[index]}</span>
              {SIGN_NAMES[language][index]}
              <ZodiacConstellation sign={index} size="tiny" />
            </Link>
          ),
        )}
      </div>
    </ArticleSection>
  );
}
export function PeriodNav({ period }: { period: HoroscopePeriod }) {
  const { t } = useExplore();
  return (
    <nav
      className={styles.periods}
      aria-label={t({ en: "Horoscope period", zh: "运势周期" })}
    >
      {(
        [
          ["daily", { en: "Today's Horoscope", zh: "今日运势" }],
          ["monthly", { en: "Monthly Horoscope", zh: "每月运势" }],
          ["yearly", { en: "Yearly Horoscope", zh: "年度运势" }],
        ] as const
      ).map(([key, label]) => (
        <Link
          key={key}
          href={horoscopeHref(key)}
          aria-current={period === key ? "page" : undefined}
        >
          {t(label)}
        </Link>
      ))}
    </nav>
  );
}
