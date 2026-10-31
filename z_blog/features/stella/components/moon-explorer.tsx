"use client";

import { useState } from "react";
import { ZodiacConstellation, ZodiacLabel } from "./zodiac-constellation";
import { SIGN_NAMES, SIGN_SYMBOLS, type SkySnapshot } from "../lib/sky";
import { signQualities } from "../lib/explore-config";
import { phaseIndex } from "../lib/moon-phase";
import type { MoonDay, MoonQuarter } from "../lib/explore-calculations";
import {
  ExploreShell,
  Section,
  MonthNav,
  MoonDisc,
  TimeText,
  styles,
  useExplore,
} from "./explore-shared";

const phases = [
  { en: "New Moon", zh: "新月" },
  { en: "Waxing Crescent", zh: "娥眉月" },
  { en: "First Quarter", zh: "上弦月" },
  { en: "Waxing Gibbous", zh: "盈凸月" },
  { en: "Full Moon", zh: "满月" },
  { en: "Waning Gibbous", zh: "亏凸月" },
  { en: "Last Quarter", zh: "下弦月" },
  { en: "Waning Crescent", zh: "残月" },
];
export default function MoonExplorer({
  year,
  month,
  days,
  quarters,
  snapshot,
}: {
  year: number;
  month: number;
  days: MoonDay[];
  quarters: MoonQuarter[];
  snapshot: SkySnapshot;
}) {
  const { t, language, locale } = useExplore();
  const [selected, setSelected] = useState<number | null>(null);
  const current =
    selected === null ? null : days.find((d) => d.day === selected);
  const moon = snapshot.planets.find((p) => p.key === "moon")!;
  const phase = current?.phase ?? snapshot.moon.phase,
    illumination = current?.illumination ?? snapshot.moon.illumination,
    sign = current?.sign ?? moon.signIndex;
  const monthName = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
  return (
    <ExploreShell
      title={{
        en: `Moon Calendar — ${new Intl.DateTimeFormat("en", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, 1)))}`,
        zh: `月亮日历 · ${year}年${month}月`,
      }}
      description={{
        en: "Daily lunar signs, phases and illumination, with exact quarter-phase times.",
        zh: "每日月亮落座、月相与照明比例，以及精确的四分月相时刻。",
      }}
    >
      <MonthNav slug="moon-calendar" year={year} month={month} />
      <div className={styles.banner} aria-live="polite">
        <span className={styles.small}>
          {current
            ? `${monthName} · ${current.day}`
            : t({ en: "THE MOON RIGHT NOW", zh: "此刻的月亮" })}
        </span>
        <div className={`${styles.row} justify-center`}>
          <MoonDisc phase={phase} />
          <strong>{t(phases[phaseIndex(phase)])}</strong>
        </div>
        <p>
          <ZodiacLabel sign={sign} size="compact">
            {SIGN_SYMBOLS[sign]} {SIGN_NAMES[language][sign]}
          </ZodiacLabel>{" "}
          · {(illumination * 100).toFixed(1)}%{" "}
          {t({ en: "illuminated", zh: "被照亮" })}
        </p>
      </div>
      <Section title={{ en: "Daily Moon Signs", zh: "每日月亮星座" }}>
        <p className={styles.small}>
          {t({
            en: "Daily samples at 12:00 UTC. The Moon may change sign within a day.",
            zh: "每日数据取 UTC 12:00，月亮也可能在当天其他时刻换座。",
          })}
        </p>
        <div className={styles.calendar}>
          {Array.from({ length: 7 }, (_, i) => (
            <span key={`weekday-${i}`} className={styles.weekday}>
              {new Intl.DateTimeFormat(locale, {
                weekday: "short",
                timeZone: "UTC",
              }).format(new Date(Date.UTC(2026, 0, 4 + i)))}
            </span>
          ))}
          {Array.from(
            { length: new Date(Date.UTC(year, month - 1, 1)).getUTCDay() },
            (_, i) => (
              <span key={`blank-${i}`} aria-hidden />
            ),
          )}
          {days.map((d) => (
            <button
              key={d.day}
              className={`${styles.day} ${selected === d.day ? styles.daySelected : ""}`}
              aria-pressed={selected === d.day}
              onClick={() => setSelected(d.day)}
              aria-label={`${monthName} ${d.day}, ${SIGN_NAMES[language][d.sign]}, ${Math.round(d.illumination * 100)}%`}
            >
              <span>{d.day}</span>
              <MoonDisc phase={d.phase} />
              <span className={styles.daySign}>
                <span>{SIGN_SYMBOLS[d.sign]} </span>
                <span className={styles.signFull}>
                  {SIGN_NAMES[language][d.sign]}
                </span>
                <span className={styles.signShort}>
                  {language === "en"
                    ? SIGN_NAMES.en[d.sign].slice(0, 3)
                    : SIGN_NAMES.zh[d.sign]}
                </span>
              </span>
              <ZodiacConstellation sign={d.sign} size="tiny" />
              <span className={styles.small}>
                {Math.round(d.illumination * 100)}%
              </span>
            </button>
          ))}
        </div>
      </Section>
      <Section title={{ en: "This Month's Lunar Phases", zh: "本月主要月相" }}>
        <div className={styles.grid}>
          {quarters.map((q) => (
            <article
              key={q.time}
              className={`${styles.card} ${styles.phaseCard}`}
            >
              <div className={styles.row}>
                <MoonDisc phase={q.quarter * 90} />
                <h3>{t(phases[q.quarter * 2])}</h3>
              </div>
              <TimeText value={q.time} />
            </article>
          ))}
        </div>
      </Section>
      <Section
        title={{ en: "Moon Signs and Their Energy", zh: "月亮星座与情绪主题" }}
      >
        <div className={styles.grid}>
          {signQualities.map((copy, i) => (
            <article key={i}>
              <h3>
                <ZodiacLabel sign={i}>
                  {SIGN_SYMBOLS[i]} {SIGN_NAMES[language][i]}
                </ZodiacLabel>
              </h3>
              <p>
                {t({
                  en: `A useful reflection for a ${SIGN_NAMES.en[i]} Moon is ${copy.en}. Notice how this theme meets your actual emotional needs rather than treating it as a fixed forecast.`,
                  zh: `月亮经过${SIGN_NAMES.zh[i]}时，可以围绕${copy.zh}展开观察。把主题与自己的真实需要联系，而非当作固定预言。`,
                })}
              </p>
            </article>
          ))}
        </div>
      </Section>
    </ExploreShell>
  );
}
