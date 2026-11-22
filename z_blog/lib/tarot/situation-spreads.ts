import relationships from "@/features/tarot/data/relationship-spreads.json";
import finances from "@/features/tarot/data/finance-spreads.json";
import type { TarotModeConfig } from "./reading-modes";
import type { TarotPosition } from "@/types/tarot";

export type SituationMode = `relationship-${string}` | `finance-${string}`;
export type SituationCategory = "relationships" | "finances";

export type SituationLayout = {
  ratio: number;
  cards: { x: number; y: number; width: number; rotation: number }[];
};

const layouts = Object.fromEntries(Object.entries(relationships.layouts).map(([id, layout]) => [
  id,
  {
    ratio: layout.ratio,
    cards: layout.cards.map(([x, y, width, rotation]) => ({ x, y, width, rotation })),
  },
])) as Record<string, SituationLayout>;

const catalogConfigs = {
  relationships: {
    data: relationships,
    prefix: "relationship",
    title: { zh: "关系情境", en: "Relationship Situations" },
    introduction: {
      zh: "选一个贴近你目前处境的问题，用韦特塔罗看清这段关系。",
      en: "Choose a question that fits your situation and explore it with Rider–Waite tarot.",
    },
    back: { href: "/tarot-ai/love", label: { zh: "返回双方关系", en: "Back to Love Tarot" } },
    image: "/NEW CARDS/The Lovers.png",
    interpretation: {
      zh: "只讨论用户可观察的互动与自己的判断和行动。不得声称知道他人的私密想法，也不得把时机、忠诚或关系结局说成确定事实。",
      en: "Focus on observable interactions, personal choices and boundaries. Do not claim to know private thoughts or present timing, fidelity or relationship outcomes as facts.",
    },
  },
  finances: {
    data: finances,
    prefix: "finance",
    title: { zh: "财务情境", en: "Financial Situations" },
    introduction: {
      zh: "选一个贴近你的财务问题，用韦特塔罗反思金钱习惯、目标和取舍。",
      en: "Choose a financial question and use Rider–Waite tarot to reflect on habits, goals and trade-offs.",
    },
    back: { href: "/tarot-readings", label: { zh: "返回塔罗在线测算", en: "Back to Tarot Online Reading" } },
    image: "/NEW CARDS/Pentacles/Ten of Pentacles.png",
    interpretation: {
      zh: "解读仅用于反思金钱习惯、价值取舍和待核实的问题。不得预测收益、彩票中奖、借款还款或交易结果，不得推荐具体投资、贷款或赌博操作。涉及重大决定时引导用户查证实际条款与数据，并在需要时咨询合格专业人士。",
      en: "Use the cards to reflect on money habits, priorities and facts to verify. Never predict returns, lottery outcomes, repayments or deal results, or recommend a particular investment, loan or wager. For major decisions, encourage checking real terms and figures and consulting a qualified professional when needed.",
    },
  },
} as const;

function createCatalog(category: SituationCategory) {
  const { data, prefix, image, interpretation, ...copy } = catalogConfigs[category];
  const positionTranslations: Record<string, string> = data.positionZh;
  const situations = data.situations.map((situation) => ({
    ...situation,
    mode: `${prefix}-${situation.id}` as SituationMode,
    href: `/tarot-ai/${category}/${situation.id}`,
    layout: layouts[situation.layout],
  }));
  const modes = Object.fromEntries(situations.map((situation) => [
    situation.mode,
    {
      title: situation.question,
      description: {
        zh: `用 ${situation.positions.length} 张韦特塔罗反思这个问题。`,
        en: `Reflect on this question with ${situation.positions.length} Rider–Waite cards.`,
      },
      fixedQuestion: situation.question,
      interpretation,
      href: situation.href,
      image,
      layout: situation.layout,
      positions: situation.positions.map((label, index) => ({
        key: `${prefix}-${index + 1}` as TarotPosition,
        label: { en: label, zh: positionTranslations[label] },
      })),
    } satisfies TarotModeConfig,
  ])) as Record<SituationMode, TarotModeConfig>;

  return { ...copy, situations, modes };
}

export const situationCatalogs = {
  relationships: createCatalog("relationships"),
  finances: createCatalog("finances"),
};

export const situationSpreads = {
  ...situationCatalogs.relationships.modes,
  ...situationCatalogs.finances.modes,
};

export function isSituationMode(value: string): value is SituationMode {
  return Object.hasOwn(situationSpreads, value);
}

export function situationSlotWidth(layout: SituationLayout, index: number) {
  const card = layout.cards[index];
  const gaps = layout.cards
    .filter((other) => other !== card && Math.abs(other.y - card.y) < 2)
    .map((other) => Math.abs(other.x - card.x));
  return Math.min(card.width, ...gaps.map((gap) => gap * 0.86));
}
