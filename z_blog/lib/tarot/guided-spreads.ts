import type { TarotPosition } from "@/types/tarot";

type Copy = { zh: string; en: string };
export type GuidedSpread = {
  title: Copy; description: Copy; image: string; href: string;
  fixedQuestion: Copy; interpretation: Copy;
  positions: { key: TarotPosition; label: Copy; description: Copy }[];
};

export const guidedSpreads = {
  "problem-obstacle-advice": {
    title: { zh: "问题－障碍－建议", en: "Problem–Obstacle–Advice" },
    description: { zh: "厘清问题核心、辨认阻力，找到可以着手的下一步。", en: "Clarify the issue, identify resistance, and find a practical next step." },
    image: "/NEW CARDS/The Hanged Man.png", href: "/tarot-ai/problem-obstacle-advice",
    fixedQuestion: { zh: "当前困境的核心是什么，什么阻碍了进展，我可以怎样行动？", en: "What is at the heart of my current difficulty, what is blocking progress, and how can I act?" },
    interpretation: { zh: "区分表面问题与真正阻力，将第三张牌落实为用户能控制的行动，不虚构用户的经历。", en: "Distinguish the apparent issue from its underlying resistance. Turn the third card into an actionable step without inventing personal circumstances." },
    positions: [
      { key: "problem", label: { zh: "问题", en: "Problem" }, description: { zh: "此刻最需要看清的核心议题。", en: "The central issue asking for your attention now." } },
      { key: "obstacle", label: { zh: "障碍", en: "Obstacle" }, description: { zh: "让问题难以推进的内在或外在阻力。", en: "The internal or external resistance making progress difficult." } },
      { key: "recommendation", label: { zh: "建议", en: "Advice" }, description: { zh: "可以尝试的行动、调整或新的看待方式。", en: "An action, adjustment, or new perspective you can try." } },
    ],
  },
  "free-flow": {
    title: { zh: "无牌阵", en: "Free Flow" },
    description: { zh: "用五张自由牌观察整体故事、元素呼应与能量变化。", en: "Explore the overall story, elemental connections, and shifts across five free cards." },
    image: "/NEW CARDS/The Moon.png", href: "/tarot-ai/free-flow",
    fixedQuestion: { zh: "我当下的整体状态呈现了什么线索，有哪些值得觉察的变化？", en: "What patterns appear in my current overall state, and which changes deserve attention?" },
    interpretation: { zh: "这不是固定角色牌阵。五个牌位说明只是观察顺序，不是过去、现在、未来或人物角色。比较牌间的元素、数字、重复意象、推进与停滞；找出核心牌，并将整体故事作为主要结论。", en: "These five positions are observation prompts, not fixed roles or a past-present-future timeline. Compare elements, numbers, recurring imagery, progression, and stagnation. Identify a focal card and prioritize the connected story." },
    positions: [
      { key: "free1", label: { zh: "自由牌 1", en: "Free card 1" }, description: { zh: "作为从左向右阅读整体故事的起点。", en: "Begin the connected story with this first card." } },
      { key: "free2", label: { zh: "自由牌 2", en: "Free card 2" }, description: { zh: "观察它如何延续或转变第一张牌的线索。", en: "Notice how it develops or redirects the first card's theme." } },
      { key: "free3", label: { zh: "自由牌 3", en: "Free card 3" }, description: { zh: "寻找重复意象、元素及数字之间的联系。", en: "Look for recurring imagery and connections in elements and numbers." } },
      { key: "free4", label: { zh: "自由牌 4", en: "Free card 4" }, description: { zh: "留意整体能量正在积累、消退还是停滞。", en: "Observe whether the overall energy builds, fades, or stalls." } },
      { key: "free5", label: { zh: "自由牌 5", en: "Free card 5" }, description: { zh: "以这张牌收束故事，辨认最重要的提示。", en: "Bring the story together and identify its most useful reminder." } },
    ],
  },
  "love-triangle": {
    title: { zh: "恋爱三角", en: "Love Triangle" },
    description: { zh: "从你、对方与关系三个角度，观察情感中的互动。", en: "Reflect on the dynamics between you, the other person, and the relationship." },
    image: "/NEW CARDS/The Lovers.png", href: "/tarot-ai/love-triangle",
    fixedQuestion: { zh: "我与心中这位对象的关系，现在呈现出怎样的互动模式？", en: "What interaction patterns are present in the relationship I have in mind?" },
    interpretation: { zh: "恋爱三角指三个观察角度，不代表第三者或三角恋。对方牌只能作为关系体验的象征，不能声称读取真实想法、忠诚度或感情；把建议聚焦在沟通、边界和用户可采取的行动。", en: "The triangle means three perspectives, not an affair. Treat the other person's card as a symbolic perspective on the relationship, not factual access to thoughts, loyalty, or feelings. Focus on communication, boundaries, and the user's own choices." },
    positions: [
      { key: "you", label: { zh: "你", en: "You" }, description: { zh: "你在这段关系中的状态与投入方式。", en: "Your current state and way of participating in the relationship." } },
      { key: "partner", label: { zh: "对方", en: "The other person" }, description: { zh: "关系中对方所呈现的象征视角，而非读心。", en: "A symbolic perspective on the other person's role, not a reading of private thoughts." } },
      { key: "relationship", label: { zh: "关系", en: "The relationship" }, description: { zh: "两人之间当下的联系、张力与互动模式。", en: "The connection, tensions, and interaction patterns between you." } },
    ],
  },
  "career-3": {
    title: { zh: "事业三牌", en: "Career Three Cards" },
    description: { zh: "了解工作现状、主要挑战与可以尝试的突破方向。", en: "Reflect on your work situation, main challenge, and a constructive way forward." },
    image: "/NEW CARDS/The Chariot.png", href: "/tarot-ai/career-3",
    fixedQuestion: { zh: "我目前的事业或工作，有什么需要看清的现状、挑战与行动方向？", en: "What should I understand about my current work situation, its challenges, and a useful next step?" },
    interpretation: { zh: "围绕能力、协作、边界和现实资源提供建议。不虚构职位、薪资或雇佣事实，不保证升职、收入或投资回报。", en: "Offer practical reflections on skills, collaboration, boundaries, and resources. Do not invent employment facts or promise promotion, earnings, or investment returns." },
    positions: [
      { key: "careerState", label: { zh: "现状", en: "Current situation" }, description: { zh: "当前工作与事业处境最值得注意的主题。", en: "The most significant theme in your present work situation." } },
      { key: "careerChallenge", label: { zh: "挑战", en: "Challenge" }, description: { zh: "正在消耗精力或阻碍发展的关键困难。", en: "The key difficulty drawing on your energy or limiting growth." } },
      { key: "careerAdvice", label: { zh: "建议", en: "Advice" }, description: { zh: "可执行的调整与寻找突破口的方向。", en: "A practical adjustment and a direction for making progress." } },
    ],
  },
  "two-choices": {
    title: { zh: "二择一", en: "Two Choices" },
    description: { zh: "将两条路径的现状、可能走向与注意事项并列比较。", en: "Compare the starting point, possible direction, and considerations of two paths." },
    image: "/NEW CARDS/Justice.png", href: "/tarot-ai/two-choices",
    fixedQuestion: { zh: "对于心中已有的 A 与 B 两个选项，各有什么处境、可能走向和需要注意的地方？", en: "For the two options A and B I have in mind, what are their current situations, possible directions, and practical considerations?" },
    interpretation: { zh: "仅以选项A、选项B称呼两条路径，用户没有输入具体内容，不得编造选项。1至3张只对应A，4至6张只对应B。结果表示条件性趋势，不是保证；比较代价、机会和行动，不替用户作重大决定。", en: "Keep the paths labelled Option A and Option B; no concrete option details were supplied, so do not invent them. Cards 1–3 belong only to A and 4–6 only to B. Outcomes are conditional trends. Compare trade-offs and actions without making a major decision for the user." },
    positions: [
      { key: "choiceAState", label: { zh: "选择 A · 现状", en: "Option A · Situation" }, description: { zh: "选项 A 目前的出发点与条件。", en: "The starting point and present conditions of Option A." } },
      { key: "choiceAOutcome", label: { zh: "选择 A · 结果", en: "Option A · Outcome" }, description: { zh: "沿选项 A 推进时可能出现的方向。", en: "A possible direction if you pursue Option A." } },
      { key: "choiceAAdvice", label: { zh: "选择 A · 建议", en: "Option A · Advice" }, description: { zh: "选项 A 需要留意的事项与可采取的行动。", en: "Practical considerations and actions for Option A." } },
      { key: "choiceBState", label: { zh: "选择 B · 现状", en: "Option B · Situation" }, description: { zh: "选项 B 目前的出发点与条件。", en: "The starting point and present conditions of Option B." } },
      { key: "choiceBOutcome", label: { zh: "选择 B · 结果", en: "Option B · Outcome" }, description: { zh: "沿选项 B 推进时可能出现的方向。", en: "A possible direction if you pursue Option B." } },
      { key: "choiceBAdvice", label: { zh: "选择 B · 建议", en: "Option B · Advice" }, description: { zh: "选项 B 需要留意的事项与可采取的行动。", en: "Practical considerations and actions for Option B." } },
    ],
  },
  "celtic-cross": {
    title: { zh: "凯尔特十字", en: "Celtic Cross" },
    description: { zh: "通过十个观察位置，梳理处境、内在驱动与可能的发展。", en: "Explore your situation, underlying motivations, and possible developments through ten perspectives." },
    image: "/NEW CARDS/The World.png", href: "/tarot-ai/celtic-cross",
    fixedQuestion: { zh: "对于心中这件事，我该如何理解它的现状、内外影响、过去与未来的可能发展？", en: "How can I understand the current situation, inner and outer influences, background, and possible developments of the matter I have in mind?" },
    interpretation: { zh: "严格区分第5张的惯性长期走向和第6张的近期发展。第10张是综合其余位置后的条件性结论，不是注定的未来。先梳理1至6张的核心处境，再整合7至10张的态度、环境和希望恐惧。不诊断潜意识或心理疾病。", en: "Distinguish the longer-term trajectory in card 5 from near-term developments in card 6. Card 10 is a conditional synthesis, not fate. Connect cards 1–6 before integrating attitude, environment, and hopes or fears in cards 7–10. Do not diagnose unconscious states or mental illness." },
    positions: [
      { key: "current", label: { zh: "现状", en: "Present situation" }, description: { zh: "这件事眼下最核心的状态。", en: "The central state of the situation at present." } },
      { key: "crossing", label: { zh: "阻碍", en: "Crossing influence" }, description: { zh: "与现状交织的主要困难或挑战。", en: "The main difficulty or challenge intersecting the situation." } },
      { key: "subconscious", label: { zh: "深层意识", en: "Underlying influences" }, description: { zh: "可能尚未被留意、却影响选择的内在驱动。", en: "Inner motivations that may influence your choices without being fully noticed." } },
      { key: "background", label: { zh: "过去", en: "Background" }, description: { zh: "促成当前处境的背景与先前影响。", en: "Earlier influences and context contributing to the present situation." } },
      { key: "potential", label: { zh: "可能的未来", en: "Possible trajectory" }, description: { zh: "如果维持当前模式，事情可能延续的方向。", en: "A possible longer-term direction if the current pattern continues." } },
      { key: "nearFuture", label: { zh: "近期未来", en: "Near future" }, description: { zh: "短期内值得留意的发展与机会。", en: "Near-term developments and opportunities to watch for." } },
      { key: "attitude", label: { zh: "你的态度", en: "Your attitude" }, description: { zh: "你面对这件事的立场、期待或保护方式。", en: "Your stance, expectations, or protective responses toward the matter." } },
      { key: "environment", label: { zh: "外界影响", en: "External influences" }, description: { zh: "他人、环境及现实条件带来的影响。", en: "Influences from other people, surroundings, and practical conditions." } },
      { key: "hopes", label: { zh: "希望与恐惧", en: "Hopes and fears" }, description: { zh: "你珍视的期待与难以面对的顾虑。", en: "The expectations you value and concerns that feel difficult to face." } },
      { key: "outcome", label: { zh: "最终结果", en: "Overall outcome" }, description: { zh: "综合整副牌后，在当前条件下呈现的方向。", en: "The conditional direction suggested by the spread as a whole." } },
    ],
  },
} satisfies Record<string, GuidedSpread>;

export type GuidedSpreadMode = keyof typeof guidedSpreads;
