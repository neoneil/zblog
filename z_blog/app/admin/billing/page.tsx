import { requireAdmin } from "@/lib/auth/require-admin";
import { createBillingAdminClient } from "@/features/billing/lib/billing-db";
import { PageShell } from "@/components/site/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { billingReadiness } from "@/features/billing/lib/billing-readiness";

export default async function BillingAdminPage() {
  await requireAdmin("/admin/billing");
  const readiness = billingReadiness();
  const db = createBillingAdminClient();
  const { data: orders, error } = await db
    .from("stardust_topups")
    .select("id,user_id,amount_cents,status,created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  return (
    <PageShell className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl text-[var(--text)]">
        <h1 className="text-2xl font-semibold">充值订单</h1>
        <section
          className="my-6 space-y-4"
          aria-labelledby="payment-setup-heading"
        >
          <h2 id="payment-setup-heading" className="text-lg font-semibold">
            支付配置状态
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {readiness.checks.map((check) => (
              <Card key={check.label}>
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-medium">{check.label}</h3>
                    <Badge variant={check.ready ? "success" : "warning"}>
                      {check.ready ? "已配置" : "待处理"}
                    </Badge>
                  </div>
                  <p className="text-sm text-[var(--text-soft)]">
                    {check.detail}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          {readiness.local && (
            <p className="text-sm leading-7 text-[var(--text-soft)]">
              本地验收需要 Stripe CLI 将测试事件转发至
              /api/stripe/webhook。签名密钥必须与当前监听进程一致；仅在 Stripe
              Dashboard 配置 localhost 地址不能收到回调。
            </p>
          )}
          <p className="text-sm text-[var(--text-soft)]">
            配置状态不代表支付、邮件或定时任务已经通过端到端验收。请勿在测试结束前开启正式收费。
          </p>
        </section>
        <p className="my-4 text-sm text-[var(--text-soft)]">
          最近100笔充值订单 · 退款及争议订单转人工审核，不在此处直接修改余额。
        </p>
        {error ? (
          <p role="alert">暂时无法读取支付数据，请检查数据库配置。</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr>
                  {["订单", "用户", "金额 AUD", "状态", "悉尼时间"].map(
                    (label) => (
                      <th
                        key={label}
                        className="border-b border-[var(--border)] p-3"
                      >
                        {label}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {orders?.map((order) => (
                  <tr key={order.id}>
                    {[
                      order.id,
                      order.user_id,
                      (order.amount_cents / 100).toFixed(2),
                      order.status,
                      new Date(order.created_at).toLocaleString("zh-CN", {
                        timeZone: "Australia/Sydney",
                      }),
                    ].map((value, index) => (
                      <td
                        key={index}
                        className="border-b border-[var(--border)] p-3"
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {!orders?.length && <p className="py-6">暂无充值订单。</p>}
          </div>
        )}
      </div>
    </PageShell>
  );
}
