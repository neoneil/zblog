"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/`,
      },
    });

    console.log("SIGNUP DATA:", data);
    console.log("SIGNUP ERROR:", error);

    if (error) {
      console.error("SIGNUP FAILED:", error);
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage("注册成功，请检查邮箱并完成验证。");

    router.refresh();

    setLoading(false);
  }

  async function handleGoogleSignup() {
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
    <form onSubmit={handleSignup} className="space-y-4 max-w-md">
      <input
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 !text-[var(--text)] placeholder:text-[var(--text-faint)]"
        type="text"
        placeholder="Full name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

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
          {loading ? "Loading..." : "Sign up"}
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={handleGoogleSignup}
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2 !text-[var(--text)] transition hover:bg-[var(--bg-soft)]"
        >
          Continue with Google
        </button>
      </div>

      {message && <p className="text-sm text-[var(--text)]">{message}</p>}
    </form>
  );
}