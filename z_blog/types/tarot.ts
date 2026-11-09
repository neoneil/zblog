export type TarotArcana = "major" | "minor";
export type TarotSuit = "cups" | "wands" | "swords" | "pentacles";
export type TarotPosition = "past" | "present" | "future"
  | "contribution" | "challenge" | "influence" | "growth" | "selfLove"
  | "insight" | "signal" | "context"
  | "problem" | "obstacle" | "recommendation"
  | "free1" | "free2" | "free3" | "free4" | "free5"
  | "you" | "partner" | "relationship"
  | "careerState" | "careerChallenge" | "careerAdvice"
  | "choiceAState" | "choiceAOutcome" | "choiceAAdvice"
  | "choiceBState" | "choiceBOutcome" | "choiceBAdvice"
  | "current" | "crossing" | "subconscious" | "background" | "potential"
  | "nearFuture" | "attitude" | "environment" | "hopes" | "outcome";

export type TarotCard = {
  id: string;
  name: string;
  nameCn: string;
  arcana: TarotArcana;
  suit?: TarotSuit;
  imageSrc: string;
  meaningUp: string[];
  meaningReversed: string[];
};

export type DrawnTarotCard = TarotCard & {
  reversed: boolean;
  position: TarotPosition;
};
