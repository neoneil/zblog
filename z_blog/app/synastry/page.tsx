import { getAiAccessStatus } from "@/features/billing/lib/ai-access";
import SynastryClient from "@/features/synastry/components/synastry-client";

export const metadata = { title: "双人合盘 · Synastry", description: "两人的本命盘、跨盘相位与关系互动解读。" };
export default async function SynastryPage() {
  const accessStatus = await getAiAccessStatus("astroplate", "synastry");
  return <SynastryClient accessStatus={accessStatus} />;
}
