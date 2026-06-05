"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    router.refresh();
    router.push("/");
  }

  async function handleGoogleLogin() {
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/`,
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4 max-w-md">
      <input
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 !text-[var(--text)] placeholder:text-[var(--text-faint)]"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 !text-[var(--text)] placeholder:text-[var(--text-faint)]"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2 !text-[var(--text)] transition hover:bg-[var(--bg-soft)]"
        >
          {loading ? "Loading..." : "Login"}
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={handleGoogleLogin}
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2 !text-[var(--text)] transition hover:bg-[var(--bg-soft)]"
        >
          Continue with Google
        </button>
      </div>

      {message && <p className="text-sm text-[var(--text)]">{message}</p>}
    </form>
  );
}