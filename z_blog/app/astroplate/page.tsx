import AstrologyClient from "./astrology-client";
import { getAiAccessStatus } from "@/features/billing/lib/ai-access";
import { requireUser } from "@/lib/auth/require-user";

export const metadata = {
  title: "星盘解读",
  description: "AI 星盘解读",
};

export default async function AstrologyPage() {
  await requireUser("/astroplate");

  const accessStatus = await getAiAccessStatus("astroplate");

  return <AstrologyClient accessStatus={accessStatus} />;
}
