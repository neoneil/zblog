import { ButtonLink } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

type PricingSuccessPageProps = {
  searchParams: Promise<{
    session_id?: string;
  }>;
};

export default async function PricingSuccessPage({
  searchParams,
}: PricingSuccessPageProps) {
  const { session_id: sessionId } = await searchParams;
  const supabase = await createClient();
  const { data: order } = sessionId
    ? await supabase
        .from("ai_checkout_orders")
        .select("product_scope, package_days, status, entitlement_valid_until")
        .eq("stripe_checkout_session_id", sessionId)
        .maybeSingle()
    : { data: null };

  return (
    <main className="min-h-screen bg-[var(--bg-soft)] px-4 py-16 text-[var(--text)] sm:px-6">
      <Card className="mx-auto max-w-2xl overflow-hidden">
        <CardHeader className="items-start border-b border-[var(--border)] bg-[var(--card-soft)]">
          <CardTitle className="text-3xl">支付处理中</CardTitle>
          <CardDescription className="text-base leading-7">
            Stripe 已返回支付结果，权限会由 webhook 自动写入。大多数情况下会立即生效。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 p-6">
          {order ? (
            <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-soft)] p-4 text-sm leading-7 text-[var(--text-soft)]">
              <p>产品：{order.product_scope}</p>
              <p>时间包：{order.package_days} 天</p>
              <p>订单状态：{order.status}</p>
              {order.entitlement_valid_until ? (
                <p>
                  有效期至：
                  {new Date(order.entitlement_valid_until).toLocaleString("zh-CN", {
                    timeZone: "Australia/Sydney",
                  })}
                </p>
              ) : null}
            </div>
          ) : (
            <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-soft)] p-4 text-sm leading-7 text-[var(--text-soft)]">
              暂时没有读到订单详情。如果你刚完成支付，请稍等几秒后刷新。
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/tarot-ai" variant="secondary">
              打开 Tarot AI
            </ButtonLink>
            <ButtonLink href="/astroplate" variant="secondary">
              打开 Astroplate AI
            </ButtonLink>
            <ButtonLink href="/pricing">
              返回时间包页面
            </ButtonLink>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
