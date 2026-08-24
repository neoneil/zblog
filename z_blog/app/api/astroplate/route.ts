import { NextResponse } from "next/server";
import OpenAI from "openai";
import { consumeAiAccess } from "@/features/billing/lib/ai-access";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ChartPointJson = {
  key: string;
  label: string;
  labelZh: string;
  absoluteDegrees: number;
  sign: string;
  signZh: string;
  signDegrees: number;
  retrograde?: boolean;
  house?: number;
};

type AstrologyChartJson = {
  meta: {
    name: string;
    generatedAt: string;
    zodiac: string;
    zodiacZh: string;
    houseSystem: string;
    houseSystemZh: string;
    birth: {
      year: number;
      month: number;
      day: number;
      hour: number;
      minute: number;
      latitude: number;
      longitude: number;
    };
    notes?: string[];
  };
  planets: ChartPointJson[];
  angles: ChartPointJson[];
  houses: Array<{
    house: number;
    cuspDegrees: number;
    sign: string;
    signZh: string;
    signDegrees: number;
  }>;
  aspects: Array<{
    point1Key: string;
    point1Label: string;
    point1LabelZh: string;
    point2Key: string;
    point2Label: string;
    point2LabelZh: string;
    label: string;
    labelZh: string;
    orb: number;
  }>;
};

