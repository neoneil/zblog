"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { youtubeEmbed } from "@/features/tarot-novel/lib/youtube";

export async function deleteChapter(id: string): Promise<string> {
  const { supabase } = await requireAdmin("/admin/novel");
  if (!/^[0-9a-f-]{36}$/i.test(id)) return "章节无效";
  const { data, error } = await supabase.from("novel_chapters").delete().eq("id", id).select("id").single();
  if (error || !data) return "删除失败，请重试。";
  revalidatePath("/tarot-novel", "layout");
  revalidatePath("/admin/novel");
  return "删除成功";
}

export async function saveChapter(form: FormData): Promise<string> {
  const { supabase, user } = await requireAdmin("/admin/novel");
  const get = (key: string) => String(form.get(key) ?? "").trim();
  const id = get("id");
  const slug = get("slug");
  const chapter_number = Number(get("chapter_number"));
  const status = get("status");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 120) return "链接标识请使用小写英文、数字及短横线。";
  if (!Number.isInteger(chapter_number) || chapter_number < 1 || chapter_number > 10000) return "章节编号须为 1–10000。";
  if (!["draft", "published"].includes(status)) return "发布状态无效。";
  const titles = { title_zh: get("title_zh"), title_en: get("title_en"), subtitle_zh: get("subtitle_zh"), subtitle_en: get("subtitle_en") };
  if (Object.values(titles).some((value) => !value || value.length > 300)) return "请填写中英文主标题和副标题（各不超过 300 字）。";
  const content_zh = get("content_zh"), content_en = get("content_en");
  if (content_zh.length > 200000 || content_en.length > 200000) return "每种语言正文最多 200000 字符。";
  if (status === "published" && (!content_zh || !content_en)) return "发布前请填写中英文正文。";
  const youtube_url = get("youtube_url") || null;
  if (youtube_url && !youtubeEmbed(youtube_url)) return "请填写有效的 HTTPS YouTube 视频链接。";
  const payload = { ...titles, slug, chapter_number, status, content_zh, content_en, youtube_url };
  const result = id
    ? await supabase.from("novel_chapters").update(payload).eq("id", id).select("id").single()
    : await supabase.from("novel_chapters").insert({ ...payload, author_id: user.id }).select("id").single();
  if (result.error) return result.error.code === "23505" ? "章节编号或链接标识已存在。" : "保存失败，请确认数据库 SQL 已执行，稍后重试。";
  revalidatePath("/tarot-novel", "layout");
  revalidatePath("/admin/novel");
  return "保存成功";
}
