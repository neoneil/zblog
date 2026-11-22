import Container from "@/components/site/container";
import { PageShell } from "@/components/site/page-shell";
import { SituationCatalog } from "@/features/tarot/components/situation-catalog";

export const metadata = { title: "关系情境 · Relationship Situations" };

export default function RelationshipCatalogPage() {
  return <PageShell><Container><SituationCatalog category="relationships" /></Container></PageShell>;
}
