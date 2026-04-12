"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import LogoutButton from "@/components/auth/logout-button";
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

  const name =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    "User";

  const email = user?.email || "";

  const avatar =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    "/default-avatar.png";

  const navLinkClass =
    "rounded-full px-3 py-2 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white lg:text-base";

  const mobileLinkClass =
    "rounded-xl px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white";

  return (
    <header className=" top-0 z-50 bg-transparent">
      <Container>
        <div className="flex min-h-16 items-center justify-between gap-4 py-3">
          <Link
            href="/"
            className="shrink-0 text-lg font-bold tracking-tight text-white transition hover:text-white/85 sm:text-xl"
          >
            Cosmic Childhood
          </Link>

          {/* mobile button */}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10 lg:hidden"
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

          {/* desktop nav */}
          <nav className="hidden items-center justify-end gap-1.5 sm:gap-2 lg:flex lg:gap-3">
            <Link href="/" className={navLinkClass}>
              Home
            </Link>

            <Link href="/categories" className={navLinkClass}>
              Main categories
            </Link>

            <Link href="/resources" className={navLinkClass}>
              Resources
            </Link>

            <Link href="/" className={navLinkClass}>
              About us
            </Link>

            <Link href="/tarot" className={navLinkClass}>
              Tarot AI
            </Link>

            {user ? (
              <>
                {canManagePosts && (
                  <Link href="/admin/posts" className={navLinkClass}>
                    Admin
                  </Link>
                )}

                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1 shadow-sm backdrop-blur-md">
                  <Image
                    src={avatar}
                    alt={name}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full object-cover ring-1 ring-white/15"
                  />

                  <div className="hidden xl:flex flex-col leading-tight">
                    <span className="text-sm font-medium text-white">
                      {name}
                    </span>
                    <span className="max-w-40 truncate text-xs text-white/55">
                      {email}
                    </span>
                  </div>
                </div>

                <LogoutButton />
              </>
            ) : (
              <>
                <Link href="/login" className={navLinkClass}>
                  Login
                </Link>

                <Link
                  href="/sign-up"
                  className="rounded-full border border-white/15 bg-white/90 px-4 py-2 text-sm font-semibold text-black transition hover:bg-white lg:text-base"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* mobile dropdown */}
        {mobileOpen && (
          <div className="mb-3 rounded-2xl border border-white/10 bg-black/60 p-3 backdrop-blur-md lg:hidden">
            <nav className="flex flex-col gap-1">
              <Link
                href="/"
                className={mobileLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                Home
              </Link>

              <Link
                href="/categories"
                className={mobileLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                Main categories
              </Link>

              <Link
                href="/resources"
                className={mobileLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                Resources
              </Link>

              <Link
                href="/"
                className={mobileLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                About us
              </Link>

              <Link
                href="/tarot"
                className={mobileLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                Tarot AI
              </Link>

              {user ? (
                <>
                  {canManagePosts && (
                    <Link
                      href="/admin/posts"
                      className={mobileLinkClass}
                      onClick={() => setMobileOpen(false)}
                    >
                      Admin
                    </Link>
                  )}

                  <div className="mt-2 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                    <Image
                      src={avatar}
                      alt={name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover ring-1 ring-white/15"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {name}
                      </p>
                      <p className="truncate text-xs text-white/60">
                        {email}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <LogoutButton />
                  </div>
                </>
              ) : (
                <div className="mt-2 flex flex-col gap-2">
                  <Link
                    href="/login"
                    className={mobileLinkClass}
                    onClick={() => setMobileOpen(false)}
                  >
                    Login
                  </Link>

                  <Link
                    href="/sign-up"
                    className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-black transition hover:bg-white/90"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
}