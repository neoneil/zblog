"use client";

import Link from "next/link";
import { ZodiacLabel } from "./zodiac-constellation";
import { SIGN_NAMES, SIGN_SYMBOLS } from "../lib/sky";
import {
  elements,
  modalities,
  signSlugs,
  signQualities,
  signChallenges,
  planetCopy,
  rulers,
  type Copy,
} from "../lib/explore-config";
import {
  ExploreShell,
  Section,
  FAQ,
  styles,
  useExplore,
} from "./explore-shared";

const placements: { symbol: string; title: Copy; copy: Copy }[] = [
  {
    symbol: "☉",
    title: { en: "Sun Sign", zh: "太阳星座" },
    copy: {
      en: "Your Sun describes identity, vitality and the direction of creative expression. It is one part of the chart, not the whole personality.",
      zh: "太阳对应自我认同、生命力和创造性表达的方向。它是星盘的一部分，并不代表完整人格。",
    },
  },
  {
    symbol: "☽",
    title: { en: "Moon Sign", zh: "月亮星座" },
    copy: {
      en: "The Moon describes emotional responses, familiar habits and what helps you feel secure. Its faster motion makes the birth date and time important.",
      zh: "月亮对应情绪反应、熟悉的习惯和安全感来源。它移动较快，因此出生日期和时间很重要。",
    },
  },
  {
    symbol: "ASC",
    title: { en: "Rising Sign", zh: "上升星座" },
    copy: {
      en: "The Ascendant marks the eastern horizon. It frames your approach to unfamiliar situations and anchors the houses; an accurate birth time and place are essential.",
      zh: "上升点标记东方地平线，象征面对新情境的方式，也是宫位的重要基准。需要准确的出生时间和地点。",
    },
  },
  {
    symbol: "MC",
    title: { en: "Midheaven", zh: "天顶" },
    copy: {
      en: "The Midheaven relates to public direction, vocation and what you develop through responsibility. It is not a prediction of a particular occupation.",
      zh: "天顶对应公共方向、职业志向与责任中的发展，并不预言某一种具体职业。",
    },
  },
  {
    symbol: "♇",
    title: { en: "Planetary Positions", zh: "行星位置" },
    copy: {
      en: "Each planet represents a function. Its sign suggests a style of expression, while its house places that theme in a part of daily life.",
      zh: "每颗行星象征一种功能，星座提示表达风格，宫位则把主题放进生活领域。",
    },
  },
  {
    symbol: "⌂",
    title: { en: "Houses", zh: "十二宫位" },
    copy: {
      en: "Houses organize the chart into life areas. Different house systems may give different cusps, so compare charts using the same settings.",
      zh: "宫位将星盘划分为不同生活领域。不同宫制可能给出不同宫头，比较星盘时应使用相同设置。",
    },
  },
  {
    symbol: "⚹",
    title: { en: "Aspects", zh: "行星相位" },
    copy: {
      en: "Aspects are angular relationships. A conjunction joins themes; a sextile supports exchange; a square calls for adjustment; a trine flows; an opposition asks for balance.",
      zh: "相位是行星之间的角度关系。合相汇聚主题，六合支持交流，四分提示调整，三分较为流畅，对分要求平衡。",
    },
  },
  {
    symbol: "✦",
    title: { en: "Soul Purpose", zh: "成长方向" },
    copy: {
      en: "Read the whole chart as a set of questions about values, growth and contribution. No placement removes your freedom to choose how to live.",
      zh: "把完整星盘看作关于价值观、成长和贡献的一组问题。任何位置都不会剥夺你选择生活方式的自由。",
    },
  },
];
export const houseThemes: Copy[] = [
  { en: "identity and initiative", zh: "自我与主动性" },
  { en: "resources and values", zh: "资源与价值观" },
  { en: "communication and learning", zh: "沟通与学习" },
  { en: "home and foundations", zh: "家庭与根基" },
  { en: "creativity and play", zh: "创造与玩乐" },
  { en: "routines and service", zh: "日常与服务" },
  { en: "partnership and agreements", zh: "伙伴与约定" },
  { en: "shared resources and trust", zh: "共享资源与信任" },
  { en: "beliefs and exploration", zh: "信念与探索" },
  { en: "vocation and public life", zh: "事业与公共生活" },
  { en: "community and future hopes", zh: "社群与未来愿景" },
  { en: "rest and the inner world", zh: "休息与内在世界" },
];
export default function BirthGuide() {
  const { language, t } = useExplore();
  return (
    <ExploreShell
      title={{ en: "Free Birth Chart Calculator", zh: "出生星盘指南" }}
      description={{
        en: "Understand your Sun, Moon, Rising sign and the relationships that make your chart unique.",
        zh: "了解太阳、月亮、上升，以及构成你独特星盘的行星关系。",
      }}
    >
      <div className={styles.header}>
        <Link href="/stella" className={styles.button}>
          {t({ en: "Calculate Your Birth Chart", zh: "计算出生星盘" })}
        </Link>
      </div>
      <Section
        title={{ en: "What Your Birth Chart Reveals", zh: "出生星盘呈现什么" }}
      >
        <div className={styles.grid}>
          {placements.map((item) => (
            <article className={styles.card} key={item.title.en}>
              <span className={styles.symbol}>{item.symbol}</span>
              <h3>{t(item.title)}</h3>
              <p>{t(item.copy)}</p>
            </article>
          ))}
        </div>
      </Section>
      <Section title={{ en: "What You Need", zh: "需要准备的信息" }}>
        <div className={styles.grid}>
          {[
            { en: "Birth date", zh: "出生日期" },
            { en: "Exact birth time", zh: "准确出生时间" },
            { en: "Birthplace", zh: "出生地点" },
          ].map((item, i) => (
            <div key={item.en}>
              <h3>
                {i + 1}. {t(item)}
              </h3>
              <p>
                {t(
                  [
                    {
                      en: "Use the full date, including the year. Planetary positions are calculated for that specific moment.",
                      zh: "填写包含年份的完整日期，行星位置需要按具体时刻计算。",
                    },
                    {
                      en: "Check a birth certificate where possible. If the time is uncertain, do not treat the Ascendant or houses as precise.",
                      zh: "尽可能核对出生证明。时间不确定时，不宜把上升点与宫位当作精确结果。",
                    },
                    {
                      en: "The local horizon depends on geographic coordinates and the historical time zone at birth.",
                      zh: "当地地平线取决于经纬度，以及出生时当地实际使用的历史时区。",
                    },
                  ][i],
                )}
              </p>
            </div>
          ))}
        </div>
      </Section>
      <Section title={{ en: "The Twelve Houses", zh: "十二宫位" }}>
        <div className={styles.grid}>
          {houseThemes.map((item, i) => (
            <div key={i}>
              <h3>{i + 1}</h3>
              <p>{t(item)}</p>
            </div>
          ))}
        </div>
      </Section>
      <Section title={{ en: "The Twelve Signs", zh: "十二星座" }}>
        <div className={styles.grid}>
          {signSlugs.map((slug, i) => (
            <article className={styles.card} id={slug} key={slug}>
              <h3>
                <ZodiacLabel sign={i}>
                  {SIGN_SYMBOLS[i]} {SIGN_NAMES[language][i]}
                </ZodiacLabel>
              </h3>
              <span className={styles.small}>
                {t(elements[i % 4])} · {t(modalities[i % 3])} ·{" "}
                {t(planetCopy[rulers[i]].name)}
              </span>
              <p>{t(signQualities[i])}</p>
              <p>{t(signChallenges[i])}</p>
            </article>
          ))}
        </div>
      </Section>
      <FAQ
        items={[
          {
            question: {
              en: "Can I calculate without a birth time?",
              zh: "没有出生时间可以计算吗？",
            },
            answer: {
              en: "You can explore planetary signs using an approximate time, but the Moon may change sign during the day. Ascendant and houses cannot be considered reliable without a birth time.",
              zh: "可以用近似时间查看行星落座，但月亮可能在当天换座。缺少出生时间时，上升点和宫位不具可靠精度。",
            },
          },
          {
            question: {
              en: "Why can two calculators disagree?",
              zh: "为什么不同计算器结果不同？",
            },
            answer: {
              en: "Check time zones, daylight saving, zodiac convention, house system and aspect orbs. Small setting differences can change angles or a placement near a boundary.",
              zh: "请比较时区、夏令时、黄道体系、宫制和相位容许度。设置差异可能改变角度或边界附近的落座。",
            },
          },
        ]}
      />
    </ExploreShell>
  );
}
