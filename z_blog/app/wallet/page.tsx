import { walletSnapshot } from "@/features/billing/lib/stardust-server";
import { WalletClient } from "@/features/billing/components/wallet-client";
import { PageShell } from "@/components/site/page-shell";
import { billingSchema } from "@/features/billing/lib/billing-db";

export default async function WalletPage({
  searchParams,
}: {
  searchParams: Promise<{ topup?: string | string[] }>;
}) {
  const { topup } = await searchParams;
  const snapshot = await walletSnapshot(typeof topup === "string" ? topup : undefined);
  return (
    <PageShell className="px-4 py-8 sm:px-6">
      <WalletClient
        sandbox={billingSchema() === "stardust_sandbox"}
        snapshot={snapshot}
        checkoutEnabled={process.env.STARDUST_CHECKOUT_ENABLED === "true"}
      />
    </PageShell>
  );
}
