import { NextResponse } from "next/server";
import OpenAI from "openai";
import { consumeAiAccess } from "@/features/billing/lib/ai-access";
import { tarotDeck } from "@/lib/tarot/full-deck";
import { getTarotReadingSchema, isTarotReadingResult, readingResultToMarkdown } from "@/lib/tarot/reading-result";
import { isTarotReadingMode, tarotModes } from "@/lib/tarot/reading-modes";
import { getYesNoAnswer } from "@/lib/tarot/yes-no";
import { buildTarotReadingPrompts } from "@/lib/tarot/reading-prompt";
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
    const prompts = buildTarotReadingPrompts(mode, cards, question);
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.8,
      response_format: { type: "json_schema", json_schema: { name: "bilingual_tarot_reading", strict: true, schema: getTarotReadingSchema(mode) } },
      messages: [
        { role: "system", content: prompts.system },
        { role: "user", content: prompts.user },
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
