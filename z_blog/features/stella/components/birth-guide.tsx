"use client";
import { ElementLabel } from "./element-label";

import Link from "next/link";
import { guideFaq } from "../lib/faq-content";
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
      en: "The Sun is a starting point for exploring identity: what gives you energy, how you create and which choices feel personally meaningful. Its sign offers a style of expression; its house and aspects add context that a single zodiac label cannot provide.",
      zh: "太阳是探索自我认同的起点：什么让你充满活力，如何发挥创造力，哪些选择对你真正有意义。太阳星座提示表达风格，宫位与相位则补充单一星座标签无法呈现的背景。",
    },
  },
  {
    symbol: "☽",
    title: { en: "Moon Sign", zh: "月亮星座" },
    copy: {
      en: "The Moon helps you reflect on emotional habits, private needs and the ways you restore a sense of safety. Notice how you react before you have time to think. Its house and aspects describe the settings and relationships in which these responses become especially noticeable.",
      zh: "月亮帮助你观察情绪习惯、私密需求与恢复安全感的方式。留意来不及思考时的本能回应，再结合宫位和相位，理解这些反应在哪些生活场景与关系中更为明显。",
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
      en: "The Midheaven invites reflection on public contribution, professional identity and the qualities you develop by taking responsibility. Consider what you want your work to stand for, not merely a job title. Read its ruler and aspects alongside the rest of the chart rather than predicting a fixed occupation.",
      zh: "天顶引导你思考公共贡献、职业认同与承担责任时形成的品质。关注你希望工作体现的价值，而不仅是职位名称。结合守护星、相位与完整星盘理解它，不把它当作某种固定职业的预言。",
    },
  },
  {
    symbol: "♇",
    title: { en: "Planetary Positions", zh: "行星位置" },
    copy: {
      en: "Mercury, Venus and Mars offer lenses on thinking, relating and taking action. Jupiter and Saturn bring questions of growth, limits and commitment, while the outer planets add wider cycles of change. A placement becomes more useful when sign, house and aspects are interpreted together.",
      zh: "水星、金星和火星分别提供观察思考、关系与行动的视角。木星与土星关联拓展、边界和承诺，外行星则补充更长期的变化周期。把星座、宫位与相位放在一起，才能让单个落点获得更完整的意义。",
    },
  },
  {
    symbol: "⌂",
    title: { en: "Houses", zh: "十二宫位" },
    copy: {
      en: "The twelve houses locate chart themes in everyday experience: identity, money, learning, home, creativity, routines, partnership and beyond. A planet's house asks where its symbolism may be explored. House cusps depend on the birth time, location and chosen house system, so keep those settings consistent when comparing charts.",
      zh: "十二宫把星盘主题放进实际生活：自我、金钱、学习、家庭、创造、日常与伙伴关系等。行星所在宫位提示可在哪个领域探索其象征。宫头取决于出生时间、地点及宫制，因此比较星盘时需要保持这些设置一致。",
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
    title: { en: "Soul Purpose", zh: "灵魂使命" },
    copy: {
      en: "A soul-oriented reading asks how insight can become a more intentional life. Use recurring themes to reflect on values, service and the qualities you want to cultivate. Esoteric traditions add symbolic frameworks, but a chart cannot establish an objective spiritual rank or remove your freedom to choose.",
      zh: "面向灵魂成长的解读关注：如何把理解转化为更有意识的生活。通过反复出现的主题，思考价值观、贡献与希望培养的品质。秘传传统提供额外的象征框架，但星盘不能客观判定灵性等级，也不会剥夺你的选择自由。",
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
      <Section title={{ en: "Beyond Personality Astrology", zh: "超越性格层面的占星" }}>
        <p>{t({
          en: "Move from describing familiar tendencies to choosing how you want to live. Reflection becomes useful when it changes an everyday decision.",
          zh: "从描述熟悉的倾向，走向主动选择生活方式。当一次反思改变了日常决定，理解才真正落地。",
        })}</p>
        <div className={styles.grid}>
          {[
            { title: { en: "Soul Purpose", zh: "灵魂使命" }, copy: { en: "Consider a quality you want to practise, not a destiny you must fulfil. Let the Ascendant prompt questions about courage, awareness and contribution; your circumstances and choices shape the answer.", zh: "关注希望练习的品质，而不是必须完成的宿命。以上升星座为起点，思考勇气、觉察与贡献，再由现实处境和个人选择形成答案。" } },
            { title: { en: "Growth Through Challenge", zh: "在挑战中成长" }, copy: { en: "When two needs seem incompatible, avoid labelling one as a flaw. Name the tension, experiment with a small change and notice what helps you respond more thoughtfully.", zh: "当两种需要看似冲突时，不急着把其中一种视为缺陷。说清张力、尝试小幅调整，观察什么能帮助自己更有意识地回应。" } },
            { title: { en: "Life as a Journey", zh: "把生命视为旅程" }, copy: { en: "Return to your chart as your experience changes. Keep a journal of questions and decisions; over time, compare interpretation with lived experience rather than treating the first reading as a final identity.", zh: "随着经历变化重新阅读星盘，记录问题与决定。让诠释与真实生活相互对照，而不是把第一次解读当成最终的身份定义。" } },
          ].map((item) => <article key={item.title.en} className={styles.card}><h3>{t(item.title)}</h3><p>{t(item.copy)}</p></article>)}
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
                <ElementLabel element={elements[i % 4]} /> · {t(modalities[i % 3])} ·{" "}
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
          ...guideFaq,
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
