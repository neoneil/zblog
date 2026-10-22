import { requireUser } from "@/lib/auth/require-user";
import { getAiAccessStatus } from "@/features/billing/lib/ai-access";
import SynastryClient from "@/features/synastry/components/synastry-client";

export const metadata = { title: "双人合盘 · Synastry", description: "两人的本命盘、跨盘相位与关系互动解读。" };
export default async function SynastryPage() {
  await requireUser("/synastry");
  const accessStatus = await getAiAccessStatus("astroplate");
  return <SynastryClient accessStatus={accessStatus} />;
}
