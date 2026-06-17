import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireUser(nextPath?: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = nextPath
      ? `/login?next=${encodeURIComponent(nextPath)}`
      : "/login";

    redirect(loginUrl);
  }

  return { supabase, user };
}

export async function requireRole(roles: string[], redirectPath = "/", nextPath?: string) {
  const { supabase, user } = await requireUser(nextPath);

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, role")
    .eq("id", user.id)
    .single();

  if (!profile || !roles.includes(profile.role)) {
    redirect(redirectPath);
  }

  return { supabase, user, profile };
}
