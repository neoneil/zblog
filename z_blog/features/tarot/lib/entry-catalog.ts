import type { LocalizedCopy } from "@/components/site/preferences-provider";

export type TarotEntry = {
  title: LocalizedCopy;
  description: LocalizedCopy;
  href: string;
  image: string;
};

export const tarotEntries: readonly TarotEntry[] = [
  {
    title: { en: "RIDER–WAITE READING", zh: "韦特占卜" },
    description: {
      en: "Explore Love Tarot, Yes/No, One-Card and Three-Card Readings — Find Clarity, Guidance, and New Perspectives.",
      zh: "探索爱情塔罗、是非占卜、单张牌与三张牌阵，寻找答案、指引与全新视角。",
    },
    href: "/tarot-ai",
    image: "/knowledge/waite-reading.png",
  },
  {
    title: { en: "RIDER–WAITE LIBRARY", zh: "韦特秘典" },
    description: {
      en: "Explore All 78 Tarot Cards — Discover Their Imagery, Decode Hidden Symbols, Learn Through Real Examples, and Master Practical Readings.",
      zh: "探索韦特塔罗78张牌的画面奥秘，解读隐藏符号，结合真实案例，掌握实战占卜技巧。",
    },
    href: "/feishu-docs",
    image: "/knowledge/waite-library.png",
  },
  {
    title: { en: "THOTH TAROT READING", zh: "透特占卜" },
    description: {
      en: "Explore the Tree of Life, Abyss Crossing, Four Worlds, Golden Dawn 15-Card Method, One-Card Oracle, and Sacred Union — Six Mystical Spreads to Unveil Hidden Wisdom and Illuminate Your Path.",
      zh: "探索生命之树、跨越深渊、四重世界、黄金黎明十五张牌阵、单张神谕与神圣结合六大牌阵，揭示隐秘智慧，照亮命运之路。",
    },
    href: "/thoth-tarot/readings",
    image: "/knowledge/thoth-reading.png",
  },
  {
    title: { en: "THOTH TAROT LIBRARY", zh: "透特秘典" },
    description: {
      en: "Explore All 78 Thoth Tarot Cards — Uncover Their Meanings, Elemental Energies, and Hidden Wisdom.",
      zh: "探索透特塔罗78张牌的深层牌义、元素能量与状态，揭开每张牌蕴藏的神秘智慧。",
    },
    href: "/thoth-tarot",
    image: "/knowledge/thoth-library.png",
  },
];

export const tarotSectionCopy = {
  title: { en: "TAROT ORACLES", zh: "塔罗神谕" },
  description: {
    en: "Seventy-eight mirrors of insight, revealing the unseen within.",
    zh: "七十八张命运之镜，映照心灵深处的答案。",
  },
};

const relationshipEntry: TarotEntry = {
  title: { en: "RELATIONSHIP SITUATIONS", zh: "关系情境" },
  description: {
    en: "Explore 121 questions about love and relationships with Rider–Waite tarot.",
    zh: "从 121 个情境中找到贴近你的感情问题，用韦特塔罗探索。",
  },
  href: "/tarot-ai/relationships",
  image: "/NEW CARDS/The Lovers.png",
};

const financeEntry: TarotEntry = {
  title: { en: "FINANCIAL SITUATIONS", zh: "财务情境" },
  description: {
    en: "Explore 25 questions about money habits, income and financial choices with Rider–Waite tarot.",
    zh: "用韦特塔罗探索 25 个有关金钱习惯、收入和财务选择的情境。",
  },
  href: "/tarot-ai/finances",
  image: "/NEW CARDS/Pentacles/Ten of Pentacles.png",
};

export const tarotCollections = {
  readings: {
    href: "/tarot-readings",
    title: { zh: "塔罗在线测算", en: "Tarot Online Reading" },
    entries: [tarotEntries[0], tarotEntries[2], relationshipEntry, financeEntry],
  },
  library: {
    href: "/tarot-library",
    title: { zh: "塔罗秘典", en: "Tarot Grimoire" },
    entries: [tarotEntries[1], tarotEntries[3]],
  },
};
