import { NextResponse } from "next/server";
import OpenAI from "openai";
import { consumeAiAccess } from "@/features/billing/lib/ai-access";
import { tarotDeck } from "@/lib/tarot/full-deck";
import { getTarotReadingSchema, isTarotReadingResult, readingResultToMarkdown } from "@/lib/tarot/reading-result";
import { isTarotReadingMode, tarotModes } from "@/lib/tarot/reading-modes";
import { getCardAnswer, getYesNoAnswer } from "@/lib/tarot/yes-no";
import type { DrawnTarotCard } from "@/types/tarot";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const mode = body.mode ?? "three-cards";
    if (!isTarotReadingMode(mode)) {
      return NextResponse.json({ error: "未知牌阵 / Unknown reading mode." }, { status: 400 });
    }
    const config = tarotModes[mode];
    const submitted: unknown = body.cards;
    if (!Array.isArray(submitted) || submitted.length !== config.positions.length
      || submitted.some(card => !card || typeof card.id !== "string")
      || new Set(submitted.map(card => card.id)).size !== submitted.length
      || new Set(submitted.map(card => card.position)).size !== submitted.length
      || !config.positions.every(position => submitted.some(card => card.position === position.key))) {
      return NextResponse.json({ error: `此牌阵需要 ${config.positions.length} 张不重复且牌位正确的牌。 / This spread requires ${config.positions.length} unique cards in their correct positions.` }, { status: 400 });
    }

    const cards: DrawnTarotCard[] = [];
    for (const position of config.positions) {
      const picked = submitted.find(card => card.position === position.key);
      const source = tarotDeck.find(card => card.id === picked.id);
      if (!source) return NextResponse.json({ error: "无效卡牌 / Invalid card." }, { status: 400 });
      cards.push({ ...source, position: position.key, reversed: mode === "yes-no" ? false : picked.reversed === true });
    }
    const question = typeof body.question === "string" ? body.question.trim() : "";
    if (mode === "yes-no" && !question) {
      return NextResponse.json({ error: "请输入一个明确的是非问题。 / Please enter a clear yes-or-no question." }, { status: 400 });
    }
    const access = await consumeAiAccess("tarot");
    if (!access.allowed) {
      return NextResponse.json({ error: access.message, code: access.code, upgradeUrl: "/pricing?scope=tarot" }, { status: access.httpStatus });
    }

    const answer = mode === "yes-no" ? getYesNoAnswer(cards) : undefined;
    const cardsText = cards.map((card, index) => {
      const position = config.positions[index];
      return `字段：${position.key}
位置：${position.label.zh} / ${position.label.en}
牌名：${card.nameCn} (${card.name})
牌组：${card.arcana} / ${card.suit ?? "major"}
方向：${card.reversed ? "逆位 / Reversed" : "正位 / Upright"}
重点关键词：${(card.reversed ? card.meaningReversed : card.meaningUp).join("、")}
正位关键词：${card.meaningUp.join("、")}
逆位关键词：${card.meaningReversed.join("、")}${mode === "yes-no" ? `\n象征倾向：${getCardAnswer(card)}` : ""}`;
    }).join("\n\n");

    const systemPrompt = `你是一位专业、温和、富有洞察力的中英双语塔罗解读师。
本次牌阵是 ${config.title.zh} / ${config.title.en}，共 ${cards.length} 张牌。
只解读本次实际抽到的牌，不要混淆或交换牌位，不要补造未抽到的牌。
使用完整78张韦特塔罗的传统象征，严格结合问题、牌位、所属牌组、正逆位和重点关键词。
大阿尔卡那关注人生阶段，圣杯关注情感，权杖关注行动，宝剑关注认知与沟通，星币关注现实与资源。
不要恐吓、宿命化或保证结果。使用趋势、提醒、觉察和具体可执行的建议，不要空泛套话。
如果没有问题，围绕当前牌阵主题解读。
${mode === "love" ? "本次关注关系中的自我模式、挑战、过去影响、成长与自我关爱。不能声称知道他人的私人思想、感情或保证关系结果。" : ""}
${mode === "one-card" ? "只围绕这张牌给出此刻的Insight，不要虚构过去/现在/未来三张牌。" : ""}
${mode === "yes-no" ? `最终象征答案已由两张牌的本地规则确定为 ${answer}。不要改变这个答案，也不要输出概率、保证或事实预测。解释两张牌的象征依据、情境、条件与现实判断的重要性。` : ""}
严格按JSON schema输出。每个文字字段包含zh简体中文和en自然完整英文，含义一致，不能只翻译标题。
overview用2至4句概括本次牌阵。${config.positions.map(position => `${position.key}字段仅解释${position.label.zh}这个牌位的实际卡牌。`).join(" ")}
synthesis串联本次牌阵，advice恰好3条具体温和现实的建议。
不要生成图片路径或卡牌元数据。`;
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.8,
      response_format: { type: "json_schema", json_schema: { name: "bilingual_tarot_reading", strict: true, schema: getTarotReadingSchema(mode) } },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `用户问题：${question || "围绕本次牌阵做总体解读。"}\n\n实际抽牌：\n${cardsText}` },
      ],
    });
    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("暂时没有生成解读。 / No reading was generated.");
    const result: unknown = JSON.parse(content);
    if (!isTarotReadingResult(result, mode)) throw new Error("解读格式不完整，请稍后重试。 / The reading is incomplete. Please try again.");
    const sections = { ...result, ...(answer ? { answer } : {}) };
    return NextResponse.json({ mode, reading: readingResultToMarkdown(sections, mode), sections });
  } catch (error: unknown) {
    console.error("tarot-reading error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "解读失败 / Failed to generate tarot reading." }, { status: 500 });
  }
}
