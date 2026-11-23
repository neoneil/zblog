"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { readServerUser } from "@/lib/supabase/server-reads";
import { limitWish } from "./wish-limit";

export async function saveAppleTreeMessage(id: string, input: string) {
  if (typeof id !== "string" || !/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id) || typeof input !== "string") {
    return "invalid" as const;
  }
  const body = input.trim();
  if (!body || body.length > 4000 || limitWish(body).value !== body) return "invalid" as const;
  const db = await createClient();
  const { user, unavailable } = await readServerUser(db);
  if (unavailable) return "unavailable" as const;
  if (!user) return "login" as const;

  const { error } = await db.from("apple_tree_messages").upsert(
    { id, user_id: user.id, body },
    { onConflict: "user_id,id", ignoreDuplicates: true },
  );
  if (error) return "unavailable" as const;
  revalidatePath("/account");
  return "saved" as const;
}
