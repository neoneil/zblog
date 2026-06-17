"use client";

import { createClient } from "@/lib/supabase/client";
import { usePreferences } from "@/components/site/preferences-provider";

export default function LogoutButton() {
  const supabase = createClient();
  const { t } = usePreferences();

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <button
      onClick={handleLogout}
      className="inline-flex min-w-max items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-[var(--text-soft)] transition hover:bg-[var(--card-muted)] hover:text-[var(--text)]"
    >
      {t({ zh: "退出登录", en: "Log out" })}
    </button>
  );
}
