import "server-only";
import { createClient } from "@/lib/supabase/server";
import { emptyStats, literalSearch, PAGE_SIZE, PUBLIC_FIELDS, type CommunityProfile, type DirectoryFilters, type DirectoryStats } from "./model";

export async function communityDirectory(filters: DirectoryFilters) {
  const supabase = await createClient();
  let query = supabase.from("community_profiles").select(PUBLIC_FIELDS, { count: "exact" }).eq("is_public", true);
  if (filters.sign) query = query.eq("zodiac_sign", filters.sign);
  if (filters.role) query = query.eq("member_type", filters.role);
  const term = literalSearch(filters.q);
  if (term) query = query.or(`display_name.ilike.%${term}%,username.ilike.%${term}%,location.ilike.%${term}%`);
  query = filters.sort === "name" ? query.order("display_name").order("user_id") : query.order("created_at", { ascending: false }).order("user_id");
  const start = (filters.page - 1) * PAGE_SIZE;
  const [{ data, count, error }, stats] = await Promise.all([
    query.range(start, start + PAGE_SIZE - 1), supabase.rpc("community_directory_counts"),
  ]);
  return {
    members: (data ?? []) as CommunityProfile[], count: count ?? 0,
    stats: (stats.data ?? emptyStats) as DirectoryStats,
    unavailable: Boolean(error || stats.error),
  };
}

export async function communityMember(username: string) {
  if (!/^[a-z0-9_]{3,32}$/.test(username)) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.from("community_profiles").select(PUBLIC_FIELDS).eq("username", username).eq("is_public", true).maybeSingle();
  if (error || !data) return null;
  return data as CommunityProfile;
}

export async function relatedMembers(profile: CommunityProfile) {
  const supabase = await createClient();
  const { data } = await supabase.from("community_profiles").select(PUBLIC_FIELDS).eq("is_public", true).eq("zodiac_sign", profile.zodiac_sign).neq("user_id", profile.user_id).order("created_at", { ascending: false }).limit(4);
  return (data ?? []) as CommunityProfile[];
}
