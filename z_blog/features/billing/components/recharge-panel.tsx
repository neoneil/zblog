"use client";

import { useId, useRef, useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePreferences } from "@/components/site/preferences-provider";
import { createStardustCheckout, purchaseStardustProduct } from "../lib/stardust-actions";
import { MEMBERSHIPS, TOPUP_CENTS } from "../lib/stardust-config";
import type { WalletSnapshot } from "../lib/stardust-server";
import { MembershipActions } from "./membership-actions";

export function RechargePanel({
  snapshot,
  checkoutEnabled,
  returnTo,
  beforeSections,
}: {
  snapshot: WalletSnapshot | null;
  checkoutEnabled: boolean;
  returnTo?: "/recharge";
  beforeSections?: (state: { pending: boolean; message: string }) => ReactNode;
}) {
  const { language, t } = usePreferences();
  const router = useRouter();
  const purchaseTitleId = useId();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [purchase, setPurchase] = useState<{
    sku: string;
    stars: number;
    name: string;
  } | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const request = useRef<{ key: string; id: string } | null>(null);
  const date = (value: string) =>
    new Date(value).toLocaleDateString(language === "zh" ? "zh-CN" : "en-AU", {
      timeZone: "Australia/Sydney",
    });
  const num = (value: number) =>
    Number(value).toLocaleString(language === "zh" ? "zh-CN" : "en-AU");
  const disabled =
    pending ||
    !snapshot?.ready ||
    !snapshot.verified ||
    !!snapshot.wallet?.blocked;
  const guestLabel = t({ zh: "游客", en: "Guest" });
  const freeMemberLabel = t({ zh: "免费会员", en: "Free membership" });
  const paidMemberships = (["monthly", "annual"] as const)
    .filter((plan) => snapshot?.memberships.some((item) => item.plan === plan))
    .map((plan) => MEMBERSHIPS[plan][language]);
  const currentMembership = snapshot
    ? paidMemberships.join(language === "zh" ? "、" : " & ") || freeMemberLabel
    : guestLabel;
  function idFor(key: string) {
    if (request.current?.key !== key)
      request.current = { key, id: crypto.randomUUID() };
    return request.current.id;
  }

  function recharge(amount: number) {
    setMessage("");
    startTransition(async () => {
      try {
        const result = await createStardustCheckout(
          amount,
          idFor(`topup:${amount}`),
          returnTo,
        );
        if (result.ok) window.location.assign(result.url);
        else setMessage(result.message);
      } catch {
        setMessage(
          t({
            zh: "网络异常，请重试。不会根据此页面的跳转入账。",
            en: "Connection interrupted. Please retry; redirects do not credit your wallet.",
          }),
        );
      }
    });
  }

  function confirmPurchase() {
    if (!purchase) return;
    const product = purchase;
    dialog.current?.close();
    setPurchase(null);
    setMessage("");
    startTransition(async () => {
      try {
        const result = await purchaseStardustProduct(
          product.sku,
          idFor(product.sku),
        );
        setMessage(result.message);
        if (result.ok) {
          request.current = null;
          router.refresh();
        }
      } catch {
        setMessage(
          t({
            zh: "网络异常，请刷新查看订单后重试。",
            en: "Connection interrupted. Check your orders before retrying.",
          }),
        );
      }
    });
  }

  return (
    <>
      {beforeSections ? beforeSections({ pending, message }) : message && (
        <p role="status" className="break-words border border-[var(--border)] p-4">{message}</p>
      )}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">
          {t({ zh: "充值 STARS", en: "Top up STARS" })}
        </h2>
        <p className="text-sm text-[var(--text-soft)]">
          {t({
            zh: "充值积分与奖励积分目前均不过期。消费优先使用奖励积分。",
            en: "Paid and reward STARS currently do not expire. Reward STARS are spent first.",
          })}
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {TOPUP_CENTS.map((amount) => (
            <Card key={amount}>
              <CardContent className="p-4">
                <p className="text-xl font-semibold">A${amount / 100}</p>
                <p className="my-3 text-sm text-[var(--text-soft)]">
                  {num(amount)} STARS
                </p>
                <Button
                  fullWidth
                  disabled={disabled || !checkoutEnabled}
                  onClick={() => recharge(amount)}
                >
                  {t({ zh: "充值", en: "Top up" })}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        {!checkoutEnabled && (
          <p className="text-sm text-[var(--text-soft)]">
            {t({ zh: "充值暂未开放。", en: "Top-ups are not open yet." })}
          </p>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">
          {t({ zh: "选择会员", en: "Memberships" })}
        </h2>
        <p
          role="status"
          className="rounded-[var(--radius-sm)] border border-rose-300/50 bg-rose-950 px-5 py-4 text-base font-semibold text-rose-50 sm:text-lg"
        >
          {snapshot
            ? t({ zh: "您目前的会员", en: "Your current membership" })
            : t({ zh: "您目前的身份", en: "Your current status" })}
          <strong className="ml-3 text-xl text-rose-200">{currentMembership}</strong>
        </p>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-semibold">{guestLabel}</h3>
              <UserRound aria-hidden="true" className="size-12 rounded-full bg-[var(--bg-soft)] p-3" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-semibold">{freeMemberLabel}</h3>
              <div className="flex flex-wrap items-center gap-3">
                {snapshot?.account.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element -- OAuth avatars are served directly by their provider.
                  <img
                    src={snapshot.account.avatar}
                    alt=""
                    width={48}
                    height={48}
                    referrerPolicy="no-referrer"
                    className="size-12 rounded-full object-cover"
                  />
                ) : (
                  <UserRound aria-hidden="true" className="size-12 rounded-full bg-[var(--bg-soft)] p-3" />
                )}
                {snapshot && (
                  <div className="min-w-0 break-words text-sm">
                    <p className="font-medium">
                      {snapshot.account.name || t({ zh: "用户", en: "User" })}
                    </p>
                    {snapshot.account.email && (
                      <p className="text-[var(--text-soft)]">{snapshot.account.email}</p>
                    )}
                  </div>
                )}
              </div>
              <MembershipActions signedIn={!!snapshot} actions={["signUp"]} returnTo={returnTo} />
            </CardContent>
          </Card>
          {(["monthly", "annual"] as const).map((plan) => {
            const config = MEMBERSHIPS[plan];
            const active = snapshot?.memberships.find(
              (item) => item.plan === plan,
            );
            return (
              <Card key={plan} id={`membership-${plan}`} className="scroll-mt-24">
                <CardContent className="flex h-full flex-col gap-5">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {config[language]}
                    </h3>
                    <p className="mt-3 text-2xl font-semibold">
                      {num(config.stars)}{" "}
                      <span className="text-sm font-normal">
                        STARS /{" "}
                        {language === "zh"
                          ? config.durationZh
                          : config.durationEn}
                      </span>
                    </p>
                  </div>
                  <ul className="flex-1 space-y-2 text-sm leading-6 text-[var(--text-soft)]">
                    {(plan === "annual"
                      ? [
                          t({ zh: "36次塔罗解读", en: "36 tarot readings" }),
                          t({
                            zh: "本命盘、双人合盘、生命灵数各1次",
                            en: "1 natal, 1 synastry and 1 numerology reading",
                          }),
                          t({
                            zh: "3次邮件解读，3次60分钟咨询",
                            en: "3 email readings and 3 × 60-minute consultations",
                          }),
                          t({
                            zh: "韦特、透特、占星三门课程，会员有效期内可看",
                            en: "All three courses throughout your membership",
                          }),
                        ]
                      : [
                          t({
                            zh: "本命盘、双人合盘、生命灵数各1次",
                            en: "1 natal, 1 synastry and 1 numerology reading",
                          }),
                          t({
                            zh: "3次邮件解读，1次15分钟咨询",
                            en: "3 email readings and 1 × 15-minute consultation",
                          }),
                          t({
                            zh: "不包含录播课程和会员塔罗次数",
                            en: "Recorded courses and membership tarot credits not included",
                          }),
                        ]
                    ).map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                  {active && (
                    <p className="text-sm">
                      {t({ zh: "当前有效期至：", en: "Active until: " })}
                      {date(active.valid_until)}
                    </p>
                  )}
                  <Button
                    disabled={disabled || !checkoutEnabled}
                    onClick={() => {
                      setPurchase({
                        sku: `membership-${plan}`,
                        stars: config.stars,
                        name: config[language],
                      });
                      dialog.current?.showModal();
                    }}
                  >
                    {active
                      ? t({ zh: "续费", en: "Renew" })
                      : t({ zh: "购买会员", en: "Purchase" })}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <p className="text-sm text-[var(--text-soft)]">
          {t({
            zh: "两种会员可同时拥有。续费立即发放新次数；免费月度次数仍于月底失效。",
            en: "Both memberships may coexist. Renewal credits are issued immediately; free monthly credits still expire at month end.",
          })}
        </p>
      </section>

      <dialog
        ref={dialog}
        onCancel={() => setPurchase(null)}
        aria-labelledby={purchaseTitleId}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card)] p-6 text-[var(--text)] backdrop:bg-[var(--archive-overlay)]"
      >
        <h2 id={purchaseTitleId} className="text-lg font-semibold">
          {t({ zh: "确认购买", en: "Confirm purchase" })}
        </h2>
        <p className="my-5 leading-7">
          {purchase?.name} · {num(purchase?.stars || 0)} STARS
        </p>
        <p className="mb-6 text-sm text-[var(--text-soft)]">
          {t({
            zh: "优先使用奖励积分，其余从充值积分扣除。不自动续费。",
            en: "Reward STARS are used first, then paid STARS. No automatic renewal.",
          })}
        </p>
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={() => {
              dialog.current?.close();
              setPurchase(null);
            }}
          >
            {t({ zh: "取消", en: "Cancel" })}
          </Button>
          <Button disabled={pending} onClick={confirmPurchase}>
            {t({ zh: "确认支付", en: "Confirm payment" })}
          </Button>
        </div>
      </dialog>
    </>
  );
}
