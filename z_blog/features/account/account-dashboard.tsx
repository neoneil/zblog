"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePreferences } from "@/components/site/preferences-provider";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MEMBERSHIPS } from "@/features/billing/lib/stardust-config";
import { registrationCopy } from "@/features/events/lib/registration-types";
import { StarMessageCollection } from "@/features/star-message/collection";
import type { loadAccount } from "./data";
import { OrdersDialog } from "./orders-dialog";
import { ReadingCollections } from "./reading-collections";

type Account = Awaited<ReturnType<typeof loadAccount>>;
type RailEvent = Pick<Account["events"][number], "slug" | "title_zh" | "title_en" | "starts_at" | "timezone"> & {
  status?: Account["booked"][number]["status"];
};

export function AccountDashboard({ account, signedIn = true }: { account: Account; signedIn?: boolean }) {
  const { language, t } = usePreferences();
  const locale = language === "zh" ? "zh-CN" : "en-AU";
  const shortDate = new Intl.DateTimeFormat(locale, { timeZone: "Australia/Sydney", dateStyle: "medium" });

  function eventRail(id: string, title: string, rows: RailEvent[], unavailable: boolean, empty: string) {
    return (
      <section aria-labelledby={id} className="min-w-0 space-y-3">
        <h3 id={id} className="text-lg font-semibold">{title}</h3>
        {unavailable && <p role="status" className="text-sm text-[var(--text-soft)]">{t({ zh: "部分沙龙记录暂时无法读取。", en: "Some salon records are temporarily unavailable." })}</p>}
        {rows.length ? (
          <ul aria-labelledby={id} className="flex snap-x gap-3 overflow-x-auto pb-3">
            {rows.map((event) => (
              <li key={event.slug} className="w-[min(16rem,82%)] shrink-0 snap-start">
                <Link href={`/events/${encodeURIComponent(event.slug)}`} className="block h-full space-y-2 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 hover:border-[var(--primary)]">
                  <p className="font-semibold">{language === "zh" ? event.title_zh : event.title_en}</p>
                  <time className="block text-sm text-[var(--text-soft)]" dateTime={event.starts_at}>
                    {new Intl.DateTimeFormat(locale, { timeZone: event.timezone, dateStyle: "medium", timeStyle: "short" }).format(new Date(event.starts_at))}
                  </time>
                  {event.status && (
                    <p className="text-xs text-[var(--primary)]">
                      {event.status === "paid" ? t({ zh: "已购票", en: "Ticket purchased" }) : t(registrationCopy[event.status])}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        ) : !unavailable && <p className="text-sm text-[var(--text-soft)]">{empty}</p>}
      </section>
    );
  }

  return (
    <div className="space-y-8 py-8 sm:py-12">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">{t({ zh: "我的星巢", en: "My Account" })}</h1>
        <OrdersDialog signedIn={signedIn} />
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-[var(--primary)]">
          <CardContent className="space-y-3">
            <h2 className="text-lg font-semibold">{t({ zh: "目前的会员等级", en: "Current membership" })}</h2>
            {!signedIn ? <p className="font-semibold text-[var(--primary)]">{t({ zh: "游客", en: "Guest" })}</p>
              : account.membershipUnavailable ? <p role="status">{t({ zh: "暂时无法读取会员等级。", en: "Membership is temporarily unavailable." })}</p>
              : account.memberships.length ? (
                <ul className="space-y-2">
                  {account.memberships.map((item) => (
                    <li key={item.plan}>
                      <p className="font-semibold text-[var(--primary)]">{MEMBERSHIPS[item.plan][language]}</p>
                      <p className="text-sm text-[var(--text-soft)]">{t({ zh: "有效期至 ", en: "Valid until " })}{shortDate.format(new Date(item.valid_until))}</p>
                    </li>
                  ))}
                </ul>
              ) : <p className="font-semibold text-[var(--primary)]">{t({ zh: "免费会员", en: "Free membership" })}</p>}
            {account.sandbox && <p className="text-xs text-[var(--text-soft)]">{t({ zh: "测试环境", en: "Test environment" })}</p>}
            <ButtonLink href="/pricing" variant="secondary">{t({ zh: "星尘钱包", en: "Stardust Wallet" })}</ButtonLink>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3">
            <h2 className="text-lg font-semibold">{t({ zh: "我的会员星魂空间", en: "My Community Space" })}</h2>
            {account.communityUnavailable ? <p role="status">{t({ zh: "暂时无法读取社区资料。", en: "Community profile is temporarily unavailable." })}</p> : (
              <ButtonLink href={account.username ? `/community/${encodeURIComponent(account.username)}` : "/community"} variant="secondary">
                {account.username ? `@${account.username}` : signedIn ? t({ zh: "创建社区资料", en: "Create a community profile" }) : t({ zh: "浏览社区", en: "Browse community" })}
              </ButtonLink>
            )}
          </CardContent>
        </Card>
        <Card id="my-apple-tree" className="scroll-mt-24">
          <CardContent className="space-y-3">
            <h2 className="text-lg font-semibold">{t({ zh: "种下我的苹果树", en: "Plant My Apple Tree" })}</h2>
            {signedIn && account.appleTree?.unavailable && <p role="status" className="text-sm text-[var(--text-soft)]">
              {t({ zh: "暂时无法读取心声记录。", en: "Your messages are temporarily unavailable." })}
            </p>}
            {signedIn && !account.appleTree?.unavailable && !account.appleTree?.records.length && <p className="text-sm text-[var(--text-soft)]">
              {t({ zh: "你还没有留下心声。", en: "You haven’t saved a message yet." })}
            </p>}
            {signedIn && Boolean(account.appleTree?.records.length) && (
              <ul className="max-h-64 space-y-2 overflow-y-auto">
                {account.appleTree.records.map((message) => (
                  <li key={message.id} className="space-y-1 rounded-lg border border-[var(--border)] p-3">
                    <p className="whitespace-pre-wrap break-words text-sm">{message.body}</p>
                    <time dateTime={message.created_at} className="block text-xs text-[var(--text-soft)]">
                      {shortDate.format(new Date(message.created_at))}
                    </time>
                  </li>
                ))}
              </ul>
            )}
            <ButtonLink href="/apple-tree#write-apple-message" variant="secondary">{t({ zh: "写下我的心声", en: "Write a message" })}</ButtonLink>
          </CardContent>
        </Card>
      </div>
      <section aria-labelledby="salons-title" className="space-y-5">
        <h2 id="salons-title" className="text-2xl font-semibold">{t({ zh: "沙龙活动", en: "Salon events" })}</h2>
        {eventRail("booked-salons", t({ zh: "已报名的沙龙", en: "My salon registrations" }), account.booked, account.bookedUnavailable, t({ zh: "暂无报名。", en: "No registrations yet." }))}
        {eventRail("all-salons", t({ zh: "所有沙龙", en: "All salons" }), account.events, account.eventsUnavailable, t({ zh: "暂无已发布的沙龙。", en: "No published salons yet." }))}
      </section>
      <StarMessageCollection {...account.timeline} />
      <ReadingCollections {...account.readings} />
    </div>
  );
}

export function AccountUnavailable() {
  const { t } = usePreferences();
  const router = useRouter();
  return (
    <section className="space-y-4 py-10">
      <h1 className="text-3xl font-semibold">{t({ zh: "我的星巢", en: "My Account" })}</h1>
      <p role="status">{t({
        zh: "登录服务暂时没有响应，请稍后重试。",
        en: "The sign-in service is temporarily unavailable. Please try again.",
      })}</p>
      <Button onClick={() => router.refresh()} variant="secondary">{t({ zh: "重试", en: "Retry" })}</Button>
    </section>
  );
}
