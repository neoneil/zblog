import TarotClient from "./tarot-client";
import { getAiAccessStatus } from "@/features/billing/lib/ai-access";
import { requireUser } from "@/lib/auth/require-user";
import { tarotModes, type TarotReadingMode } from "@/lib/tarot/reading-modes";

export default async function TarotExperiencePage({ mode }: { mode: TarotReadingMode }) {
  await requireUser(tarotModes[mode].href);
  const accessStatus = await getAiAccessStatus("tarot");
  return <TarotClient key={mode} mode={mode} accessStatus={accessStatus} />;
}
