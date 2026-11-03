import "server-only";
import { createClient } from "@/lib/supabase/server";

export type NovelChapter = {
  id: string; slug: string; chapter_number: number;
  title_zh: string; title_en: string;
  subtitle_zh: string; subtitle_en: string;
  content_zh: string; content_en: string;
  youtube_url: string | null; status: "draft" | "published";
};

export async function publishedChapters(slug?: string) {
  const supabase = await createClient();
  let query = supabase.from("novel_chapters").select("id,slug,chapter_number,title_zh,title_en,subtitle_zh,subtitle_en,content_zh,content_en,youtube_url,status").eq("status", "published").order("chapter_number");
  if (slug) query = query.eq("slug", slug);
  const { data, error } = await query;
  if (error) {
    if (["42P01", "PGRST205"].includes(error.code)) return [];
    throw new Error("Unable to load novel chapters");
  }
  return (data ?? []) as NovelChapter[];
}
