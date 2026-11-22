"use client";

import { useRef, useState, useTransition } from "react";
import { usePreferences } from "@/components/site/preferences-provider";
import { Button } from "@/components/ui/button";
import { COURSES, MEMBERSHIPS } from "@/features/billing/lib/stardust-config";
import { getMyOrders } from "./actions";

type Label = { zh: string; en: string };
const names: Record<string, Label> = {
  "membership-monthly": MEMBERSHIPS.monthly,
  "membership-annual": MEMBERSHIPS.annual,
  "course-waite": COURSES.waite,
  "course-thoth": COURSES.thoth,
  "course-astrology": COURSES.astrology,
  "waite-single": { zh: "韦特单牌解读", en: "Rider–Waite single-card reading" },
  "waite-multi": { zh: "韦特塔罗解读", en: "Rider–Waite tarot reading" },
  thoth: { zh: "透特塔罗解读", en: "Thoth tarot reading" },
  natal: { zh: "本命盘", en: "Natal chart" },
  synastry: { zh: "双人合盘", en: "Synastry" },
  numerology: { zh: "生命灵数", en: "Numerology" },
};

const statuses: Record<string, Label> = {
  pending: { zh: "待付款确认", en: "Awaiting confirmation" },
  paid: { zh: "已完成", en: "Completed" },
  expired: { zh: "已过期", en: "Expired" },
  failed: { zh: "付款未完成", en: "Payment incomplete" },
  review: { zh: "审核中", en: "Under review" },
  held: { zh: "积分暂扣", en: "STARS held" },
  completed: { zh: "已完成", en: "Completed" },
  released: { zh: "暂扣积分已退回", en: "Held STARS returned" },
  refunded: { zh: "已退款", en: "Refunded" },
};

type Order = { id: string; date: string; label: string; status: string; amount: string; detail?: string };

