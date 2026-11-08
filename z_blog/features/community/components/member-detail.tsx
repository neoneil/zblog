"use client";

import Link from "next/link";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { CalendarDays, ChevronRight, MapPin, Share2, UserRound, ExternalLink } from "lucide-react";
import { usePreferences } from "@/components/site/preferences-provider";
import { Button } from "@/components/ui/button";
import { validWebsite, type CommunityProfile } from "../lib/model";
import MemberCard, { MemberAvatar, useSignLabel } from "./member-card";
import styles from "./community.module.css";

export default function MemberDetail({ profile, related }: { profile: CommunityProfile; related: CommunityProfile[] }) {
  const { t } = usePreferences();
  const sign = useSignLabel();
  const [shared, setShared] = useState(false);
  const [shareError, setShareError] = useState(false);
  const year = profile.created_at.slice(0, 4);
  const role = t(profile.member_type === "reader" ? { en: "Reader", zh: "占星服务者" } : { en: "Customer", zh: "占星需求者" });
  return <>
    <nav className={styles.breadcrumbs} aria-label={t({ en: "Breadcrumb", zh: "面包屑导航" })}><Link href="/community">{t({ en: "Members", zh: "社区成员" })}</Link><ChevronRight size={14} /><Link href={`/community?sign=${profile.zodiac_sign}`}>{sign(profile.zodiac_sign)}</Link><ChevronRight size={14} /><span>{profile.display_name}</span></nav>
    <header className={styles.profileHero}>
      <div className={styles.profileHeader}>
        <MemberAvatar profile={profile} large />
        <div className={styles.identityText}><h1>{profile.display_name}</h1><p className={styles.userName}>@{profile.username}</p><span className={styles.role}>{role}</span>
          <div className={styles.meta}>
            <span>{sign(profile.zodiac_sign)}</span>
            {profile.location && <span><MapPin size={16} />{profile.location}</span>}
            <span><CalendarDays size={16} />{t({ en: `Member since ${year}`, zh: `${year} 年加入` })}</span>
          </div>
        </div>
        <Button type="button" variant="ghost" onClick={async () => {
          setShareError(false);
          try {
            if (navigator.share) await navigator.share({ title: profile.display_name, url: window.location.href });
            else await navigator.clipboard.writeText(window.location.href);
            setShared(true);
          } catch (error) { if (!(error instanceof DOMException && error.name === "AbortError")) setShareError(true); }
        }}><Share2 size={17} />{t(shared ? { en: "Shared", zh: "已分享" } : { en: "Share", zh: "分享" })}</Button>
      </div>
      {shareError && <p role="status">{t({ en: "Sharing is unavailable. The profile address is in your browser's address bar.", zh: "暂时无法分享，可使用浏览器地址栏中的个人主页链接。" })}</p>}
      <a href="#member-about" className={styles.profileTab}><UserRound size={17} />{t({ en: "About", zh: "关于" })}</a>
    </header>
    <div className={styles.detailGrid}>
      <section className={styles.about} id="member-about"><h2>{t({ en: "About", zh: "个人介绍" })}</h2><div><ReactMarkdown skipHtml>{profile.about || t({ en: `${profile.display_name} has not written an introduction yet.`, zh: `${profile.display_name} 还没有填写个人介绍。` })}</ReactMarkdown></div></section>
      <aside className={styles.aside}>
        <section><h2>{t({ en: "Practice", zh: "个人档案" })}</h2><dl className={styles.facts}>
          <div><dt>{t({ en: "ZODIAC SIGN", zh: "星座" })}</dt><dd>{sign(profile.zodiac_sign)}</dd></div>
          <div><dt>{t({ en: "MEMBER SINCE", zh: "加入年份" })}</dt><dd>{year}</dd></div>
          <div><dt>{t({ en: "LOCATION", zh: "所在地" })}</dt><dd>{profile.location || t({ en: "Not provided", zh: "未填写" })}</dd></div>
          <div><dt>{t({ en: "COMMUNITY ROLE", zh: "社区身份" })}</dt><dd>{role}</dd></div>
        </dl></section>
        <section><h2>{t({ en: "Where to find me", zh: "了解更多" })}</h2>
          {profile.website && validWebsite(profile.website) ? <a href={profile.website} target="_blank" rel="noopener noreferrer nofollow ugc" className="mt-4 inline-flex items-center gap-2 break-all">{t({ en: "Visit website", zh: "访问个人网站" })}<ExternalLink size={16} /></a> : <p className="mt-4">{t({ en: "No public links yet.", zh: "暂未提供公开链接。" })}</p>}
        </section>
      </aside>
    </div>
    <section className={styles.related}>
      <div className={styles.resultLine}><h2>{t({ en: `More ${sign(profile.zodiac_sign)} members`, zh: `更多${sign(profile.zodiac_sign)}成员` })}</h2><Link href={`/community?sign=${profile.zodiac_sign}`}>{t({ en: "See all →", zh: "查看全部 →" })}</Link></div>
      <div className={styles.memberGrid}>{related.map(member => <MemberCard key={member.user_id} profile={member} />)}</div>
      {!related.length && <p>{t({ en: "No other members with this sign yet.", zh: "暂时没有其他同星座成员。" })}</p>}
    </section>
  </>;
}
