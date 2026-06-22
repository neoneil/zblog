"use client";

import { FormEvent, useRef, useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import VideoPlayer from "@/components/video/video-player";
import { createClient } from "@/lib/supabase/client";
import {
  createVideoRecord,
  createVideoUploadTarget,
  deleteVideo,
  updateVideoMetadata,
  type AdminVideoItem,
} from "@/features/video/lib/video-actions";

type AdminVideosClientProps = {
  videos: AdminVideoItem[];
};

function getFileMeta(file: File) {
  return {
    fileSize: String(file.size),
    mimeType: file.type || "video/mp4",
  };
}

export default function AdminVideosClient({ videos }: AdminVideosClientProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      setMessage("Please choose a video file.");
      return;
    }

    startTransition(async () => {
      const targetResult = await createVideoUploadTarget(file.name);

      if (!targetResult.ok || !targetResult.target) {
        setMessage(targetResult.error ?? "Failed to prepare upload.");
        return;
      }

      const supabase = createClient();
      const { error: uploadError } = await supabase.storage
        .from("zblog")
        .uploadToSignedUrl(
          targetResult.target.path,
          targetResult.target.token,
          file,
        );

      if (uploadError) {
        setMessage(uploadError.message);
        return;
      }

      const meta = getFileMeta(file);
      formData.set("storagePath", targetResult.target.path);
      formData.set("fileSize", meta.fileSize);
      formData.set("mimeType", meta.mimeType);
      formData.set("isPublished", formData.get("isPublished") ? "true" : "false");

      const result = await createVideoRecord(formData);
      setMessage(result.ok ? "Video uploaded." : result.error ?? "Upload failed.");

      if (result.ok) {
        form.reset();
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    });
  }

  function handleUpdate(formData: FormData) {
    setMessage(null);
    startTransition(async () => {
      formData.set("isPublished", formData.get("isPublished") ? "true" : "false");
      const result = await updateVideoMetadata(formData);
      setMessage(result.ok ? "Video updated." : result.error ?? "Update failed.");
    });
  }

  function handleDelete(videoId: string) {
    setMessage(null);
    startTransition(async () => {
      const result = await deleteVideo(videoId);
      setMessage(result.ok ? "Video deleted." : result.error ?? "Delete failed.");
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div>
            <Badge variant="secondary">Upload</Badge>
            <CardTitle className="mt-3">New Video</CardTitle>
            <CardDescription>
              Upload private videos to zblog/video and save metadata.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {message && (
            <p className="mb-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2 text-sm text-[var(--text-soft)]">
              {message}
            </p>
          )}

          <form onSubmit={handleCreate} className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-3">
              <Input name="title" placeholder="Title" required />
              <Input name="category" placeholder="Category" defaultValue="general" required />
              <Textarea name="description" placeholder="Description" />
            </div>

            <div className="space-y-3">
              <Input name="sortOrder" type="number" placeholder="Sort order" defaultValue={0} />
              <Input ref={fileInputRef} type="file" accept="video/*" required />
              <label className="flex items-center gap-2 text-sm text-[var(--text-soft)]">
                <input name="isPublished" type="checkbox" className="h-4 w-4" />
                Published
              </label>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Upload Video"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-5">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden">
            <CardHeader className="border-b border-[var(--border)] bg-[var(--card-soft)]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={video.is_published ? "success" : "warning"}>
                      {video.is_published ? "Published" : "Draft"}
                    </Badge>
                    <Badge variant="outline">{video.category}</Badge>
                  </div>
                  <CardTitle className="mt-3">{video.title}</CardTitle>
                  <CardDescription>{video.storage_path}</CardDescription>
                </div>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  disabled={isPending}
                  onClick={() => handleDelete(video.id)}
                >
                  Delete
                </Button>
              </div>
            </CardHeader>

            <CardContent className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_360px]">
              <form action={handleUpdate} className="space-y-3">
                <input type="hidden" name="id" value={video.id} />
                <Input name="title" defaultValue={video.title} required />
                <Input name="category" defaultValue={video.category} required />
                <Input name="sortOrder" type="number" defaultValue={video.sort_order} />
                <Textarea name="description" defaultValue={video.description ?? ""} />
                <label className="flex items-center gap-2 text-sm text-[var(--text-soft)]">
                  <input
                    name="isPublished"
                    type="checkbox"
                    className="h-4 w-4"
                    defaultChecked={video.is_published}
                  />
                  Published
                </label>
                <Button type="submit" disabled={isPending}>
                  Save Metadata
                </Button>
              </form>

              <VideoPlayer
                signedUrl={video.signed_video_url}
                posterUrl={video.signed_thumbnail_url}
                title={video.title}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
