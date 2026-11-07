"use client";
import { skyFaq } from "../lib/faq-content";
import { FAQ } from "./explore-shared";

import { useState } from "react";
import Link from "next/link";
import { ZodiacLabel } from "./zodiac-constellation";
import {
  SIGN_NAMES,
  SIGN_SYMBOLS,
  PLANET_SYMBOLS,
  type SkySnapshot,
} from "../lib/sky";
import { elements, planetCopy } from "../lib/explore-config";
import {
  ExploreShell,
  Section,
  MoonDisc,
  TimeText,
  styles,
  useExplore,
  Input,
} from "./explore-shared";

export function PlanetTable({ snapshot }: { snapshot: SkySnapshot }) {
  const { language, t } = useExplore();
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {[
              { en: "Planet", zh: "行星" },
              { en: "Sign", zh: "星座" },
              { en: "Degree", zh: "度数" },
              { en: "Motion", zh: "运动" },
            ].map((copy) => (
              <th key={copy.en} scope="col">
                {t(copy)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {snapshot.planets.map((p) => (
            <tr key={p.key}>
              <th scope="row">
                <Link href={`/stella/planets/${p.key}`}>
                  {PLANET_SYMBOLS[p.key]}{" "}
                  {language === "zh" ? p.labelZh : p.label}
                </Link>
              </th>
              <td>
                <ZodiacLabel sign={p.signIndex} size="compact">
                  {SIGN_SYMBOLS[p.signIndex]}{" "}
                  {SIGN_NAMES[language][p.signIndex]}
                </ZodiacLabel>
              </td>
              <td>{Math.floor(p.signDegrees)}°</td>
              <td className={p.retrograde ? styles.retro : undefined}>
                {t(
                  p.retrograde
                    ? { en: "Retrograde ℞", zh: "逆行 ℞" }
                    : { en: "Direct", zh: "顺行" },
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
const aspectNames: Record<string, { en: string; zh: string }> = {
  conjunction: { en: "Conjunction", zh: "合相" },
  sextile: { en: "Sextile", zh: "六合" },
  square: { en: "Square", zh: "四分" },
  trine: { en: "Trine", zh: "三分" },
  opposition: { en: "Opposition", zh: "对分" },
};
export default function SkyExplorer({
  snapshot,
  time,
}: {
  snapshot: SkySnapshot;
  time: string;
}) {
  const { language, t } = useExplore();
  const [date, setDate] = useState(time.slice(0, 10));
  return (
    <ExploreShell
      title={{
        en: "Today's Sky — Planetary Positions & Aspects",
        zh: "今日星空：行星位置与相位",
      }}
      description={{
        en: "A live view of the tropical zodiac, major aspects and lunar illumination.",
        zh: "查看回归黄道中的行星位置、主要相位与月亮照明比例。",
      }}
    >
      <form className={styles.toolbar} method="get">
        <label className={styles.field}>
          {t({
            en: "Date (12:00 UTC for selected dates)",
            zh: "日期（所选日期以 UTC 12:00 计算）",
          })}
          <Input
            type="date"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min="1900-01-01"
            max="2100-12-31"
            required
          />
        </label>
        <button className={styles.button} type="submit">
          {t({ en: "View sky", zh: "查看星空" })}
        </button>
        <Link href="/stella/todays-sky" className={styles.muted}>
          {t({ en: "Now", zh: "此刻" })}
        </Link>
      </form>
      <p className={styles.small}>
        <TimeText value={time} />
      </p>
      <Section title={{ en: "Planetary Positions", zh: "行星位置" }}>
        <PlanetTable snapshot={snapshot} />
      </Section>
      <Section title={{ en: "Moon Phase", zh: "月相" }}>
        <div className={styles.row}>
          <MoonDisc phase={snapshot.moon.phase} />
          <strong>{(snapshot.moon.illumination * 100).toFixed(1)}%</strong>
          <span className={styles.muted}>
            {t({ en: "illuminated", zh: "被照亮" })} ·{" "}
            {t(
              snapshot.moon.phase < 180
                ? { en: "Waxing", zh: "盈月" }
                : { en: "Waning", zh: "亏月" },
            )}
          </span>
        </div>
      </Section>
      <Section title={{ en: "Active Aspects", zh: "当前主要相位" }}>
        <p className={styles.small}>
          {t({
            en: "Major aspect orbs: conjunction/opposition 8°, square/trine 7°, sextile 4°. Sorted by closeness.",
            zh: "主要相位容许度：合相／对分 8°，四分／三分 7°，六合 4°。按精确程度排列。",
          })}
        </p>
        <div className={styles.grid}>
          {snapshot.aspects
            .toSorted((a, b) => a.orb - b.orb)
            .map((a) => (
              <article className={styles.card} key={`${a.a}-${a.b}`}>
                <h3>
                  {PLANET_SYMBOLS[a.a]} {t(planetCopy[a.a].name)} ·{" "}
                  {PLANET_SYMBOLS[a.b]} {t(planetCopy[a.b].name)}
                </h3>
                <p>
                  {t(aspectNames[a.type])} · {a.orb.toFixed(2)}°
                </p>
              </article>
            ))}
        </div>
      </Section>
      <Section title={{ en: "Elemental Balance", zh: "四元素分布" }}>
        <div className={styles.grid}>
          {elements.map((element, i) => {
            const matches = snapshot.planets.filter(
              (p) => p.signIndex % 4 === i,
            );
            return (
              <article key={element.en}>
                <h3>
                  {t(element)} · {matches.length}
                </h3>
                <div className={styles.progress}>
                  <span style={{ width: `${matches.length * 10}%` }} />
                </div>
                <p>
                  {matches
                    .map((p) => (language === "zh" ? p.labelZh : p.label))
                    .join(" · ") || t({ en: "No planets", zh: "暂无行星" })}
                </p>
              </article>
            );
          })}
        </div>
      </Section>
      <Section title={{ en: "How to Use This Information", zh: "如何使用这些信息" }}>
        <div className={styles.grid}>
          {[
            {
              title: { en: "Planetary Signs", zh: "行星落座" },
              body: { en: "A planet describes a theme, while its sign suggests how that theme is expressed. For example, Mercury's communication style can be more spontaneous in fire signs and more sensitive to feeling in water signs.", zh: "行星代表一种主题，星座则提示它的表达方式。例如，水星在火象星座时可侧重主动表达，在水象星座时则更关注感受与直觉。" },
            },
            {
              title: { en: "Retrograde Planets", zh: "逆行行星" },
              body: { en: "Astrological tradition interprets apparent backward motion as a time to turn attention inward. Reviewing plans, revisiting conversations and finishing unresolved matters are ways to work with that theme rather than rushing a new beginning.", zh: "占星传统把逆向视运动理解为向内关注的时段。检视计划、重新沟通和处理未完成事务，都能呼应这一主题，而不必急于开启新局。" },
            },
            {
              title: { en: "Aspects", zh: "行星相位" },
              body: { en: "Aspects connect planetary themes. Trines and sextiles are traditionally associated with cooperation, squares with tension that calls for action, and oppositions with different needs seeking balance. Read the relationship between both planets, not just the aspect name.", zh: "相位连接行星主题。传统上，三分与六合关联合作，四分关联需要行动回应的张力，对分则提示不同需求之间的平衡。解读时应同时看两颗行星，而不只看相位名称。" },
            },
            {
              title: { en: "Personal Impact", zh: "个人影响" },
              body: { en: "The same sky can activate different parts of different birth charts. Compare transits with your natal planets and houses to identify the life areas involved, then consider those symbols alongside your actual circumstances and choices.", zh: "同一片天空会对应不同本命盘中的不同部分。把行运与自己的本命行星和宫位比较，了解涉及的生活领域，再结合现实处境与选择理解这些象征。" },
            },
          ].map((item) => <article className={styles.card} key={item.title.en}><h3>{t(item.title)}</h3><p>{t(item.body)}</p></article>)}
        </div>
      </Section>
      <Section
        title={{ en: "Understanding Today's Sky", zh: "如何理解今日星象" }}
      >
        <p>
          {t({
            en: "A transit describes the sky for everyone. Your natal chart supplies the personal context: the same transiting planet can activate different houses and aspects for different people. Retrograde is an apparent change in motion from Earth's perspective, not a planet physically reversing its orbit.",
            zh: "行运描述所有人共同面对的天空，而本命盘提供个人背景。同一颗行运行星对不同的人可能触发不同宫位和相位。逆行是地球视角中的视运动变化，并不是行星真的倒转公转方向。",
          })}
        </p>
        <p>
          {t({
            en: "Esoteric astrology treats planets and their relationships as spiritual symbols, sometimes interpreted through the seven-ray tradition. This is a contemplative framework, distinct from the astronomical measurements in the table.",
            zh: "秘传占星把行星及其关系视为灵性象征，有时结合七道光线传统理解。这是一种沉思框架，应与表格中的天文测量区分。",
          })}
        </p>
        <p>
          {t({
            en: "Instead of labelling an aspect fortunate or unfortunate, reflect on your response: which habit feels effortless, which tension asks for attention, and what choice is available now? Your birth chart can provide a starting point, not a predetermined answer.",
            zh: "比起给相位贴上幸运或不幸的标签，可以观察自己的回应：什么习惯自然发生，什么张力需要关注，此刻又有哪些选择？本命盘可以提供起点，但不是预先写好的答案。",
          })}
        </p>
      </Section>
      <FAQ items={skyFaq} />
    </ExploreShell>
  );
}