export async function POST(req: Request) {
  try {
    const access = await consumeAiAccess("astroplate");

    if (!access.allowed) {
      return NextResponse.json(
        {
          error: access.message,
          code: access.code,
          upgradeUrl: "/pricing?scope=astroplate",
        },
        { status: access.httpStatus },
      );
    }

    const body = await req.json();
    const question: string = body.question ?? "";
    const chartJson: AstrologyChartJson | null = body.chartJson ?? null;

    if (!chartJson) {
      return NextResponse.json(
        { error: "chartJson is required." },
        { status: 400 }
      );
    }

    if (!Array.isArray(chartJson.planets) || chartJson.planets.length === 0) {
      return NextResponse.json(
        { error: "Invalid chartJson: planets are required." },
        { status: 400 }
      );
    }

    const planetsText = chartJson.planets
      .map((planet) => {
        return [
          `星体：${planet.labelZh} (${planet.label})`,
          `落座：${planet.signZh} (${planet.sign}) ${planet.signDegrees.toFixed(2)}°`,
          typeof planet.house === "number" ? `宫位：第 ${planet.house} 宫` : null,
          `是否逆行：${planet.retrograde ? "是" : "否"}`,
        ]
          .filter(Boolean)
          .join("\n");
      })
      .join("\n\n");

    const anglesText = chartJson.angles
      .map((angle) => {
        return [
          `点位：${angle.labelZh} (${angle.label})`,
          `落座：${angle.signZh} (${angle.sign}) ${angle.signDegrees.toFixed(2)}°`,
        ].join("\n");
      })
      .join("\n\n");

    const housesText = chartJson.houses
      .map((house) => {
        return `第 ${house.house} 宫宫头：${house.signZh} (${house.sign}) ${house.signDegrees.toFixed(2)}°`;
      })
      .join("\n");

    const aspectsText =
      chartJson.aspects.length > 0
        ? chartJson.aspects
            .map((aspect) => {
              return `${aspect.point1LabelZh} (${aspect.point1Label}) 与 ${aspect.point2LabelZh} (${aspect.point2Label})：${aspect.labelZh} (${aspect.label})，容许度 ${aspect.orb.toFixed(2)}°`;
            })
            .join("\n")
        : "无主要相位数据。";

    const birthText = [
      `姓名：${chartJson.meta.name || "未填写"}`,
      `出生时间：${chartJson.meta.birth.year}-${String(chartJson.meta.birth.month).padStart(2, "0")}-${String(chartJson.meta.birth.day).padStart(2, "0")} ${String(chartJson.meta.birth.hour).padStart(2, "0")}:${String(chartJson.meta.birth.minute).padStart(2, "0")}`,
      `经纬度：纬度 ${chartJson.meta.birth.latitude}，经度 ${chartJson.meta.birth.longitude}`,
      `黄道类型：${chartJson.meta.zodiacZh} (${chartJson.meta.zodiac})`,
      `宫位系统：${chartJson.meta.houseSystemZh} (${chartJson.meta.houseSystem})`,
      chartJson.meta.notes?.length
        ? `备注：${chartJson.meta.notes.join("；")}`
        : null,
    ]
      .filter(Boolean)
      .join("\n");

    const systemPrompt = `
你是一位专业、温和、具有结构化分析能力的中文占星解读师。

用户会提供：
1. 一个提问（可能为空）
2. 一份已经计算完成的本命星盘 JSON
   - 行星 planets
   - 角点 angles（例如上升 Ascendant、天顶 Midheaven）
   - 宫位 houses
   - 主要相位 aspects

请严格基于用户提供的数据进行解读，不要凭空捏造不存在的星体、宫位、相位或技术细节。

解读要求：
- 风格专业、温和、清晰，不要神神叨叨
- 不要绝对化表达，不要说“命中注定”
- 以“倾向、模式、优势、提醒、发展方向”为主
- 不要制造恐惧
- 要尽量结合用户问题场景；如果用户没有提问，就做总体人格与人生主题解读
- 优先参考：
  1. 太阳、月亮、上升
  2. 水星、金星、火星
  3. 土星
  4. 天顶
  5. 主要相位
  6. 宫位分布
- 当经纬度为 0 或备注提示精度有限时，要自然说明：
  “部分宫位、上升、天顶解读可能偏概略”
  但不要否定整份解读的价值
- 行星、星座、角点、相位，请尽量使用“中文 + 英文”格式，例如：
  太阳（Sun）、狮子座（Leo）、上升（Ascendant）、拱相（Trine）

请使用中文 Markdown 输出，并严格使用以下结构：

## 总览
用 3-5 句话总结这张星盘最核心的气质、主线与整体倾向。

## 核心人格
重点解读：
- 太阳（Sun）
- 月亮（Moon）
- 上升（Ascendant）

## 思维与沟通
重点解读：
- 水星（Mercury）

## 感情与关系
重点解读：
- 金星（Venus）
- 火星（Mars）

## 事业与成长课题
重点解读：
- 天顶（Midheaven）
- 土星（Saturn）

## 关键相位影响
挑出最值得关注的 3-5 个主要相位进行解释，不要机械罗列全部相位。

## 综合分析
把人格、情绪、关系、事业成长串起来，说清楚这张盘的整体运行逻辑。

## 建议
给出 4 条具体、现实、温和的建议。
`;

    const userPrompt = `
用户问题：
${question.trim() || "用户没有输入具体问题，请按总体人格、关系模式、成长方向进行解读。"}

以下是用户的本命星盘核心数据：

### 基本信息
${birthText}

### 行星数据
${planetsText}

### 角点数据
${anglesText}

### 宫位数据
${housesText}

### 主要相位
${aspectsText}

请基于以上数据，进行完整中文占星解读。
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
      completion.choices[0]?.message?.content ?? "暂时没有生成占星解读。";

    return NextResponse.json({ reading });
  } catch (error: unknown) {
    const errorRecord =
      typeof error === "object" && error !== null
        ? (error as Record<string, unknown>)
        : {};
    const message =
      error instanceof Error ? error.message : "Failed to generate astrology reading.";

    console.error("astrology-reading full error:", error);
    console.error("message:", message);
    console.error("status:", errorRecord.status);
    console.error("code:", errorRecord.code);
    console.error("type:", errorRecord.type);
    console.error("response data:", errorRecord.response);

    return NextResponse.json(
      {
        error: message,
      },
      { status: 500 }
    );
  }
}
