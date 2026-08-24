"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import LogoutButton from "@/components/auth/logout-button";
import { LanguageToggle, ThemeToggle } from "@/components/site/preference-controls";
import { usePreferences } from "@/components/site/preferences-provider";
import { siteCopy } from "@/lib/i18n/copy";
import Container from "./container";

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

export default function NavbarClient({
  user,
  canManagePosts,
}: NavbarClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = usePreferences();

  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      router.refresh();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const name =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    t({ zh: "用户", en: "User" });

  const email = user?.email || "";

  const avatar =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    "/default-avatar.png";

  const navLinkClass =
    "inline-flex min-w-max items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-[var(--text-soft)] transition hover:bg-[var(--card-muted)] hover:text-[var(--text)]";

  const mobileLinkClass =
    "rounded-xl px-3 py-2 text-sm font-medium text-[var(--text-soft)] transition hover:bg-[var(--card-muted)] hover:text-[var(--text)]";

  return (
    <header className="top-0 z-50 bg-transparent">
      <Container>
        <div className="flex min-h-16 items-center justify-between gap-4 py-3">
          <Link
            href="/"
            className="shrink-0 text-lg font-bold tracking-tight text-[var(--text)] transition hover:text-[var(--text)] sm:text-xl"
          >
            {t(siteCopy.brand)}
          </Link>

          <button
            type="button"
            aria-label="切换导航菜单"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card-soft)] text-[var(--text)] transition hover:bg-[var(--card-muted)] 2xl:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          <nav className="hidden min-w-0 flex-1 items-center justify-end gap-1.5 2xl:flex">
            <Link href="/" className={navLinkClass}>
              {t(siteCopy.navHome)}
            </Link>

            <Link href="/categories" className={navLinkClass}>
              {t(siteCopy.navCategories)}
            </Link>

            <Link href="/resources" className={navLinkClass}>
              {t(siteCopy.navResources)}
            </Link>

            <Link href="/aboutus" className={navLinkClass}>
              {t(siteCopy.navAbout)}
            </Link>

            <Link href="/astroplate" className={navLinkClass}>
              {t(siteCopy.navAstroplate)}
            </Link>

            <Link href="/tarot-ai" className={navLinkClass}>
              {t(siteCopy.navTarot)}
            </Link>

            <Link href="/tarot" className={navLinkClass}>
              {t(siteCopy.navTarotLibrary)}
            </Link>

            <Link href="/classroom" className={navLinkClass}>
              {t(siteCopy.navClassroom)}
            </Link>

            <Link href="/feishu-docs" className={navLinkClass}>
              {t(siteCopy.navFeishuDocs)}
            </Link>

            <Link
              href="/pricing"
              className="inline-flex min-w-max items-center justify-center whitespace-nowrap rounded-full border border-[var(--border)] bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--text-inverse)] shadow-[var(--shadow-sm)] transition hover:bg-[var(--primary-hover)]"
            >
              {t(siteCopy.navMembership)}
            </Link>

            {user ? (
              <>
                {canManagePosts && (
                  <Link href="/admin" className={navLinkClass}>
                    {t(siteCopy.navAdmin)}
                  </Link>
                )}

                <div className="flex min-w-0 max-w-[220px] items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card-soft)] px-2 py-1 shadow-sm backdrop-blur-md">
                  <Image
                    src={avatar}
                    alt={name}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full object-cover ring-1 ring-[var(--border)]"
                  />

                  <div className="hidden min-w-0 2xl:flex flex-col leading-tight">
                    <span className="max-w-36 truncate text-sm font-medium text-[var(--text)]">
                      {name}
                    </span>

                    <span className="max-w-40 truncate text-xs text-[var(--text-faint)]">
                      {email}
                    </span>
                  </div>
                </div>

                <LogoutButton />

                <div className="flex shrink-0 items-center gap-2">
                  <ThemeToggle />
                  <LanguageToggle />
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className={navLinkClass}>
                  {t(siteCopy.navLogin)}
                </Link>

                <Link
                  href="/sign-up"
                  className="inline-flex min-w-max items-center justify-center whitespace-nowrap rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--card)]"
                >
                  {t(siteCopy.navSignup)}
                </Link>

                <div className="flex shrink-0 items-center gap-2">
                  <ThemeToggle />
                  <LanguageToggle />
                </div>
              </>
            )}
          </nav>
        </div>

        {mobileOpen && (
          <div className="mb-3 rounded-2xl border border-[var(--border)] bg-[color:var(--bg)]/80 p-3 backdrop-blur-md 2xl:hidden">
            <nav className="flex flex-col gap-1">
              <Link
                href="/"
                className={mobileLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                {t(siteCopy.navHome)}
              </Link>

              <Link
                href="/categories"
                className={mobileLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                {t(siteCopy.navCategories)}
              </Link>

              <Link
                href="/resources"
                className={mobileLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                {t(siteCopy.navResources)}
              </Link>

              <Link
                href="/aboutus"
                className={mobileLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                {t(siteCopy.navAbout)}
              </Link>

              <Link
                href="/astroplate"
                className={mobileLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                {t(siteCopy.navAstroplate)}
              </Link>

              <Link
                href="/tarot-ai"
                className={mobileLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                {t(siteCopy.navTarot)}
              </Link>

              <Link
                href="/tarot"
                className={mobileLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                {t(siteCopy.navTarotLibrary)}
              </Link>

              <Link
                href="/classroom"
                className={mobileLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                {t(siteCopy.navClassroom)}
              </Link>

              <Link
                href="/feishu-docs"
                className={mobileLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                {t(siteCopy.navFeishuDocs)}
              </Link>

              <Link
                href="/pricing"
                className="rounded-xl border border-[var(--border)] bg-[var(--primary)] px-3 py-2 text-sm font-semibold text-[var(--text-inverse)] transition hover:bg-[var(--primary-hover)]"
                onClick={() => setMobileOpen(false)}
              >
                {t(siteCopy.navMembership)}
              </Link>

              {user ? (
                <>
                  {canManagePosts && (
                    <Link
                      href="/admin/posts"
                      className={mobileLinkClass}
                      onClick={() => setMobileOpen(false)}
                    >
                      {t(siteCopy.navAdmin)}
                    </Link>
                  )}

                  <div className="mt-2 flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 py-3">
                    <Image
                      src={avatar}
                      alt={name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover ring-1 ring-[var(--border)]"
                    />

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[var(--text)]">
                        {name}
                      </p>

                      <p className="truncate text-xs text-[var(--text-soft)]">
                        {email}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-end gap-2">
                    <LogoutButton />

                    <ThemeToggle />

                    <LanguageToggle />
                  </div>
                </>
              ) : (
                <div className="mt-2 flex flex-col gap-2">
                  <Link
                    href="/login"
                    className={mobileLinkClass}
                    onClick={() => setMobileOpen(false)}
                  >
                    {t(siteCopy.navLogin)}
                  </Link>

                  <Link
                    href="/sign-up"
                    className="rounded-xl bg-[var(--card)] px-3 py-2 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--card)]"
                    onClick={() => setMobileOpen(false)}
                  >
                    {t(siteCopy.navSignup)}
                  </Link>

                  <div className="flex justify-end gap-2 pt-1">
                    <ThemeToggle />
                    <LanguageToggle />
                  </div>
                </div>
              )}
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
}
