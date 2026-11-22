"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CreditCard, RefreshCw, ShieldCheck, UserRound, Wallet } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePreferences } from "@/components/site/preferences-provider";
import {
  createStardustCheckout,
  purchaseStardustProduct,
} from "../lib/stardust-actions";
import { COURSES, MEMBERSHIPS, TOPUP_CENTS } from "../lib/stardust-config";
import type { WalletSnapshot } from "../lib/stardust-server";
import { MembershipActions } from "./membership-actions";

const serviceNames: Record<string, { zh: string; en: string }> = {
  tarot: { zh: "塔罗解读", en: "Tarot readings" },
  natal: { zh: "本命盘", en: "Natal chart" },
  synastry: { zh: "双人合盘", en: "Synastry" },
  numerology: { zh: "生命灵数", en: "Numerology" },
  email: { zh: "邮件解读", en: "Email readings" },
  "consultation-15": { zh: "15分钟咨询", en: "15-minute consultation" },
  "consultation-60": { zh: "60分钟咨询", en: "60-minute consultation" },
};

export function WalletClient({
  snapshot,
  checkoutEnabled,
  sandbox = false,
}: {
  snapshot: WalletSnapshot | null;
  checkoutEnabled: boolean;
  sandbox?: boolean;
}) {
  const { language, t } = usePreferences();
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [stalledTopup, setStalledTopup] = useState<string | null>(null);
  const topupPolling = useRef<{ order: string | null; attempts: number }>({
    order: null,
    attempts: 0,
  });
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
  const transactionTypes: Record<string, string> = {
    topup: t({ zh: "充值到账", en: "Top-up credited" }),
    reserve: t({ zh: "暂扣积分", en: "STARS held" }),
    release: t({ zh: "暂扣积分退回", en: "Held STARS returned" }),
    complete: t({ zh: "消费已确认", en: "Purchase confirmed" }),
  };
  const formatDelta = (delta: number) => delta > 0 ? `+${num(delta)}` : num(delta);
  const topup = snapshot ? params.get("topup") : null;
  const topupState = snapshot?.topups.find(
    (order) => order.id === topup,
  )?.status;

  useEffect(() => {
    if (
      !topup ||
      topupState === "paid" ||
      topupState === "failed" ||
      topupState === "expired" ||
      topupState === "review"
    )
      return;
    if (topupPolling.current.order !== topup) {
      topupPolling.current = { order: topup, attempts: 0 };
    }
    if (topupPolling.current.attempts >= 15) return;
    const timer = window.setInterval(() => {
      topupPolling.current.attempts += 1;
      router.refresh();
      if (topupPolling.current.attempts >= 15) {
        window.clearInterval(timer);
        setStalledTopup(topup);
      }
    }, 4000);
    return () => window.clearInterval(timer);
  }, [topup, topupState, router]);

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
    <div className="mx-auto max-w-6xl space-y-8 text-[var(--text)]">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div>
          <p className="mb-2 text-sm text-[var(--primary)]">STARDUST</p>
          <h1 className="text-3xl font-semibold">
            {t({ zh: "会员与星尘钱包", en: "Membership & wallet" })}
          </h1>
          <p className="mt-3 text-sm text-[var(--text-soft)]">
            {t({
              zh: "一次性购买 · 不自动续费 · A$1 = 100 STARS",
              en: "One-time purchases · No automatic renewal · A$1 = 100 STARS",
            })}
          </p>
        </div>
        {snapshot ? (
          <Button
            variant="secondary"
            disabled={pending}
            onClick={() => router.refresh()}
          >
            <RefreshCw className="mr-2 size-4" />
            {t({ zh: "刷新账户", en: "Refresh" })}
          </Button>
        ) : (
          <MembershipActions signedIn={false} actions={["signIn"]} />
        )}
      </header>

      {sandbox && (
        <p
          role="status"
          className="border-l-2 border-[var(--primary)] bg-[var(--bg-soft)] p-4 text-sm leading-7"
        >
          {t({
            zh: "测试环境：此处的积分、会员、次数和订单仅用于验收，不计入正式账户，不会真实扣款。",
            en: "Test environment: STARS, memberships, allowances and orders are for testing only and do not affect your live account or charge real money.",
          })}
        </p>
      )}
      {snapshot && !snapshot.ready && (
        <p
          role="status"
          className="border-l-2 border-[var(--primary)] bg-[var(--bg-soft)] p-4"
        >
          {snapshot.verified
            ? t({
                zh: "支付系统正在配置，充值及购买暂未开放。",
                en: "Payments are being configured. Purchases are not available yet.",
              })
            : t({
                zh: "请先验证注册邮箱，再使用钱包和免费次数。",
                en: "Verify your email to activate your wallet and free readings.",
              })}
        </p>
      )}
      {snapshot?.wallet?.blocked && (
        <p role="alert">
          {t({
            zh: "账户资金正在审核，暂不可消费，请联系客服。",
            en: "Your wallet is under review. Please contact support.",
          })}
        </p>
      )}
      {topup && (
        <p role="status" className="bg-[var(--bg-soft)] p-4">
          {topupState === "paid"
            ? t({
                zh: "充值成功，STARS 已到账。",
                en: "Payment confirmed. Your STARS have been credited.",
              })
            : topupState === "review"
              ? t({
                  zh: "此订单正在人工审核。",
                  en: "This payment is under review.",
                })
              : topupState === "expired" || topupState === "failed"
                ? t({
                    zh: "此支付未完成，请重新发起充值。",
                    en: "Payment was not completed. Please start again.",
                  })
                : stalledTopup === topup
                  ? t({
                      zh: "支付确认延迟，已暂停自动查询。如果 Stripe 已显示付款成功，请勿再次付款，请联系管理员核对回调并恢复原订单。",
                      en: "Payment confirmation is delayed and automatic checks have stopped. If Stripe shows payment succeeded, do not pay again. Contact support to verify the callback and recover the original order.",
                    })
                  : t({
                      zh: "正在等待支付确认，请稍后刷新。请勿重复付款。",
                      en: "Awaiting payment confirmation. Please refresh shortly; do not pay again.",
                    })}
        </p>
      )}
      {message && (
        <p
          role="status"
          aria-live="polite"
          className="break-words border border-[var(--border)] p-4"
        >
          {message}
        </p>
      )}

      {snapshot && (
        <section
          aria-label={t({ zh: "账户余额", en: "Balances" })}
          className="grid gap-4 sm:grid-cols-3"
        >
          {[
            {
              label: t({ zh: "可用 STARS", en: "Available STARS" }),
              value:
                Number(snapshot.wallet?.paid || 0) +
                Number(snapshot.wallet?.reward || 0),
              icon: Wallet,
            },
            {
              label: t({ zh: "充值积分", en: "Paid STARS" }),
              value: Number(snapshot.wallet?.paid || 0),
              icon: CreditCard,
            },
            {
              label: t({ zh: "奖励积分", en: "Reward STARS" }),
              value: Number(snapshot.wallet?.reward || 0),
              icon: ShieldCheck,
            },
          ].map(({ label, value, icon: Icon }) => (
            <Card key={label}>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-[var(--text-soft)]">
                  {label}
                  <Icon className="size-4" />
                </div>
                <p className="mt-4 text-3xl font-semibold tabular-nums">
                  {num(value)}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>
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
              <MembershipActions signedIn={!!snapshot} actions={["signUp"]} />
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

      {snapshot && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            {t({ zh: "可用次数", en: "Available allowances" })}
          </h2>
          {snapshot.allowances.length ? (
            <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
              {snapshot.allowances.map((item, index) => (
                <div
                  key={`${item.service}:${item.family}:${index}`}
                  className="grid grid-cols-[1fr_auto] gap-2 py-4 text-sm sm:grid-cols-3"
                >
                  <span>
                    {serviceNames[item.service]?.[language] || item.service}
                  </span>
                  <span>
                    {item.remaining} {t({ zh: "次", en: "remaining" })}
                  </span>
                  <span className="col-span-2 text-[var(--text-soft)] sm:col-span-1">
                    {t({ zh: "有效期至 ", en: "Until " })}
                    {date(item.expires_at)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--text-soft)]">
              {t({ zh: "暂无可用次数。", en: "No active allowances." })}
            </p>
          )}
          <ButtonLink href="/tarot-ai" variant="secondary">
            {t({ zh: "开始塔罗解读", en: "Start a tarot reading" })}
          </ButtonLink>
        </section>
      )}

      {snapshot && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            {t({ zh: "我的课程", en: "My courses" })}
          </h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(COURSES)
              .filter(
                ([key]) =>
                  snapshot.memberships.some((item) => item.plan === "annual") ||
                  snapshot.courses.some((item) => item.course === key),
              )
              .map(([key, course]) => (
                <ButtonLink
                  key={key}
                  href={`/learn/${key}`}
                  variant="secondary"
                >
                  {course[language]}
                </ButtonLink>
              ))}
          </div>
          <p className="text-sm text-[var(--text-soft)]">
            {t({
              zh: "年度会员可观看三门课程。单独购买课程暂未开放。",
              en: "Annual members can access all three courses. Individual course purchases are not open yet.",
            })}
          </p>
        </section>
      )}

      {!!snapshot?.reports.length && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            {t({
              zh: "已保存的报告与购买记录",
              en: "Saved reports & purchases",
            })}
          </h2>
          {snapshot.reports.map((report) => (
            <details
              key={report.id}
              className="border-b border-[var(--border)] py-3"
            >
              <summary className="cursor-pointer text-sm">
                {report.sku} · {date(report.created_at)}
              </summary>
              <pre className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap break-words text-sm leading-7 text-[var(--text-soft)]">
                {typeof report.result === "object" &&
                report.result &&
                "reading" in report.result
                  ? typeof report.result.reading === "string"
                    ? report.result.reading
                    : JSON.stringify(report.result.reading, null, 2)
                  : JSON.stringify(report.result, null, 2)}
              </pre>
            </details>
          ))}
        </section>
      )}

      {!!snapshot?.ledger.length && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            {t({ zh: "最近积分流水", en: "Recent transactions" })}
          </h2>
          <p className="text-sm leading-6 text-[var(--text-soft)]">
            {t({
              zh: "暂扣积分会先从可用余额扣除。消费确认后，这笔暂扣转为实际消费；如果未完成，暂扣的积分会退回。",
              en: "Held STARS are deducted from your available balance. The hold becomes a charge once confirmed, or is returned if the purchase does not complete.",
            })}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-96 text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  {[
                    t({ zh: "日期", en: "Date" }),
                    t({ zh: "类型", en: "Type" }),
                    t({ zh: "充值积分变动", en: "Paid change" }),
                    t({ zh: "奖励积分变动", en: "Reward change" }),
                  ].map((label) => (
                    <th key={label} className="py-3 pr-4 font-medium">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {snapshot.ledger.map((row) => (
                  <tr key={row.id} className="border-b border-[var(--border)]">
                    <td className="py-3 pr-4">{date(row.created_at)}</td>
                    <td>
                      {transactionTypes[row.kind] || row.kind}
                    </td>
                    {row.kind === "complete" && Number(row.paid_delta) === 0 && Number(row.reward_delta) === 0 ? (
                      <td colSpan={2} className="text-[var(--text-soft)]">
                        {t({ zh: "本步骤无额外扣款", en: "No additional deduction at confirmation" })}
                      </td>
                    ) : (
                      <>
                        <td>{formatDelta(row.paid_delta)}</td>
                        <td>{formatDelta(row.reward_delta)}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <dialog
        ref={dialog}
        onCancel={() => setPurchase(null)}
        aria-labelledby="purchase-title"
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card)] p-6 text-[var(--text)] backdrop:bg-[var(--archive-overlay)]"
      >
        <h2 id="purchase-title" className="text-lg font-semibold">
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
    </div>
  );
}
