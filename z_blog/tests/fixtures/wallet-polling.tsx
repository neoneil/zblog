import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { WalletClient } from "@/features/billing/components/wallet-client";
import { PreferencesProvider } from "@/components/site/preferences-provider";

const stats = { refreshes: 0 };
const order = "00000000-0000-4000-8000-000000000001";

function Fixture() {
  const [, rerender] = useState(0);
  const [status, setStatus] = useState(
    new URLSearchParams(location.search).get("state") || "pending",
  );
  useEffect(() => {
    const refresh = () => {
      stats.refreshes++;
      rerender((count) => count + 1);
    };
    window.addEventListener("wallet-test-refresh", refresh);
    Object.assign(window, {
      walletFixture: { stats, markPaid: () => setStatus("paid") },
    });
    return () => window.removeEventListener("wallet-test-refresh", refresh);
  }, []);
  return (
    <PreferencesProvider>
      <WalletClient
        checkoutEnabled={false}
        sandbox
        snapshot={{
          account: { name: "Test User", email: "member@example.test", avatar: undefined },
          ready: true,
          verified: true,
          wallet: { paid: 1000, reward: 0, blocked: false },
          memberships: [],
          allowances: [],
          courses: [],
          ledger: [],
          reports: [],
          topups: [
            {
              id: order,
              status,
              amount_cents: 2500,
              created_at: "2026-11-21T00:00:00Z",
            },
          ],
        }}
      />
    </PreferencesProvider>
  );
}

createRoot(document.getElementById("root")!).render(<Fixture />);
