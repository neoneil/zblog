"use client";
import { ElementLabel, ElementHeading } from "./element-label";

import Link from "next/link";
import { ZodiacConstellation, ZodiacLabel } from "./zodiac-constellation";
import { SIGN_NAMES, SIGN_SYMBOLS } from "../lib/sky";
import {
  compatibilityPairs,
  signSlugs,
  parsePair,
  elements,
  modalities,
  rulers,
  planetCopy,
} from "../lib/explore-config";
import { zodiacProfiles } from "../lib/zodiac-profiles";
import { compatibilityNarrative } from "../lib/compatibility-content";
import pairStyles from "./compatibility.module.css";
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
      dynamics = compatibilityNarrative(first, second);
    return (
      <ExploreShell
        signs={[first, second]}
        title={{
          en: `${SIGN_NAMES.en[first]} and ${SIGN_NAMES.en[second]} Compatibility`,
          zh: `${SIGN_NAMES.zh[first]}与${SIGN_NAMES.zh[second]}配对`,
        }}
        description={{
          en: `${SIGN_SYMBOLS[first]} ${zodiacProfiles[first].dates.en} — ${SIGN_SYMBOLS[second]} ${zodiacProfiles[second].dates.en}`,
          zh: `${SIGN_SYMBOLS[first]} ${zodiacProfiles[first].dates.zh} — ${SIGN_SYMBOLS[second]} ${zodiacProfiles[second].dates.zh}`,
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
              <ElementLabel element={elements[first % 4]} /> + <ElementLabel element={elements[second % 4]} />
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
        <Section title={dynamics.elementTitle} titleContent={<ElementHeading text={t(dynamics.elementTitle)} />}>
          <div className={pairStyles.combination}><ElementLabel element={elements[first % 4]} /><span>+</span><ElementLabel element={elements[second % 4]} /></div>
          {dynamics.elementParagraphs.map((paragraph, index) => <p key={index}>{t(paragraph)}</p>)}
        </Section>
        <Section title={dynamics.modalityTitle}>
          <div className={pairStyles.combination}>{t(modalities[first % 3])}<span>+</span>{t(modalities[second % 3])}</div>
          {dynamics.modalityParagraphs.map((paragraph, index) => <p key={index}>{t(paragraph)}</p>)}
        </Section>
        <Section title={{ en: "Soul-Level Connection", zh: "深层连接" }}>
          <p>
            {t({
              en: "Use differences as an invitation to understand, not as a verdict. A shared intention and honest repair matter more than any sign pairing.",
              zh: "把差异当作理解的邀请，而非关系的判决。共同意愿和真诚修复，比任何星座组合更重要。",
            })}
          </p>
          <div className={pairStyles.columns}>
            {[first, second].map((i, index) => <article key={index}>
              <h3><ZodiacLabel sign={i}>{SIGN_SYMBOLS[i]} {sign(i)}</ZodiacLabel></h3>
              <p>{t(zodiacProfiles[i].purpose)}</p>
              <p>{t(zodiacProfiles[i].lesson)}</p>
            </article>)}
          </div>
        </Section>
        <Section title={{ en: "Sign Profiles", zh: "双方星座资料" }}>
          <div className={pairStyles.columns}>
            {[first, second].map((i, index) => (
              <article key={index}>
                <h3>
                  <ZodiacLabel sign={i}>
                    {SIGN_SYMBOLS[i]} {sign(i)}
                  </ZodiacLabel>
                </h3>
                <div className={pairStyles.traits}>{zodiacProfiles[i].traits.map((trait) => <span key={trait.en}>{t(trait)}</span>)}</div>
                {zodiacProfiles[i].about.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{t(paragraph)}</p>)}
                <p><strong>{t({ en: "Strengths", zh: "优势" })}: </strong>{zodiacProfiles[i].strengths.map(t).join(language === "zh" ? "、" : ", ")}</p>
                <p><strong>{t({ en: "Growth opportunities", zh: "成长课题" })}: </strong>{zodiacProfiles[i].challenges.map(t).join(language === "zh" ? "、" : ", ")}</p>
                <Link
                  href={`/stella/zodiac/${signSlugs[i]}`}
                  className={styles.muted}
                >
                  {t({ en: "Explore this sign", zh: "了解这个星座" })} →
                </Link>
              </article>
            ))}
          </div>
        </Section>
        <Section title={{ en: "Learn More About Each Sign", zh: "深入了解双方星座" }}>
          <div className={pairStyles.profileLinks}>{[first, second].map((i, index) => <Link key={index} href={`/stella/zodiac/${signSlugs[i]}`}><ZodiacLabel sign={i}>{SIGN_SYMBOLS[i]} {sign(i)} →</ZodiacLabel></Link>)}</div>
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
