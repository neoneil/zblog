import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import VideoPlayer from "@/components/video/video-player";
import { listPublishedVideos } from "@/features/video/lib/video-actions";

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
  const { category = "all" } = await searchParams;
  const allVideos = await listPublishedVideos();
  const videos = category === "all"
    ? allVideos
    : allVideos.filter((video) => video.category === category);
  const categories = Array.from(
    new Set(["all", ...allVideos.map((video) => video.category)]),
  );

  return (
    <main className="min-h-screen bg-[var(--bg)] px-4 py-8 text-[var(--text)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <Card className="overflow-hidden">
          <CardHeader className="bg-[var(--card-soft)]">
            <Badge variant="secondary">Healing Daily</Badge>
            <CardTitle className="mt-3 text-3xl sm:text-4xl">
              每日疗愈视频
            </CardTitle>
            <CardDescription>
              Healing Daily videos for gentle care, emotional rhythm, and small rituals.
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((item) => (
            <Link
              key={item}
              href={`/parentinglab/healingdaily/videos?category=${item}`}
              className={[
                "inline-flex min-w-max items-center rounded-full border px-4 py-2 text-sm font-medium transition",
                item === category
                  ? "border-transparent bg-[var(--primary)] text-[var(--text-inverse)]"
                  : "border-[var(--border)] bg-[var(--card)] text-[var(--text-soft)] hover:bg-[var(--card-soft)] hover:text-[var(--text)]",
              ].join(" ")}
            >
              {item === "all" ? "All" : item}
            </Link>
          ))}
        </div>

        {videos.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-sm text-[var(--text-soft)]">
              No published videos yet.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5">
            {videos.map((video) => (
              <Card key={video.id} className="overflow-hidden">
                <CardHeader className="border-b border-[var(--border)] bg-[var(--card-soft)]">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <Badge variant="outline">{video.category}</Badge>
                      <CardTitle className="mt-3 text-2xl">
                        {video.title}
                      </CardTitle>
                      {video.description && (
                        <CardDescription className="max-w-2xl leading-6">
                          {video.description}
                        </CardDescription>
                      )}
                    </div>

                    <ButtonLink href="/parentinglab/healingdaily" variant="secondary" size="sm">
                      Healing Daily
                    </ButtonLink>
                  </div>
                </CardHeader>

                <CardContent className="p-5">
                  <VideoPlayer
                    signedUrl={video.signed_video_url}
                    posterUrl={video.signed_thumbnail_url}
                    title={video.title}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
