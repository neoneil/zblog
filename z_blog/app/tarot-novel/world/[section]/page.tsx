import { notFound } from "next/navigation";
import { NovelArchive } from "@/features/tarot-novel/components/novel-experience";

export default async function NovelArchivePage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (section !== "relationships" && section !== "characters") notFound();
  return <NovelArchive section={section} />;
}
