import Container from "@/components/site/container";
import { PageShell } from "@/components/site/page-shell";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FeishuDocsClient } from "@/features/feishu-docs/components/feishu-docs-client";
import { getFeishuDocsData } from "@/features/feishu-docs/lib/feishu-docs";
import { requireRole } from "@/lib/auth/require-user";

export const dynamic = "force-dynamic";

export default async function FeishuDocsPage() {
  await requireRole(["admin", "editor"]);

  const data = await getFeishuDocsData();

  return (
    <PageShell>
      <div className="border-b border-[var(--border)] bg-[color:var(--card)]/88 backdrop-blur-xl">
        <Container>
          <section className="py-8 sm:py-12">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
              <div>
                <Badge variant="secondary">Feishu Docs</Badge>
                <h1 className="mt-4 max-w-4xl text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl lg:text-5xl">
                  飞书 Markdown 知识库
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--text-soft)] sm:text-lg">
                  将飞书导出的 Markdown 按牌面和目录整理为可阅读页面，并通过 R2 临时签名加载对应图片。
                </p>
              </div>

              <Card className="bg-[var(--card)]">
                <CardHeader className="pb-3">
                  <CardTitle>资料概览</CardTitle>
                  <CardDescription>当前已解析的文档与图片状态</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-3 pt-0">
                  <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card-soft)] p-3">
                    <p className="text-xs text-[var(--text-faint)]">文档</p>
                    <p className="mt-1 text-2xl font-semibold text-[var(--text)]">
                      {data.documents.length}
                    </p>
                  </div>
                  <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card-soft)] p-3">
                    <p className="text-xs text-[var(--text-faint)]">图片</p>
                    <p className="mt-1 text-2xl font-semibold text-[var(--text)]">
                      {data.totalImages}
                    </p>
                  </div>
                  <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card-soft)] p-3">
                    <p className="text-xs text-[var(--text-faint)]">缺失</p>
                    <p className="mt-1 text-2xl font-semibold text-[var(--text)]">
                      {data.missingImages}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </Container>
      </div>

      <Container>
        <section className="py-6 sm:py-8 lg:py-10">
          <FeishuDocsClient
            documents={data.documents}
            categories={data.categories}
          />
        </section>
      </Container>
    </PageShell>
  );
}
