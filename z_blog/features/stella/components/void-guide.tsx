"use client";

import { Check, Pause, Moon, Focus } from "lucide-react";
import type { Copy } from "../lib/explore-config";
import { Section, useExplore } from "./explore-shared";
import styles from "./void-guide.module.css";

const c = (en: string, zh: string): Copy => ({ en, zh });
export const voidIntroduction = [
  c("In astrology, a void-of-course Moon is the interval after the Moon's final major planetary aspect in a zodiac sign and before it enters the next sign. The five aspects normally considered are the conjunction, sextile, square, trine and opposition. 'Void' describes this particular aspect convention, not a Moon that has stopped moving or lost its gravitational influence.", "在占星学中，月亮空亡指月亮在某个星座内完成最后一次主要行星相位，到进入下一个星座之间的间隔。通常考虑合相、六合、刑相、拱相与对冲。空亡描述的是这一特定相位规则，并不表示月亮停止运动或失去引力。"),
  c("Traditional timing practices associate this interval with a pause in outward momentum. Here, it is offered as an optional planning and reflection framework, not a prediction that an undertaking will fail. A useful question is whether a task needs a fresh commitment or simply steady attention to something already underway.", "传统择时实践把这段间隔与向外推进的暂停联系起来。本页将其作为可选的规划与反思框架，而不是预言某项行动必然失败。可以问自己：眼前任务需要作出全新承诺，还是只需要稳定照料已经开始的事情？"),
  c("A VOC interval is not a Moon phase, an eclipse or a personal natal placement. Its length depends on the chosen aspect rules and the changing planetary geometry, so it is not a fixed daily break. Read the actual start and end times in your selected time zone instead of assuming the entire date is unsuitable.", "空亡不是月相、日月食或个人本命配置。时长取决于采用的相位规则与不断变化的行星位置，并不是每天固定的一段休息时间。请按所选时区查看实际起止时刻，不要把整天都视为不适合行动。"),
];

export const voidActivities = [
  {
    title: c("Favorable During VOC", "适合安排的事情"), icon: Check,
    intro: c("Choose continuity over pressure: keep useful work moving without requiring every moment to produce a new beginning.", "以延续代替施压：让有价值的事情继续推进，不要求每个时刻都必须开启新篇章。"),
    items: [
      c("Routine and maintenance: organise files, tidy your workspace and handle familiar administrative tasks. Use a checklist so small jobs leave a clear result.", "日常与维护：整理文件、收拾工作区、处理熟悉的行政事务。用清单留下清楚的完成结果。"),
      c("Reflection and meditation: take a quiet walk or write down what is occupying your attention. Notice feelings without requiring an immediate explanation.", "反思与静心：安静散步，或写下正在牵动注意力的事情。观察感受，不急着为它们找到解释。"),
      c("Creative exploration: sketch, gather references or draft several alternatives. Let an idea remain provisional before deciding which version deserves investment.", "创意探索：画草稿、收集参考、构思多个方案。允许想法暂时保持开放，再决定哪一个值得投入。"),
      c("Rest and everyday care: make room for food, sleep and a manageable pace. Recovery is useful in its own right, not a reward that must be earned.", "休息与日常照顾：照顾饮食、睡眠与可承受的节奏。恢复本身有价值，不是必须先证明努力才配获得的奖励。"),
      c("Completion and review: edit an existing draft, finish a small outstanding task or document lessons from a completed project before taking on another.", "收尾与复盘：修改已有稿件、完成积压小事，或记录已结束项目的经验，再考虑接下一个任务。"),
    ],
  },
  {
    title: c("Best Approached With Care", "适合审慎处理的事情"), icon: Pause,
    intro: c("Traditional cautions concern consequential new starts. Treat them as prompts for due diligence, not rules that cancel your agency or real-world obligations.", "传统提醒主要涉及影响较大的新开始。把它们当作认真核查的提示，而不是取消自主选择与现实责任的禁令。"),
    items: [
      c("New projects or businesses: check readiness, ownership and resources. If timing is flexible, use the pause to resolve an unanswered question rather than rushing a launch.", "新项目或创业：检查准备程度、职责归属与资源。时间允许时，用停顿解决尚未明确的问题，不必仓促启动。"),
      c("Contracts and commitments: read the terms, confirm expectations and seek suitable advice where needed. A lunar calendar never substitutes for understanding an agreement.", "合同与承诺：阅读条款、核对期待，必要时寻求适当专业意见。月历不能代替对协议的真实理解。"),
      c("Interviews and first meetings: prepare carefully and clarify practical details. Keep an existing appointment when appropriate; do not assume the other person or outcome is unsuitable.", "面试与初次见面：认真准备，明确实际安排。适当时照常赴约，不要据此认定对方不合适或结果注定不好。"),
      c("Major purchases: verify specifications, total cost and return conditions. Separate a genuine need from pressure to decide before you have enough information.", "重要购买：核对规格、总费用与退换条件。区分真实需求与信息不足时被催促作决定的压力。"),
      c("Product and campaign launches: review testing, approvals and support arrangements. Honour necessary deadlines; readiness and responsible execution matter more than symbolic timing.", "产品与活动发布：复查测试、审批与支持安排。遵守必要时限，准备充分与负责任地执行比象征性择时更重要。"),
    ],
  },
];

