import type { Metadata } from "next";
import { AstrologyTarotNovel } from "@/features/tarot-novel/components/astrology-tarot-novel";
import { publishedChapters } from "@/features/tarot-novel/lib/chapters";
import { novelComments } from "@/features/tarot-novel/lib/comments";
import { getCurrentUserWithRole } from "@/lib/auth/current-user";

export const metadata: Metadata = {
  title: "STARDUST STORIES｜星尘物语 | 星辰之巢",
  description: "星辰是宇宙的秩序，描绘命运的轨迹；星尘是灵魂的自由，书写自由的篇章。",
};

export default async function TarotNovelPage() {
  const chapters = await publishedChapters();
  const comments = await novelComments();
  const { role } = await getCurrentUserWithRole();
  return <AstrologyTarotNovel chapters={chapters} comments={comments} isAdmin={role === "admin"} />;
}
