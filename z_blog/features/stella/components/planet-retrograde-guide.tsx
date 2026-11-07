"use client";
import Link from "next/link";
import { retrogradeGuides } from "../lib/retrograde-guides";
import { retrogradeMyths } from "../lib/retrograde-myths";
import { retrogradePractices } from "../lib/retrograde-practices";
import { zodiacProfiles } from "../lib/zodiac-profiles";
import { signSlugs, planetCopy } from "../lib/explore-config";
import { SIGN_NAMES, SIGN_SYMBOLS, type SkyPlanet } from "../lib/sky";
import { houseThemes } from "./birth-guide";
import { ZodiacLabel } from "./zodiac-constellation";
import { Section, FAQ, styles, useExplore } from "./explore-shared";
import guideStyles from "./retrograde.module.css";

export default function PlanetRetrogradeGuide({ planet, position, time, year }: { planet: string; position: SkyPlanet; time: string; year: number }) {
  const { t, language } = useExplore();
  const guide = retrogradeGuides[planet], name = planetCopy[planet].name;
  return <>
    <Section title={{ en: `What Is ${name.en} Retrograde?`, zh: `什么是${name.zh}逆行？` }}>
      <p>{t(guide.cycle)}</p><p>{t(guide.summary)}</p>
      <p>{t({ en: "Retrograde is apparent motion viewed from Earth, not a reversal of a planet's physical orbit. The dates and sign positions above are calculated; the following themes are astrological interpretations rather than guaranteed events.", zh: "逆行是从地球观察到的视运动，并非行星真实轨道反转。上方日期与落座来自计算，下方主题属于占星诠释，不是必然事件。" })}</p>
    </Section>
    <Section title={{ en: "Myths vs. Reality", zh: "误区与事实" }}>
      <div className={guideStyles.cards}>{guide.misconceptions.map((item, index) => {
        const split = (value: string) => { const separator = language === "zh" ? "：" : ". "; const at = value.indexOf(separator); return at < 0 ? [value, ""] : [value.slice(0, at), value.slice(at + separator.length)]; };
        const [myth, reality] = split(t(item));
        const explanation = retrogradeMyths[planet][index];
        return <article className={guideStyles.card} key={index}>
          <strong>{t({ en: "Myth", zh: "误区" })}</strong><p>{myth}</p>
          <strong>{t({ en: "Reality", zh: "事实" })}</strong><p>{reality}</p>
          <p>{t(explanation.context)}</p>
          <strong>{t({ en: "A Practical Approach", zh: "可以怎么做" })}</strong><p>{t(explanation.action)}</p>
        </article>;
      })}</div>
    </Section>
    <Section title={{ en: `Your Sign's ${name.en} Retrograde Guide`, zh: `十二星座的${name.zh}逆行指南` }}>
      <p>{t({ en: "These prompts use the displayed reference position and whole-sign solar houses. They change with the planet's sign, not just the page title. For personal house placements, use a timed natal chart; the notes are not individual predictions.", zh: "以下提示采用显示的参考落座及太阳整宫法，会随行星所在星座变化，而非只替换标题。个人宫位仍需要准确出生时间，本区不是个人事件预测。" })}</p>
      <div className={guideStyles.cards}>{signSlugs.map((slug, index) => {
        const house = (position.signIndex - index + 12) % 12;
        return <article key={slug} className={guideStyles.card}>
          <h3><ZodiacLabel sign={index}>{SIGN_SYMBOLS[index]} {SIGN_NAMES[language][index]}</ZodiacLabel></h3>
          <p>{t({ en: `${name.en} in ${SIGN_NAMES.en[position.signIndex]} highlights solar house ${house + 1}: ${houseThemes[house].en}. Review how ${planetCopy[planet].theme.en} connects with that area of life.`, zh: `${name.zh}在${SIGN_NAMES.zh[position.signIndex]}，对应太阳整宫第 ${house + 1} 宫：${houseThemes[house].zh}。可以检视${planetCopy[planet].theme.zh}与这一生活领域的联系。` })}</p>
          <p>{t(zodiacProfiles[index].lesson)}</p>
          <Link href={`/stella/zodiac/${slug}`}>{t({ en: "Explore your sign", zh: "了解你的星座" })} →</Link>
        </article>;
      })}</div>
    </Section>
    <Section title={{ en: "A Deeper Perspective", zh: "更深层的视角" }}><p>{t(guide.deeper)}</p><p>{t({ en: "Use these themes as invitations to observe rather than instructions to fear. Notice a recurring habit, choose one manageable change and review its real effect. Your agency and circumstances matter more than a general transit description.", zh: "把这些主题当作观察邀请，而不是需要恐惧的指令。留意反复习惯，选择一项可行调整，再观察真实效果。自主选择与现实处境比笼统行运描述更重要。" })}</p></Section>
    <Section title={{ en: "Practical Tips", zh: "实用建议" }}><div className={guideStyles.cards}>{guide.practices.map((tip, index) => {
      const text = t(tip), separator = language === "zh" ? "：" : ": ", at = text.indexOf(separator);
      const detail = retrogradePractices[planet][index];
      return <article className={guideStyles.card} key={index}>
        <h3>{at < 0 ? text : text.slice(0, at)}</h3><p>{at < 0 ? "" : text.slice(at + separator.length)}</p>
        <p>{t(detail.steps)}</p>
        <strong>{t({ en: "Try This", zh: "试着这样做" })}</strong><p>{t(detail.example)}</p>
      </article>;
    })}</div></Section>
    <FAQ items={[
      { question: { en: `Is ${name.en} retrograde at the reference time?`, zh: `参考时刻${name.zh}正在逆行吗？` }, answer: { en: `${position.retrograde ? "Yes, retrograde" : "No, direct"} in ${SIGN_NAMES.en[position.signIndex]} at ${time}. Check the status panel for the reference-date convention.`, zh: `${time}，${name.zh}在${SIGN_NAMES.zh[position.signIndex]}${position.retrograde ? "逆行" : "顺行"}。参考日期规则见状态区说明。` } },
      { question: { en: `When is ${name.en} retrograde in ${year}?`, zh: `${year} 年${name.zh}什么时候逆行？` }, answer: { en: "The schedule above lists every calculated interval intersecting the selected year. Boundary labels identify periods already underway on January 1 or continuing into the following year. Change the year selector to explore another calendar.", zh: "上方日历列出与所选年份相交的所有计算区间，边界标记说明年初已开始或延续到下一年的情况。可通过年份选择器查看其他年份。" } },
      { question: { en: "How often and how long does it retrograde?", zh: "逆行多久发生一次，会持续多久？" }, answer: guide.cycle },
      { question: { en: "How should I approach this period?", zh: "这段时间适合如何安排？" }, answer: { en: `${guide.practices.map((tip) => tip.en).join(" ")} These are reflective suggestions, not rules that override practical responsibilities or professional advice.`, zh: `${guide.practices.map((tip) => tip.zh).join(" ")}这些是反思建议，不替代实际责任或专业意见。` } },
      { question: { en: `What is a common misconception about ${name.en} retrograde?`, zh: `关于${name.zh}逆行有什么常见误解？` }, answer: guide.misconceptions[0] },
    ]} />
    <p><Link href="/stella" className={styles.button}>{t({ en: "Explore Your Birth Chart", zh: "探索你的出生星盘" })}</Link></p>
  </>;
}
