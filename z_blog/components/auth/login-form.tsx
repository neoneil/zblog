"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginForm({ returnTo = "/", authError }: {
  returnTo?: string;
  authError?: string;
}) {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(
    authError === "unavailable"
      ? "登录服务暂时无法响应，请稍后重试。"
      : authError === "google_failed" ? "Google 登录没有完成，请重试。"
      : authError === "auth_failed" ? "登录或邮箱验证没有完成，请重试。" : "",
  );
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

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
    router.push(returnTo);
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ next: returnTo }),
        signal: AbortSignal.timeout(7000),
      });
      const result = await response.json();
      if (!response.ok || typeof result.url !== "string") {
        setMessage(response.status === 503
          ? "登录服务暂时无法响应，请稍后重试。"
          : "无法开始 Google 登录，请重试。");
        return;
      }
      window.location.assign(result.url);
    } catch {
      setMessage("登录服务暂时无法响应，请稍后重试。");
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4 max-w-md">
      <input
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 !text-[var(--text)] placeholder:text-[var(--text-faint)]"
        type="email"
        placeholder="邮箱"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 !text-[var(--text)] placeholder:text-[var(--text-faint)]"
        type="password"
        placeholder="密码"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading || googleLoading}
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2 !text-[var(--text)] transition hover:bg-[var(--bg-soft)]"
        >
          {loading ? "加载中..." : "登录"}
        </button>

        <button
          type="button"
          disabled={loading || googleLoading}
          onClick={handleGoogleLogin}
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2 !text-[var(--text)] transition hover:bg-[var(--bg-soft)]"
        >
          {googleLoading ? "正在连接 Google…" : "使用 Google 继续"}
        </button>
      </div>

      {returnTo !== "/" && <Link href={returnTo} className="inline-block text-sm text-[var(--primary)] underline">返回上一页面</Link>}
      {message && <p role="status" className="text-sm text-[var(--text)]">{message}</p>}
    </form>
  );
}
