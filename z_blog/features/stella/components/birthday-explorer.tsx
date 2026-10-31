"use client";

import Link from "next/link";
import { ZodiacConstellation, ZodiacLabel } from "./zodiac-constellation";
import { SIGN_NAMES, SIGN_SYMBOLS } from "../lib/sky";
import {
  monthSlugs,
  monthLengths,
  birthdaySlugs,
  parseBirthday,
  signQualities,
  signChallenges,
  elements,
  modalities,
  rulers,
  planetCopy,
  signSlugs,
} from "../lib/explore-config";
import type { birthdayProfile } from "../lib/explore-calculations";
import { ExploreShell, Section, styles, useExplore } from "./explore-shared";

export default function BirthdayExplorer({
  slug,
  profile,
}: {
  slug?: string;
  profile?: ReturnType<typeof birthdayProfile>;
}) {
  const { t, language, locale } = useExplore();
  const date = slug ? parseBirthday(slug) : null;
  if (date && profile) {
    const { sign, decan, degree, ruler } = profile,
      index = birthdaySlugs.indexOf(slug!),
      previous =
        birthdaySlugs[
          (index + birthdaySlugs.length - 1) % birthdaySlugs.length
        ],
      next = birthdaySlugs[(index + 1) % birthdaySlugs.length];
    const format = (m: number, d: number) =>
      new Intl.DateTimeFormat(locale, {
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      }).format(new Date(Date.UTC(2000, m - 1, d)));
    const matches = signSlugs
      .map((_, i) => i)
      .filter(
        (i) =>
          i !== sign && (i % 4 === sign % 4 || ((i % 4) + 2) % 4 === sign % 4),
      );
    return (
      <ExploreShell
        title={{
          en: `Born on ${monthSlugs[date.month - 1][0].toUpperCase() + monthSlugs[date.month - 1].slice(1)} ${date.day}`,
          zh: `${date.month}月${date.day}日出生`,
        }}
        description={{
          en: "A birthday profile through the Sun's sign, decan and traditional planetary symbolism.",
          zh: "从太阳星座、旬位与传统行星象征，探索生日档案。",
        }}
      >
        <div className={styles.header}>
          <div className={styles.heroSymbol}>{SIGN_SYMBOLS[sign]}</div>
          <h2>
            <ZodiacLabel sign={sign}>{SIGN_NAMES[language][sign]}</ZodiacLabel>
          </h2>
        </div>
        <Section title={{ en: "Your Birthday Profile", zh: "你的生日档案" }}>
          <dl className={styles.facts}>
            <div>
              <dt>{t({ en: "Sun sign", zh: "太阳星座" })}</dt>
              <dd>
                <ZodiacLabel sign={sign} size="compact">
                  {SIGN_NAMES[language][sign]}
                </ZodiacLabel>
              </dd>
            </div>
            <div>
              <dt>{t({ en: "Decanate", zh: "旬位" })}</dt>
              <dd>
                {decan} · {t(planetCopy[ruler].name)}
              </dd>
            </div>
            <div>
              <dt>{t({ en: "Approximate Sun degree", zh: "太阳近似度数" })}</dt>
              <dd>~{degree}°</dd>
            </div>
          </dl>
          <p className={styles.small}>
            {t({
              en: "Birthday profiles use fixed calendar dates and approximate degrees, not a calculated natal Sun position. Actual signs and degrees depend on your birth year, time and time zone. Use the full calculator for precision.",
              zh: "生日档案使用固定日期区间与近似度数，并非本命太阳的天文计算结果。实际星座和度数取决于出生年份、时间和时区，精确结果请使用完整星盘计算器。",
            })}
          </p>
        </Section>
        <Section title={{ en: "Your Personality", zh: "性格探索" }}>
          <p>
            {t({
              en: `This solar archetype emphasises ${signQualities[sign].en}. Decan ${decan} adds the symbolism of ${planetCopy[ruler].name.en}: ${planetCopy[ruler].theme.en}. Explore where those themes fit your experience and where they do not.`,
              zh: `这一太阳原型着重于${signQualities[sign].zh}。第 ${decan} 旬增添${planetCopy[ruler].name.zh}的象征：${planetCopy[ruler].theme.zh}。可以观察哪些主题符合你的体验，哪些并不适合。`,
            })}
          </p>
        </Section>
        <Section
          sign={sign}
          title={{
            en: `About ${SIGN_NAMES.en[sign]}`,
            zh: `关于${SIGN_NAMES.zh[sign]}`,
          }}
        >
          <p>
            {t(elements[sign % 4])} · {t(modalities[sign % 3])} ·{" "}
            {t(planetCopy[rulers[sign]].name)}
          </p>
          <h3>{t({ en: "Strengths", zh: "优势主题" })}</h3>
          <p>{t(signQualities[sign])}</p>
          <h3>{t({ en: "Growth and challenges", zh: "成长与挑战" })}</h3>
          <p>{t(signChallenges[sign])}</p>
        </Section>
        <Section title={{ en: "Compatibility", zh: "星座配对" }}>
          <div className={styles.grid}>
            {matches.map((other) => {
              const [a, b] = [sign, other].sort((a, b) => a - b);
              return (
                <Link
                  className={styles.link}
                  key={other}
                  href={`/stella/compatibility/${signSlugs[a]}-${signSlugs[b]}`}
                >
                  {SIGN_SYMBOLS[sign]} & {SIGN_SYMBOLS[other]}{" "}
                  {SIGN_NAMES[language][other]}
                  <ZodiacConstellation sign={other} size="compact" />
                </Link>
              );
            })}
          </div>
        </Section>
        <Section
          title={{ en: "Explore Your Complete Chart", zh: "探索完整出生星盘" }}
        >
          <p>
            {t({
              en: "A birthday alone does not provide the Moon, Rising sign, houses or the full pattern of planetary aspects. Add a birth year, place and accurate time to see the broader picture.",
              zh: "仅凭生日无法得知准确的月亮、上升、宫位或完整相位。补充出生年份、地点和准确时间，才能看到更完整的图景。",
            })}
          </p>
          <Link className={styles.button} href="/stella">
            {t({ en: "Calculate Your Birth Chart", zh: "计算出生星盘" })}
          </Link>
        </Section>
        <nav className={styles.nav}>
          <Link href={`/stella/birthday/${previous}`}>
            ←{" "}
            {format(
              parseBirthday(previous)!.month,
              parseBirthday(previous)!.day,
            )}
          </Link>
          <Link href="/stella/birthday">
            {t({ en: "All Birthdays", zh: "全部生日" })}
          </Link>
          <Link href={`/stella/birthday/${next}`}>
            {format(parseBirthday(next)!.month, parseBirthday(next)!.day)} →
          </Link>
        </nav>
      </ExploreShell>
    );
  }
  return (
    <ExploreShell
      title={{ en: "Birthday Horoscope", zh: "生日运势" }}
      description={{
        en: "Explore all 366 birthdays, including February 29, through solar signs and decans.",
        zh: "探索包含 2 月 29 日的全部 366 个生日，了解太阳星座与旬位。",
      }}
    >
      <div className={styles.months}>
        {monthSlugs.map((month, i) => (
          <section key={month}>
            <h2>
              {new Intl.DateTimeFormat(locale, {
                month: "long",
                timeZone: "UTC",
              }).format(new Date(Date.UTC(2000, i, 1)))}
            </h2>
            <div className={styles.dates}>
              {Array.from({ length: monthLengths[i] }, (_, d) => (
                <Link
                  key={d}
                  href={`/stella/birthday/${month}-${d + 1}`}
                  aria-label={`${language === "zh" ? `${i + 1}月` : month} ${d + 1}`}
                >
                  {d + 1}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </ExploreShell>
  );
}
