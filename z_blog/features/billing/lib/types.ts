export type AiProductScope = "tarot" | "astroplate";

export type AiAccessStatus = {
  authenticated: boolean;
  isAdmin: boolean;
  isPaid: boolean;
  usedToday: boolean;
  remainingToday: number;
  validUntil: string | null;
};
