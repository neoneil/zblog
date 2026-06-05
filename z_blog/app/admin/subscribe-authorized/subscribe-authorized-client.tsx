"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  id: string;
  email: string;
  role: string;
};

export default function SubscribeAuthorizedClient() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [subscribedUsers, setSubscribedUsers] = useState<Profile[]>([]);

  async function loadSubscribedUsers() {
    const { data } = await supabase
      .from("profiles")
      .select("id, email, role")
      .eq("role", "subscribed")
      .order("created_at", { ascending: false });

    setSubscribedUsers(data || []);
  }

  useEffect(() => {
    void loadSubscribedUsers();
  }, []);

  async function handleAuthorize() {
    setLoading(true);
    setMessage("");

    // 查用户
    const { data: profile, error: findError } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .single();

    if (findError || !profile) {
      setMessage("User not found.");
      setLoading(false);
      return;
    }

    // 更新 role
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        role: "subscribed",
      })
      .eq("email", email);

    if (updateError) {
      setMessage(updateError.message);
      setLoading(false);
      return;
    }

    setMessage("Successfully subscribed.");

    setEmail("");

    // 刷新列表
    await loadSubscribedUsers();

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[var(--bg)] px-6 py-20 text-[var(--text)]">
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[var(--text-faint)]">
          Admin Panel
        </p>

        <h1 className="text-5xl font-semibold">
          Subscribe Authorized
        </h1>

        <p className="mt-4 text-lg text-[var(--text-soft)]">
          Enter a user email and grant subscribed access.
        </p>

        {/* 授权区域 */}
        <div className="mt-10 rounded-[32px] border border-[var(--border)] bg-[var(--card-soft)] p-8 backdrop-blur-xl">
          <div className="space-y-5">
            <input
              type="email"
              placeholder="User email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full rounded-2xl
                border border-[var(--border)]
                bg-[var(--card)] px-5 py-4
                !text-[var(--text)]
                placeholder:text-[var(--text-faint)]
              "
            />

            <button
              onClick={handleAuthorize}
              disabled={loading}
              className=" cursor-pointer
                w-full rounded-2xl
                bg-[var(--card)] px-5 py-4
                text-lg font-semibold text-[var(--text)]
                transition hover:bg-[var(--bg-muted)]
              "
            >
              {loading
                ? "Authorizing..."
                : "Grant Subscribed Access"}
            </button>

            {message && (
              <div className="rounded-2xl bg-[var(--card-muted)] p-4 text-[var(--text-soft)]">
                {message}
              </div>
            )}
          </div>
        </div>

        {/* 已授权用户 */}
        <div className="mt-12">
          <h2 className="mb-6 text-3xl font-semibold">
            Subscribed Users
          </h2>

          <div className="space-y-3">
            {subscribedUsers.length === 0 && (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-soft)] p-5 text-[var(--text-faint)]">
                No subscribed users yet.
              </div>
            )}

            {subscribedUsers.map((user) => (
              <div
                key={user.id}
                className="
                  flex items-center justify-between
                  rounded-2xl border border-[var(--border)]
                  bg-[var(--card-soft)] px-5 py-4
                  backdrop-blur-xl
                "
              >
                <div>
                  <p className="text-lg font-medium text-[var(--text)]">
                    {user.email}
                  </p>

                  <p className="mt-1 text-sm text-[var(--success)]">
                    subscribed
                  </p>
                </div>

                <div
                  className="
                    rounded-full bg-[var(--success-soft)]
                    px-3 py-1 text-sm
                    text-[var(--success)]
                  "
                >
                  Active
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}