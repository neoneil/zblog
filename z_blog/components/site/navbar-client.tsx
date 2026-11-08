"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import LogoutButton from "@/components/auth/logout-button";
import { Button } from "@/components/ui/button";
import { LanguageToggle, ThemeToggle } from "@/components/site/preference-controls";
import { usePreferences } from "@/components/site/preferences-provider";
import { siteCopy } from "@/lib/i18n/copy";
import Container from "./container";
import SiteNavigation from "./site-navigation";
import { CartLink } from "@/features/services/components/shop-shared";

type NavbarClientProps = {
  user: {
    email?: string;
    user_metadata?: {
      full_name?: string;
      name?: string;
      avatar_url?: string;
      picture?: string;
    };
  } | null;
  canManagePosts: boolean;
};

export default function NavbarClient({ user, canManagePosts }: NavbarClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileId = useId();
  const { t } = usePreferences();
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      router.refresh();
    });
    return () => subscription.unsubscribe();
  }, [router]);

  const name = user?.user_metadata?.full_name || user?.user_metadata?.name || t({ zh: "用户", en: "User" });
  const email = user?.email || "";
  const avatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || "/default-avatar.png";
  const utilityClass = "inline-flex min-h-11 items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-[var(--text-soft)] transition hover:bg-[var(--card-muted)] hover:text-[var(--text)]";
  const membershipClass = "inline-flex min-h-11 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--text-inverse)] transition hover:bg-[var(--primary-hover)]";

  function accountControls(mobile = false) {
    return <div className={mobile ? "flex flex-wrap items-center gap-2 border-t border-[var(--border)] pt-4" : "flex items-center gap-2"}>
      <Link href="/pricing" className={membershipClass} onClick={() => setMobileOpen(false)}>{t(siteCopy.navMembership)}</Link>
      {user ? <>
        {canManagePosts && <Link href="/admin" className={utilityClass} onClick={() => setMobileOpen(false)}>{t(siteCopy.navAdmin)}</Link>}
        <div className="flex min-w-0 max-w-[220px] items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--card-soft)] px-2 py-1">
          <Image src={avatar} alt={name} width={36} height={36} className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-[var(--border)]" />
          <div className="min-w-0 leading-tight">
            <span className="block max-w-36 truncate text-sm font-medium text-[var(--text)]">{name}</span>
            <span className="block max-w-40 truncate text-xs text-[var(--text-faint)]">{email}</span>
          </div>
        </div>
        <LogoutButton />
      </> : <>
        <Link href="/login" className={utilityClass} onClick={() => setMobileOpen(false)}>{t(siteCopy.navLogin)}</Link>
        <Link href="/sign-up" className={utilityClass} onClick={() => setMobileOpen(false)}>{t(siteCopy.navSignup)}</Link>
      </>}
      <div className="flex shrink-0 items-center gap-2"><ThemeToggle /><LanguageToggle /></div>
    </div>;
  }

  return <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--navbar-bg)] backdrop-blur-xl">
    <Container>
      <div className="flex min-h-16 items-center justify-between gap-3 py-3">
        <Link href="/" className="shrink-0 text-lg font-bold text-[var(--text)] sm:text-xl" onClick={() => setMobileOpen(false)}>{t(siteCopy.brand)}</Link>
        <div className="ml-auto flex items-center gap-3">
          <CartLink />
          <div className="hidden xl:block">{accountControls()}</div>
          <Button type="button" variant="ghost" size="icon" className="xl:hidden" aria-label={t({ en: mobileOpen ? "Close navigation" : "Open navigation", zh: mobileOpen ? "关闭导航" : "打开导航" })} aria-expanded={mobileOpen} aria-controls={mobileId} onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </Button>
        </div>
      </div>
      <div className="hidden xl:block"><SiteNavigation /></div>
      {mobileOpen && <div id={mobileId} className="max-h-[calc(100dvh-84px)] overflow-y-auto border-t border-[var(--border)] pb-5 xl:hidden" onKeyDown={event => { if (event.key === "Escape" && !event.defaultPrevented) setMobileOpen(false); }}>
        <SiteNavigation mobile onNavigate={() => setMobileOpen(false)} />
        {accountControls(true)}
      </div>}
    </Container>
  </header>;
}
