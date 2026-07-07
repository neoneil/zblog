"use client";

import { useMemo, useState } from "react";
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
import type { AdminVideoItem } from "@/features/video/lib/video-actions";

type HealingVideosClientProps = {
  videos: AdminVideoItem[];
  category: string;
  categories: string[];
};

function formatDuration(seconds: number | null) {
  if (!seconds) return "Pending";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

export default function HealingVideosClient({
  videos,
  category,
  categories,
}: HealingVideosClientProps) {
  const [selectedVideoId, setSelectedVideoId] = useState(videos[0]?.id ?? "");
  const selectedVideo = useMemo(
    () => videos.find((video) => video.id === selectedVideoId) ?? videos[0],
    [selectedVideoId, videos],
  );

  if (!selectedVideo) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-[var(--text-soft)]">
          目前还没有已发布的视频。
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
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
                  Curated published videos for emotional care, parent-child rituals,
                  and repeatable wellbeing practices. This preview is currently admin-only.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="grid gap-3 p-5 sm:grid-cols-3">
            <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-soft)] p-4">
              <p className="text-sm text-[var(--text-soft)]">Published Videos</p>
              <p className="mt-2 text-3xl font-semibold text-[var(--text)]">
                {videos.length}
              </p>
            </div>
            <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-soft)] p-4">
              <p className="text-sm text-[var(--text-soft)]">Current Category</p>
              <p className="mt-2 truncate text-2xl font-semibold text-[var(--text)]">
                {category === "all" ? "All" : category}
              </p>
            </div>
            <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-soft)] p-4">
              <p className="text-sm text-[var(--text-soft)]">Access</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--text)]">
                Admin
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="items-start">
            <div>
              <CardTitle>Category Filter</CardTitle>
              <CardDescription>
                Browse published videos by business content category.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <ButtonLink
                key={item}
                href={`/parentinglab/healingdaily/videos?category=${item}`}
                variant={item === category ? "primary" : "secondary"}
                size="sm"
              >
                {item === "all" ? "All Videos" : item}
              </ButtonLink>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-[var(--border)] bg-[var(--card-soft)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <Badge variant="outline">{selectedVideo.category}</Badge>
                <CardTitle className="mt-3 text-2xl sm:text-3xl">
                  {selectedVideo.title}
                </CardTitle>
                {selectedVideo.description && (
                  <CardDescription className="mt-2 max-w-3xl leading-6">
                    {selectedVideo.description}
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
              signedUrl={selectedVideo.signed_video_url}
              posterUrl={selectedVideo.signed_thumbnail_url}
              title={selectedVideo.title}
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-soft)] p-4">
                <p className="text-xs uppercase tracking-wide text-[var(--text-soft)]">
                  Category
                </p>
                <p className="mt-1 font-medium text-[var(--text)]">
                  {selectedVideo.category}
                </p>
              </div>
              <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-soft)] p-4">
                <p className="text-xs uppercase tracking-wide text-[var(--text-soft)]">
                  Duration
                </p>
                <p className="mt-1 font-medium text-[var(--text)]">
                  {formatDuration(selectedVideo.duration_seconds)}
                </p>
              </div>
              <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-soft)] p-4">
                <p className="text-xs uppercase tracking-wide text-[var(--text-soft)]">
                  Stream
                </p>
                <p className="mt-1 font-medium text-[var(--text)]">
                  R2 signed URL
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="items-start border-b border-[var(--border)] bg-[var(--card-soft)]">
            <div>
              <CardTitle>Published Library</CardTitle>
              <CardDescription>
                Select a video to preview it in the main player.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="max-h-[calc(100vh-260px)] space-y-3 overflow-y-auto p-3">
            {videos.map((video) => {
              const isActive = video.id === selectedVideo.id;

              return (
                <button
                  key={video.id}
                  type="button"
                  onClick={() => setSelectedVideoId(video.id)}
                  className={[
                    "grid w-full grid-cols-[104px_minmax(0,1fr)] gap-3 rounded-[var(--radius-sm)] border p-2 text-left transition",
                    isActive
                      ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                      : "border-[var(--border)] bg-[var(--bg-soft)] hover:border-[var(--primary)]",
                  ].join(" ")}
                >
                  <div className="aspect-video overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card)]">
                    {video.signed_thumbnail_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={video.signed_thumbnail_url}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-[var(--text-soft)]">
                        Video
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{video.category}</Badge>
                      <span className="text-xs text-[var(--text-soft)]">
                        {formatDuration(video.duration_seconds)}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm font-semibold leading-5 text-[var(--text)]">
                      {video.title}
                    </p>
                    {video.description && (
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--text-soft)]">
                        {video.description}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