export const voidCalculation = [
  c("The starting point is geocentric ecliptic longitude: the Moon's position around the zodiac as viewed from Earth. Each sign occupies 30 degrees. This calendar detects a change of sign using hourly samples; the recorded end of an interval is therefore a sampled ingress boundary, not a second-by-second solution of the crossing.", "计算从地心黄经开始，即从地球观察月亮在黄道上的位置。每个星座占三十度。本日历按小时取样识别换座，因此区间结束记录的是取样得到的换座边界，不是逐秒求解的精确跨界时刻。"),
  c("For each detected ingress, the current implementation scans backward through that sign in thirty-minute steps. At each step it compares the Moon with the Sun, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune and Pluto. It checks angular separations against 0, 60, 90, 120 and 180 degrees, accepting a difference smaller than one degree.", "每次检测到换座后，现有实现会在前一个星座内以三十分钟步长回查。每一步比较月亮与太阳、水星、金星、火星、木星、土星、天王星、海王星及冥王星的位置，对照零、六十、九十、一百二十与一百八十度，并接受小于一度的偏差。"),
  c("The most recent qualifying sample becomes the displayed beginning. Because this is a tolerance-based search, that sample can fall after the exact aspect while the bodies remain within the allowed separation. It must not be read as the exact instant the final aspect perfected. Sampling and tolerance both affect the duration; the table is a calendar estimate, not a minute-accurate electional tool.", "最近一个符合条件的取样点成为显示的开始时间。由于搜索使用容许度，取样点可能位于精确成相之后，只要角距仍在范围内。因此不能把它理解为最后相位精确完成的时刻。取样和容许度都会影响时长，本表属于日历估算，不是分钟级精确择时工具。"),
  c("If no qualifying aspect sample is found, the implementation uses the recorded entry into that sign and labels the interval accordingly. Such a row describes the algorithm's result under its stated convention, not proof that no aspect occurred between samples. A calendar using exact root-finding, fewer planets or different aspect rules can legitimately show different boundaries.", "若没有找到符合条件的相位取样点，程序会使用记录的该星座进入时刻，并作相应标记。这代表当前算法与规则下的结果，不证明取样点之间从未出现相位。使用精确求根、更少行星或不同相位规则的日历，可能得到不同的边界。"),
  c("The selected month includes intervals whose recorded end falls within that UTC month, so an interval may begin in the preceding month. Times are stored in UTC; the selector changes their display to a supported local time zone, including its applicable daylight-saving offset. It does not alter planetary positions or recalculate the interval. Compare both calendars in the same time zone before interpreting a discrepancy.", "所选月份收录记录结束时刻落在该 UTC 月份内的区间，因此开始时刻可能在上个月。时间以 UTC 保存；时区选择器只转换显示，并应用当地相应的夏令时偏移，不会改变行星位置或重新计算区间。比较日历前，先统一时区。"),
];

