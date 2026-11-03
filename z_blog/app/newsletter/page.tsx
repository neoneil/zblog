import { PageShell, PageSection } from "@/components/site/page-shell";
import NewsletterEntry from "@/components/site/newsletter-entry";
export default function NewsletterPage() {
  return <PageShell><PageSection><div className="mx-auto max-w-2xl"><NewsletterEntry /></div></PageSection></PageShell>;
}
