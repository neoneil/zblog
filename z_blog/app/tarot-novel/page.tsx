import type { Metadata } from "next";
import { AstrologyTarotNovel } from "@/features/tarot-novel/components/astrology-tarot-novel";

export const metadata: Metadata = {
  title: "占星塔罗小说 | 星语童年",
  description: "以故事串联占星、塔罗与成长主题的系列阅读页面。",
};

export default function TarotNovelPage() {
  return <AstrologyTarotNovel />;
}
