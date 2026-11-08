"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserWithRole } from "@/lib/auth/current-user";
import { profilePayload, validAvatar } from "@/features/community/lib/model";

export async function saveCommunityProfile(form: FormData) {
  const { user, supabase } = await getCurrentUserWithRole();
  if (!user) return { status: "login" } as const;
  const payload = profilePayload(form);
  if (!payload || !validAvatar(payload.avatar_url, user.id, process.env.NEXT_PUBLIC_SUPABASE_URL || "")) return { status: "invalid" } as const;
  const { data: previous } = await supabase.from("community_profiles").select("username").eq("user_id", user.id).maybeSingle();
  // The server supplies ownership; client-provided user IDs and privilege roles are ignored.
  const { error } = previous
    ? await supabase.from("community_profiles").update(payload).eq("user_id", user.id).select("user_id").single()
    : await supabase.from("community_profiles").insert({ ...payload, user_id: user.id }).select("user_id").single();
  if (error) return { status: error.code === "23505" ? "taken" : "error" } as const;
  revalidatePath("/community");
  revalidatePath(`/community/${payload.username}`);
  if (previous?.username && previous.username !== payload.username) revalidatePath(`/community/${previous.username}`);
  return { status: "ok" } as const;
}
