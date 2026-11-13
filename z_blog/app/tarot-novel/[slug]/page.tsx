import { notFound } from "next/navigation";
import { publishedChapters } from "@/features/tarot-novel/lib/chapters";
import { AstrologyTarotNovel } from "@/features/tarot-novel/components/astrology-tarot-novel";
import { novelComments } from "@/features/tarot-novel/lib/comments";
import { getCurrentUserWithRole } from "@/lib/auth/current-user";
import { plannedChapterForSlug } from "@/features/tarot-novel/lib/novel-world";
import { NovelPlannedChapter } from "@/features/tarot-novel/components/novel-experience";
import { redirect } from "next/navigation";

export default async function ChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapters = await publishedChapters();
  const planned = plannedChapterForSlug(slug);
  const chapter = chapters.find(item => item.slug === slug) ?? (planned ? chapters.find(item => item.chapter_number === planned.number) : undefined);
  if (!chapter) {
    if (planned) return <NovelPlannedChapter chapter={planned} />;
    notFound();
  }
  if (chapter.slug !== slug) redirect(`/tarot-novel/${chapter.slug}`);
  const comments = await novelComments(chapter.id);
  const { user, role, supabase } = await getCurrentUserWithRole();
  const { data: ownCount } = user ? await supabase.rpc("my_novel_comment_count", { target_chapter: chapter.id }) : { data: 0 };
  return <AstrologyTarotNovel chapter={chapter} comments={comments} commentCount={Number(ownCount ?? 0)} signedIn={Boolean(user)} isAdmin={role === "admin"} />;
}