export function OrdersDialog({ signedIn = true }: { signedIn?: boolean }) {
  const { language, t } = usePreferences();
  const dialog = useRef<HTMLDialogElement>(null);
  const [data, setData] = useState<Awaited<ReturnType<typeof getMyOrders>>>();
  const [failed, setFailed] = useState(false);
  const [pending, startTransition] = useTransition();

  function open() {
    dialog.current?.showModal();
    if (!signedIn) return;
    setFailed(false);
    startTransition(async () => {
      try {
        setData(await getMyOrders());
      } catch {
        setFailed(true);
      }
    });
  }

  const locale = language === "zh" ? "zh-CN" : "en-AU";
  const number = new Intl.NumberFormat(locale);
  const money = new Intl.NumberFormat(locale, { style: "currency", currency: "AUD", currencyDisplay: "code" });
  const date = new Intl.DateTimeFormat(locale, { timeZone: "Australia/Sydney", dateStyle: "medium", timeStyle: "short" });
  const stars = (value: number) => `${number.format(value)} STARS`;
  const split = (paid: number, reward: number) => t({
    zh: `充值积分 ${number.format(paid)} · 奖励积分 ${number.format(reward)}`,
    en: `Paid ${number.format(paid)} · Reward ${number.format(reward)}`,
  });
  const spends = data?.spends.map((item) => ({
    id: item.id,
    date: item.created_at,
    label: names[item.sku] ? t(names[item.sku]) : item.sku,
    status: item.state,
    amount: stars(Number(item.paid) + Number(item.reward)),
    detail: split(item.paid, item.reward),
    membership: item.sku.startsWith("membership-"),
  })) ?? [];
  const walletOrders: Order[] = [
    ...(data?.topups.map((item) => ({
      id: item.id,
      date: item.paid_at ?? item.created_at,
      label: t({ zh: "星尘钱包充值", en: "Stardust Wallet top-up" }),
      status: item.status,
      amount: money.format(item.amount_cents / 100),
      detail: item.status === "paid" ? `+${stars(item.amount_cents)}` : undefined,
    })) ?? []),
    ...spends.filter((item) => item.membership),
  ];
  const productOrders: Order[] = [
    ...spends.filter((item) => !item.membership),
    ...(data?.tickets.map((item) => ({
      id: item.id,
      date: item.created_at,
      label: language === "zh" ? item.event_snapshot.title_zh : item.event_snapshot.title_en,
      status: item.status,
      amount: stars(Number(item.paid_stars) + Number(item.reward_stars)),
      detail: split(item.paid_stars, item.reward_stars),
    })) ?? []),
  ];
  const byDate = (a: Order, b: Order) => Date.parse(b.date) - Date.parse(a.date);

  function orderSection(title: string, rows: Order[]) {
    return (
      <section className="space-y-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        {rows.length ? (
          <ul className="divide-y divide-[var(--border)] rounded-lg border border-[var(--border)]">
            {rows.map((row) => (
              <li key={row.id} className="grid gap-2 px-3 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:px-4">
                <div className="min-w-0">
                  <p className="break-words font-medium">{row.label}</p>
                  <p className="mt-1 text-xs text-[var(--text-soft)]">
                    <time dateTime={row.date}>{date.format(new Date(row.date))}</time>
                    {" · "}{statuses[row.status] ? t(statuses[row.status]) : row.status}
                  </p>
                </div>
                <div className="text-sm sm:text-right">
                  <p className="font-semibold tabular-nums">{row.amount}</p>
                  {row.detail && <p className="mt-1 text-xs text-[var(--text-soft)]">{row.detail}</p>}
                </div>
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-[var(--text-soft)]">{t({ zh: "暂无记录。", en: "No orders yet." })}</p>}
      </section>
    );
  }

  return (
    <>
      <Button onClick={open}>{t({ zh: "我的订单", en: "My Orders" })}</Button>
      <dialog ref={dialog} aria-labelledby="orders-title" className="m-auto max-h-[85dvh] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-[var(--text)] backdrop:bg-black/60 sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 id="orders-title" className="text-xl font-semibold">{t({ zh: "我的订单", en: "My Orders" })}</h2>
          <form method="dialog"><Button type="submit" variant="secondary" size="sm">{t({ zh: "关闭", en: "Close" })}</Button></form>
        </div>
        {!signedIn && <p role="status">{t({ zh: "登录后可查看自己的订单。", en: "Sign in to view your own orders." })}</p>}
        {pending && <p role="status">{t({ zh: "正在读取订单…", en: "Loading orders…" })}</p>}
        {failed && <p role="status">{t({ zh: "暂时无法读取订单，请稍后重试。", en: "Orders could not be loaded. Please try again." })}</p>}
        {!pending && !failed && data && (
          <div className="space-y-6">
            {data.sandbox && <p className="text-sm text-[var(--text-soft)]">{t({ zh: "正在查看测试账本。", en: "Viewing the test ledger." })}</p>}
            {data.unavailable && <p role="status" className="text-sm">{t({ zh: "部分订单暂时无法读取。", en: "Some order records are temporarily unavailable." })}</p>}
            {orderSection(t({ zh: "钱包充值与会员购买", en: "Wallet top-ups and memberships" }), walletOrders.sort(byDate))}
            {orderSection(t({ zh: "STARS 商品与服务消费", en: "STARS purchases for products and services" }), productOrders.sort(byDate))}
            <div className="grid gap-2 border-t border-[var(--border)] pt-4 text-sm text-[var(--text-soft)] sm:grid-cols-2">
              <div>
                <p className="font-medium text-[var(--text)]">{t({ zh: "20 小时在线语音课程", en: "20-hour live courses" })}</p>
                <p>{t({ zh: "塔罗研习、占星研习", en: "Tarot studies and astrology studies" })}</p>
                <p>{t({ zh: "已上及剩余小时 · 待接入", en: "Completed and remaining hours · Coming later" })}</p>
              </div>
              <div>
                <p className="font-medium text-[var(--text)]">{t({ zh: "星学影院录制课程", en: "Recorded courses" })}</p>
                <p>{t({ zh: "韦特塔罗、透特塔罗、占星术 · 待接入", en: "Rider–Waite, Thoth and astrology · Coming later" })}</p>
              </div>
              <p>{t({ zh: "实物商品 · 待接入", en: "Physical products · Coming later" })}</p>
              <p>{t({ zh: "数字产品 · 待接入", en: "Digital products · Coming later" })}</p>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
