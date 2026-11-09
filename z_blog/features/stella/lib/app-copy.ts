import type { OpenAIChartJson } from "@/lib/astrology/natal-chart";
import {
  copy,
  esotericProfile,
  timingTechniques,
  type AnalysisTopic,
  type ReadingPeriod,
} from "./app-analysis";
import { SIGN_NAMES, type SkySnapshot } from "./sky";
import { solarHouseTheme } from "./horoscope-calculations";

export function generalReading(
  sign: number,
  period: ReadingPeriod,
  sky: SkySnapshot,
  language: "en" | "zh",
) {
  const sun = sky.planets.find((p) => p.key === "sun")!,
    mercury = sky.planets.find((p) => p.key === "mercury")!;
  const theme = solarHouseTheme(sign, sun.signIndex)[language];
  const zh = language === "zh";
  const focus = zh
    ? `${period === "today" ? "今天" : period === "week" ? "本周" : "本月"}，太阳位于${SIGN_NAMES.zh[sun.signIndex]}，为${SIGN_NAMES.zh[sign]}的太阳宫位带来关于${theme}的思考。${period === "today" ? "选择一个可以完成的小行动。" : period === "week" ? "把这个主题放进一周的安排，给沟通与调整留下空间。" : "把这个主题视为本月的主线，定期回顾目标与实际精力是否一致。"}`
    : `${period === "today" ? "Today" : period === "week" ? "This week" : "This month"}, the Sun in ${SIGN_NAMES.en[sun.signIndex]} highlights ${theme} in a solar-house reading for ${SIGN_NAMES.en[sign]}. ${period === "today" ? "Choose one manageable action." : period === "week" ? "Build this theme into the week's plans, with room for conversations and adjustment." : "Use this as a monthly thread, checking whether your priorities and available energy still agree."}`;
  const communication = zh
    ? `水星位于${SIGN_NAMES.zh[mercury.signIndex]}${mercury.retrograde ? "并处于逆行，适合检查约定、复核信息并重访未完成的对话" : "，可以留意自己的表达习惯，给事实核对与倾听同样的重视"}。这些是反思方向，而非事件必然发生的保证。`
    : `Mercury is in ${SIGN_NAMES.en[mercury.signIndex]}${mercury.retrograde ? " and retrograde: review agreements, verify information, and revisit unfinished conversations" : ". Notice your communication habits, giving fact-checking and listening equal attention"}. These are reflective prompts, not guarantees about events.`;
  return [focus, communication];
}

export const topicNames = {
  personal: copy("Your Personal Reading", "你的个人解读"),
  energy: copy("Today's Energy for You", "你的能量主题"),
  guidance: copy("Practical Guidance", "行动指引"),
  "soul-insight": copy("Soul Insight", "灵魂洞见"),
  "featured-transit": copy("Featured Transit", "重点行运"),
  profection: copy("Annual Profection", "年限推运"),
  progressions: copy("Secondary Progressions", "次限推运"),
  "solar-return": copy("Solar Return", "太阳返照"),
  "saturn-return": copy("Saturn Return", "土星回归"),
  "ray-constitution": copy("Ray Constitution", "射线构成"),
  vehicles: copy("Vehicle Tendencies", "身心载体倾向"),
  "soul-purpose": copy("Soul Purpose", "灵魂目的"),
  personality: copy("Personality Focus", "人格焦点"),
  emotions: copy("Emotional Pattern", "情感模式"),
  esoteric: copy("Esoteric Analysis", "秘传分析"),
  "saturn-lesson": copy("Saturn's Lesson", "土星的课题"),
  "life-moment": copy("Explore a Life Moment", "探索人生时刻"),
  planet: copy("Planetary Insight", "行星洞见"),
  aspect: copy("Aspect Insight", "相位洞见"),
} satisfies Record<AnalysisTopic, { en: string; zh: string }>;

