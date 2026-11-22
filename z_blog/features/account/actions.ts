"use server";

import { requireUser } from "@/lib/auth/require-user";
import { isRequestId } from "@/features/billing/lib/stardust-config";
import { loadOrders, loadReading } from "./data";

export async function getMyOrders() {
  const { supabase, user } = await requireUser("/account");
  return loadOrders(supabase, user.id);
}

export async function getMyReading(id: string) {
  if (!isRequestId(id)) return null;
  const { supabase, user } = await requireUser("/account");
  return loadReading(supabase, user.id, id);
}
