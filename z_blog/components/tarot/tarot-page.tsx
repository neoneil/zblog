import TarotClient from "./tarot-client";
import { getAiAccessStatus } from "@/features/billing/lib/ai-access";
import type { TarotReadingMode } from "@/lib/tarot/reading-modes";

export default async function TarotExperiencePage({ mode, manualReading }: { mode: TarotReadingMode; manualReading?: boolean }) {
  const accessStatus = await getAiAccessStatus("tarot");
  return <TarotClient key={mode} mode={mode} accessStatus={accessStatus} manualReading={manualReading} />;
}
