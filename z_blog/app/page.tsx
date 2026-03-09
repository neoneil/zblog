import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/auth/logout-button";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-6 text-3xl font-bold">My Blog</h1>


      <div className="mb-8">
        <Link href="/posts" className="rounded border px-3 py-2">
          View Posts
        </Link>
      </div>




      {user ? (
        <div className="space-y-4">
          <p>已登录：{user.email}</p>
          <LogoutButton />
        </div>
      ) : (
        <div className="space-x-4">
          <Link href="/login" className="rounded border px-3 py-2">
            Login
          </Link>
          <Link href="/sign-up" className="rounded border px-3 py-2">
            Sign up
          </Link>
        </div>
      )}
    </main>
  );
}