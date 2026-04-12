export type TarotArcana = "major" | "minor";
export type TarotSuit = "cups" | "wands" | "swords" | "pentacles";
export type TarotPosition = "past" | "present" | "future";

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