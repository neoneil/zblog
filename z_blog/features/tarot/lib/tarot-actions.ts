"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUserWithRole } from "@/lib/auth/current-user";
import type {
  TarotBlockUpdateInput,
  TarotSectionKey,
} from "@/features/tarot/types";
import { TAROT_SECTION_LABELS, TAROT_SECTION_KEYS } from "@/features/tarot/types";

const TAROT_BUCKET = "tarots";

type EnsureTarotCardInput = {
  slug: string;
  cardNo: number | null;
  nameCn: string;
  nameEn: string;
  arcana: string | null;
  suit: string | null;
  orderIndex: number;
};

function assertEditor(role: string | null) {
  if (role !== "admin" && role !== "editor") {
    throw new Error("Unauthorized");
  }
}

function normalizeNumber(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeString(value: FormDataEntryValue | null) {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

function refreshCard(cardSlug?: string | null) {
  if (cardSlug) {
    revalidatePath(`/tarot/${cardSlug}`);
  }
}

export async function updateTarotBlock(
  input: TarotBlockUpdateInput,
  cardSlug?: string,
) {
  const { supabase, role } = await getCurrentUserWithRole();
  assertEditor(role);

  const { error } = await supabase
    .schema("tarot")
    .from("tarot_section_blocks")
    .update({
      content: input.content ?? null,
      image_url: input.image_url ?? null,
      order_index: input.order_index,
      x: input.x ?? null,
      y: input.y ?? null,
      width: input.width ?? null,
      height: input.height ?? null,
      align: input.align ?? null,
      font_size: input.font_size ?? null,
      font_weight: input.font_weight ?? null,
    })
    .eq("id", input.id);

  if (error) {
    return { ok: false, error: error.message };
  }

  refreshCard(cardSlug);
  return { ok: true };
}

export async function createTarotTextBlock(formData: FormData) {
  const { supabase, role } = await getCurrentUserWithRole();
  assertEditor(role);

  const sectionId = normalizeString(formData.get("sectionId"));
  const cardSlug = normalizeString(formData.get("cardSlug"));

  if (!sectionId) {
    return { ok: false, error: "Missing section id." };
  }

  const { error } = await supabase
    .schema("tarot")
    .from("tarot_section_blocks")
    .insert({
      section_id: sectionId,
      block_type: "text",
      content: normalizeString(formData.get("content")) ?? "",
      order_index: normalizeNumber(formData.get("orderIndex")) ?? 0,
      x: normalizeNumber(formData.get("x")),
      y: normalizeNumber(formData.get("y")),
      width: normalizeNumber(formData.get("width")) ?? 420,
      height: normalizeNumber(formData.get("height")) ?? 180,
      align: "left",
      font_size: 16,
      font_weight: "400",
    });

  if (error) {
    return { ok: false, error: error.message };
  }

  refreshCard(cardSlug);
  return { ok: true };
}

export async function createTarotImageBlock(formData: FormData) {
  const { supabase, role } = await getCurrentUserWithRole();
  assertEditor(role);

  const file = formData.get("file");
  const cardSlug = normalizeString(formData.get("cardSlug"));
  const sectionId = normalizeString(formData.get("sectionId"));
  const sectionKey = normalizeString(formData.get("sectionKey")) as TarotSectionKey | null;

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Please choose an image." };
  }

  if (!cardSlug || !sectionId || !sectionKey) {
    return { ok: false, error: "Missing tarot upload metadata." };
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const storagePath = `tarot/${cardSlug}/${sectionKey}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from(TAROT_BUCKET)
    .upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    return { ok: false, error: uploadError.message };
  }

  const { error: insertError } = await supabase
    .schema("tarot")
    .from("tarot_section_blocks")
    .insert({
      section_id: sectionId,
      block_type: "image",
      image_url: storagePath,
      order_index: normalizeNumber(formData.get("orderIndex")) ?? 0,
      x: normalizeNumber(formData.get("x")),
      y: normalizeNumber(formData.get("y")),
      width: normalizeNumber(formData.get("width")) ?? 360,
      height: normalizeNumber(formData.get("height")) ?? 260,
      align: "center",
    });

  if (insertError) {
    await supabase.storage.from(TAROT_BUCKET).remove([storagePath]);
    return { ok: false, error: insertError.message };
  }

  refreshCard(cardSlug);
  return { ok: true };
}

export async function uploadTarotImage(formData: FormData) {
  return createTarotImageBlock(formData);
}

export async function deleteTarotBlock(blockId: string, cardSlug?: string) {
  const { supabase, role } = await getCurrentUserWithRole();
  assertEditor(role);

  const { data: block, error: readError } = await supabase
    .schema("tarot")
    .from("tarot_section_blocks")
    .select("id, block_type, image_url")
    .eq("id", blockId)
    .single();

  if (readError) {
    return { ok: false, error: readError.message };
  }

  const { error: deleteError } = await supabase
    .schema("tarot")
    .from("tarot_section_blocks")
    .delete()
    .eq("id", blockId);

  if (deleteError) {
    return { ok: false, error: deleteError.message };
  }

  if (block?.block_type === "image" && block.image_url) {
    await supabase.storage.from(TAROT_BUCKET).remove([block.image_url]);
  }

  refreshCard(cardSlug);
  return { ok: true };
}

export async function ensureTarotCardShell(input: EnsureTarotCardInput) {
  const { supabase, role } = await getCurrentUserWithRole();
  assertEditor(role);

  const { data: existingCard, error: readError } = await supabase
    .schema("tarot")
    .from("tarot_cards")
    .select("id")
    .eq("slug", input.slug)
    .maybeSingle();

  if (readError) {
    throw new Error(readError.message);
  }

  let cardId = existingCard?.id as string | undefined;

  if (!cardId) {
    const { data: card, error: insertError } = await supabase
      .schema("tarot")
      .from("tarot_cards")
      .insert({
        slug: input.slug,
        card_no: input.cardNo,
        name_cn: input.nameCn,
        name_en: input.nameEn,
        arcana: input.arcana,
        suit: input.suit,
        order_index: input.orderIndex,
        is_published: false,
      })
      .select("id")
      .single();

    if (insertError) {
      throw new Error(insertError.message);
    }

    cardId = card.id;
  }

  const { data: existingSections, error: sectionReadError } = await supabase
    .schema("tarot")
    .from("tarot_card_sections")
    .select("section_key")
    .eq("card_id", cardId);

  if (sectionReadError) {
    throw new Error(sectionReadError.message);
  }

  const existingKeys = new Set(
    (existingSections ?? []).map((section) => section.section_key),
  );
  const missingSections = TAROT_SECTION_KEYS
    .filter((sectionKey) => !existingKeys.has(sectionKey))
    .map((sectionKey, index) => ({
      card_id: cardId,
      section_key: sectionKey,
      title: TAROT_SECTION_LABELS[sectionKey].zh,
      order_index: index,
    }));

  if (missingSections.length > 0) {
    const { error: insertSectionError } = await supabase
      .schema("tarot")
      .from("tarot_card_sections")
      .insert(missingSections);

    if (insertSectionError) {
      throw new Error(insertSectionError.message);
    }
  }

  revalidatePath("/tarot");
  redirect(`/tarot/${input.slug}?lang=zh`);
}

export async function setTarotCardPublished(
  cardId: string,
  cardSlug: string,
  isPublished: boolean,
) {
  const { supabase, role } = await getCurrentUserWithRole();
  assertEditor(role);

  const { error } = await supabase
    .schema("tarot")
    .from("tarot_cards")
    .update({ is_published: isPublished })
    .eq("id", cardId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/tarot");
  revalidatePath(`/tarot/${cardSlug}`);
}
