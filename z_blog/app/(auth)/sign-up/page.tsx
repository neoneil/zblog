import SignupForm from "@/components/auth/signup-form";

import { safeReturnPath } from "@/lib/auth/return-path";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const { next } = await searchParams;
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-6 text-3xl font-bold text-[var(--text)]">注册</h1>
      <SignupForm returnTo={safeReturnPath(next)} />
    </main>
  );
}
