import { NextResponse } from "next/server";
import OpenAI from "openai";
import type { DrawnTarotCard } from "@/types/tarot";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    console.log("OPENAI_API_KEY exists:", !!process.env.OPENAI_API_KEY);

    const body = await req.json();
    const question: string = body.question ?? "";
    const cards: DrawnTarotCard[] = body.cards ?? [];

    if (!cards || cards.length !== 3) {
      return NextResponse.json(
        { error: "Exactly 3 cards are required." },
        { status: 400 }
      );
    }

    const positionLabel: Record<string, string> = {
      past: "过去",
      present: "现在",
      future: "未来",
    };

    const suitLabel: Record<string, string> = {
      cups: "圣杯",
      wands: "权杖",
      swords: "宝剑",
      pentacles: "星币",
    };

    const arcanaLabel: Record<string, string> = {
      major: "大阿尔卡那",
      minor: "小阿尔卡那",
    };

    const cardsText = cards
      .map((card) => {
        const activeKeywords = card.reversed ? card.meaningReversed : card.meaningUp;
        const suitText = card.suit ? suitLabel[card.suit] ?? card.suit : "无";
        const arcanaText = arcanaLabel[card.arcana] ?? card.arcana;

        return `位置：${positionLabel[card.position]}
牌名：${card.nameCn} (${card.name})
牌组：${arcanaText}${card.suit ? ` / ${suitText}` : ""}
方向：${card.reversed ? "逆位" : "正位"}
本次应重点参考关键词：${activeKeywords.join("、")}
正位关键词：${card.meaningUp.join("、")}
逆位关键词：${card.meaningReversed.join("、")}`;
      })
      .join("\n\n");

    const systemPrompt = `
你是一位专业、温和、富有洞察力的中文塔罗占卜师。

用户会提出一个问题，并抽出三张塔罗牌，分别代表：
- 过去（past）
- 现在（present）
- 未来（future）

每张牌都可能是：
- 正位
- 逆位

牌组包含完整 78 张塔罗牌：
1. 大阿尔卡那（Major Arcana）
2. 小阿尔卡那（Minor Arcana）
   - 圣杯 Cups：情感、关系、内在感受
   - 权杖 Wands：行动、事业、热情、推进
   - 宝剑 Swords：思维、冲突、沟通、理性
   - 星币 Pentacles：现实、资源、金钱、稳定、长期建设

请严格结合：
1. 用户的问题
2. 三张牌的位置
3. 正逆位
4. 牌本身所属牌组
5. 本次应重点参考的关键词

进行具体分析。

解读原则：
- 大阿尔卡那更偏向人生阶段、命运主题、重要转折
- 圣杯更偏向情感、人际、关系、情绪
- 权杖更偏向行动力、事业推进、创造热情、外在扩张
- 宝剑更偏向思维、判断、沟通、冲突、心理压力
- 星币更偏向现实基础、资源、金钱、安全感、长期建设

写作要求：
- 风格温和、有洞察力，不要恐吓用户
- 不要说“命中注定”
- 不要绝对化地下结论
- 以趋势、提醒、建议、觉察为主
- 不要空泛套话，要尽量结合用户的问题场景
- 如果用户没有写具体问题，就按总体运势方向解读
- 优先结合用户问题所属场景调整解读重心，例如感情、事业、家庭、自我成长
- 先分别解读三张牌，再做整体串联
- 建议要具体、现实、可执行，不要鸡汤化

请使用中文 Markdown 输出，并严格使用以下结构：

## 总览
用 2-4 句话总结这组三张牌的整体能量与主线。

## 单张解读

### 过去
解读过去位置这张牌的含义，并说明它如何影响现在。

### 现在
解读现在位置这张牌的状态、矛盾、机会或提醒。

### 未来
解读未来位置这张牌显示的发展趋势，以及可能的变化方向。

## 综合分析
把三张牌联系起来，说明事件的发展逻辑、情绪变化、关系变化，或现实层面的推进过程。

## 建议
给出 3 条具体、温和、现实的建议。
`;

    const userPrompt = `
用户问题：
${question.trim() || "用户没有输入具体问题，请做总体运势方向解读。"}

抽到的三张牌如下：

${cardsText}

请基于以上内容进行完整中文塔罗解读。
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.8,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const reading =
      completion.choices[0]?.message?.content ?? "暂时没有生成解读。";

    return NextResponse.json({ reading });
  } catch (error: any) {
    console.error("tarot-reading full error:", error);
    console.error("message:", error?.message);
    console.error("status:", error?.status);
    console.error("code:", error?.code);
    console.error("type:", error?.type);
    console.error("response data:", error?.response?.data);

    return NextResponse.json(
      {
        error: error?.message || "Failed to generate tarot reading.",
      },
      { status: 500 }
    );
  }
}