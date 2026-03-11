import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/auth/logout-button";
import Container from "./container";

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

  return (
    <header className="sticky top-0 z-50 border-b backdrop-blur" style={{
      background: "var(--navbar-bg)",
      borderColor: "var(--border)",
    }}>
      <Container>
        <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 py-3">
          <Link href="/" className="text-lg font-bold tracking-tight sm:text-xl">
            My Blog
          </Link>

          <nav className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
            <Link
              href="/"
              className="rounded-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-black"
            >
              Home
            </Link>

            <Link
              href="/posts"
              className="nav-link"
            >
              Posts
            </Link>

            {user ? (
              <>
                {canManagePosts && (
                  <Link
                    href="/admin/posts"
                    className="rounded-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-black"
                  >
                    Admin
                  </Link>
                )}

                <span className="hidden text-sm text-gray-400 lg:inline">
                  {user.email}
                </span>

                <LogoutButton />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-black"
                >
                  Login
                </Link>

                <Link
                  href="/sign-up"
                  className="rounded-full border px-4 py-2 text-sm font-medium text-black hover:bg-gray-50"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      </Container>
    </header>
  );
}