export const voidPerspective = [
  c("A deeper way to approach this interval is as a threshold rather than a missing piece of time. Between finishing one activity and choosing the next, there can be space to notice what momentum usually conceals: an unspoken feeling, an unfinished thought or the simple need to stop. The lunar symbolism offers a language for that pause, not a requirement to experience it in a particular way.", "更深一层地理解，这段间隔可以是一道门槛，而非时间中的缺口。完成一件事与选择下一件事之间，留有空间看见惯性常掩盖的东西：尚未表达的感受、没有想完的念头，或只是想停下来的需要。月亮象征为停顿提供一种语言，不要求你必须产生某种体验。"),
  c("Some spiritual traditions describe quiet intervals as opportunities for inward receptivity. This is a contemplative interpretation, not a measured disappearance of planetary influence. You may find clarity, ordinary distraction or nothing remarkable at all. None of those responses makes the interval a success or failure, and a strong impression does not automatically become reliable guidance.", "一些灵性传统把安静间隔理解为向内聆听的机会。这属于观照性诠释，不是测量到行星影响消失。你可能感到清晰，也可能分心，或毫无特别感受。这些反应不代表成功或失败，强烈印象也不自动等于可靠指引。"),
  c("Try a small retreat within the day: close unnecessary tabs, sit comfortably and write three lines about what is complete, what can wait and what needs genuine attention. Let an answer remain unfinished if necessary. Before returning to activity, choose one grounded next step and check it against your responsibilities, available information and the needs of people affected by it.", "可以在一天中安排一次小型静修：关掉不必要的页面，舒适坐下，写三行——什么已完成、什么可以等待、什么真正需要关注。必要时允许答案暂时不完整。回到行动前，选一个扎实的下一步，并对照现实责任、可用信息与受影响者的需要。"),
  c("The aim is not to withdraw from life until the sky gives permission. It is to create a more deliberate transition from reaction to choice. Keep essential appointments and urgent care, and let rest serve engagement rather than avoidance. The most useful insight is one that helps you return to ordinary life with greater steadiness, kindness and practical clarity.", "目的不是退出生活，等待天空批准，而是在自动反应与主动选择之间创造更有意识的过渡。保留必要约会与紧急照护，让休息支持投入，而非变成逃避。真正有用的洞察，应帮助你以更稳定、友善而清晰的方式回到日常。"),
];

export default function VoidGuide() {
  const { t } = useExplore();
  return <>
    <Section title={c("What Is a Void of Course Moon?", "什么是月亮空亡？")}>
      {voidIntroduction.map((copy) => <p key={copy.en}>{t(copy)}</p>)}
    </Section>
    <Section title={c("What to Do (and Not Do) During a Void of Course Moon", "月亮空亡期间适合做什么，以及应谨慎处理什么？")}>
      <div className={styles.cards}>{voidActivities.map(({ title, intro, items, icon: Icon }) => <article className={styles.card} key={title.en}>
        <header><span className={styles.icon}><Icon size={24} aria-hidden="true" /></span><h3>{t(title)}</h3></header>
        <p>{t(intro)}</p>
        <ul>{items.map((item) => <li key={item.en}>{t(item)}</li>)}</ul>
      </article>)}</div>
    </Section>
    <Section title={c("How Void of Course Periods Are Calculated", "月亮空亡区间如何计算")}>
      {voidCalculation.map((copy) => <p key={copy.en}>{t(copy)}</p>)}
    </Section>
    <Section title={c("Using a Quiet Interval", "如何度过安静的间隙")}>
      <div className={styles.perspective}><Moon size={28} aria-hidden="true" /><h3>{t(c("A Deeper Perspective", "更深层的视角"))}</h3></div>
      {voidPerspective.map((copy) => <p key={copy.en}>{t(copy)}</p>)}
      <p className={styles.note}><Focus size={20} aria-hidden="true" />{t(c("Use the calendar as an invitation to pause, never as a substitute for evidence, consent or essential responsibilities.", "让日历成为停顿的邀请，不让它替代证据、同意或必要责任。"))}</p>
    </Section>
  </>;
}
