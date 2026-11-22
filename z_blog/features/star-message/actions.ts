"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { starCards } from "./cards";
import { pickDraw, readDraw, sydneyDay, writeDraw } from "./daily";
import { starCardImage } from "./storage";
import { memberDailyDraw, memberDrawById, recordDailyDraw } from "./member-draws";

export async function drawStarCard(position: number) {
  if (!Number.isInteger(position) || position < 0 || position >= starCards.length) {
    return { ok: false as const };
  }
  try {
    const day = sydneyDay();
    const db = await createClient();
    const { data: { user }, error: authError } = await db.auth.getUser();
    if (authError && authError.name !== "AuthSessionMissingError") throw authError;
    const browserDraw = await readDraw();
    const accountDraw = user ? await memberDailyDraw(db, user.id, day) : null;
    const candidate = browserDraw?.day === day ? browserDraw : pickDraw(position, day);
    const stored = accountDraw ?? (user ? await recordDailyDraw(db, user.id, candidate) : null);
    const draw = stored ?? candidate;
    const image = await starCardImage(draw.cardId);
    if (!stored && draw.id !== browserDraw?.id) await writeDraw(draw);
    if (stored && !accountDraw) revalidatePath("/account");
    return { ok: true as const, cardId: draw.cardId, drawId: draw.id, image };
  } catch {
    return { ok: false as const };
  }
}

export async function saveStarCard(drawId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { status: "login" as const };

  if (typeof drawId !== "string" || !/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(drawId)) {
    return { status: "error" as const };
  }

  try {
    const accountDraw = await memberDrawById(supabase, user.id, drawId);
    const candidate = accountDraw ?? await readDraw();
    if (!candidate || candidate.id !== drawId) return { status: "error" as const };
    const draw = accountDraw ?? await recordDailyDraw(supabase, user.id, candidate) ?? candidate;
    if (draw.id !== candidate.id) return { status: "error" as const };
    const download = await starCardImage(draw.cardId, true);
    const { error } = await createAdminClient().from("star_message_collection").upsert({
      user_id: user.id,
      draw_id: draw.id,
      card_id: draw.cardId,
      draw_day: draw.day,
    }, { onConflict: "user_id,draw_id", ignoreDuplicates: true });
    if (error) return { status: "error" as const };
    revalidatePath("/account");
    return { status: "saved" as const, download };
  } catch {
    return { status: "error" as const };
  }
}
