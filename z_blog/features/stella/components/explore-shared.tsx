"use client";

import Link from "next/link";
import { useId } from "react";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { usePreferences } from "@/components/site/preferences-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { stellaTools, stellaHref, type Copy } from "../lib/explore-config";
import styles from "./explore.module.css";
import { ZodiacConstellation, ZodiacLabel } from "./zodiac-constellation";

export { styles, Button, Input };
export function useExplore() {
  const { language, t } = usePreferences();
  return { language, t, locale: language === "zh" ? "zh-CN" : "en-US" };
}
export function Section({
  title,
  children,
  sign,
}: {
  title: Copy;
  children: React.ReactNode;
  sign?: number;
}) {
  const { t } = useExplore();
  return (
    <section className={styles.section}>
      <h2>
        {sign === undefined ? (
          t(title)
        ) : (
          <ZodiacLabel sign={sign}>{t(title)}</ZodiacLabel>
        )}
      </h2>
      {children}
    </section>
  );
}
export function ExploreShell({
  title,
  description,
  children,
  signs,
}: {
  title: Copy;
  description: Copy;
  children: React.ReactNode;
  signs?: number[];
}) {
  const { t } = useExplore();
  return (
    <main className={styles.root}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <h1>{t(title)}</h1>
          {signs?.length ? (
            <div className={styles.constellationRow}>
              {signs.map((sign, index) => (
                <ZodiacConstellation key={`${sign}-${index}`} sign={sign} />
              ))}
            </div>
          ) : null}
          <p>{t(description)}</p>
        </header>
        {children}
        <section className={styles.section}>
          <h2>{t({ en: "Explore", zh: "探索星象" })}</h2>
          <div className={styles.grid}>
            {stellaTools.map((tool) => (
              <Link
                className={styles.link}
                key={tool.slug}
                href={stellaHref(tool.slug)}
              >
                {t(tool)}
                <ArrowRight aria-hidden size={16} />
              </Link>
            ))}
          </div>
        </section>
        <p className={styles.small}>
          {t({
            en: "Astronomical positions use the tropical zodiac and geocentric ecliptic coordinates. Interpretive material is for reflection, not a scientific assessment or a prediction.",
            zh: "天文位置采用回归黄道与地心黄经。诠释性内容仅供自我探索，不是科学评估或未来预测。",
          })}
        </p>
      </div>
    </main>
  );
}
export function MoonDisc({ phase }: { phase: number }) {
  const id = useId().replace(/:/g, "");
  const angle = ((phase % 360) + 360) % 360;
  const size = 48,
    cos = Math.cos((angle * Math.PI) / 180),
    waxing = angle < 180,
    terminator = (Math.abs(cos) * size) / 2;
  const side = waxing ? 1 : 0,
    sweep = cos > 0 ? (waxing ? 0 : 1) : waxing ? 1 : 0;
  // Fixed precision avoids server/browser Math.cos rounding differences during hydration.
  const path = `M 24 0 A 24 24 0 0 ${side} 24 48 A ${Math.max(0.01, terminator).toFixed(4)} 24 0 0 ${sweep} 24 0`;
  return (
    <svg
      className={styles.moon}
      viewBox="0 0 48 48"
      aria-hidden
      data-phase={angle.toFixed(4)}
    >
      <defs>
        <clipPath id={`${id}-disc`}>
          <circle cx="24" cy="24" r="24" />
        </clipPath>
        <clipPath id={`${id}-light`}>
          <path d={path} />
        </clipPath>
        <filter
          id={`${id}-halo`}
          filterUnits="userSpaceOnUse"
          x="-24"
          y="-24"
          width="96"
          height="96"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.3" result="near" />
          <feGaussianBlur in="SourceAlpha" stdDeviation="3.4" result="far" />
          <feFlood
            floodColor="var(--explore-moon-halo, var(--stella-white))"
            result="nearColor"
          />
          <feComposite
            in="nearColor"
            in2="near"
            operator="in"
            result="nearGlow"
          />
          <feFlood
            floodColor="var(--explore-moon-aura, var(--stella-star-label))"
            floodOpacity="0.55"
            result="farColor"
          />
          <feComposite in="farColor" in2="far" operator="in" result="farGlow" />
          <feMerge>
            <feMergeNode in="farGlow" />
            <feMergeNode in="nearGlow" />
          </feMerge>
        </filter>
      </defs>
      <circle
        cx="24"
        cy="24"
        r="24"
        fill="var(--explore-moon-shadow, var(--stella-bg))"
      />
      <g clipPath={`url(#${id}-disc)`} opacity="0.12">
        <image
          href="/stella/textures/moon-full.jpg"
          x="-1.4"
          y="-1.4"
          width="50.8"
          height="50.8"
        />
      </g>
      <g filter={`url(#${id}-halo)`} opacity={((1 - cos) / 2).toFixed(4)}>
        <g clipPath={`url(#${id}-light)`}>
          <image
            href="/stella/textures/moon-full.jpg"
            x="-1.4"
            y="-1.4"
            width="50.8"
            height="50.8"
          />
        </g>
      </g>
      <g clipPath={`url(#${id}-light)`} className={styles.moonSurface}>
        <image
          href="/stella/textures/moon-full.jpg"
          x="-1.4"
          y="-1.4"
          width="50.8"
          height="50.8"
        />
      </g>
    </svg>
  );
}
export function TimeText({
  value,
  zone = "UTC",
  dateOnly = false,
}: {
  value: string;
  zone?: string;
  dateOnly?: boolean;
}) {
  const { locale } = useExplore();
  return (
    <time dateTime={value}>
      {new Intl.DateTimeFormat(locale, {
        timeZone: zone,
        year: "numeric",
        month: "short",
        day: "numeric",
        ...(!dateOnly
          ? { hour: "2-digit", minute: "2-digit", hourCycle: "h23" as const }
          : {}),
      }).format(new Date(value))}
      {!dateOnly ? ` ${zone}` : ""}
    </time>
  );
}
export function MonthNav({
  slug,
  year,
  month,
}: {
  slug: string;
  year: number;
  month: number;
}) {
  const { t, locale } = useExplore(),
    previous = new Date(Date.UTC(year, month - 2, 1)),
    next = new Date(Date.UTC(year, month, 1));
  const href = (d: Date) =>
    `${stellaHref(slug)}?year=${d.getUTCFullYear()}&month=${d.getUTCMonth() + 1}`;
  return (
    <nav
      className={styles.toolbar}
      aria-label={t({ en: "Month navigation", zh: "月份导航" })}
    >
      {year > 1900 || month > 1 ? (
        <Link
          href={href(previous)}
          className={styles.iconButton}
          title={t({ en: "Previous month", zh: "上个月" })}
        >
          <ChevronLeft />
        </Link>
      ) : null}
      <strong>
        {new Intl.DateTimeFormat(locale, {
          month: "long",
          year: "numeric",
          timeZone: "UTC",
        }).format(new Date(Date.UTC(year, month - 1, 1)))}
      </strong>
      {year < 2100 || month < 12 ? (
        <Link
          href={href(next)}
          className={styles.iconButton}
          title={t({ en: "Next month", zh: "下个月" })}
        >
          <ChevronRight />
        </Link>
      ) : null}
    </nav>
  );
}
export function YearNav({ slug, year }: { slug: string; year: number }) {
  const { t } = useExplore();
  return (
    <nav
      className={styles.toolbar}
      aria-label={t({ en: "Year navigation", zh: "年份导航" })}
    >
      {year > 1900 ? (
        <Link
          className={styles.iconButton}
          href={`${stellaHref(slug)}?year=${year - 1}`}
          title={t({ en: "Previous year", zh: "上一年" })}
        >
          <ChevronLeft />
        </Link>
      ) : null}
      <strong>{year}</strong>
      {year < 2100 ? (
        <Link
          className={styles.iconButton}
          href={`${stellaHref(slug)}?year=${year + 1}`}
          title={t({ en: "Next year", zh: "下一年" })}
        >
          <ChevronRight />
        </Link>
      ) : null}
    </nav>
  );
}
export function Back({ href, label }: { href: string; label: Copy }) {
  const { t } = useExplore();
  return (
    <nav className={styles.nav}>
      <Link href={href} className={styles.row}>
        <ArrowLeft size={16} />
        {t(label)}
      </Link>
    </nav>
  );
}
export function FAQ({ items }: { items: { question: Copy; answer: Copy }[] }) {
  const { t } = useExplore();
  return (
    <Section title={{ en: "Frequently Asked Questions", zh: "常见问题" }}>
      <div className={styles.faq}>
        {items.map((item) => (
          <details key={item.question.en}>
            <summary>{t(item.question)}</summary>
            <p>{t(item.answer)}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
