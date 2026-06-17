export type TarotLanguage = "zh" | "en";

export type TarotSectionKey =
  | "image_explanation"
  | "symbol_analysis"
  | "case_reading"
  | "practical_use";

export type TarotBlockType = "text" | "image";

export type TarotCard = {
  id: string;
  slug: string;
  card_no: number | null;
  name_cn: string;
  name_en: string;
  arcana: string | null;
  suit: string | null;
  order_index: number | null;
  is_published: boolean;
};

export type TarotSectionBlock = {
  id: string;
  section_id: string;
  block_type: TarotBlockType;
  content: string | null;
  image_url: string | null;
  signed_image_url: string | null;
  order_index: number;
  x: number | null;
  y: number | null;
  width: number | null;
  height: number | null;
  align: "left" | "center" | "right" | null;
  font_size: number | null;
  font_weight: string | null;
};

export type TarotCardSection = {
  id: string;
  card_id: string;
  section_key: TarotSectionKey;
  title: string;
  order_index: number;
  blocks: TarotSectionBlock[];
};

export type TarotBlockUpdateInput = {
  id: string;
  content?: string | null;
  image_url?: string | null;
  order_index?: number;
  x?: number | null;
  y?: number | null;
  width?: number | null;
  height?: number | null;
  align?: "left" | "center" | "right" | null;
  font_size?: number | null;
  font_weight?: string | null;
};

export const TAROT_SECTION_KEYS: TarotSectionKey[] = [
  "image_explanation",
  "symbol_analysis",
  "case_reading",
  "practical_use",
];

export const TAROT_SECTION_LABELS: Record<
  TarotSectionKey,
  { zh: string; en: string }
> = {
  image_explanation: {
    zh: "画面讲解",
    en: "Image Explanation",
  },
  symbol_analysis: {
    zh: "符号拆解",
    en: "Symbol Analysis",
  },
  case_reading: {
    zh: "案例解读",
    en: "Case Reading",
  },
  practical_use: {
    zh: "实战运用",
    en: "Practical Use",
  },
};
