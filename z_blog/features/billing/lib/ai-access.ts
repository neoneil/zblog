import "server-only";
import type { AiAccessStatus, AiProductScope } from "./types";
import { billingUser, walletSnapshot } from "./stardust-server";

export async function getAiAccessStatus(
  scope: AiProductScope,
  service?: "natal" | "synastry",
): Promise<AiAccessStatus> {
  const context = await billingUser();
  const empty: AiAccessStatus = {
    authenticated: !!context,
    isAdmin: !!context?.isAdmin,
    isPaid: false,
    usedToday: false,
    remainingToday: 0,
    validUntil: null,
  };
  if (!context) return empty;
  if (context.isAdmin) return { ...empty, remainingToday: 1 };
  const data = await walletSnapshot();
  if (!data?.ready || !data.wallet || data.wallet.blocked) return empty;
  const key = scope === "tarot" ? "tarot" : service || "natal";
  const count = data.allowances
    .filter((item) => item.service === key)
    .reduce((sum, item) => sum + item.remaining, 0);
  const canPay =
    scope === "tarot" &&
    Number(data.wallet.paid) + Number(data.wallet.reward) >= 300;
  return {
    ...empty,
    remainingToday: count || Number(canPay),
    remainingReadings: count,
    availableStars: Number(data.wallet.paid) + Number(data.wallet.reward),
  };
}