export function analysisText(
  topic: AnalysisTopic,
  chart: OpenAIChartJson,
  sky: SkySnapshot,
  language: "en" | "zh",
  period: ReadingPeriod = "today",
  utc?: string,
  date = new Date(),
) {
  const zh = language === "zh";
  const point = (key: string) => {
    const p = [...chart.planets, ...chart.angles].find((p) => p.key === key);
    return p
      ? `${zh ? p.labelZh : p.label} · ${zh ? p.signZh : p.sign} ${p.signDegrees.toFixed(2)}°${p.house ? ` · ${zh ? "第" : "House "}${p.house}${zh ? "宫" : ""}` : ""}`
      : key;
  };
  const profile = esotericProfile(chart),
    dominant = profile.rays[0];
  const sun = point("sun"),
    moon = point("moon"),
    asc = point("ascendant"),
    saturn = point("saturn");
  const sunTransit = sky.planets.find((p) => p.key === "sun")!;
  const timing =
    utc && ["profection", "progressions", "solar-return"].includes(topic)
      ? timingTechniques(chart, utc, date)
      : null;
  const texts: Partial<Record<AnalysisTopic, string>> = {
    energy: zh
      ? `${sun}。${period === "today" ? "今天" : period === "week" ? "本周" : "本月"}的太阳位于${SIGN_NAMES.zh[sunTransit.signIndex]}，落入你本命盘的不同生活领域时，会带来不同的关注重点。先观察自己把精力放在哪里，再选择一个真正值得推进的方向；行运并不决定事件。`
      : `${sun}. ${period === "today" ? "Today's" : period === "week" ? "This week's" : "This month's"} Sun is in ${SIGN_NAMES.en[sunTransit.signIndex]}. Consider the contrast between your natal solar style and the current sky: choose one worthwhile direction, rather than treating every external demand as equally important. A transit describes a context, not an inevitable event.`,
    guidance: zh
      ? `${asc}。把感受转化为一个可以执行的小步骤：明确优先事项、给沟通留出时间，并在承担额外责任前确认边界。结合下方行运的容许度观察变化，而不是仅凭星座名称作出重大决定。`
      : `${asc}. Turn observation into one manageable step: clarify priorities, leave time for a conversation, and check your boundaries before taking on more. Use the transit orbs below to follow changing emphasis, not a sign label alone to make a major decision.`,
    "soul-insight": zh
      ? `${moon}。你的情绪需要与外在目标不一定同步。留意哪些惯性反应在保护你，又有哪些已不再适合现在的生活。把这次阅读视为自我觉察的起点，不是对人格或命运的定论。`
      : `${moon}. Emotional needs and outward goals do not always move together. Notice which familiar responses still protect you and which now limit your choices. Treat this reading as an invitation to awareness, not a fixed verdict on personality or destiny.`,
    "ray-constitution": zh
      ? `当前象征模型中，第 ${dominant.ray} 射线的权重最高，占 ${dominant.percent}%。模型结合行星对应射线、太阳月亮权重与落座对应关系；它是一种自我反思框架，并非经过验证的人格测量。`
      : `Ray ${dominant.ray} has the largest symbolic weighting (${dominant.percent}%) in this model. Planet-to-ray correspondences, extra Sun/Moon weighting and sign correspondences contribute to the result. This is a framework for reflection, not a validated personality measure.`,
    vehicles: zh
      ? `本命盘可以提供反思心智、情绪与行为方式的象征线索，但不能单独确定肉体、情绪体或心智体的射线。请结合下方自我观察问卷，而不要把推测当成诊断。`
      : `A natal chart offers symbolic prompts about thinking, feeling and action, but cannot determine the rays of the physical, emotional or mental vehicles on its own. Use the self-observation questionnaire below rather than treating a chart inference as a diagnosis.`,
    "soul-purpose": zh
      ? `${asc}。以上升星座的成长方向为线索，练习让天赋服务于关系与日常生活。灵魂目的不是一个固定职业标签，而是你反复选择如何理解、关怀与承担责任的过程。`
      : `${asc}. Use the rising sign as a growth-oriented lens: let your abilities become useful in relationships and everyday life. Soul purpose is not a single predetermined occupation, but an ongoing practice of understanding, care and responsible choice.`,
    personality: zh
      ? `${sun}。太阳象征有意识的表达与认同。观察你如何追求成就、发挥创造力以及回应认可；成熟的表达既保留自我，也能听见不同意见。`
      : `${sun}. The Sun symbolizes conscious identity and expression. Observe how you pursue achievement, create, and respond to recognition. A mature expression can remain self-directed while making room for another perspective.`,
    emotions: zh
      ? `${moon}。月亮描述情绪安全感与熟悉的反应方式。辨认触发情绪的情境，给需求一个清晰的名字，再考虑如何提出请求，而不是让别人猜测。`
      : `${moon}. The Moon describes emotional security and familiar responses. Notice the situations that activate a feeling, name the need beneath it, and consider a clear request rather than expecting others to infer it.`,
    esoteric: zh
      ? `以上升星座${SIGN_NAMES.zh[profile.sign]}为出发点，结合十字、守护星与最高度数的古典行星观察成长主题。Atmakaraka 使用七颗古典行星的星座内度数排序；不同占星学派采用的规则可能不同。`
      : `Start with ${SIGN_NAMES.en[profile.sign]} rising, its cross and rulers, then reflect on the classical planet with the highest degree within its sign. Atmakaraka here uses the seven classical planets; other schools may apply different zodiac or node conventions.`,
    "saturn-lesson": zh
      ? `${saturn}。土星的课题常与界限、责任与长期练习有关。把自我批评转化为可持续的结构，区分真正的承诺与仅仅来自恐惧的压力。`
      : `${saturn}. Saturn's symbolism concerns boundaries, responsibility and sustained practice. Translate self-criticism into a workable structure, distinguishing a genuine commitment from pressure maintained by fear.`,
    profection: timing
      ? zh
        ? `${timing.age} 岁对应第 ${timing.profectionHouse} 宫年，年主星为 ${timing.timeLord}。采用上升星座起算的整宫年限法，每过一个生日推进一宫；它是年度关注主题，不是事件预测。`
        : `Age ${timing.age} corresponds to a ${timing.profectionHouse}th-house year, ruled by ${timing.timeLord}. This uses whole-sign annual profections from the Ascendant, advancing at each birthday. It describes an annual emphasis, not a prediction of events.`
      : "",
    progressions: timing
      ? zh
        ? `次限采用出生后一天对应生活一年，计算日期为 ${timing.progressedDate.slice(0, 10)}。它描述象征性的内在发展节奏，不应与今日真实天空的位置混淆。`
        : `Secondary progressions use one day after birth for each year of life. The progressed ephemeris date is ${timing.progressedDate.slice(0, 10)}. This symbolic developmental clock is distinct from the actual sky today.`
      : "",
    "solar-return": timing
      ? zh
        ? `下一次太阳回到本命黄经的时刻为 ${timing.solarReturn || "暂无"}。这是全球统一的天文时刻；返照盘的宫位仍取决于所选地点，不能仅凭生日日期推断。`
        : `The next return of the Sun to its natal longitude is ${timing.solarReturn || "unavailable"}. This is a single astronomical instant worldwide; return-chart houses still depend on the chosen location, not simply the calendar birthday.`
      : "",
    "saturn-return": zh
      ? `土星回归发生于行运土星回到本命黄经附近，约每 29.5 年一次。下方日期通过黄经交会搜索得到；逆行可能让同一次回归出现多次精确交会，这里显示最接近该周期中心的一次。`
      : `Saturn returns to its natal longitude roughly every 29.5 years. The dates below are found by searching for longitude crossings. Retrograde motion can produce multiple exact contacts; the displayed date is the crossing nearest the cycle's center.`,
  };
  return (
    texts[topic] ||
    (zh
      ? `${sun}；${moon}；${asc}。结合实际相位、宫位与时间背景，观察这个主题如何与你的生活经验产生联系。`
      : `${sun}; ${moon}; ${asc}. Combine the actual aspects, houses and timing context with your lived experience when exploring this theme.`)
  );
}
