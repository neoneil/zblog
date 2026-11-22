import { createClient } from "@/lib/supabase/server";
import { readServerUser } from "@/lib/supabase/server-reads";

export async function getCurrentUserWithRole() {
  const supabase = await createClient();

  const { user } = await readServerUser(supabase);

  let role: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    role = profile?.role ?? null;
  }

  return {
    supabase,
    user,
    role,
    canManagePosts: role === "admin" || role === "editor",
  };
}
