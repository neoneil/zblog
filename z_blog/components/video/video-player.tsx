"use client";

import { Card, CardContent } from "@/components/ui/card";

type VideoPlayerProps = {
  signedUrl: string | null;
  title: string;
  posterUrl?: string | null;
};

export default function VideoPlayer({
  signedUrl,
  title,
  posterUrl,
}: VideoPlayerProps) {
  if (!signedUrl) {
    return (
      <Card className="overflow-hidden bg-[var(--card-soft)]">
        <CardContent className="flex aspect-video items-center justify-center p-6 text-sm text-[var(--text-soft)]">
          Video unavailable
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden bg-[var(--card)]">
      <CardContent className="p-0">
        <video
          className="aspect-video w-full bg-[var(--bg)]"
          src={signedUrl}
          poster={posterUrl ?? undefined}
          title={title}
          controls
          controlsList="nodownload"
          disablePictureInPicture
          disableRemotePlayback
          onContextMenu={(event) => event.preventDefault()}
          preload="metadata"
        >
          <track kind="captions" />
        </video>
      </CardContent>
    </Card>
  );
}
