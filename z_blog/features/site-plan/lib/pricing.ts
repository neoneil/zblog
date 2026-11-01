export type BillingMode = "monthly" | "yearly" | "both";
export type PricingDraft = {
  mode: BillingMode;
  monthlyCents: number | null;
  yearlyCents: number | null;
};

export function parseAmount(value: string): number | null {
  if (!/^\d{1,6}(\.\d{1,2})?$/.test(value.trim())) return null;
  const [whole, fraction = ""] = value.trim().split(".");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return cents > 0 ? cents : null;
}
export function createPricingDraft(
  mode: BillingMode,
  monthly: string,
  yearly: string,
): PricingDraft | null {
  if (!["monthly", "yearly", "both"].includes(mode)) return null;
  const monthlyCents = mode === "yearly" ? null : parseAmount(monthly);
  const yearlyCents = mode === "monthly" ? null : parseAmount(yearly);
  if (
    (mode !== "yearly" && monthlyCents === null) ||
    (mode !== "monthly" && yearlyCents === null)
  )
    return null;
  return { mode, monthlyCents, yearlyCents };
}
export const displayAUD = (cents: number) =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    currencyDisplay: "code",
  }).format(cents / 100);
