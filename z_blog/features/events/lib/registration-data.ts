import "server-only";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/require-user";
import type { EventRegistration } from "./registration-types";

export const registrationFields = "id,event_id,user_id,contact_name,contact_email,status,admin_note,event_snapshot,created_at,updated_at";

export async function getRegistrationContext(eventId: string) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (!user) return { signedIn: false, registration: null, available: !authError || authError.name === "AuthSessionMissingError" };
  const { data, error } = await supabase.from("event_registrations").select(registrationFields)
    .eq("event_id", eventId).eq("user_id", user.id).maybeSingle();
  return { signedIn: true, registration: data as EventRegistration | null, available: !error };
}

// Account pages can reuse this query and MyEventRegistrations without another ledger.
export async function getMyEventRegistrations() {
  const { supabase, user } = await requireUser("/events/my-registrations");
  const { data, error } = await supabase.from("event_registrations").select(registrationFields)
    .eq("user_id", user.id).order("created_at", { ascending: false }).limit(200);
  return { registrations: (data ?? []) as EventRegistration[], available: !error };
}
