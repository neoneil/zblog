import { notFound, redirect } from "next/navigation";
import TarotExperiencePage from "@/components/tarot/tarot-page";
import { isTarotReadingMode, tarotModes } from "@/lib/tarot/reading-modes";

type Props = { params: Promise<{ mode: string }> };
export async function generateMetadata({ params }: Props) {
  const { mode } = await params;
  if (!isTarotReadingMode(mode)) return {};
  const config = tarotModes[mode];
  return { title: `${config.title.zh} · ${config.title.en}`, description: config.description.zh };
}
export default async function TarotModePage({ params }: Props) {
  const { mode } = await params;
  if (!isTarotReadingMode(mode)) notFound();
  if (mode === "three-cards") redirect("/tarot-ai");
  return <TarotExperiencePage mode={mode} />;
}
