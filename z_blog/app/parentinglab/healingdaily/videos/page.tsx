import { Card, CardContent } from "@/components/ui/card";
import HealingVideosClient from "@/features/video/components/healing-videos-client";
import { listPublishedVideos } from "@/features/video/lib/video-actions";
import { requireAdmin } from "@/lib/auth/require-admin";

type VideosPageProps = {
  searchParams: Promise<{
    category?: string;
  }>;
};

export const metadata = {
  title: "Healing Daily Videos",
  description: "Watch Healing Daily videos.",
};

export default async function HealingDailyVideosPage({
  searchParams,
}: VideosPageProps) {
  await requireAdmin("/parentinglab/healingdaily/videos");

  const { category = "all" } = await searchParams;
  const allVideos = await listPublishedVideos();
  const videos = category === "all"
    ? allVideos
    : allVideos.filter((video) => video.category === category);
  const categories = Array.from(
    new Set(["all", ...allVideos.map((video) => video.category)]),
  );

  return (
    <main className="min-h-screen bg-[var(--bg)] px-4 py-6 text-[var(--text)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {videos.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-sm text-[var(--text-soft)]">
              当前分类还没有已发布的视频。
            </CardContent>
          </Card>
        ) : (
          <HealingVideosClient
            videos={videos}
            category={category}
            categories={categories}
          />
        )}
      </div>
    </main>
  );
}
