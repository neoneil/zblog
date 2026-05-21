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
        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 !text-black placeholder:text-gray-400"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 !text-black placeholder:text-gray-400"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl border border-gray-300 bg-white px-4 py-2 !text-black transition hover:bg-gray-100"
        >
          {loading ? "Loading..." : "Login"}
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={handleGoogleLogin}
          className="rounded-xl border border-gray-300 bg-white px-4 py-2 !text-black transition hover:bg-gray-100"
        >
          Continue with Google
        </button>
      </div>

      {message && <p className="text-sm text-white">{message}</p>}
    </form>
  );
}