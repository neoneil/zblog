import { createClient } from "@/lib/supabase/server";
import NavbarClient from "./navbar-client";

export default async function Navbar() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    role = profile?.role ?? null;
  }

  const canManagePosts = role === "admin" || role === "editor";

  return <NavbarClient user={user} canManagePosts={canManagePosts} />;
}