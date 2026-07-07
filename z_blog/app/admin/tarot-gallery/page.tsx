import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TarotGalleryClient from "@/features/tarot-gallery/components/tarot-gallery-client";
import { listTarotGalleryDirectories } from "@/features/tarot-gallery/lib/r2-gallery";
import { requireAdmin } from "@/lib/auth/require-admin";

export const metadata = {
  title: "图片知识库",
  description: "Browse uploaded tarot image folders from Cloudflare R2.",
};

export default async function AdminTarotGalleryPage() {
  await requireAdmin("/admin/tarot-gallery");

  const directories = await listTarotGalleryDirectories();
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
              <Badge variant="secondary">Admin Gallery</Badge>
              <div className="space-y-2">
                <CardTitle className="text-3xl sm:text-4xl">
                  图片知识库
                </CardTitle>
                <CardDescription className="max-w-3xl text-base leading-7">
                  从 Cloudflare R2 读取「澳洲网站版知识库」图片资源，按原文件夹层级浏览。
                  左侧选择目录，右侧即时预览该目录下的全部图片。
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="grid gap-3 p-5 sm:grid-cols-3">
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
          </CardContent>
        </Card>

        <TarotGalleryClient directories={directories} />
      </div>
    </main>
  );
}
