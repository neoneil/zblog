import { signSlugs } from "@/features/stella/lib/explore-config";

export { signSlugs };
export type MemberType = "reader" | "customer";
export type CommunityProfile = {
  user_id: string;
  username: string;
  display_name: string;
  member_type: MemberType;
  zodiac_sign: string;
  location: string;
  about: string;
  website: string;
  avatar_url: string;
  is_public: boolean;
  created_at: string;
};
export type DirectoryFilters = { q: string; sign: string; role: string; sort: string; page: number };
export type DirectoryStats = { members: number; readers: number; customers: number; signs: Record<string, number> };
export const PAGE_SIZE = 24;
export const PUBLIC_FIELDS = "user_id,username,display_name,member_type,zodiac_sign,location,about,website,avatar_url,is_public,created_at";
export const emptyStats: DirectoryStats = { members: 0, readers: 0, customers: 0, signs: {} };

export function directoryFilters(values: Record<string, string | string[] | undefined>): DirectoryFilters {
  const text = (key: string) => typeof values[key] === "string" ? values[key] as string : "";
  const page = Number(text("page"));
  return {
    q: text("q").trim().slice(0, 80),
    sign: signSlugs.includes(text("sign")) ? text("sign") : "",
    role: ["reader", "customer"].includes(text("role")) ? text("role") : "",
    sort: text("sort") === "name" ? "name" : "newest",
    page: Number.isInteger(page) && page > 0 ? Math.min(page, 100000) : 1,
  };
}

// Only literal search text reaches PostgREST's OR expression.
export function literalSearch(value: string) {
  return value.replace(/[^\p{L}\p{N}\s@.-]/gu, " ").trim();
}

export function validWebsite(value: string) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password && value.length <= 300;
  } catch { return false; }
}

export function validAvatar(value: string, userId: string, supabaseUrl: string) {
  if (!value) return true;
  try {
    const url = new URL(value);
    const base = new URL(supabaseUrl);
    return url.origin === base.origin &&
      url.pathname.startsWith(`/storage/v1/object/public/community-avatars/${userId}/`) &&
      /^[a-f0-9-]+\.jpg$/.test(url.pathname.split("/").pop() || "") && !url.search && !url.hash;
  } catch { return false; }
}

export function profilePayload(form: FormData) {
  const get = (key: string) => String(form.get(key) ?? "").trim();
  const payload = {
    username: get("username").toLowerCase(), display_name: get("display_name"),
    member_type: get("member_type"), zodiac_sign: get("zodiac_sign"),
    location: get("location"), about: get("about"), website: get("website"),
    avatar_url: get("avatar_url"), is_public: form.get("is_public") === "on",
  };
  if (!/^[a-z0-9_]{3,32}$/.test(payload.username) ||
    !payload.display_name || payload.display_name.length > 80 ||
    !["reader", "customer"].includes(payload.member_type) || !signSlugs.includes(payload.zodiac_sign) ||
    payload.location.length > 100 || payload.about.length > 6000 || !validWebsite(payload.website)) return null;
  return payload;
}
