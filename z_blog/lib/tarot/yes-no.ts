import type { DrawnTarotCard } from "@/types/tarot";

export type TarotAnswer = "yes" | "no" | "maybe";
const majorAnswers: TarotAnswer[] = [
  "yes", "yes", "maybe", "yes", "yes", "maybe", "yes", "yes", "yes", "maybe", "yes",
  "maybe", "maybe", "no", "yes", "no", "no", "yes", "maybe", "yes", "yes", "yes",
];
const minorAnswers: Record<string, TarotAnswer[]> = {
  cups: ["yes", "yes", "yes", "maybe", "no", "yes", "maybe", "no", "yes", "yes", "yes", "yes", "yes", "yes"],
  wands: ["yes", "maybe", "yes", "yes", "no", "yes", "maybe", "yes", "maybe", "no", "yes", "yes", "yes", "yes"],
  swords: ["yes", "maybe", "no", "maybe", "no", "yes", "no", "no", "no", "no", "maybe", "maybe", "maybe", "maybe"],
  pentacles: ["yes", "maybe", "yes", "maybe", "no", "yes", "maybe", "yes", "yes", "yes", "yes", "yes", "yes", "yes"],
};
const courtRanks = ["page", "knight", "queen", "king"];

export function getCardAnswer(card: Pick<DrawnTarotCard, "id" | "reversed">): TarotAnswer {
  const [group, rank] = card.id.split("-");
  const index = courtRanks.includes(rank) ? 10 + courtRanks.indexOf(rank) : Number(rank) - 1;
  const upright = group === "major" ? majorAnswers[Number(rank)] : minorAnswers[group]?.[index];
  if (!upright || card.reversed) return "maybe";
  return upright;
}

// Mixed directions cancel out; neutral cards leave the other card's direction intact.
export function getYesNoAnswer(cards: Pick<DrawnTarotCard, "id" | "reversed">[]): TarotAnswer {
  const score = cards.reduce((total, card) => {
    const answer = getCardAnswer(card);
    return total + (answer === "yes" ? 1 : answer === "no" ? -1 : 0);
  }, 0);
  return score > 0 ? "yes" : score < 0 ? "no" : "maybe";
}
export const tarotAnswerLabels: Record<TarotAnswer, string> = {
  yes: "是 / Yes", no: "否 / No", maybe: "尚不明确 / Maybe",
};
