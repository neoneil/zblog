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

function formatDuration(seconds: number | null) {
  if (!seconds) return "Duration pending";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

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
  const featuredVideo = videos[0];
  const remainingVideos = videos.slice(1);

  return (
    <main className="min-h-screen bg-[var(--bg)] px-4 py-6 text-[var(--text)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Card className="overflow-hidden">
            <CardHeader className="items-start border-b border-[var(--border)] bg-[var(--card-soft)]">
              <div className="space-y-4">
                <Badge variant="secondary">Healing Daily</Badge>
                <div className="space-y-2">
                  <CardTitle className="text-3xl sm:text-4xl">
                    每日疗愈视频
                  </CardTitle>
                  <CardDescription className="max-w-3xl text-base leading-7">
                    A curated video library for focused emotional care, repeatable daily rituals,
                    and gentle family wellbeing practices.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="grid gap-3 p-5 sm:grid-cols-3">
              <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-soft)] p-4">
                <p className="text-sm text-[var(--text-soft)]">Published</p>
                <p className="mt-2 text-3xl font-semibold text-[var(--text)]">
                  {allVideos.length}
                </p>
              </div>
              <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-soft)] p-4">
                <p className="text-sm text-[var(--text-soft)]">Categories</p>
                <p className="mt-2 text-3xl font-semibold text-[var(--text)]">
                  {Math.max(categories.length - 1, 0)}
                </p>
              </div>
              <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-soft)] p-4">
                <p className="text-sm text-[var(--text-soft)]">Current View</p>
                <p className="mt-2 truncate text-2xl font-semibold text-[var(--text)]">
                  {category === "all" ? "All" : category}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="items-start">
              <div>
                <CardTitle>Library Filter</CardTitle>
                <CardDescription>Choose a category to narrow the video set.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <Link
                  key={item}
                  href={`/parentinglab/healingdaily/videos?category=${item}`}
                  className={[
                    "inline-flex min-w-max items-center rounded-[var(--radius-md)] border px-4 py-2 text-sm font-medium transition",
                    item === category
                      ? "border-transparent bg-[var(--primary)] text-[var(--text-inverse)]"
                      : "border-[var(--border)] bg-[var(--card)] text-[var(--text-soft)] hover:bg-[var(--card-soft)] hover:text-[var(--text)]",
                  ].join(" ")}
                >
                  {item === "all" ? "All Videos" : item}
                </Link>
              ))}
            </CardContent>
          </Card>
        </section>

        {videos.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-sm text-[var(--text-soft)]">
              No published videos in this category yet.
            </CardContent>
          </Card>
        ) : (
          <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
            <Card className="overflow-hidden">
              <CardHeader className="border-b border-[var(--border)] bg-[var(--card-soft)]">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <Badge variant="outline">{featuredVideo.category}</Badge>
                    <CardTitle className="mt-3 text-2xl sm:text-3xl">
                      {featuredVideo.title}
                    </CardTitle>
                    {featuredVideo.description && (
                      <CardDescription className="mt-2 max-w-3xl leading-6">
                        {featuredVideo.description}
                      </CardDescription>
                    )}
                  </div>

                  <ButtonLink href="/parentinglab/healingdaily" variant="secondary" size="sm">
                    Healing Daily
                  </ButtonLink>
                </div>
              </CardHeader>

              <CardContent className="space-y-5 p-5">
                <VideoPlayer
                  signedUrl={featuredVideo.signed_video_url}
                  posterUrl={featuredVideo.signed_thumbnail_url}
                  title={featuredVideo.title}
                />

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-soft)] p-4">
                    <p className="text-xs uppercase tracking-wide text-[var(--text-soft)]">
                      Category
                    </p>
                    <p className="mt-1 font-medium text-[var(--text)]">
                      {featuredVideo.category}
                    </p>
                  </div>
                  <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-soft)] p-4">
                    <p className="text-xs uppercase tracking-wide text-[var(--text-soft)]">
                      Duration
                    </p>
                    <p className="mt-1 font-medium text-[var(--text)]">
                      {formatDuration(featuredVideo.duration_seconds)}
                    </p>
                  </div>
                  <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-soft)] p-4">
                    <p className="text-xs uppercase tracking-wide text-[var(--text-soft)]">
                      Access
                    </p>
                    <p className="mt-1 font-medium text-[var(--text)]">
                      Private signed stream
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <aside className="space-y-4">
              <Card>
                <CardHeader className="items-start">
                  <div>
                    <CardTitle>Up Next</CardTitle>
                    <CardDescription>
                      Continue through the current category.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(remainingVideos.length > 0 ? remainingVideos : [featuredVideo]).map(
                    (video) => (
                      <div
                        key={video.id}
                        className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-soft)] p-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <Badge variant="outline">{video.category}</Badge>
                          <span className="text-xs text-[var(--text-soft)]">
                            {formatDuration(video.duration_seconds)}
                          </span>
                        </div>
                        <h3 className="mt-3 text-sm font-semibold leading-6 text-[var(--text)]">
                          {video.title}
                        </h3>
                        {video.description && (
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--text-soft)]">
                            {video.description}
                          </p>
                        )}
                      </div>
                    ),
                  )}
                </CardContent>
              </Card>
            </aside>
          </section>
        )}
      </div>
    </main>
  );
}
