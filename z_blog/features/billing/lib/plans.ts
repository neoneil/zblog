import type { AiProductScope } from "@/features/billing/lib/types";

export type AiPlan = {
  id: string;
  days: 30 | 60 | 90 | 180;
  amountCents: number;
  currency: "aud";
};

export const AI_PRODUCTS: Record<
  AiProductScope,
  {
    label: string;
    description: string;
  }
> = {
  tarot: {
    label: "Tarot AI",
    description: "塔罗 AI 解读权限",
  },
  astroplate: {
    label: "Astroplate AI",
    description: "星盘 AI 解读权限",
  },
};

export const AI_TIME_PACK_PLANS: AiPlan[] = [
  {
    id: "30-days",
    days: 30,
    amountCents: 1900,
    currency: "aud",
  },
  {
    id: "60-days",
    days: 60,
    amountCents: 3500,
    currency: "aud",
  },
  {
    id: "90-days",
    days: 90,
    amountCents: 4900,
    currency: "aud",
  },
  {
    id: "180-days",
    days: 180,
    amountCents: 8900,
    currency: "aud",
  },
];

export function getAiPlan(planId: string) {
  return AI_TIME_PACK_PLANS.find((plan) => plan.id === planId) ?? null;
}

export function formatAud(amountCents: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(amountCents / 100);
}
