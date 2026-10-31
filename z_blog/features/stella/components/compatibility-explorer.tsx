"use client";

import Link from "next/link";
import { ZodiacConstellation, ZodiacLabel } from "./zodiac-constellation";
import { SIGN_NAMES, SIGN_SYMBOLS } from "../lib/sky";
import {
  compatibilityPairs,
  signSlugs,
  parsePair,
  pairDynamics,
  elements,
  modalities,
  rulers,
  planetCopy,
  signQualities,
  signChallenges,
} from "../lib/explore-config";
import {
  ExploreShell,
  Section,
  Back,
  FAQ,
  styles,
  useExplore,
} from "./explore-shared";

export default function CompatibilityExplorer({ pair }: { pair?: string }) {
  const { t, language } = useExplore();
  const selected = pair ? parsePair(pair) : null;
  const sign = (i: number) => SIGN_NAMES[language][i];
  if (selected) {
    const [first, second] = selected,
      dynamics = pairDynamics(first, second);
    return (
      <ExploreShell
        signs={[first, second]}
        title={{
          en: `${SIGN_NAMES.en[first]} and ${SIGN_NAMES.en[second]} Compatibility`,
          zh: `${SIGN_NAMES.zh[first]}与${SIGN_NAMES.zh[second]}配对`,
        }}
        description={{
          en: "Element harmony, relationship rhythms and opportunities to grow together.",
          zh: "探索元素互动、关系节奏与共同成长的空间。",
        }}
      >
        <div className={styles.header}>
          <span className={styles.heroSymbol}>
            {SIGN_SYMBOLS[first]} & {SIGN_SYMBOLS[second]}
          </span>
        </div>
        <dl className={styles.facts}>
          <div>
            <dt>{t({ en: "Elements", zh: "元素" })}</dt>
            <dd>
              {t(elements[first % 4])} + {t(elements[second % 4])}
            </dd>
          </div>
          <div>
            <dt>{t({ en: "Modalities", zh: "模式" })}</dt>
            <dd>
              {t(modalities[first % 3])} + {t(modalities[second % 3])}
            </dd>
          </div>
          <div>
            <dt>{t({ en: "Rulers", zh: "守护星" })}</dt>
            <dd>
              {t(planetCopy[rulers[first]].name)} +{" "}
              {t(planetCopy[rulers[second]].name)}
            </dd>
          </div>
        </dl>
        <Section title={{ en: "Element Harmony", zh: "元素关系" }}>
          <p>{t(dynamics.harmony)}</p>
        </Section>
        <Section title={{ en: "Modality Dynamics", zh: "模式互动" }}>
          <p>{t(dynamics.modality)}</p>
        </Section>
        <Section title={{ en: "Soul-Level Connection", zh: "深层连接" }}>
          <p>
            {t({
              en: "Use differences as an invitation to understand, not as a verdict. A shared intention and honest repair matter more than any sign pairing.",
              zh: "把差异当作理解的邀请，而非关系的判决。共同意愿和真诚修复，比任何星座组合更重要。",
            })}
          </p>
        </Section>
        <Section title={{ en: "Sign Profiles", zh: "双方星座资料" }}>
          <div className={styles.grid}>
            {[first, second].map((i, index) => (
              <article key={index} className={styles.card}>
                <h3>
                  <ZodiacLabel sign={i}>
                    {SIGN_SYMBOLS[i]} {sign(i)}
                  </ZodiacLabel>
                </h3>
                <p>{t(signQualities[i])}</p>
                <p>{t(signChallenges[i])}</p>
                <Link
                  href={`/stella/birth-chart#${signSlugs[i]}`}
                  className={styles.muted}
                >
                  {t({ en: "Explore this sign", zh: "了解这个星座" })} →
                </Link>
              </article>
            ))}
          </div>
        </Section>
        <p>
          {t({
            en: "Sun-sign compatibility is not full synastry. For a detailed comparison, include both complete birth charts.",
            zh: "太阳星座配对并不等于完整合盘，深入比较还需要双方完整的出生星盘。",
          })}
        </p>
        <Back
          href="/stella/compatibility"
          label={{ en: "All compatibility pairs", zh: "全部配对" }}
        />
      </ExploreShell>
    );
  }
  return (
    <ExploreShell
      title={{ en: "Zodiac Compatibility", zh: "星座配对" }}
      description={{
        en: "Explore all 78 zodiac pairings. Choose a combination to discover element harmony, modality dynamics and the individual qualities each person brings to a relationship.",
        zh: "从元素、模式和各自特质出发，探索十二星座的全部配对。",
      }}
    >
      <div className={styles.pairs}>
        {compatibilityPairs.map((slug) => {
          const [x, y] = parsePair(slug)!;
          return (
            <Link
              className={styles.link}
              key={slug}
              href={`/stella/compatibility/${slug}`}
            >
              <span className={styles.symbol}>
                {SIGN_SYMBOLS[x]}
                {x !== y ? ` ${SIGN_SYMBOLS[y]}` : ""}
              </span>
              <span>
                {sign(x)} + {sign(y)}
              </span>
              <span className={styles.pairFigures}>
                <ZodiacConstellation sign={x} size="tiny" />
                {x !== y ? <ZodiacConstellation sign={y} size="tiny" /> : null}
              </span>
            </Link>
          );
        })}
      </div>
      <FAQ
        items={[
          {
            question: {
              en: "Is this a compatibility score?",
              zh: "这是关系分数吗？",
            },
            answer: {
              en: "No. These are traditional sign-based descriptions, not a measurement of a real relationship. A complete synastry compares planetary placements and aspects for both people.",
              zh: "不是。这是传统星座关系描述，不是对真实关系的量化评估。完整合盘还需要比较双方行星位置和相位。",
            },
          },
        ]}
      />
    </ExploreShell>
  );
}
