import { notFound } from "next/navigation";
import TarotCardReader from "@/features/tarot/components/TarotCardReader";
import { getCurrentUserWithRole } from "@/lib/auth/current-user";
import type {
  TarotBlockType,
  TarotCard,
  TarotCardSection,
  TarotLanguage,
  TarotSectionBlock,
  TarotSectionKey,
} from "@/features/tarot/types";
import { TAROT_SECTION_KEYS } from "@/features/tarot/types";

type TarotPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    lang?: string;
    preview?: string;
  }>;
};

type TarotCardRow = {
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

type TarotSectionRow = {
  id: string;
  card_id: string;
  section_key: string;
  title: string | null;
  order_index: number | null;
};

type TarotBlockRow = {
  id: string;
  section_id: string;
  block_type: string;
  content: string | null;
  image_url: string | null;
  order_index: number | null;
  x: number | null;
  y: number | null;
  width: number | null;
  height: number | null;
  align: "left" | "center" | "right" | null;
  font_size: number | null;
  font_weight: string | null;
};

function getLanguage(rawLang?: string): TarotLanguage {
  return rawLang === "en" ? "en" : "zh";
}

function isSectionKey(value: string): value is TarotSectionKey {
  return TAROT_SECTION_KEYS.includes(value as TarotSectionKey);
}

function isBlockType(value: string): value is TarotBlockType {
  return value === "text" || value === "image";
}

function toCard(row: TarotCardRow): TarotCard {
  return {
    id: row.id,
    slug: row.slug,
    card_no: row.card_no,
    name_cn: row.name_cn,
    name_en: row.name_en,
    arcana: row.arcana,
    suit: row.suit,
    order_index: row.order_index,
    is_published: row.is_published,
  };
}

async function withSignedImageUrl(
  supabase: Awaited<ReturnType<typeof getCurrentUserWithRole>>["supabase"],
  block: TarotBlockRow,
): Promise<TarotSectionBlock | null> {
  if (!isBlockType(block.block_type)) return null;

  let signedImageUrl: string | null = null;

  if (block.block_type === "image" && block.image_url) {
    const { data } = await supabase.storage
      .from("tarots")
      .createSignedUrl(block.image_url, 60 * 60);

    signedImageUrl = data?.signedUrl ?? null;
  }

  return {
    id: block.id,
    section_id: block.section_id,
    block_type: block.block_type,
    content: block.content,
    image_url: block.image_url,
    signed_image_url: signedImageUrl,
    order_index: block.order_index ?? 0,
    x: block.x,
    y: block.y,
    width: block.width,
    height: block.height,
    align: block.align,
    font_size: block.font_size,
    font_weight: block.font_weight,
  };
}

export default async function TarotCardPage({
  params,
  searchParams,
}: TarotPageProps) {
  const { slug: rawSlug } = await params;
  const { lang: rawLang, preview } = await searchParams;
  const slug = decodeURIComponent(rawSlug).trim();
  const lang = getLanguage(rawLang);
  const { supabase, role } = await getCurrentUserWithRole();
  const isEditor = role === "admin" || role === "editor";
  const isUserPreview = isEditor && preview === "user";
  const canEdit = isEditor && !isUserPreview;

  let cardQuery = supabase
    .schema("tarot")
    .from("tarot_cards")
    .select("id, slug, card_no, name_cn, name_en, arcana, suit, order_index, is_published")
    .eq("slug", slug);

  if (!isEditor) {
    cardQuery = cardQuery.eq("is_published", true);
  }

  const { data: cardRow } = await cardQuery.single<TarotCardRow>();

  if (!cardRow) {
    notFound();
  }

  const { data: sectionRows } = await supabase
    .schema("tarot")
    .from("tarot_card_sections")
    .select("id, card_id, section_key, title, order_index")
    .eq("card_id", cardRow.id)
    .in("section_key", TAROT_SECTION_KEYS)
    .order("order_index", { ascending: true })
    .returns<TarotSectionRow[]>();

  const validSections = (sectionRows ?? []).filter((section) =>
    isSectionKey(section.section_key),
  );

  const sectionIds = validSections.map((section) => section.id);

  const { data: blockRows } = sectionIds.length > 0
    ? await supabase
        .schema("tarot")
        .from("tarot_section_blocks")
        .select("id, section_id, block_type, content, image_url, order_index, x, y, width, height, align, font_size, font_weight")
        .in("section_id", sectionIds)
        .order("order_index", { ascending: true })
        .returns<TarotBlockRow[]>()
    : { data: [] as TarotBlockRow[] };

  const blocksWithSignedUrls = await Promise.all(
    (blockRows ?? []).map((block) => withSignedImageUrl(supabase, block)),
  );

  const blocksBySection = new Map<string, TarotSectionBlock[]>();

  blocksWithSignedUrls.forEach((block) => {
    if (!block) return;
    const existing = blocksBySection.get(block.section_id) ?? [];
    blocksBySection.set(block.section_id, [...existing, block]);
  });

  const sections: TarotCardSection[] = validSections.map((section) => ({
    id: section.id,
    card_id: section.card_id,
    section_key: section.section_key as TarotSectionKey,
    title: section.title ?? section.section_key,
    order_index: section.order_index ?? 0,
    blocks: blocksBySection.get(section.id) ?? [],
  }));

  return (
    <TarotCardReader
      card={toCard(cardRow)}
      sections={sections}
      lang={lang}
      canEdit={canEdit}
    />
  );
}
