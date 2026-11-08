"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowLeft, ArrowRight, Users } from "lucide-react";
import { usePreferences } from "@/components/site/preferences-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { PAGE_SIZE, signSlugs, type CommunityProfile, type DirectoryFilters, type DirectoryStats } from "../lib/model";
import MemberCard, { useSignLabel } from "./member-card";
import ProfileEditor, { type CommunityUser } from "./profile-editor";
import styles from "./community.module.css";

export default function CommunityDirectory({ members, count, stats, unavailable, filters, user, profile }: {
  members: CommunityProfile[]; count: number; stats: DirectoryStats; unavailable: boolean;
  filters: DirectoryFilters; user: CommunityUser | null; profile: CommunityProfile | null;
}) {
  const { t } = usePreferences();
  const sign = useSignLabel();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [search, setSearch] = useState(filters.q);
  const pages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  function navigate(change: Partial<DirectoryFilters>) {
    const next = { ...filters, ...change };
    const params = new URLSearchParams();
    if (next.q) params.set("q", next.q);
    if (next.sign) params.set("sign", next.sign);
    if (next.role) params.set("role", next.role);
    if (next.sort !== "newest") params.set("sort", next.sort);
    if (next.page > 1) params.set("page", String(next.page));
    const query = params.toString();
    startTransition(() => router.push(`/community${query ? `?${query}` : ""}`, { scroll: false }));
  }
  const pageNumbers = Array.from(new Set([1, Math.max(1, filters.page - 1), filters.page, Math.min(pages, filters.page + 1), pages])).filter(p => p <= pages);

  return <>
    <ProfileEditor user={user} profile={profile} unavailable={unavailable} />
    <header className={styles.hero}>
      <h1>{t({ en: "Community", zh: "星辰社区" })}</h1>
      <p>{t({ en: "Meet the readers and curious minds exploring astrology, tarot and the stories written in the stars.", zh: "在星辰之间相遇，认识分享占星与塔罗智慧的服务者，以及寻求灵感与指引的同行者。" })}</p>
      <div className={styles.stats}>
        {[{ en: "Members", zh: "成员", value: stats.members }, { en: "Readers", zh: "占星服务者", value: stats.readers }, { en: "Customers", zh: "占星需求者", value: stats.customers }].map(item => <div key={item.en}><strong>{unavailable ? "—" : item.value}</strong><span>{t(item)}</span></div>)}
      </div>
    </header>
    {unavailable && <p className={styles.notice} role="status">{t({ en: "The community directory is not available yet. Please try again later.", zh: "社区目录暂不可用，请稍后重试。" })}</p>}
    <section aria-label={t({ en: "Member directory", zh: "成员目录" })} aria-busy={pending}>
      <div className={styles.toolbar}>
        <form className={styles.filters} onSubmit={event => { event.preventDefault(); navigate({ q: search.trim(), page: 1 }); }}>
          <div className={styles.search}>
            <label className={styles.field}><span>{t({ en: "Search members", zh: "搜索成员" })}</span><Input type="search" maxLength={80} value={search} onChange={event => setSearch(event.target.value)} placeholder={t({ en: "Search by name or place", zh: "搜索姓名、用户名或所在地" })} /></label>
            <Button type="submit" variant="secondary" size="icon" title={t({ en: "Search", zh: "搜索" })} aria-label={t({ en: "Search", zh: "搜索" })} disabled={pending}><Search size={18} /></Button>
          </div>
          <label className={styles.field}><span>{t({ en: "House / Zodiac sign", zh: "星座筛选" })}</span><Select value={filters.sign} onChange={event => navigate({ sign: event.target.value, q: search.trim(), page: 1 })} disabled={pending}><option value="">{t({ en: "All houses", zh: "全部星座" })}</option>{signSlugs.map(slug => <option key={slug} value={slug}>{sign(slug)}</option>)}</Select></label>
          <label className={styles.field}><span>{t({ en: "Sort by", zh: "排序" })}</span><Select value={filters.sort} onChange={event => navigate({ sort: event.target.value, q: search.trim(), page: 1 })} disabled={pending}><option value="newest">{t({ en: "Newest", zh: "最新加入" })}</option><option value="name">{t({ en: "Name A–Z", zh: "按名称排序" })}</option></Select></label>
        </form>
        <div className={styles.tabs} role="group" aria-label={t({ en: "Member roles", zh: "成员身份" })}>
          {[{ value: "", en: "Everyone", zh: "所有成员" }, { value: "reader", en: "Readers", zh: "占星服务者" }, { value: "customer", en: "Customers", zh: "占星需求者" }].map(item => <Button key={item.value} type="button" variant="ghost" className={styles.roleButton} aria-pressed={filters.role === item.value} disabled={pending} onClick={() => navigate({ role: item.value, q: search.trim(), page: 1 })}>{t(item)}</Button>)}
        </div>
      </div>
      <div className={styles.resultLine}><p role="status" aria-live="polite">{t({ en: `${count} members`, zh: `${count} 位成员` })}</p>{(filters.q || filters.sign || filters.role) && <Button type="button" variant="ghost" disabled={pending} onClick={() => { setSearch(""); navigate({ q: "", sign: "", role: "", page: 1 }); }}>{t({ en: "Clear filters", zh: "清除筛选" })}</Button>}</div>
      <div className={styles.memberGrid}>{members.map(member => <MemberCard key={member.user_id} profile={member} />)}</div>
      {!members.length && !unavailable && <div className={styles.empty}><Users size={32} className="mx-auto mb-4" /><h2>{t({ en: "No members found", zh: "暂无符合条件的成员" })}</h2><p>{t({ en: filters.q || filters.sign || filters.role ? "Try another name, sign or community role." : "Be the first to share your public profile.", zh: filters.q || filters.sign || filters.role ? "试试其他名字、星座或成员身份。" : "成为第一位公开个人资料的社区成员。" })}</p></div>}
      {pages > 1 && <nav className={`${styles.tabs} mt-8 justify-center`} aria-label={t({ en: "Member pages", zh: "成员分页" })}>
        <Button type="button" variant="ghost" size="icon" disabled={pending || filters.page <= 1} aria-label={t({ en: "Previous page", zh: "上一页" })} title={t({ en: "Previous page", zh: "上一页" })} onClick={() => navigate({ page: filters.page - 1 })}><ArrowLeft size={18} /></Button>
        {pageNumbers.map(page => <Button type="button" key={page} size="sm" variant={filters.page === page ? "primary" : "ghost"} aria-current={filters.page === page ? "page" : undefined} disabled={pending} onClick={() => navigate({ page })}>{page}</Button>)}
        <Button type="button" variant="ghost" size="icon" disabled={pending || filters.page >= pages} aria-label={t({ en: "Next page", zh: "下一页" })} title={t({ en: "Next page", zh: "下一页" })} onClick={() => navigate({ page: filters.page + 1 })}><ArrowRight size={18} /></Button>
      </nav>}
    </section>
    <section className={styles.signBrowser}>
      <h2>{t({ en: "Browse members by zodiac sign", zh: "按星座浏览成员" })}</h2>
      <div className={styles.signGrid}>{signSlugs.map(slug => <Link key={slug} href={`/community?sign=${slug}`}><span>{sign(slug)}</span><span>{stats.signs[slug] || 0}</span></Link>)}</div>
    </section>
  </>;
}
