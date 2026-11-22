import type { OpenAIChartJson } from "@/lib/astrology/natal-chart";
import type { SynastryInput } from "@/lib/astrology/synastry";
import type { TarotReadingMode } from "@/lib/tarot/reading-modes";
import type { DrawnTarotCard } from "@/types/tarot";

export const archivedReadingSkus = ["waite-single", "waite-multi", "natal", "synastry"] as const;
export type ArchivedReadingSku = (typeof archivedReadingSkus)[number];

export type ReadingContext =
  | { kind: "tarot"; mode: TarotReadingMode; question: string; fixedQuestion?: { zh: string; en: string }; cards: Pick<DrawnTarotCard, "id" | "position" | "reversed">[] }
  | { kind: "natal"; question: string; chart: OpenAIChartJson; language: "zh" | "en" }
  | { kind: "synastry"; input: SynastryInput };

export type ReadingArchive = ReadingContext & { completedAt: string };
export type ReadingSummary = {
  id: string;
  sku: ArchivedReadingSku;
  created_at: string;
  completed_at: string | null;
  mode: string | null;
};

export type ReadingDetail = {
  id: string;
  sku: ArchivedReadingSku;
  result: unknown;
};
