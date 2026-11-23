"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, UserRound, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import LogoutButton from "@/components/auth/logout-button";
import { Button } from "@/components/ui/button";
import { LanguageToggle, ThemeToggle } from "@/components/site/preference-controls";
import { usePreferences } from "@/components/site/preferences-provider";
import { siteCopy } from "@/lib/i18n/copy";
import styles from "./navbar-client.module.css";
import SiteNavigation from "./site-navigation";
import { CartLink } from "@/features/services/components/shop-shared";
import glowStyles from "./navigation-link.module.css";

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

  const avatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const accountLabel = t({ zh: "我的星巢", en: "My Account" });
  const utilityClass = `${glowStyles.link} inline-flex min-h-11 items-center justify-center rounded-md px-3 py-2 text-base font-medium`;

  function accountControls(mobile = false) {
    return <div className={`${styles.account} ${mobile ? styles.mobileAccount : ""}`}>
      <Link href="/account" className={`${utilityClass} gap-2 whitespace-nowrap`} onClick={() => setMobileOpen(false)}>
        {avatar ? (
          <Image src={avatar} alt="" width={30} height={30} className={styles.avatar} />
        ) : (
          <span aria-hidden="true" className={`${styles.avatar} grid place-items-center bg-[var(--bg-soft)]`}>
            <UserRound className="size-4" />
          </span>
        )}
        <span>{accountLabel}</span>
      </Link>
      {user ? <>
        {canManagePosts && <Link href="/admin" className={utilityClass} onClick={() => setMobileOpen(false)}>{t(siteCopy.navAdmin)}</Link>}
        <LogoutButton />
      </> : <>
        <Link href="/login" className={utilityClass} onClick={() => setMobileOpen(false)}>{t(siteCopy.navLogin)}</Link>
        <Link href="/sign-up" className={utilityClass} onClick={() => setMobileOpen(false)}>{t(siteCopy.navSignup)}</Link>
      </>}
      <div className={styles.preferences}><ThemeToggle /><LanguageToggle /></div>
    </div>;
  }

  return <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--navbar-bg)] backdrop-blur-xl">
    <div className={styles.inner}>
      <div className={styles.bar}>
        <Link href="/" className={styles.brand} onClick={() => setMobileOpen(false)}>{t(siteCopy.brand)}</Link>
        <div className={styles.navigation}><SiteNavigation /></div>
        <div className={styles.tools}>
          <div className={styles.cart}><CartLink /></div>
          <div className={styles.desktopAccount}>{accountControls()}</div>
          <Button type="button" variant="ghost" size="icon" className={styles.menuButton} aria-label={t({ en: mobileOpen ? "Close navigation" : "Open navigation", zh: mobileOpen ? "关闭导航" : "打开导航" })} aria-expanded={mobileOpen} aria-controls={mobileId} onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </Button>
        </div>
      </div>
      {mobileOpen && <div id={mobileId} className={styles.mobilePanel} onKeyDown={event => { if (event.key === "Escape" && !event.defaultPrevented) setMobileOpen(false); }}>
        <SiteNavigation mobile onNavigate={() => setMobileOpen(false)} />
        {accountControls(true)}
      </div>}
    </div>
  </header>;
}
