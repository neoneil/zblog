"use client";

import { useState } from "react";
import { Calculator } from "lucide-react";
import { lifePath } from "../lib/numerology";
import type { Copy } from "../lib/explore-config";
import {
  ExploreShell,
  Section,
  FAQ,
  Button,
  Input,
  styles,
  useExplore,
} from "./explore-shared";

const numbers: { number: number; title: Copy; copy: Copy }[] = [
  {
    number: 1,
    title: { en: "The Leader", zh: "开创者" },
    copy: {
      en: "Initiative and independence are the central themes. Practise choosing a direction while leaving room for collaboration. Confidence becomes more useful when it helps others find their own voice.",
      zh: "主动与独立是核心主题。练习选择方向，同时为合作留出空间。能够帮助别人找到声音的自信，更有价值。",
    },
  },
  {
    number: 2,
    title: { en: "The Diplomat", zh: "协调者" },
    copy: {
      en: "Cooperation, receptivity and relationship are the focus. Listen carefully without disappearing into another person's needs. A clear preference can make a partnership more honest.",
      zh: "合作、接纳和关系是重点。认真倾听，但不要在他人的需要里消失。清楚的个人偏好能让关系更真实。",
    },
  },
  {
    number: 3,
    title: { en: "The Creative", zh: "表达者" },
    copy: {
      en: "Expression and imagination invite you to make something shareable. Give inspiration a regular practice, and let playfulness coexist with substance and follow-through.",
      zh: "表达和想象邀请你创造可以分享的作品。为灵感建立日常练习，让趣味与内容、坚持并存。",
    },
  },
  {
    number: 4,
    title: { en: "The Builder", zh: "建设者" },
    copy: {
      en: "Structure, reliability and patient work are your themes. Build systems that support life, not systems that consume it. Flexibility can strengthen a foundation rather than weaken it.",
      zh: "结构、可靠与耐心投入是主题。建立支持生活的系统，而不是消耗生活的系统。灵活性也可以加固根基。",
    },
  },
  {
    number: 5,
    title: { en: "The Explorer", zh: "探索者" },
    copy: {
      en: "Change, curiosity and freedom call for direct experience. Choose an experiment and complete it before chasing the next. Freedom can include commitments that you choose consciously.",
      zh: "变化、好奇与自由鼓励亲身体验。选定一个尝试并完成，再追逐下一个。自由也包括自主选择的承诺。",
    },
  },
  {
    number: 6,
    title: { en: "The Nurturer", zh: "关怀者" },
    copy: {
      en: "Care, responsibility and beauty connect you to others. Ask whether help is wanted, and include yourself in the circle of care. Service need not become control or self-neglect.",
      zh: "关怀、责任与美感让你与他人连接。先确认对方是否需要帮助，也把自己放进照顾的范围。服务不必成为控制或忽视自己。",
    },
  },
  {
    number: 7,
    title: { en: "The Seeker", zh: "求索者" },
    copy: {
      en: "Study, introspection and discernment invite depth. Balance private reflection with real conversation, and allow evidence to reshape an idea you have grown attached to.",
      zh: "学习、内省与辨别力邀请深入探索。平衡独处与真实交流，也允许证据修正已经依恋的想法。",
    },
  },
  {
    number: 8,
    title: { en: "The Organiser", zh: "统筹者" },
    copy: {
      en: "Resources, influence and practical achievement are the themes. Define success beyond status, use authority transparently, and make the distribution of effort and reward fair.",
      zh: "资源、影响力与务实成就是主题。在地位之外定义成功，透明地运用权力，也公平分配投入与回报。",
    },
  },
  {
    number: 9,
    title: { en: "The Humanitarian", zh: "博爱者" },
    copy: {
      en: "Compassion and a wide perspective invite meaningful contribution. Choose a practical form for your ideals, and learn when a chapter can end without being a failure.",
      zh: "同理心和宽广视角邀请有意义的贡献。为理想选择具体形式，也理解一段经历结束不等于失败。",
    },
  },
  {
    number: 11,
    title: { en: "The Intuitive", zh: "直觉者" },
    copy: {
      en: "A master-number tradition associates 11 with sensitivity and inspiration. Ground insight in everyday routines and test your impressions with care rather than treating intuition as certainty.",
      zh: "大师数字传统将 11 与敏感度和启发联系。用日常习惯承载灵感，细心检验感受，不把直觉直接当成确定事实。",
    },
  },
  {
    number: 22,
    title: { en: "The Master Builder", zh: "愿景建设者" },
    copy: {
      en: "This archetype joins a large vision with practical structure. Break ambitious work into manageable steps and build with others. Potential is an invitation, not a burden to prove your worth.",
      zh: "这一原型把宏大愿景与实际结构联系起来。将目标拆成可行步骤，与他人共建。潜力是邀请，不是证明自身价值的负担。",
    },
  },
  {
    number: 33,
    title: { en: "The Master Teacher", zh: "慈悲引导者" },
    copy: {
      en: "Compassionate teaching and responsible care are the themes. Share what you have actually learned, stay open to correction, and keep healthy boundaries around the wish to help.",
      zh: "慈悲的引导与负责任的关怀是主题。分享真正学到的经验，保持可被纠正的开放，也为助人的愿望建立健康边界。",
    },
  },
];
export default function NumerologyExplorer() {
  const { t } = useExplore();
  const [date, setDate] = useState(""),
    [result, setResult] = useState<ReturnType<typeof lifePath> | null>(null),
    [error, setError] = useState(false);
  return (
    <ExploreShell
      title={{
        en: "Numerology — Life Path Number Calculator & Guide",
        zh: "生命数字：计算器与指南",
      }}
      description={{
        en: "Calculate your Life Path Number and explore nine number archetypes, master numbers and repeating sequences.",
        zh: "计算你的生命数字，探索九种数字原型、大师数字与重复数字序列。",
      }}
    >
      <section className={styles.card}>
        <h2>
          {t({ en: "Calculate Your Life Path Number", zh: "计算你的生命数字" })}
        </h2>
        <p>
          {t({
            en: "Reduce the month, day and year separately, keeping 11, 22 and 33, then reduce their sum using the same rule.",
            zh: "先分别约简月、日、年，保留 11、22、33，再以同一规则约简三者之和。",
          })}
        </p>
        <form
          className={`${styles.toolbar} ${styles.calculatorForm}`}
          onSubmit={(e) => {
            e.preventDefault();
            try {
              setResult(lifePath(date));
              setError(false);
            } catch {
              setResult(null);
              setError(true);
            }
          }}
        >
          <label className={styles.field}>
            {t({ en: "Date of birth", zh: "出生日期" })}
            <Input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setResult(null);
              }}
              required
              min="0001-01-01"
              max="9999-12-31"
            />
          </label>
          <Button className={styles.button} type="submit" disabled={!date}>
            <Calculator size={16} />
            {t({ en: "Calculate", zh: "计算" })}
          </Button>
        </form>
        {error ? (
          <p role="alert" className={styles.error}>
            {t({
              en: "Enter a valid birth date.",
              zh: "请输入有效的出生日期。",
            })}
          </p>
        ) : null}
        {result ? (
          <div className={styles.result} role="status">
            <strong>
              {result.number} ·{" "}
              {t(numbers.find((n) => n.number === result.number)!.title)}
            </strong>
            <p>
              {result.components.join(" + ")} = {result.sum} → {result.number}
            </p>
            <p>{t(numbers.find((n) => n.number === result.number)!.copy)}</p>
          </div>
        ) : null}
      </section>
      <Section
        title={{
          en: "The 9 Life Path Numbers & Master Numbers",
          zh: "九种生命数字与大师数字",
        }}
      >
        <div className={`${styles.grid} ${styles.threeColumns}`}>
          {numbers.map((item) => (
            <article
              className={styles.card}
              key={item.number}
              id={`number-${item.number}`}
            >
              <h3>
                {item.number} · {t(item.title)}
              </h3>
              <p>{t(item.copy)}</p>
            </article>
          ))}
        </div>
      </Section>
      <Section
        title={{
          en: "Angel Numbers & Their Meanings",
          zh: "重复数字与象征含义",
        }}
      >
        <p>
          {t({
            en: "Some people use repeating sequences as reminders for reflection. They do not establish that an external message or predicted event exists.",
            zh: "有些人把重复数字当作反思提醒，但这并不能证明外部信息或某个预言事件的存在。",
          })}
        </p>
        <div className={`${styles.grid} ${styles.threeColumns}`}>
          {numbers.slice(0, 9).map((item) => (
            <article key={item.number}>
              <h3>
                {String(item.number).repeat(3)} · {t(item.title)}
              </h3>
              <p>{t(item.copy)}</p>
            </article>
          ))}
        </div>
      </Section>
      <FAQ
        items={[
          {
            question: {
              en: "Which calculation method is used?",
              zh: "使用哪一种计算方法？",
            },
            answer: {
              en: "Month, day and year are reduced separately before addition. Master numbers 11, 22 and 33 are retained at each stage. Other traditions may use a different reduction method and return a different result.",
              zh: "先分别约简年月日，再相加。每个阶段都保留大师数字 11、22、33。其他传统可能使用不同的约简方法，结果也可能不同。",
            },
          },
          {
            question: {
              en: "Does this number determine my future?",
              zh: "这个数字决定我的未来吗？",
            },
            answer: {
              en: "No. Numerology is a symbolic belief system, not a scientific personality test or a forecast. Use the descriptions as questions rather than conclusions.",
              zh: "不会。数字命理属于象征性信念体系，不是科学人格测试或预测。可以把描述当作问题，而非结论。",
            },
          },
        ]}
      />
    </ExploreShell>
  );
}
