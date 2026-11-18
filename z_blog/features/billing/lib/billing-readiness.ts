import "server-only";

export function billingReadiness() {
  const secret = process.env.STRIPE_SECRET_KEY || "";
  const mode = secret.startsWith("sk_test_")
    ? "test"
    : secret.startsWith("sk_live_")
      ? "live"
      : "missing";
  let validOrigin = false;
  let local = false;
  try {
    const url = new URL(process.env.NEXT_PUBLIC_SITE_URL || "");
    local = ["localhost", "127.0.0.1"].includes(url.hostname);
    validOrigin =
      url.protocol === "https:" || (local && url.protocol === "http:");
  } catch {
    /* Invalid or absent origins must not enable checkout. */
  }
  const webhook = !!process.env.STRIPE_WEBHOOK_SECRET?.startsWith("whsec_");
  const enabled = process.env.STARDUST_CHECKOUT_ENABLED === "true";
  return {
    mode,
    local,
    enabled,
    canCheckout:
      enabled &&
      mode !== "missing" &&
      webhook &&
      validOrigin &&
      (!local || mode === "test"),
    checks: [
      {
        label: "积分账本环境",
        ready: mode !== "missing",
        detail:
          mode === "test"
            ? "独立测试账本 stardust_sandbox"
            : mode === "live"
              ? "正式账本 public"
              : "等待配置支付模式",
      },
      {
        label: "Stripe 密钥",
        ready: mode !== "missing",
        detail:
          mode === "test"
            ? "测试模式"
            : mode === "live"
              ? "正式模式"
              : "未配置或格式无效",
      },
      {
        label: "Webhook 签名",
        ready: webhook,
        detail: webhook ? "已配置，仍需验证事件转发" : "未配置或格式无效",
      },
      {
        label: "支付返回地址",
        ready: validOrigin,
        detail: validOrigin
          ? local
            ? "本地验收地址"
            : "HTTPS 网站地址"
          : "未配置或地址无效",
      },
      {
        label: "收费开关",
        ready: enabled,
        detail: enabled ? "已开启" : "保持关闭",
      },
      {
        label: "定时任务认证",
        ready: !!process.env.CRON_SECRET,
        detail: process.env.CRON_SECRET
          ? "密钥已配置，需另行安排任务"
          : "未配置",
      },
      {
        label: "交易通知邮件",
        ready: !!process.env.RESEND_API_KEY && !!process.env.CONTACT_FROM_EMAIL,
        detail:
          process.env.RESEND_API_KEY && process.env.CONTACT_FROM_EMAIL
            ? "已配置，需验收发送及定时任务"
            : "配置未完成",
      },
    ],
  };
}
