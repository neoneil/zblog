"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { usePreferences } from "@/components/site/preferences-provider";
import { SIGN_NAMES } from "@/features/stella/lib/sky";
import { signSlugs, type CommunityProfile } from "../lib/model";
import styles from "./community.module.css";

export function MemberAvatar({ profile, large = false }: { profile: Pick<CommunityProfile, "display_name" | "avatar_url">; large?: boolean }) {
  const [failed, setFailed] = useState(false);
  return <span className={`${styles.avatar} ${large ? styles.avatarLarge : ""}`}>
    {profile.avatar_url && !failed
      // User uploads are resized before storage and use the site's own Supabase bucket.
      // eslint-disable-next-line @next/next/no-img-element
      ? <img src={profile.avatar_url} alt={profile.display_name} width={large ? 160 : 64} height={large ? 160 : 64} onError={() => setFailed(true)} loading="lazy" referrerPolicy="no-referrer" />
      : <span aria-hidden="true">{Array.from(profile.display_name.trim())[0]?.toUpperCase() || "S"}</span>}
  </span>;
}

export function useSignLabel() {
  const { language } = usePreferences();
  return (slug: string) => SIGN_NAMES[language][signSlugs.indexOf(slug)] || slug;
}

export default function MemberCard({ profile }: { profile: CommunityProfile }) {
  const { t } = usePreferences();
  const sign = useSignLabel();
  return <Card className={styles.memberCard}>
    <div className={styles.identity}>
      <MemberAvatar profile={profile} />
      <div className={styles.identityText}>
        <h3><Link href={`/community/${profile.username}`} className={styles.profileLink}>{profile.display_name}</Link></h3>
        <p>{sign(profile.zodiac_sign)}{profile.location ? ` · ${profile.location}` : ""}</p>
      </div>
    </div>
    <span className={styles.role}>{t(profile.member_type === "reader" ? { en: "Reader", zh: "占星服务者" } : { en: "Customer", zh: "占星需求者" })}</span>
    {profile.about && <p className={styles.excerpt}>{profile.about.replace(/[#*_>`[\]]/g, "")}</p>}
    <p className={styles.cardFooter}>{t({ en: "Community member", zh: "社区成员" })}</p>
  </Card>;
}
