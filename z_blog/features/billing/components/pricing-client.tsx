"use client";

import { useMemo, useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createAiCheckoutSession } from "@/features/billing/lib/billing-actions";
import {
  AI_PRODUCTS,
  AI_TIME_PACK_PLANS,
  formatAud,
} from "@/features/billing/lib/plans";
import type { AiAccessStatus, AiProductScope } from "@/features/billing/lib/types";

type PricingClientProps = {
  initialScope: AiProductScope;
  tarotStatus: AiAccessStatus | null;
  astroplateStatus: AiAccessStatus | null;
  isLoggedIn: boolean;
};

function formatDate(value: string | null) {
  if (!value) return null;

  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeZone: "Australia/Sydney",
  }).format(new Date(value));
}

function getStatusLabel(status: AiAccessStatus | null) {
  if (!status) return "登录后购买";
  if (status.isAdmin) return "Admin 无限制";
  if (status.isPaid) return `有效期至 ${formatDate(status.validUntil)}`;
  if (status.usedToday) return "今日免费次数已用完";
  return "今日还可免费使用 1 次";
}

export function PricingClient({
  initialScope,
  tarotStatus,
  astroplateStatus,
  isLoggedIn,
}: PricingClientProps) {
  const [activeScope, setActiveScope] = useState<AiProductScope>(initialScope);
  const [message, setMessage] = useState("");
  const [pendingPlanId, setPendingPlanId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const activeStatus = useMemo(
    () => (activeScope === "tarot" ? tarotStatus : astroplateStatus),
    [activeScope, astroplateStatus, tarotStatus],
  );

  function handleCheckout(planId: string) {
    setMessage("");
    setPendingPlanId(planId);

    startTransition(async () => {
      const result = await createAiCheckoutSession(activeScope, planId);

      if (!result.ok) {
        setMessage(result.message);
        setPendingPlanId(null);
        return;
      }

      window.location.href = result.url;
    });
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden bg-[var(--card)]">
        <CardHeader className="items-start gap-4 border-b border-[var(--border)] bg-[var(--card-soft)]">
          <div>
            <Badge variant="secondary">AI Access</Badge>
            <CardTitle className="mt-4 text-3xl sm:text-4xl">
              AI 时间包
            </CardTitle>
            <CardDescription className="mt-3 max-w-3xl text-base leading-7">
              普通用户每天每个 AI 产品可免费使用 1 次。购买时间包后，对应产品在有效期内无限使用，不自动续费。
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 p-5 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            {(["tarot", "astroplate"] as const).map((scope) => {
              const isActive = activeScope === scope;
              const status = scope === "tarot" ? tarotStatus : astroplateStatus;

              return (
                <button
                  key={scope}
                  type="button"
                  onClick={() => setActiveScope(scope)}
                  className={[
                    "rounded-[var(--radius-sm)] border p-4 text-left transition",
                    isActive
                      ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                      : "border-[var(--border)] bg-[var(--bg-soft)] hover:border-[var(--primary)]",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-[var(--text)]">
                        {AI_PRODUCTS[scope].label}
                      </p>
                      <p className="mt-1 text-sm text-[var(--text-soft)]">
                        {AI_PRODUCTS[scope].description}
                      </p>
                    </div>
                    <Badge variant={status?.isPaid || status?.isAdmin ? "success" : "secondary"}>
                      {getStatusLabel(status)}
                    </Badge>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-soft)] p-4">
            <p className="text-sm font-medium text-[var(--text)]">
              当前选择：{AI_PRODUCTS[activeScope].label}
            </p>
            <p className="mt-1 text-sm text-[var(--text-soft)]">
              {getStatusLabel(activeStatus)}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {AI_TIME_PACK_PLANS.map((plan) => (
              <Card key={plan.id} className="bg-[var(--card)]">
                <CardHeader className="items-start gap-2">
                  <Badge variant="outline">{plan.days} 天</Badge>
                  <CardTitle className="text-3xl">
                    {formatAud(plan.amountCents)}
                  </CardTitle>
                  <CardDescription>
                    一次性购买，不自动续费。
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoggedIn ? (
                    <Button
                      type="button"
                      fullWidth
                      disabled={isPending}
                      onClick={() => handleCheckout(plan.id)}
                    >
                      {isPending && pendingPlanId === plan.id
                        ? "正在跳转..."
                        : "购买时间包"}
                    </Button>
                  ) : (
                    <ButtonLink href="/login?next=/pricing" fullWidth>
                      登录后购买
                    </ButtonLink>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card-soft)] p-4 text-sm leading-7 text-[var(--text-soft)]">
            支持澳洲银行卡、Alipay 和 WeChat Pay。Stripe 支付页可能按实时汇率显示人民币金额，实际金额以 Stripe 页面为准。
          </div>

          {message ? (
            <div className="rounded-[var(--radius-sm)] border border-[var(--danger)] bg-[var(--danger-soft)] p-4 text-sm font-medium text-[var(--danger)]">
              {message}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
