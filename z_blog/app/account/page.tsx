import Container from "@/components/site/container";
import { PageShell } from "@/components/site/page-shell";
import { createClient } from "@/lib/supabase/server";
import { readServerUser } from "@/lib/supabase/server-reads";
import { AccountDashboard, AccountUnavailable } from "@/features/account/account-dashboard";
import { loadAccount, loadGuestAccount } from "@/features/account/data";

export const metadata = { title: "我的星巢 · My Account" };

export default async function AccountPage() {
  const supabase = await createClient();
  const { user, unavailable } = await readServerUser(supabase);
  if (unavailable) return <PageShell><Container><AccountUnavailable /></Container></PageShell>;
  const account = user ? await loadAccount(supabase, user.id) : await loadGuestAccount(supabase);
  return <PageShell><Container><AccountDashboard account={account} signedIn={Boolean(user)} /></Container></PageShell>;
}
