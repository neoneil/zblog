"use client";

import Link from "next/link";
import { SIGN_NAMES, SIGN_SYMBOLS } from "../lib/sky";
import {
  elements,
  modalities,
  planetCopy,
  rulers,
  signSlugs,
} from "../lib/explore-config";
import type { HoroscopeForecast } from "../lib/horoscope-calculations";
import { zodiacProfiles } from "../lib/zodiac-profiles";
import { ZodiacLabel } from "./zodiac-constellation";
import {
  ZodiacPageShell,
  ArticleSection,
  SignFigure,
  ChartCTA,
  OtherSigns,
  PeriodNav,
  styles,
  useExplore,
  horoscopeHref,
  zodiacHref,
  type HoroscopePeriod,
} from "./zodiac-pages-shared";

export default function HoroscopeExplorer({
  period,
  sign,
  time,
  forecasts,
}: {
  period: HoroscopePeriod;
  sign?: number;
  time: string;
  forecasts: HoroscopeForecast[];
}) {
  const { language, locale, t } = useExplore();
  const date = new Date(time),
    year = date.getUTCFullYear();
  const monthLabel = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
  const dayLabel = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
  const names = SIGN_NAMES[language];
  const title =
    period === "daily"
      ? { en: "Today's Horoscope", zh: "今日星座运势" }
      : period === "monthly"
        ? { en: `${monthLabel} Monthly Horoscope`, zh: `${monthLabel}星座运势` }
        : { en: `${year} Yearly Horoscope`, zh: `${year}年度星座运势` };
  if (sign === undefined)
    return (
      <ZodiacPageShell>
        <header className={styles.intro}>
          <h1>{t(title)}</h1>
          {period === "daily" && (
            <p>
              <time dateTime={time}>{dayLabel}</time>
            </p>
          )}
          <p>
            {t(
              period === "daily"
                ? {
                    en: "Choose your sign to explore today's energy, relationships and a practical focus for the day.",
                    zh: "选择你的星座，探索今日能量、关系与值得关注的行动方向。",
                  }
                : period === "monthly"
                  ? {
                      en: "Explore twelve monthly forecasts, with planetary transits mapped through solar houses for love, career, growth and challenges.",
                      zh: "将行星行运映射到太阳宫位，从爱情、事业、成长与挑战四个方向探索十二星座的每月运势。",
                    }
                  : {
                      en: "Explore the year's wider themes, Jupiter and Saturn transits, eclipse seasons, relationships and your inner journey.",
                      zh: "探索一年的整体主题、木星与土星行运、食相季、关系与内在成长旅程。",
                    },
            )}
          </p>
        </header>
        <PeriodNav period={period} />
        <div className={styles.forecastGrid}>
          {signSlugs.map((slug, i) => (
            <Link
              className={styles.forecastCard}
              key={slug}
              href={horoscopeHref(period, i)}
            >
              <div>
                <span className={styles.symbol} aria-hidden>
                  {SIGN_SYMBOLS[i]}
                </span>
                <div>
                  <h2>{names[i]}</h2>
                  <small>{t(zodiacProfiles[i].dates)}</small>
                </div>
                <SignFigure sign={i} />
              </div>
              <p className={period === "daily" ? styles.preview : undefined}>
                {period === "daily"
                  ? t(forecasts[i].sections[0].paragraphs[0])
                  : t({
                      en: `Read your ${period === "monthly" ? monthLabel : year} forecast →`,
                      zh: `阅读${period === "monthly" ? monthLabel : year}运势 →`,
                    })}
              </p>
            </Link>
          ))}
        </div>
        <ChartCTA />
      </ZodiacPageShell>
    );
  const profile = zodiacProfiles[sign],
    forecast = forecasts[0],
    name = names[sign];
  const detailTitle =
    period === "daily"
      ? {
          en: `${SIGN_NAMES.en[sign]} Horoscope Today`,
          zh: `${SIGN_NAMES.zh[sign]}今日运势`,
        }
      : period === "monthly"
        ? {
            en: `${SIGN_NAMES.en[sign]} Monthly Horoscope`,
            zh: `${SIGN_NAMES.zh[sign]}每月运势`,
          }
        : {
            en: `${SIGN_NAMES.en[sign]} ${year} Horoscope`,
            zh: `${SIGN_NAMES.zh[sign]}${year}年度运势`,
          };
  return (
    <ZodiacPageShell>
      <header className={styles.detailHeader}>
        <span className={styles.symbol} aria-hidden>
          {SIGN_SYMBOLS[sign]}
        </span>
        <div>
          <h1>{t(detailTitle)}</h1>
          <p>
            <time dateTime={time}>
              {period === "daily"
                ? dayLabel
                : period === "monthly"
                  ? monthLabel
                  : t({ en: "Annual Forecast", zh: "年度预测" })}
            </time>
          </p>
          <p>{t(profile.dates)}</p>
        </div>
        <SignFigure sign={sign} />
      </header>
      <PeriodNav period={period} />
      <div className={styles.layout}>
        <article className={styles.reading}>
          {forecast.sections.map((section, index) => (
            <ArticleSection key={section.title.en} title={section.title}>
              <div className={index === 0 ? styles.energy : undefined}>
                {section.paragraphs.map((paragraph, i) => (
                  <p key={i}>{t(paragraph)}</p>
                ))}
              </div>
            </ArticleSection>
          ))}
          {period === "daily" && (
            <ArticleSection
              title={{
                en: `About ${SIGN_NAMES.en[sign]}`,
                zh: `关于${SIGN_NAMES.zh[sign]}`,
              }}
            >
              {profile.about.map((paragraph, i) => (
                <p key={i}>{t(paragraph)}</p>
              ))}
            </ArticleSection>
          )}
          {forecast.keyDates.length > 0 && (
            <ArticleSection
              title={{
                en: `Key Dates for ${SIGN_NAMES.en[sign]}`,
                zh: `${SIGN_NAMES.zh[sign]}重要日期`,
              }}
            >
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th scope="col">{t({ en: "Date", zh: "日期" })}</th>
                      <th scope="col">{t({ en: "Event", zh: "星象" })}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {forecast.keyDates.map((entry, i) => (
                      <tr key={`${entry.date}-${i}`}>
                        <td>
                          <time dateTime={entry.date}>
                            {new Intl.DateTimeFormat(locale, {
                              month: "short",
                              day: "numeric",
                              timeZone: "UTC",
                            }).format(new Date(`${entry.date}T12:00:00Z`))}
                          </time>
                        </td>
                        <td>{t(entry.event)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ArticleSection>
          )}
          <ArticleSection
            title={{
              en:
                period === "daily"
                  ? `${SIGN_NAMES.en[sign]}'s Soul Purpose`
                  : period === "monthly"
                    ? `${SIGN_NAMES.en[sign]}'s Monthly Soul Focus`
                    : `${SIGN_NAMES.en[sign]}'s Soul Journey in ${year}`,
              zh:
                period === "daily"
                  ? `${SIGN_NAMES.zh[sign]}的灵魂使命`
                  : period === "monthly"
                    ? `${SIGN_NAMES.zh[sign]}的每月内在主题`
                    : `${SIGN_NAMES.zh[sign]}${year}内在成长旅程`,
            }}
            callout
          >
            <p>{t(profile.purpose)}</p>
            <p>
              <em>
                {t({ en: "Spiritual lesson:", zh: "成长课题：" })}{" "}
                {t(profile.lesson)}
              </em>
            </p>
          </ArticleSection>
          {period === "daily" && (
            <>
              <ArticleSection
                title={{
                  en: `${SIGN_NAMES.en[sign]} Strengths & Challenges`,
                  zh: `${SIGN_NAMES.zh[sign]}的优势与挑战`,
                }}
              >
                <div className={styles.columns}>
                  {[
                    {
                      title: { en: "Strengths", zh: "优势" },
                      items: profile.strengths,
                    },
                    {
                      title: { en: "Challenges", zh: "挑战" },
                      items: profile.challenges,
                    },
                  ].map((group) => (
                    <div key={group.title.en}>
                      <h3>{t(group.title)}</h3>
                      <ul className={styles.tags}>
                        {group.items.map((item) => (
                          <li key={item.en}>{t(item)}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </ArticleSection>
              <ArticleSection
                title={{
                  en: `${SIGN_NAMES.en[sign]} Compatibility`,
                  zh: `${SIGN_NAMES.zh[sign]}配对`,
                }}
              >
                <p>
                  {t({
                    en: "Explore your connections with these complementary signs.",
                    zh: "探索与这些互补星座之间的连接。",
                  })}
                </p>
                <div className={styles.pairs}>
                  {profile.bestMatches.map((i) => (
                    <Link
                      key={i}
                      href={`/stella/compatibility/${signSlugs[Math.min(sign, i)]}-${signSlugs[Math.max(sign, i)]}`}
                    >
                      <ZodiacLabel sign={i} size="tiny">
                        {names[i]}
                      </ZodiacLabel>
                    </Link>
                  ))}
                </div>
              </ArticleSection>
            </>
          )}
        </article>
        <aside className={styles.aside}>
          <h3>{t({ en: "Key Traits", zh: "核心特质" })}</h3>
          <ul>
            {profile.traits.map((item) => (
              <li key={item.en}>{t(item)}</li>
            ))}
          </ul>
          <h3>{t({ en: "Element", zh: "元素" })}</h3>
          <p>{t(elements[sign % 4])}</p>
          <h3>{t({ en: "Modality", zh: "模式" })}</h3>
          <p>{t(modalities[sign % 3])}</p>
          <h3>{t({ en: "Ruling Planet", zh: "守护星" })}</h3>
          <p>{t(planetCopy[rulers[sign]].name)}</p>
          {period === "yearly" && (
            <>
              <h3>{t({ en: `${year} at a Glance`, zh: `${year}行运速览` })}</h3>
              {forecast.transits
                .filter((item) => ["jupiter", "saturn"].includes(item.planet))
                .map((item, i) => (
                  <p key={i}>
                    {t(
                      i < 2
                        ? { en: "Jan-Jun", zh: "一至六月" }
                        : { en: "Jul-Dec", zh: "七至十二月" },
                    )}{" "}
                    · {t(planetCopy[item.planet].name)}:{" "}
                    <ZodiacLabel sign={item.sign} size="tiny">
                      {names[item.sign]}
                    </ZodiacLabel>{" "}
                    ·{" "}
                    {t({ en: `House ${item.house}`, zh: `第${item.house}宫` })}
                  </p>
                ))}
            </>
          )}
          <h3>{t({ en: "Explore More", zh: "继续探索" })}</h3>
          <div className={styles.asideLinks}>
            <Link href={zodiacHref(sign)}>
              {t({
                en: `Full ${SIGN_NAMES.en[sign]} profile`,
                zh: `${name}完整档案`,
              })}
            </Link>
            <Link href={horoscopeHref("daily", sign)}>
              {t({ en: "Daily Horoscope", zh: "每日运势" })}
            </Link>
            <Link href={horoscopeHref("monthly", sign)}>
              {t({ en: "Monthly Horoscope", zh: "每月运势" })}
            </Link>
            <Link href={horoscopeHref("yearly", sign)}>
              {t({ en: "Yearly Horoscope", zh: "年度运势" })}
            </Link>
          </div>
        </aside>
      </div>
      <ChartCTA />
      <OtherSigns sign={sign} period={period} />
      <p className={styles.note}>
        {t({
          en: "General Sun-sign reflections use tropical, geocentric planetary positions and whole-sign solar houses. They are not a personal birth-chart reading or a guarantee of future events. Calendar dates use UTC.",
          zh: "通用太阳星座解读采用回归黄道、地心行星位置与整宫制太阳宫位，并非个人出生星盘解析，也不保证未来事件。日历日期使用UTC。",
        })}
      </p>
    </ZodiacPageShell>
  );
}
