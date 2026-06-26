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

type UploadMessage = {
  type: "info" | "success" | "error";
  text: string;
};

function getMetadataFormData(form: HTMLFormElement) {
  const rawFormData = new FormData(form);
  const formData = new FormData();

  for (const [key, value] of rawFormData.entries()) {
    if (typeof value === "string") {
      formData.set(key, value);
    }
  }

  return formData;
}

function uploadFileToR2(
  uploadUrl: string,
  file: File,
  onProgress: (progress: number) => void,
) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        resolve();
        return;
      }

      reject(new Error(`R2 返回 ${xhr.status} ${xhr.statusText || "上传失败"}`));
    };

    xhr.onerror = () => {
      reject(
        new Error(
          "浏览器无法连接 R2。通常是 R2 bucket CORS 没有允许当前域名的 PUT/OPTIONS，或 R2 endpoint/bucket 配置不正确。",
        ),
      );
    };

    xhr.send(file);
  });
}

export default function AdminVideosClient({ videos }: AdminVideosClientProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<UploadMessage | null>(null);
  const [progress, setProgress] = useState(0);
  const [isPending, startTransition] = useTransition();

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setProgress(0);

    const form = event.currentTarget;
    const formData = getMetadataFormData(form);
    const file = fileInputRef.current?.files?.[0];
    const thumbnail = thumbnailInputRef.current?.files?.[0];

    if (!file) {
      setMessage({ type: "error", text: "请选择要上传的视频文件。" });
      return;
    }

    startTransition(async () => {
      setMessage({ type: "info", text: "正在准备 R2 上传地址..." });
      const targetResult = await createVideoUploadTarget(file.name, file.type, "video");

      if (!targetResult.ok || !targetResult.target) {
        setMessage({
          type: "error",
          text: `上传准备失败：${targetResult.error ?? "无法生成 R2 上传地址。"}`,
        });
        return;
      }

      try {
        setMessage({ type: "info", text: "正在上传视频..." });
        await uploadFileToR2(targetResult.target.uploadUrl, file, (value) => {
          setProgress(thumbnail ? Math.round(value * 0.75) : value);
        });
      } catch (error) {
        setMessage({
          type: "error",
          text: `视频上传失败：${error instanceof Error ? error.message : "未知错误。"}`,
        });
        return;
      }

      formData.set("videoPath", targetResult.target.key);
      formData.set("videoUrl", targetResult.target.r2Url);

      if (thumbnail) {
        setMessage({ type: "info", text: "正在上传封面图..." });
        const thumbnailTarget = await createVideoUploadTarget(
          thumbnail.name,
          thumbnail.type,
          "thumbnail",
        );

        if (!thumbnailTarget.ok || !thumbnailTarget.target) {
          setMessage({
            type: "error",
            text: `封面上传准备失败：${thumbnailTarget.error ?? "无法生成 R2 上传地址。"}`,
          });
          return;
        }

        try {
          await uploadFileToR2(thumbnailTarget.target.uploadUrl, thumbnail, (value) => {
            setProgress(75 + Math.round(value * 0.25));
          });
        } catch (error) {
          setMessage({
            type: "error",
            text: `封面上传失败：${error instanceof Error ? error.message : "未知错误。"}`,
          });
          return;
        }

        formData.set("thumbnailPath", thumbnailTarget.target.key);
        formData.set("thumbnailUrl", thumbnailTarget.target.r2Url);
      }

      formData.set("isPublished", formData.get("isPublished") ? "true" : "false");

      setMessage({ type: "info", text: "正在写入数据库..." });
      const result = await createVideoRecord(formData);
      setMessage(
        result.ok
          ? { type: "success", text: "上传成功，视频已保存。" }
          : { type: "error", text: `保存失败：${result.error ?? "数据库写入失败。"}` },
      );

      if (result.ok) {
        setProgress(100);
        form.reset();
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        if (thumbnailInputRef.current) {
          thumbnailInputRef.current.value = "";
        }
      }
    });
  }

  function handleUpdate(formData: FormData) {
    setMessage(null);
    startTransition(async () => {
      formData.set("isPublished", formData.get("isPublished") ? "true" : "false");
      const result = await updateVideoMetadata(formData);
      setMessage(
        result.ok
          ? { type: "success", text: "视频信息已更新。" }
          : { type: "error", text: `更新失败：${result.error ?? "未知错误。"}` },
      );
    });
  }

  function handleDelete(videoId: string) {
    setMessage(null);
    startTransition(async () => {
      const result = await deleteVideo(videoId);
      setMessage(
        result.ok
          ? { type: "success", text: "视频已删除。" }
          : { type: "error", text: `删除失败：${result.error ?? "未知错误。"}` },
      );
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div>
            <Badge variant="secondary">Upload</Badge>
            <CardTitle className="mt-3">上传视频</CardTitle>
            <CardDescription>
              填写基础信息后上传素材。视频文件用于播放，封面图用于前台展示预览。
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {message && (
            <p
              className={[
                "mb-4 rounded-[var(--radius-md)] border px-3 py-2 text-sm",
                message.type === "success"
                  ? "border-[var(--success)] bg-[var(--success-soft)] text-[var(--success)]"
                  : message.type === "error"
                    ? "border-[var(--danger)] bg-[var(--danger-soft)] text-[var(--danger)]"
                    : "border-[var(--border)] bg-[var(--bg-soft)] text-[var(--text-soft)]",
              ].join(" ")}
            >
              {message.text}
            </p>
          )}

          {isPending && (
            <div className="mb-4 overflow-hidden rounded-full bg-[var(--bg-soft)]">
              <div
                className="h-2 rounded-full bg-[var(--primary)] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          <form onSubmit={handleCreate} className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="space-y-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--text)]">
                  视频标题
                </label>
                <Input name="title" placeholder="例如：每日疗愈练习 01" required />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--text)]">
                  分类
                </label>
                <Input name="category" placeholder="general" defaultValue="general" required />
              </div>

              <label className="flex items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2 text-sm text-[var(--text-soft)]">
                <input name="isPublished" type="checkbox" className="h-4 w-4" />
                上传后立即发布到前台
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card-soft)] p-4">
                <div className="mb-3">
                  <p className="text-sm font-semibold text-[var(--text)]">
                    1. 视频文件
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[var(--text-soft)]">
                    必填。选择要播放的 MP4、MOV 或其他视频文件。
                  </p>
                </div>
                <Input ref={fileInputRef} type="file" accept="video/*" required />
              </div>

              <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card-soft)] p-4">
                <div className="mb-3">
                  <p className="text-sm font-semibold text-[var(--text)]">
                    2. 封面图 Thumbnail
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[var(--text-soft)]">
                    可选。用于视频列表和播放器加载前的预览图。
                  </p>
                </div>
                <Input ref={thumbnailInputRef} type="file" accept="image/*" />
              </div>

              <div className="sm:col-span-2">
              <Button type="submit" disabled={isPending}>
                {isPending ? `上传中 ${progress}%` : "上传视频"}
              </Button>
              </div>
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
                  <CardDescription>{video.video_path}</CardDescription>
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
                <Input name="slug" defaultValue={video.slug} required />
                <Input name="category" defaultValue={video.category} required />
                <Input name="sortOrder" type="number" defaultValue={video.sort_order} />
                <Input
                  name="durationSeconds"
                  type="number"
                  defaultValue={video.duration_seconds ?? ""}
                />
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
