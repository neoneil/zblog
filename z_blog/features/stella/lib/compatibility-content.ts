import { elements, modalities, type Copy } from "./explore-config";

const elementNeeds: Copy[] = [
  { en: "Fire seeks momentum, encouragement and the freedom to act. Affection often takes the form of enthusiasm, shared adventures and a clear expression of desire.", zh: "火象重视行动动力、鼓励与自主空间。关爱常通过热情、共同探索与直接表达意愿来传递。" },
  { en: "Earth seeks reliability, tangible care and a pace that can be sustained. Keeping a promise, making time and sharing everyday responsibilities can communicate more than an elaborate declaration.", zh: "土象重视可靠、具体的照顾与可持续的节奏。兑现承诺、安排相处时间、分担日常责任，往往比华丽宣言更能传递关心。" },
  { en: "Air seeks conversation, intellectual companionship and room to consider alternatives. Feeling heard matters, as does the freedom to have separate interests without weakening the bond.", zh: "风象重视对话、思想上的陪伴，以及讨论不同可能性的空间。被倾听很重要，拥有各自兴趣也不必削弱彼此的连接。" },
  { en: "Water seeks emotional safety, sensitivity and an understanding of what is left unsaid. Consistent reassurance and respect for vulnerability help intimacy develop without relying on mind-reading.", zh: "水象重视情感安全、细腻回应与对言外之意的理解。稳定的安抚与对脆弱的尊重，能让亲密逐步建立，而不必依靠猜测。" },
];
const rhythmNeeds: Copy[] = [
  { en: "Cardinal energy starts things: it proposes a direction, makes a first move and looks for a response. In partnership, initiative is most useful when the other person has a genuine say in the destination.", zh: "基本宫能量擅长开启：提出方向、迈出第一步并期待回应。在关系中，只有另一方也能真正参与决定方向，主动性才更容易成为合作的资源。" },
  { en: "Fixed energy protects continuity. It builds trust through commitment and persistence, but may need time before accepting a change. Explain why a revision matters rather than treating hesitation as a lack of care.", zh: "固定宫能量维护连续性，通过投入与坚持建立信任，但接受变化可能需要时间。说明调整为何重要，不要把犹豫直接理解为不够关心。" },
  { en: "Mutable energy responds to a changing situation and notices other possibilities. Its flexibility supports repair and experimentation; clear agreements help ensure that adaptability does not leave important commitments uncertain.", zh: "变动宫能量回应环境变化，并留意其他可能性。灵活性有助于修复和尝试；同时也需要明确约定，避免重要承诺因持续调整而变得不确定。" },
];

export function compatibilityNarrative(first: number, second: number) {
  const a = first % 4, b = second % 4, m = first % 3, n = second % 3;
  const sameElement = a === b;
  const supportive = (a + 2) % 4 === b;
  return {
    elementTitle: { en: `Element Harmony: ${elements[a].en} + ${elements[b].en}`, zh: `元素关系：${elements[a].zh}象 + ${elements[b].zh}象` },
    modalityTitle: { en: `Modality: ${modalities[m].en} + ${modalities[n].en}`, zh: `模式互动：${modalities[m].zh}宫 + ${modalities[n].zh}宫` },
    elementParagraphs: [elementNeeds[a], ...(a === b ? [] : [elementNeeds[b]]), {
      en: sameElement ? "A familiar emotional language can make the first connection feel immediate. The work is to avoid amplifying the same habits: agreement is not always understanding, and shared preferences do not remove the need for boundaries. Ask what each person needs before deciding that you already know." : supportive ? "This pairing can turn different strengths into mutual support. Translate interest into practical agreements: which experiences will you share, what reassurance does each person need, and where is independence important? Complementarity becomes valuable through repeated acts of consideration rather than through chemistry alone." : "Your first responses may differ even when your intentions agree. One person may want action while the other needs reflection, or an explanation where the other wants reassurance. Name the need behind the reaction, agree on a workable pace and allow both styles to contribute to the decision.",
      zh: sameElement ? "熟悉的情感语言可能让初次连接显得自然。需要留意的是，不要相互放大同一种习惯：意见一致并不总等于理解，偏好相似也不意味着无需边界。做决定前，仍要问清彼此真正需要什么。" : supportive ? "这组关系可以把不同优势转化为支持。把好感落实为具体约定：哪些体验一起分享，双方各需要怎样的安抚，哪里应保留自主空间？互补的价值来自持续体谅，而不仅是最初的吸引。" : "即使出发点相近，双方的第一反应也可能不同。一方想立刻行动，另一方需要整理感受；一方需要解释，另一方期待安抚。表达反应背后的需要、协商可行节奏，才能让两种风格都参与决定。",
    }],
    modalityParagraphs: [rhythmNeeds[m], ...(m === n ? [] : [rhythmNeeds[n]]), {
      en: m === n ? "A shared rhythm is a resource, not a guarantee. Divide leadership, follow-through and review deliberately. When a disagreement repeats, change the process: take turns setting the agenda, choose a time to revisit the issue and make room for a different response." : "Different rhythms work best with visible handovers. Decide who opens the conversation, who carries the routine and when either person may ask for a change. Revisit those roles as your circumstances evolve, rather than making one partner permanently responsible for keeping the relationship moving.",
      zh: m === n ? "相同节奏是一种资源，而不是关系保证。主动分配引导、执行与回顾的责任。若同样的分歧不断重演，可以改变讨论过程：轮流提出议题、约定重新讨论的时间，并为不同回应留出空间。" : "不同节奏需要清楚交接。谁开启讨论、谁维护日常、什么时候可以提出变化，都值得说清楚。处境改变时重新分工，不要让一方永久承担推动关系前进的责任。",
    }],
  };
}
