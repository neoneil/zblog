import type { Metadata } from "next";
import { AstrologyTarotNovel } from "@/features/tarot-novel/components/astrology-tarot-novel";
import { publishedChapters } from "@/features/tarot-novel/lib/chapters";
import { novelComments } from "@/features/tarot-novel/lib/comments";
import { getCurrentUserWithRole } from "@/lib/auth/current-user";

export const metadata: Metadata = {
  title: "死神禁果：诸神的审判 | STARDUST STORIES | STELLARNESTS",
  description: "Seven stars. One lost goddess. Death's Forbidden Apple: Judgment of the Gods. 七星、四种信仰、十一场试炼与五幕五十章的星尘物语。",
};

export default async function TarotNovelPage() {
  const chapters = await publishedChapters();
  const comments = await novelComments();
  const { role } = await getCurrentUserWithRole();
  return <AstrologyTarotNovel chapters={chapters} comments={comments} isAdmin={role === "admin"} />;
}
