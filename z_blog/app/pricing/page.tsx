import { PricingClient } from "@/features/billing/components/pricing-client";
import { getAiAccessStatus } from "@/features/billing/lib/ai-access";
import type { AiProductScope } from "@/features/billing/lib/types";
import { PageShell } from "@/components/site/page-shell";
import { createClient } from "@/lib/supabase/server";

type PricingPageProps = {
  searchParams: Promise<{
    scope?: string;
  }>;
};

function getInitialScope(value: string | undefined): AiProductScope {
  return value === "astroplate" ? "astroplate" : "tarot";
}

export default async function PricingPage({ searchParams }: PricingPageProps) {
  const { scope } = await searchParams;
  const initialScope = getInitialScope(scope);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [tarotStatus, astroplateStatus] = user
    ? await Promise.all([
        getAiAccessStatus("tarot"),
        getAiAccessStatus("astroplate"),
      ])
    : [null, null];

  return (
    <PageShell className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <PricingClient
          initialScope={initialScope}
          tarotStatus={tarotStatus}
          astroplateStatus={astroplateStatus}
          isLoggedIn={Boolean(user)}
        />
      </div>
    </PageShell>
  );
}
