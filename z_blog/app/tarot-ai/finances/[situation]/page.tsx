import { notFound } from "next/navigation";
import TarotExperiencePage from "@/components/tarot/tarot-page";
import { isSituationMode } from "@/lib/tarot/situation-spreads";
import { tarotModes } from "@/lib/tarot/reading-modes";

type Props = { params: Promise<{ situation: string }> };

export async function generateMetadata({ params }: Props) {
  const { situation } = await params;
  const mode = `finance-${situation}`;
  if (!isSituationMode(mode)) return {};
  return { title: tarotModes[mode].title.zh };
}

export default async function FinanceSituationPage({ params }: Props) {
  const { situation } = await params;
  const mode = `finance-${situation}`;
  if (!isSituationMode(mode)) notFound();
  return <TarotExperiencePage mode={mode} />;
}
