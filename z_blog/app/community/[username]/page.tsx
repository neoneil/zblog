import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/site/container";
import { communityMember, relatedMembers } from "@/features/community/lib/server";
import MemberDetail from "@/features/community/components/member-detail";
import styles from "@/features/community/components/community.module.css";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  const profile = await communityMember(username);
  return { title: profile ? `${profile.display_name} | Community` : "Community" };
}

export default async function CommunityMemberPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const profile = await communityMember(username);
  if (!profile) notFound();
  const related = await relatedMembers(profile);
  return <main className={styles.page}><Container><MemberDetail profile={profile} related={related} /></Container></main>;
}
