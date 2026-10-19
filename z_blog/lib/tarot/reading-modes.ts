import type { TarotPosition } from "@/types/tarot";

export type TarotReadingMode = "love" | "yes-no" | "one-card" | "three-cards";
export type TarotModeCopy = { zh: string; en: string };
export type TarotModeConfig = {
  title: TarotModeCopy;
  description: TarotModeCopy;
  href: string;
  image: string;
  positions: { key: TarotPosition; label: TarotModeCopy }[];
};

export const tarotModes: Record<TarotReadingMode, TarotModeConfig> = {
  love: {
    title: { zh: "爱情塔罗", en: "Love Tarot" },
    description: { zh: "探索关系模式、过去的影响与自我关爱。", en: "Explore relationship patterns, past influences, and self-love." },
    href: "/tarot-ai/love", image: "/NEW CARDS/The Lovers.png",
    positions: [
      { key: "contribution", label: { zh: "你带给关系的", en: "What you bring to relationships" } },
      { key: "challenge", label: { zh: "关系中的挑战", en: "Relationship challenges" } },
      { key: "influence", label: { zh: "过去关系的影响", en: "Past relationship influences" } },
      { key: "growth", label: { zh: "可以成长的方向", en: "What you can work on" } },
      { key: "selfLove", label: { zh: "自我关爱", en: "Self-love guidance" } },
    ],
  },
  "yes-no": {
    title: { zh: "是或否", en: "Yes / No" },
    description: { zh: "带着一个明确的问题，看看两张牌呈现的倾向与提醒。", en: "Bring a clear question and reflect on the direction and context of two cards." },
    href: "/tarot-ai/yes-no", image: "/NEW CARDS/Justice.png",
    positions: [
      { key: "signal", label: { zh: "答案的倾向", en: "Answer direction" } },
      { key: "context", label: { zh: "补充与提醒", en: "Context and guidance" } },
    ],
  },
  "one-card": {
    title: { zh: "一张牌", en: "One Card" },
    description: { zh: "一张牌，一个值得关注的主题。", en: "One card, one theme to reflect on." },
    href: "/tarot-ai/one-card", image: "/NEW CARDS/The Star.png",
    positions: [{ key: "insight", label: { zh: "此刻的启示", en: "Insight" } }],
  },
  "three-cards": {
    title: { zh: "三张牌", en: "Three Cards" },
    description: { zh: "连接过去、现在与未来，理解变化的脉络。", en: "Connect past, present, and future to explore how your story unfolds." },
    href: "/tarot-ai", image: "/NEW CARDS/Wheel of Fortune.png",
    positions: [
      { key: "past", label: { zh: "过去", en: "Past" } },
      { key: "present", label: { zh: "现在", en: "Present" } },
      { key: "future", label: { zh: "未来", en: "Future" } },
    ],
  },
};

export const tarotModeOrder: TarotReadingMode[] = ["love", "yes-no", "one-card", "three-cards"];
export function isTarotReadingMode(value: unknown): value is TarotReadingMode {
  return typeof value === "string" && Object.hasOwn(tarotModes, value);
}

export function getTarotPositionLabel(position: TarotPosition): string {
  for (const config of Object.values(tarotModes)) {
    const match = config.positions.find(item => item.key === position);
    if (match) return `${match.label.zh} / ${match.label.en}`;
  }
  return position;
}
