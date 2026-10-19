import { tarotModes, type TarotReadingMode } from "./reading-modes";
import type { TarotPosition } from "@/types/tarot";
import type { TarotAnswer } from "./yes-no";

export type BilingualReadingText = { zh: string; en: string };

export type TarotReadingResult = {
  overview: BilingualReadingText;
  synthesis: BilingualReadingText;
  advice: BilingualReadingText[];
  answer?: TarotAnswer;
} & Partial<Record<TarotPosition, BilingualReadingText>>;

const bilingualTextSchema = {
  type: "object",
  properties: { zh: { type: "string" }, en: { type: "string" } },
  required: ["zh", "en"],
  additionalProperties: false,
} as const;

export function getTarotReadingSchema(mode: TarotReadingMode = "three-cards") {
  const keys = tarotModes[mode].positions.map(position => position.key);
  return {
    type: "object",
    properties: {
      overview: bilingualTextSchema,
      ...Object.fromEntries(keys.map(key => [key, bilingualTextSchema])),
      synthesis: bilingualTextSchema,
      advice: { type: "array", items: bilingualTextSchema, minItems: 3, maxItems: 3 },
    },
    required: ["overview", ...keys, "synthesis", "advice"],
    additionalProperties: false,
  } as const;
}
export const tarotReadingSchema = getTarotReadingSchema();

function isBilingualText(value: unknown): value is BilingualReadingText {
  if (typeof value !== "object" || value === null) return false;
  const text = value as Record<string, unknown>;
  return typeof text.zh === "string" && text.zh.trim().length > 0
    && typeof text.en === "string" && text.en.trim().length > 0;
}

export function isTarotReadingResult(value: unknown, mode: TarotReadingMode = "three-cards"): value is TarotReadingResult {
  if (typeof value !== "object" || value === null) return false;
  const result = value as Record<string, unknown>;
  return ["overview", ...tarotModes[mode].positions.map(position => position.key), "synthesis"].every(key => isBilingualText(result[key]))
    && (result.answer === undefined || ["yes", "no", "maybe"].includes(String(result.answer)))
    && Array.isArray(result.advice) && result.advice.length === 3
    && result.advice.every(isBilingualText);
}

export function readingResultToMarkdown(result: TarotReadingResult, mode: TarotReadingMode = "three-cards"): string {
  const sections = [
    ["总览 / Overview", result.overview],
    ...tarotModes[mode].positions.map(({ key, label }) => [`${label.zh} / ${label.en}`, result[key]] as const),
    ["综合分析 / Synthesis", result.synthesis],
  ] as const;
  return [
    ...sections.filter(([, text]) => Boolean(text)).map(([heading, text]) => `## ${heading}\n\n${text!.zh}\n\n${text!.en}`),
    `## 建议 / Advice\n\n${result.advice.map((text, index) => `${index + 1}. ${text.zh}\n\n   ${text.en}`).join("\n\n")}`,
  ].join("\n\n");
}
