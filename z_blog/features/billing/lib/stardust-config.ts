export const TOPUP_CENTS = [1000, 2500, 5000, 10000, 20000, 50000] as const;
export const MEMBERSHIPS = {
  annual: {
    stars: 158000,
    zh: "年度会员",
    en: "Annual membership",
    durationZh: "12个月",
    durationEn: "12 months",
  },
  monthly: {
    stars: 15800,
    zh: "月度服务会员",
    en: "Monthly service membership",
    durationZh: "30天",
    durationEn: "30 days",
  },
} as const;
export const COURSES = {
  waite: { zh: "韦特塔罗录播", en: "Rider–Waite course" },
  thoth: { zh: "透特塔罗录播", en: "Thoth course" },
  astrology: { zh: "占星术录播", en: "Astrology course" },
};
export const isRequestId = (value: unknown): value is string =>
  typeof value === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
export function siteOrigin() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (!raw && process.env.NODE_ENV === "production")
    throw new Error("SITE_URL_REQUIRED");
  const url = new URL(raw || "http://localhost:3001");
  if (
    url.protocol !== "https:" &&
    !["localhost", "127.0.0.1"].includes(url.hostname)
  )
    throw new Error("INVALID_SITE_URL");
  return url.origin;
}
export const billingMessage = (error: unknown) => {
  const message =
    error && typeof error === "object" && "message" in error
      ? String(error.message)
      : "";
  const messages: Record<string, string> = {
    EMAIL_VERIFICATION_REQUIRED:
      "请先完成邮箱验证。 / Verify your email first.",
    ACCOUNT_REVIEW: "账户正在审核，暂不可消费。 / Account under review.",
    ALREADY_INCLUDED:
      "你已拥有该课程的观看权限。 / Course access already included.",
    REQUEST_RELEASED: "此请求已取消，请重新发起。 / Start a new request.",
    REQUEST_CONFLICT: "请求编号已用于其他操作。 / Request conflict.",
    PRODUCT_NOT_AVAILABLE: "此商品尚未开放。 / Product unavailable.",
    RESERVATION_EXPIRED: "预留已过期，积分将退回。 / Reservation expired.",
  };
  return (
    Object.entries(messages).find(([key]) => message.includes(key))?.[1] ||
    "暂时无法处理，请稍后重试。 / Unable to process. Please retry."
  );
};
