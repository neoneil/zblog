import Container from "@/components/site/container";
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

export const dynamic = "force-dynamic";

export default async function FeishuDocsPage() {
  const data = await getFeishuDocsData();

  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <div className="border-b border-[var(--border)] bg-[var(--bg-soft)]">
        <Container>
          <section className="py-8 sm:py-12">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
              <div>
                <Badge variant="secondary">Tarot bank</Badge>
                <h1 className="mt-4 max-w-4xl text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl lg:text-5xl">
                  这个地方我不知道写什么
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--text-soft)] sm:text-lg">
                  这是副标题
                </p>
              </div>

              <Card className="bg-[var(--card)]">
                <CardHeader className="pb-3">
                  <CardTitle>目前已有</CardTitle>
                  <CardDescription>塔罗文档</CardDescription>
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
    </main>
  );
}
