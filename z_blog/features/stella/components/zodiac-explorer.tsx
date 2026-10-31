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
import { zodiacProfiles } from "../lib/zodiac-profiles";
import { ZodiacLabel } from "./zodiac-constellation";
import {
  ZodiacPageShell,
  ArticleSection,
  SignFigure,
  OtherSigns,
  styles,
  useExplore,
  zodiacHref,
  horoscopeHref,
} from "./zodiac-pages-shared";

export default function ZodiacExplorer({ sign }: { sign?: number }) {
  const { language, t } = useExplore();
  const names = SIGN_NAMES[language];
  if (sign === undefined)
    return (
      <ZodiacPageShell>
        <header className={styles.intro}>
          <h1>{t({ en: "All 12 Zodiac Signs", zh: "十二星座" })}</h1>
          <p>
            {t({
              en: "Discover the dates, personality, element and soul themes of each sign. Explore Sun, Moon, Rising and compatibility in the complete profiles.",
              zh: "认识十二星座的日期、性格、元素与内在主题。在完整档案中探索太阳、月亮、上升与星座配对。",
            })}
          </p>
        </header>
        <div className={styles.zodiacGrid}>
          {signSlugs.map((slug, i) => (
            <Link className={styles.signCard} key={slug} href={zodiacHref(i)}>
              <span className={styles.symbol} aria-hidden>
                {SIGN_SYMBOLS[i]}
              </span>
              <strong>{names[i]}</strong>
              <small>{t(zodiacProfiles[i].dates)}</small>
              <SignFigure sign={i} />
            </Link>
          ))}
        </div>
      </ZodiacPageShell>
    );
  const profile = zodiacProfiles[sign],
    name = names[sign],
    opposite = (sign + 6) % 12;
  return (
    <ZodiacPageShell>
      <header className={styles.profileHeader}>
        <span className={styles.symbol} aria-hidden>
          {SIGN_SYMBOLS[sign]}
        </span>
        <div>
          <h1>{name}</h1>
          <SignFigure sign={sign} />
        </div>
        <div className={styles.meta}>
          <span>{t(profile.dates)}</span>
          <span>{t(elements[sign % 4])}</span>
          <span>{t(modalities[sign % 3])}</span>
          <span>
            {t({ en: "Ruled by", zh: "守护星" })}{" "}
            {t(planetCopy[rulers[sign]].name)}
          </span>
        </div>
        <ul className={styles.tags}>
          {profile.traits.map((item) => (
            <li key={item.en}>{t(item)}</li>
          ))}
        </ul>
      </header>
      <ArticleSection
        title={{
          en: `About ${SIGN_NAMES.en[sign]}`,
          zh: `关于${SIGN_NAMES.zh[sign]}`,
        }}
      >
        {profile.about.map((item) => (
          <p key={item.en}>{t(item)}</p>
        ))}
      </ArticleSection>
      <ArticleSection
        title={{ en: "Strengths & Challenges", zh: "优势与挑战" }}
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
          en: "Soul Purpose & Deeper Meaning",
          zh: "灵魂使命与深层意义",
        }}
        callout
      >
        <p>{t(profile.purpose)}</p>
        <p>
          <em>
            <strong>{t({ en: "Spiritual lesson:", zh: "成长课题：" })}</strong>{" "}
            {t(profile.lesson)}
          </em>
        </p>
      </ArticleSection>
      <ArticleSection
        title={{ en: "Growth & Polarity", zh: "成长与对宫" }}
        callout
      >
        <div className={styles.columns}>
          <div>
            <h3>
              {t(modalities[sign % 3])} {t({ en: "Cross", zh: "十字" })}
            </h3>
            <p>
              {t(
                [
                  {
                    en: "Turn initiative into purposeful leadership and service.",
                    zh: "将主动性转化为有方向的领导力与服务。",
                  },
                  {
                    en: "Develop resilience while allowing familiar patterns to evolve.",
                    zh: "培养韧性，也让熟悉的模式逐步转变。",
                  },
                  {
                    en: "Learn through change, flexibility and the integration of experience.",
                    zh: "通过变化、适应与整合经验获得成长。",
                  },
                ][sign % 3],
              )}
            </p>
          </div>
          <div>
            <h3>{t({ en: "Polar Sign", zh: "对宫星座" })}</h3>
            <p>
              <ZodiacLabel sign={opposite}>
                <Link href={zodiacHref(opposite)}>{names[opposite]}</Link>
              </ZodiacLabel>
            </p>
            <p>
              {t({
                en: "Opposite signs invite a balance between complementary needs, rather than an either-or choice.",
                zh: "对宫星座提示互补需求之间的平衡，而非非此即彼的选择。",
              })}
            </p>
          </div>
        </div>
      </ArticleSection>
      {(
        [
          {
            key: "sun",
            title: {
              en: `Sun in ${SIGN_NAMES.en[sign]}`,
              zh: `太阳落在${SIGN_NAMES.zh[sign]}`,
            },
          },
          {
            key: "moon",
            title: {
              en: `Moon in ${SIGN_NAMES.en[sign]}`,
              zh: `月亮落在${SIGN_NAMES.zh[sign]}`,
            },
          },
          {
            key: "rising",
            title: {
              en: `${SIGN_NAMES.en[sign]} Rising`,
              zh: `上升${SIGN_NAMES.zh[sign]}`,
            },
          },
          {
            key: "midheaven",
            title: {
              en: `Midheaven in ${SIGN_NAMES.en[sign]}`,
              zh: `天顶落在${SIGN_NAMES.zh[sign]}`,
            },
          },
        ] as const
      ).map((item) => (
        <ArticleSection key={item.key} title={item.title}>
          <p>{t(profile[item.key])}</p>
        </ArticleSection>
      ))}
      <ArticleSection
        title={{
          en: `${SIGN_NAMES.en[sign]} Compatibility`,
          zh: `${SIGN_NAMES.zh[sign]}配对`,
        }}
      >
        <p>
          {t({ en: "Best matches", zh: "相处较协调的星座" })}:{" "}
          {profile.bestMatches
            .map((i) => names[i])
            .join(language === "zh" ? "、" : ", ")}
        </p>
        <div className={styles.pairs}>
          {signSlugs.map((slug, i) =>
            i === sign ? null : (
              <Link
                key={slug}
                href={`/stella/compatibility/${signSlugs[Math.min(sign, i)]}-${signSlugs[Math.max(sign, i)]}`}
              >
                <span aria-hidden>
                  {SIGN_SYMBOLS[sign]} & {SIGN_SYMBOLS[i]}
                </span>
                {name} & {names[i]}
              </Link>
            ),
          )}
        </div>
      </ArticleSection>
      <section className={styles.cta}>
        <h2>
          {t({
            en: `Read Today's ${SIGN_NAMES.en[sign]} Horoscope`,
            zh: `阅读${SIGN_NAMES.zh[sign]}今日运势`,
          })}
        </h2>
        <p>
          {t({
            en: "Explore today's energy and a practical focus for reflection.",
            zh: "探索今日能量与适合自我反思的行动方向。",
          })}
        </p>
        <Link className={styles.primary} href={horoscopeHref("daily", sign)}>
          {t({
            en: `${SIGN_NAMES.en[sign]} Horoscope Today`,
            zh: `${SIGN_NAMES.zh[sign]}今日运势`,
          })}
        </Link>
      </section>
      <OtherSigns sign={sign} />
    </ZodiacPageShell>
  );
}
