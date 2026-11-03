import Container from "@/components/site/container";
import { PageShell } from "@/components/site/page-shell";
import { FeishuDocsClient } from "@/features/feishu-docs/components/feishu-docs-client";
import { FeishuLibraryHeading } from "@/features/feishu-docs/components/library-heading";
import { getFeishuDocsData } from "@/features/feishu-docs/lib/feishu-docs";
import { requireRole } from "@/lib/auth/require-user";

export const dynamic = "force-dynamic";
export default async function FeishuDocsPage() {
  await requireRole(["admin", "editor"]);
  const data = await getFeishuDocsData();
  return <PageShell>
    <div className="border-b border-[var(--border)] bg-[color:var(--card)]/88 backdrop-blur-xl"><Container><FeishuLibraryHeading /></Container></div>
    <Container><section className="py-6 sm:py-8 lg:py-10"><FeishuDocsClient documents={data.documents} categories={data.categories} /></section></Container>
  </PageShell>;
}
