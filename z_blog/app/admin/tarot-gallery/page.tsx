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
import TarotGalleryClient from "@/features/tarot-gallery/components/tarot-gallery-client";
import { listTarotGalleryDirectories } from "@/features/tarot-gallery/lib/r2-gallery";
import { requireAdmin } from "@/lib/auth/require-admin";

export const metadata = {
  title: "图片知识库",
  description: "Browse uploaded tarot image folders from Cloudflare R2.",
};

export default async function AdminTarotGalleryPage() {
  await requireAdmin("/admin/tarot-gallery");

  const [directories, feishuDocsData] = await Promise.all([
    listTarotGalleryDirectories(),
    getFeishuDocsData(),
  ]);

  const imageCount = directories.reduce(
    (total, directory) => total + directory.imageCount,
    0,
  );
  const totalSize = directories.reduce(
    (total, directory) => total + directory.totalSize,
    0,
  );

  return (
    <main className="min-h-screen bg-[var(--bg)] px-4 py-8 text-[var(--text)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <Card className="overflow-hidden">
          <CardHeader className="items-start border-b border-[var(--border)] bg-[var(--card-soft)]">
            <div className="space-y-4">
              <Badge variant="secondary">Admin Knowledge Base</Badge>
              <div className="space-y-2">
                <CardTitle className="text-3xl sm:text-4xl">
                  塔罗知识库
                </CardTitle>
                <CardDescription className="max-w-3xl text-base leading-7">
                  管理原始图片素材与飞书 Markdown 文档内容。两个知识库都在当前后台页面内浏览，
                  仅 admin 可访问。
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-soft)] p-4">
              <p className="text-sm text-[var(--text-soft)]">Folders</p>
              <p className="mt-2 text-3xl font-semibold text-[var(--text)]">
                {directories.length}
              </p>
            </div>
            <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-soft)] p-4">
              <p className="text-sm text-[var(--text-soft)]">Images</p>
              <p className="mt-2 text-3xl font-semibold text-[var(--text)]">
                {imageCount}
              </p>
            </div>
            <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-soft)] p-4">
              <p className="text-sm text-[var(--text-soft)]">Storage</p>
              <p className="mt-2 text-3xl font-semibold text-[var(--text)]">
                {(totalSize / 1024 / 1024).toFixed(1)} MB
              </p>
            </div>
            <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-soft)] p-4">
              <p className="text-sm text-[var(--text-soft)]">Markdown</p>
              <p className="mt-2 text-3xl font-semibold text-[var(--text)]">
                {feishuDocsData.documents.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="items-start border-b border-[var(--border)] bg-[var(--card-soft)]">
            <div className="space-y-3">
              <Badge variant="outline">Image Library</Badge>
              <div>
                <CardTitle className="text-2xl sm:text-3xl">
                  原始图片知识库
                </CardTitle>
                <CardDescription className="mt-2 max-w-3xl text-base leading-7">
                  从 Cloudflare R2 读取「澳洲网站版知识库」图片资源，按原文件夹层级浏览。
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-5">
            <TarotGalleryClient directories={directories} />
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="items-start border-b border-[var(--border)] bg-[var(--card-soft)]">
            <div className="space-y-3">
              <Badge variant="outline">Markdown Library</Badge>
              <div>
                <CardTitle className="text-2xl sm:text-3xl">
                  飞书 Markdown 文档
                </CardTitle>
                <CardDescription className="mt-2 max-w-3xl text-base leading-7">
                  将飞书文档内容与 R2 图片素材合并展示，用于核对正式前端知识库内容。
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-5">
            <FeishuDocsClient
              documents={feishuDocsData.documents}
              categories={feishuDocsData.categories}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
