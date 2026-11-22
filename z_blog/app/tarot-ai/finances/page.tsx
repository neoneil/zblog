import Container from "@/components/site/container";
import { PageShell } from "@/components/site/page-shell";
import { SituationCatalog } from "@/features/tarot/components/situation-catalog";

export const metadata = { title: "财务情境 · Financial Situations" };

export default function FinanceCatalogPage() {
  return <PageShell><Container><SituationCatalog category="finances" /></Container></PageShell>;
}
