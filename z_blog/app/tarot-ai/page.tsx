import TarotClient from "@/components/tarot/tarot-client";
import { requireRole } from "@/lib/auth/require-user";

export const metadata = {
  title: "塔罗解读",
  description: "抽取三张塔罗牌，获得 AI 解读。",
};

export default async function TarotAiPage() {
  await requireRole(["subscribed", "admin"], "/pricing");
  return <TarotClient />;
}
