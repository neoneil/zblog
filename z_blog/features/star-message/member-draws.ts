import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { createClient } from "@/lib/supabase/server";
import type { Draw } from "./daily";

type Client = Awaited<ReturnType<typeof createClient>>;

export function dailyDrawTableMissing(error: { code: string } | null) {
  return error?.code === "42P01" || error?.code === "PGRST205";
}

export async function memberDailyDraw(db: Client, userId: string, day: string): Promise<Draw | null> {
  const { data, error } = await db.from("star_message_daily_draws").select("draw_id,card_id")
    .eq("user_id", userId).eq("draw_day", day).maybeSingle();
  if (error && !dailyDrawTableMissing(error)) throw error;
  return data ? { day, id: data.draw_id, cardId: data.card_id } : null;
}

export async function memberDrawById(db: Client, userId: string, drawId: string): Promise<Draw | null> {
  const { data, error } = await db.from("star_message_daily_draws").select("draw_day,draw_id,card_id")
    .eq("user_id", userId).eq("draw_id", drawId).maybeSingle();
  if (error && !dailyDrawTableMissing(error)) throw error;
  return data ? { day: data.draw_day, id: data.draw_id, cardId: data.card_id } : null;
}

export async function recordDailyDraw(db: Client, userId: string, draw: Draw): Promise<Draw | null> {
  const { error } = await createAdminClient().from("star_message_daily_draws").upsert({
    user_id: userId, draw_day: draw.day, draw_id: draw.id, card_id: draw.cardId,
  }, { onConflict: "user_id,draw_day", ignoreDuplicates: true });
  if (dailyDrawTableMissing(error)) return null;
  if (error) throw error;
  const recorded = await memberDailyDraw(db, userId, draw.day);
  if (!recorded) throw new Error("Daily draw unavailable after write");
  return recorded;
}
