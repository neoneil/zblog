import LoginForm from "@/components/auth/login-form";

import { safeReturnPath } from "@/lib/auth/return-path";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[]; auth_error?: string | string[] }>;
}) {
  const { next, auth_error } = await searchParams;
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-6 text-3xl font-bold text-[var(--primary)]">登录</h1>
      <LoginForm returnTo={safeReturnPath(next)} authError={typeof auth_error === "string" ? auth_error : undefined} />
    </main>
  );
}
