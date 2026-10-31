export type Copy = { en: string; zh: string };
export const stellaTools = [
  { slug: "", en: "Birth Chart Calculator", zh: "出生星盘计算器" },
  { slug: "compatibility", en: "Compatibility", zh: "星座配对" },
  { slug: "birth-chart", en: "Birth Chart Guide", zh: "出生星盘指南" },
  { slug: "todays-sky", en: "Today's Sky", zh: "今日星空" },
  { slug: "moon-calendar", en: "Moon Calendar", zh: "月亮日历" },
  { slug: "retrograde", en: "Retrograde Tracker", zh: "逆行追踪" },
  { slug: "void-of-course-moon", en: "Void of Course Moon", zh: "月亮空亡" },
  { slug: "planets", en: "Planets in Signs", zh: "行星落座" },
  { slug: "numerology", en: "Numerology", zh: "生命数字" },
  { slug: "birthday", en: "Birthday Horoscope", zh: "生日运势" },
  { slug: "eclipse", en: "Eclipses", zh: "日月食" },
] as const;
export const stellaHref = (slug: string) => `/stella${slug ? `/${slug}` : ""}`;
export const signSlugs = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
];
export const monthSlugs = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];
export const monthLengths = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
export const elements: Copy[] = [
  { en: "Fire", zh: "火" },
  { en: "Earth", zh: "土" },
  { en: "Air", zh: "风" },
  { en: "Water", zh: "水" },
];
export const modalities: Copy[] = [
  { en: "Cardinal", zh: "基本" },
  { en: "Fixed", zh: "固定" },
  { en: "Mutable", zh: "变动" },
];
export const signQualities: Copy[] = [
  { en: "courage, initiative and honest action", zh: "勇气、主动性与坦率行动" },
  {
    en: "patience, sensory awareness and steady effort",
    zh: "耐心、感官体验与稳定投入",
  },
  {
    en: "curiosity, conversation and flexible thinking",
    zh: "好奇心、交流与灵活思考",
  },
  {
    en: "care, emotional memory and a sense of belonging",
    zh: "关怀、情感记忆与归属感",
  },
  {
    en: "warmth, generosity and creative expression",
    zh: "热情、慷慨与创造性表达",
  },
  {
    en: "discernment, craftsmanship and practical service",
    zh: "辨别力、细致实践与务实服务",
  },
  {
    en: "fairness, partnership and an eye for balance",
    zh: "公平、伙伴关系与平衡感",
  },
  {
    en: "depth, trust and the courage to transform",
    zh: "深度、信任与转变的勇气",
  },
  {
    en: "exploration, meaning and a wider perspective",
    zh: "探索、意义与开阔视角",
  },
  {
    en: "responsibility, persistence and long-term direction",
    zh: "责任、毅力与长期方向",
  },
  {
    en: "originality, community and independent thought",
    zh: "原创性、群体意识与独立思考",
  },
  {
    en: "imagination, compassion and intuitive sensitivity",
    zh: "想象力、同理心与直觉敏感度",
  },
];
export const signChallenges: Copy[] = [
  {
    en: "Slow down before reacting; courage also includes listening.",
    zh: "反应之前稍作停顿，勇气也包括倾听。",
  },
  {
    en: "Leave room for change without abandoning your foundations.",
    zh: "在保有根基的同时，为变化留出空间。",
  },
  {
    en: "Stay with one conversation long enough to build depth.",
    zh: "在一段交流中多停留一会，让理解深入。",
  },
  {
    en: "Name your needs rather than expecting others to guess them.",
    zh: "清楚表达需要，而非期待别人猜到。",
  },
  {
    en: "Share attention and welcome feedback without losing heart.",
    zh: "分享关注，也带着开放的心接纳反馈。",
  },
  {
    en: "Let useful progress matter more than an impossible ideal.",
    zh: "让切实的进展比难以达到的完美更重要。",
  },
  {
    en: "A clear boundary can protect a genuine connection.",
    zh: "清晰的边界能够保护真实的连接。",
  },
  {
    en: "Build trust through openness instead of testing others.",
    zh: "通过坦诚建立信任，而不是反复试探。",
  },
  {
    en: "Follow inspiration with practical commitments.",
    zh: "用实际承诺接住灵感。",
  },
  {
    en: "Make rest and emotional connection part of the plan.",
    zh: "把休息与情感连接也纳入计划。",
  },
  {
    en: "Stay close to feelings as well as ideas.",
    zh: "关注想法，也靠近感受。",
  },
  {
    en: "Protect your energy with gentle, explicit boundaries.",
    zh: "用温柔而明确的边界保护自己的精力。",
  },
];
export const planetKeys = [
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
];
export const rulers = [
  "mars",
  "venus",
  "mercury",
  "moon",
  "sun",
  "mercury",
  "venus",
  "pluto",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
];
export const planetCopy: Record<
  string,
  { name: Copy; theme: Copy; period: string }
