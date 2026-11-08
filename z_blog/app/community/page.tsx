import type { Metadata } from "next";
import Container from "@/components/site/container";
import { getCurrentUserWithRole } from "@/lib/auth/current-user";
import { communityDirectory } from "@/features/community/lib/server";
import { directoryFilters, PUBLIC_FIELDS, type CommunityProfile } from "@/features/community/lib/model";
import CommunityDirectory from "@/features/community/components/community-directory";
import styles from "@/features/community/components/community.module.css";

export const metadata: Metadata = { title: "Community | 星辰社区" };

export default async function CommunityPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const filters = directoryFilters(await searchParams);
  const [{ supabase, user }, directory] = await Promise.all([getCurrentUserWithRole(), communityDirectory(filters)]);
  const { data: profile } = user ? await supabase.from("community_profiles").select(PUBLIC_FIELDS).eq("user_id", user.id).maybeSingle() : { data: null };
  return <main className={styles.page}><Container>
    <CommunityDirectory {...directory} filters={filters} profile={profile as CommunityProfile | null} user={user ? { id: user.id, email: user.email || "", name: String(user.user_metadata?.full_name || user.user_metadata?.name || "") } : null} />
  </Container></main>;
}
