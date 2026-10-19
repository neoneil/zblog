import TarotExperiencePage from "@/components/tarot/tarot-page";

export const metadata = {
  title: "塔罗解读",
  description: "抽取三张塔罗牌，获得 AI 解读。",
};

export default async function TarotAiPage() {
  return <TarotExperiencePage mode="three-cards" />;
}