> = {
  sun: {
    name: { en: "Sun", zh: "太阳" },
    theme: { en: "identity and creative direction", zh: "自我认同与创造方向" },
    period: "~30 d",
  },
  moon: {
    name: { en: "Moon", zh: "月亮" },
    theme: { en: "emotions and everyday needs", zh: "情绪与日常需要" },
    period: "~2.5 d",
  },
  mercury: {
    name: { en: "Mercury", zh: "水星" },
    theme: {
      en: "communication, learning and perception",
      zh: "沟通、学习与认知",
    },
    period: "15–60 d",
  },
  venus: {
    name: { en: "Venus", zh: "金星" },
    theme: { en: "relationships, beauty and values", zh: "关系、审美与价值观" },
    period: "23–60 d",
  },
  mars: {
    name: { en: "Mars", zh: "火星" },
    theme: {
      en: "motivation, action and assertion",
      zh: "动力、行动与自我主张",
    },
    period: "~6–7 wk",
  },
  jupiter: {
    name: { en: "Jupiter", zh: "木星" },
    theme: {
      en: "growth, understanding and opportunity",
      zh: "成长、理解与机会",
    },
    period: "~1 yr",
  },
  saturn: {
    name: { en: "Saturn", zh: "土星" },
    theme: {
      en: "boundaries, responsibility and structure",
      zh: "边界、责任与结构",
    },
    period: "~2.5 yr",
  },
  uranus: {
    name: { en: "Uranus", zh: "天王星" },
    theme: {
      en: "innovation, independence and change",
      zh: "创新、独立与变化",
    },
    period: "~7 yr",
  },
  neptune: {
    name: { en: "Neptune", zh: "海王星" },
    theme: {
      en: "imagination, ideals and sensitivity",
      zh: "想象力、理想与感受力",
    },
    period: "~14 yr",
  },
  pluto: {
    name: { en: "Pluto", zh: "冥王星" },
    theme: {
      en: "power, renewal and deep transformation",
      zh: "力量、更新与深层转变",
    },
    period: "12–32 yr",
  },
};
export const compatibilityPairs = signSlugs.flatMap((a, i) =>
  signSlugs.slice(i).map((b) => `${a}-${b}`),
);
export const birthdaySlugs = monthSlugs.flatMap((m, i) =>
  Array.from({ length: monthLengths[i] }, (_, d) => `${m}-${d + 1}`),
);
export function parsePair(slug: string): [number, number] | null {
  const pair = slug.split("-");
  if (pair.length !== 2) return null;
  const a = signSlugs.indexOf(pair[0]),
    b = signSlugs.indexOf(pair[1]);
  return a >= 0 && b >= a ? [a, b] : null;
}
export function parseBirthday(
  slug: string,
): { month: number; day: number } | null {
  const parts = slug.split("-");
  const month = monthSlugs.indexOf(parts[0]) + 1,
    day = Number(parts[1]);
  return parts.length === 2 &&
    month > 0 &&
    Number.isInteger(day) &&
    day > 0 &&
    day <= monthLengths[month - 1] &&
    String(day) === parts[1]
    ? { month, day }
    : null;
}
export function pairDynamics(
  a: number,
  b: number,
): { harmony: Copy; modality: Copy } {
  const ea = a % 4,
    eb = b % 4,
    ma = a % 3,
    mb = b % 3;
  const supportive =
    (ea === 0 && eb === 2) ||
    (ea === 2 && eb === 0) ||
    (ea === 1 && eb === 3) ||
    (ea === 3 && eb === 1);
  return {
    harmony:
      ea === eb
        ? {
            en: "A shared element makes your priorities familiar. Similar instincts can build ease, but may also reinforce the same blind spots. Make space for different habits inside that familiarity.",
            zh: "相同元素让彼此的关注点更容易被理解，也可能放大共同的盲点。在熟悉感里仍要为不同习惯留出空间。",
          }
        : supportive
          ? {
              en: "These elements can support one another: one offers a resource the other can use. Turn that potential into a relationship by discussing pace, reassurance and practical expectations.",
              zh: "这两种元素具有互补空间，一方的资源可能支持另一方。通过讨论节奏、安全感和实际期待，把这种潜力转化为关系。",
            }
          : {
              en: "Different elements invite different responses to the same experience. Neither style is wrong. Translate your needs into specific requests rather than assuming the other person shares your priorities.",
              zh: "不同元素可能对同一经历产生不同反应，双方并无绝对对错。把需要转化为具体请求，不要假设对方与你有相同的优先级。",
            },
    modality:
      ma === mb
        ? {
            en: "You share a way of approaching change. Agree who initiates, who maintains and when to reconsider a plan, so similarity becomes cooperation rather than competition.",
            zh: "双方应对变化的方式相似。明确谁发起、谁维持，以及何时调整计划，让相似性成为合作而非竞争。",
          }
        : {
            en: "Your rhythms bring different strengths: starting, sustaining and adapting. Share responsibilities explicitly and revisit them when circumstances change.",
            zh: "发起、坚持和调整，各有不同优势。明确分配责任，并在环境改变时重新讨论。",
          },
  };
}
