import { PageShell, PageSection } from "@/components/site/page-shell";
import NewsletterConfirm from "@/components/site/newsletter-confirm";
export const metadata = { robots: { index: false, follow: false }, referrer: "no-referrer" as const };
export default async function ConfirmPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return <PageShell><PageSection><NewsletterConfirm token={token ?? ""} /></PageSection></PageShell>;
}
