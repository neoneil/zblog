import { notFound } from "next/navigation";
import { publishedChapters } from "@/features/tarot-novel/lib/chapters";
import { AstrologyTarotNovel } from "@/features/tarot-novel/components/astrology-tarot-novel";
import { novelComments } from "@/features/tarot-novel/lib/comments";
import { getCurrentUserWithRole } from "@/lib/auth/current-user";

export default async function ChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [chapter] = await publishedChapters(slug);
  if (!chapter) notFound();
  const comments = await novelComments(chapter.id);
  const { user, role, supabase } = await getCurrentUserWithRole();
  const { data: ownCount } = user ? await supabase.rpc("my_novel_comment_count", { target_chapter: chapter.id }) : { data: 0 };
  return <AstrologyTarotNovel chapter={chapter} comments={comments} commentCount={Number(ownCount ?? 0)} signedIn={Boolean(user)} isAdmin={role === "admin"} />;
}
