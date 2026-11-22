import AstrologyClient from "./astrology-client";
import { getAiAccessStatus } from "@/features/billing/lib/ai-access";

export const metadata = {
  title: "星盘解读",
  description: "AI 星盘解读",
};

export default async function AstrologyPage() {

  const accessStatus = await getAiAccessStatus("astroplate");

  return <AstrologyClient accessStatus={accessStatus} />;
}
