"use client";

import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-full border px-4 py-2 text-sm font-medium hover:bg-gray-50"
    >
      Logout
    </button>
  );
}