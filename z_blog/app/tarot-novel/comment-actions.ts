"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/require-admin";

export async function publishComment(form: FormData): Promise<"ok" | "login" | "invalid" | "limit" | "error"> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return "login";
  const chapter_id = String(form.get("chapter_id") ?? "");
  const accountName = user.user_metadata?.full_name || user.user_metadata?.name;
  const display_name = typeof accountName === "string" && accountName.trim()
    ? accountName.trim().slice(0, 60) : "User";
  const body = String(form.get("body") ?? "").trim();
  if (!/^[0-9a-f-]{36}$/i.test(chapter_id) || !display_name || display_name.length > 60 || !body || body.length > 2000) return "invalid";
  const { error } = await supabase.from("novel_comments").insert({ chapter_id, display_name, body, user_id: user.id });
  if (error?.message.includes("CHAPTER_COMMENT_LIMIT")) return "limit";
  if (error) return "error";
  revalidatePath("/tarot-novel", "layout");
  return "ok";
}

export async function removeComment(id: string) {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("novel_comments").delete().eq("id", id).select("id").single();
  if (error || !data) return false;
  revalidatePath("/tarot-novel", "layout");
  revalidatePath("/admin/novel");
  return true;
}
