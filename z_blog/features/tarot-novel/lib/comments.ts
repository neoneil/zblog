import "server-only";
import { createClient } from "@/lib/supabase/server";

export type NovelComment = { id: string; chapter_id: string; display_name: string; body: string; created_at: string };

export async function novelComments(chapterId?: string) {
  const supabase = await createClient();
  let query = supabase.from("novel_comments").select("id,chapter_id,display_name,body,created_at").order("created_at", { ascending: false }).limit(chapterId ? 100 : 12);
  if (chapterId) query = query.eq("chapter_id", chapterId);
  const { data, error } = await query;
  if (error) {
    if (["42P01", "PGRST205"].includes(error.code)) return [];
    throw new Error("Unable to load novel comments");
  }
  return (data ?? []) as NovelComment[];
}
