import { tarotModes, type TarotReadingMode } from "./reading-modes";
import { getCardAnswer, getYesNoAnswer } from "./yes-no";
import type { DrawnTarotCard } from "@/types/tarot";

export function buildTarotReadingPrompts(mode: TarotReadingMode, cards: DrawnTarotCard[], submittedQuestion = "") {
  const config = tarotModes[mode];
  const question = config.fixedQuestion
    ? `${config.fixedQuestion.zh} / ${config.fixedQuestion.en}`
    : submittedQuestion.trim();
  const answer = mode === "yes-no" ? getYesNoAnswer(cards) : undefined;
  const cardsText = cards.map((card, index) => {
    const position = config.positions[index];
    return `字段：${position.key}
位置：${position.label.zh} / ${position.label.en}
${position.description ? `牌位含义：${position.description.zh} / ${position.description.en}\n` : ""}牌名：${card.nameCn} (${card.name})
牌组：${card.arcana} / ${card.suit ?? "major"}
方向：${card.reversed ? "逆位 / Reversed" : "正位 / Upright"}
重点关键词：${(card.reversed ? card.meaningReversed : card.meaningUp).join("、")}
正位关键词：${card.meaningUp.join("、")}
逆位关键词：${card.meaningReversed.join("、")}${mode === "yes-no" ? `\n象征倾向：${getCardAnswer(card)}` : ""}`;
  }).join("\n\n");

  const system = `你是一位专业、温和、富有洞察力的中英双语塔罗解读师。
本次牌阵是 ${config.title.zh} / ${config.title.en}，共 ${cards.length} 张牌。
只解读本次实际抽到的牌，不要混淆或交换牌位，不要补造未抽到的牌。
使用完整78张韦特塔罗的传统象征，严格结合问题、牌位、所属牌组、正逆位和重点关键词。
大阿尔卡那关注人生阶段，圣杯关注情感，权杖关注行动，宝剑关注认知与沟通，星币关注现实与资源。
不要恐吓、宿命化或保证结果。使用趋势、提醒、觉察和具体可执行的建议，不要空泛套话。
如果没有问题，围绕当前牌阵主题解读。
${config.fixedQuestion ? `本次使用服务端预设主题，不要求用户补充问题。固定主题：${question}。不得虚构用户没有提供的生活背景。` : ""}
${config.interpretation ? `${config.interpretation.zh}\n${config.interpretation.en}` : ""}
${mode === "love" || mode === "love-triangle" ? "本次关注关系中的自我模式、挑战、过去影响、成长与自我关爱。不能声称知道他人的私人思想、感情或保证关系结果。" : ""}
${mode === "one-card" ? "只围绕这张牌给出此刻的Insight，不要虚构过去/现在/未来三张牌。" : ""}
${mode === "yes-no" ? `最终象征答案已由两张牌的本地规则确定为 ${answer}。不要改变这个答案，也不要输出概率、保证或事实预测。解释两张牌的象征依据、情境、条件与现实判断的重要性。` : ""}
严格按JSON schema输出。每个文字字段包含zh简体中文和en自然完整英文，含义一致，不能只翻译标题。
overview用2至4句概括本次牌阵。${config.positions.map(position => `${position.key}字段仅解释${position.label.zh}这个牌位的实际卡牌。${position.description ? `观察重点：${position.description.zh}` : ""}`).join(" ")}
synthesis串联本次牌阵，advice恰好3条具体温和现实的建议。
不要生成图片路径或卡牌元数据。`;
  return { system, user: `用户问题或预设主题：${question || "围绕本次牌阵做总体解读。"}\n\n实际抽牌：\n${cardsText}` };
}
