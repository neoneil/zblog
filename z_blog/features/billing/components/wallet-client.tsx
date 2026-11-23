"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CreditCard, RefreshCw, ShieldCheck, Wallet } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePreferences } from "@/components/site/preferences-provider";
import { COURSES } from "../lib/stardust-config";
import { RechargePanel } from "./recharge-panel";
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
  rechargeOnly = false,
}: {
  snapshot: WalletSnapshot | null;
  checkoutEnabled: boolean;
  sandbox?: boolean;
  rechargeOnly?: boolean;
}) {
  const { language, t } = usePreferences();
  const router = useRouter();
  const params = useSearchParams();
  const [stalledTopup, setStalledTopup] = useState<string | null>(null);
  const topupPolling = useRef<{ order: string | null; attempts: number }>({
    order: null,
    attempts: 0,
  });
  const date = (value: string) =>
    new Date(value).toLocaleDateString(language === "zh" ? "zh-CN" : "en-AU", {
      timeZone: "Australia/Sydney",
    });
  const num = (value: number) =>
    Number(value).toLocaleString(language === "zh" ? "zh-CN" : "en-AU");
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

  return (
    <div className="mx-auto max-w-6xl space-y-8 text-[var(--text)]">
      <RechargePanel
        snapshot={snapshot}
        checkoutEnabled={checkoutEnabled}
        returnTo={rechargeOnly ? "/recharge" : undefined}
        beforeSections={({ pending, message }) => (
          <>
            <header className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--border)] pb-6">
              <div>
                <p className="mb-2 text-sm text-[var(--primary)]">STARDUST</p>
                <h1 className="text-3xl font-semibold">
                  {rechargeOnly ? t({ zh: "充值页面", en: "Recharge" }) : t({ zh: "会员与星尘钱包", en: "Membership & wallet" })}
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
                <MembershipActions signedIn={false} actions={["signIn"]} returnTo={rechargeOnly ? "/recharge" : undefined} />
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

            {!rechargeOnly && snapshot && (
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
          </>
        )}
      />

      {!rechargeOnly && snapshot && (
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

      {!rechargeOnly && snapshot && (
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

      {!rechargeOnly && !!snapshot?.reports.length && (
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

      {!rechargeOnly && !!snapshot?.ledger.length && (
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

    </div>
  );
}
