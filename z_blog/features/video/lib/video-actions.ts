"use server";

import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";

const R2_BUCKET = process.env.CLOUDFLARE_R2_BUCKET ?? "videos";
const R2_PREFIX = "videos/";
const R2_THUMBNAIL_PREFIX = "videos/thumbnails/";
const SIGNED_URL_TTL = 60 * 60;

export type AdminVideoItem = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  video_url: string;
  video_path: string | null;
  thumbnail_url: string | null;
  thumbnail_path: string | null;
  duration_seconds: number | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  signed_video_url: string | null;
  signed_thumbnail_url: string | null;
};

type VideoRow = Omit<AdminVideoItem, "signed_video_url" | "signed_thumbnail_url">;

export type VideoUploadTarget = {
  key: string;
  uploadUrl: string;
  r2Url: string;
};

type VideoUploadTargetResult =
  | { ok: true; target: VideoUploadTarget }
  | { ok: false; error: string; target?: never };

function getR2Client() {
  const endpoint = process.env.CLOUDFLARE_R2_S3_API_ENDPOINT;
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error("Missing Cloudflare R2 S3 environment variables.");
  }

  return new S3Client({
    region: "auto",
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

function normalizeString(value: FormDataEntryValue | null) {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

function normalizeNumber(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
}

function slugify(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || `video-${Date.now()}`;
}

function getUploadKey(fileName: string, kind: "video" | "thumbnail") {
  const prefix = kind === "thumbnail" ? R2_THUMBNAIL_PREFIX : R2_PREFIX;
  return `${prefix}${Date.now()}-${sanitizeFileName(fileName)}`;
}

function getR2ResourceUrl(key: string) {
  return `r2://${R2_BUCKET}/${key}`;
}

async function createR2SignedUrl(key: string | null, contentType?: string | null) {
  if (!key) return null;

  const client = getR2Client();
  const command = new GetObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    ResponseContentType: contentType ?? undefined,
  });

  return getSignedUrl(client, command, { expiresIn: SIGNED_URL_TTL });
}

async function deleteR2Object(key: string | null) {
  if (!key) return;

  const client = getR2Client();
  await client.send(
    new DeleteObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
    }),
  );
}

export async function createVideoUploadTarget(
  fileName: string,
  contentType?: string,
  kind: "video" | "thumbnail" = "video",
): Promise<VideoUploadTargetResult> {
  await requireAdmin("/admin/videos");

  try {
    const key = getUploadKey(fileName, kind);
    const client = getR2Client();
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      ContentType: contentType || (kind === "thumbnail" ? "image/jpeg" : "video/mp4"),
    });
    const uploadUrl = await getSignedUrl(client, command, { expiresIn: SIGNED_URL_TTL });

    return {
      ok: true,
      target: {
        key,
        uploadUrl,
        r2Url: getR2ResourceUrl(key),
      },
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to prepare R2 upload.",
    };
  }
}

export async function createVideoRecord(formData: FormData) {
  const { supabase, user } = await requireAdmin("/admin/videos");
  const title = normalizeString(formData.get("title"));
  const videoPath = normalizeString(formData.get("videoPath"));
  const videoUrl = normalizeString(formData.get("videoUrl"));

  if (!title || !videoPath || !videoUrl) {
    return { ok: false, error: "Title and uploaded R2 video path are required." };
  }

  const { error } = await supabase.from("videos").insert({
    title,
    slug: normalizeString(formData.get("slug")) ?? slugify(title),
    description: normalizeString(formData.get("description")),
    category: normalizeString(formData.get("category")) ?? "general",
    storage_bucket: R2_BUCKET,
    storage_path: videoPath,
    video_url: videoUrl,
    video_path: videoPath,
    thumbnail_url: normalizeString(formData.get("thumbnailUrl")),
    thumbnail_path: normalizeString(formData.get("thumbnailPath")),
    duration_seconds: normalizeNumber(formData.get("durationSeconds")),
    sort_order: normalizeNumber(formData.get("sortOrder")) ?? 0,
    is_published: formData.get("isPublished") === "true",
    created_by: user.id,
    updated_by: user.id,
  });

  if (error) {
    await deleteR2Object(videoPath);
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin/videos");
  revalidatePath("/parentinglab/healingdaily/videos");
  return { ok: true };
}

export async function updateVideoMetadata(formData: FormData) {
  const { supabase } = await requireAdmin("/admin/videos");
  const id = normalizeString(formData.get("id"));

  if (!id) {
    return { ok: false, error: "Missing video id." };
  }

  const title = normalizeString(formData.get("title")) ?? "";
  const slug = normalizeString(formData.get("slug")) ?? slugify(title);

  const { error } = await supabase
    .from("videos")
    .update({
      title,
      slug,
      description: normalizeString(formData.get("description")),
      category: normalizeString(formData.get("category")) ?? "general",
      duration_seconds: normalizeNumber(formData.get("durationSeconds")),
      sort_order: normalizeNumber(formData.get("sortOrder")) ?? 0,
      is_published: formData.get("isPublished") === "true",
    })
    .eq("id", id);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin/videos");
  revalidatePath("/parentinglab/healingdaily/videos");
  return { ok: true };
}

export async function deleteVideo(videoId: string) {
  const { supabase } = await requireAdmin("/admin/videos");

  const { data: video, error: readError } = await supabase
    .from("videos")
    .select("id, video_path, thumbnail_path")
    .eq("id", videoId)
    .single();

  if (readError || !video) {
    return { ok: false, error: readError?.message ?? "Video not found." };
  }

  const { error: deleteError } = await supabase
    .from("videos")
    .delete()
    .eq("id", videoId);

  if (deleteError) {
    return { ok: false, error: deleteError.message };
  }

  await Promise.all([
    deleteR2Object(video.video_path),
    deleteR2Object(video.thumbnail_path),
  ]);

  revalidatePath("/admin/videos");
  revalidatePath("/parentinglab/healingdaily/videos");
  return { ok: true };
}

async function toVideoItem(video: VideoRow): Promise<AdminVideoItem> {
  return {
    ...video,
    signed_video_url: await createR2SignedUrl(video.video_path),
    signed_thumbnail_url: await createR2SignedUrl(video.thumbnail_path),
  };
}

export async function listAdminVideos(): Promise<AdminVideoItem[]> {
  const { supabase } = await requireAdmin("/admin/videos");
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return Promise.all(((data ?? []) as VideoRow[]).map(toVideoItem));
}

export async function listPublishedVideos(category?: string): Promise<AdminVideoItem[]> {
  const supabase = await createClient();
  let query = supabase
    .from("videos")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return Promise.all(((data ?? []) as VideoRow[]).map(toVideoItem));
}
