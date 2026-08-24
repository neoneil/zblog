import TarotClient from "@/components/tarot/tarot-client";
import { getAiAccessStatus } from "@/features/billing/lib/ai-access";
import { requireUser } from "@/lib/auth/require-user";

export const metadata = {
  title: "塔罗解读",
  description: "抽取三张塔罗牌，获得 AI 解读。",
};

export default async function TarotAiPage() {
  await requireUser("/tarot-ai");

  const accessStatus = await getAiAccessStatus("tarot");

  return <TarotClient accessStatus={accessStatus} />;
}
