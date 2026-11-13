import { notFound } from "next/navigation";
import { NovelAct } from "@/features/tarot-novel/components/novel-experience";
import { acts } from "@/features/tarot-novel/lib/novel-world";
import { publishedChapters } from "@/features/tarot-novel/lib/chapters";

export default async function ActPage({
  params,
}: {
  params: Promise<{ act: string }>;
}) {
  const { act: slug } = await params;
  const act = acts.find((item) => item.slug === slug);
  if (!act) notFound();
  return <NovelAct number={act.number} chapters={await publishedChapters()} />;
}
