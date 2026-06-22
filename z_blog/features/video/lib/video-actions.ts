"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";

const VIDEO_BUCKET = "zblog";
const VIDEO_PREFIX = "video/";
const SIGNED_URL_TTL = 60 * 60;

export type AdminVideoItem = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  storage_bucket: string;
  storage_path: string;
  video_url: string | null;
  thumbnail_url: string | null;
  duration_seconds: number | null;
  file_size: number | null;
  mime_type: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string | null;
  signed_video_url: string | null;
  signed_thumbnail_url: string | null;
};

type VideoRow = Omit<AdminVideoItem, "signed_video_url" | "signed_thumbnail_url">;

export type VideoUploadTarget = {
  path: string;
  token: string;
};

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

function getVideoPath(fileName: string) {
  return `${VIDEO_PREFIX}${Date.now()}-${sanitizeFileName(fileName)}`;
}

async function createSignedUrl(path: string | null) {
  if (!path) return null;

  const supabase = await createClient();
  const { data } = await supabase.storage
    .from(VIDEO_BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL);

  return data?.signedUrl ?? null;
}

export async function getVideoSignedUrl(path: string) {
  return createSignedUrl(path);
}

export async function createVideoUploadTarget(fileName: string) {
  const { supabase } = await requireAdmin("/admin/videos");
  const path = getVideoPath(fileName);

  const { data, error } = await supabase.storage
    .from(VIDEO_BUCKET)
    .createSignedUploadUrl(path);

  if (error || !data) {
    return {
      ok: false,
      error: error?.message ?? "Failed to create upload URL.",
    };
  }

  return {
    ok: true,
    target: {
      path,
      token: data.token,
    } satisfies VideoUploadTarget,
  };
}

export async function createVideoRecord(formData: FormData) {
  const { supabase, user } = await requireAdmin("/admin/videos");
  const title = normalizeString(formData.get("title"));
  const storagePath = normalizeString(formData.get("storagePath"));

  if (!title || !storagePath) {
    return { ok: false, error: "Title and uploaded video path are required." };
  }

  const { error } = await supabase.from("videos").insert({
    title,
    description: normalizeString(formData.get("description")),
    category: normalizeString(formData.get("category")) ?? "general",
    storage_bucket: VIDEO_BUCKET,
    storage_path: storagePath,
    file_size: normalizeNumber(formData.get("fileSize")),
    mime_type: normalizeString(formData.get("mimeType")),
    sort_order: normalizeNumber(formData.get("sortOrder")) ?? 0,
    is_published: formData.get("isPublished") === "true",
    created_by: user.id,
    updated_by: user.id,
  });

  if (error) {
    await supabase.storage.from(VIDEO_BUCKET).remove([storagePath]);
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin/videos");
  revalidatePath("/parentinglab/healingdaily/videos");
  return { ok: true };
}

export async function updateVideoMetadata(formData: FormData) {
  const { supabase, user } = await requireAdmin("/admin/videos");
  const id = normalizeString(formData.get("id"));

  if (!id) {
    return { ok: false, error: "Missing video id." };
  }

  const { error } = await supabase
    .from("videos")
    .update({
      title: normalizeString(formData.get("title")) ?? "",
      description: normalizeString(formData.get("description")),
      category: normalizeString(formData.get("category")) ?? "general",
      sort_order: normalizeNumber(formData.get("sortOrder")) ?? 0,
      is_published: formData.get("isPublished") === "true",
      updated_by: user.id,
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
    .select("id, storage_path, thumbnail_url")
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

  const paths = [video.storage_path, video.thumbnail_url].filter(Boolean) as string[];
  if (paths.length > 0) {
    await supabase.storage.from(VIDEO_BUCKET).remove(paths);
  }

  revalidatePath("/admin/videos");
  revalidatePath("/parentinglab/healingdaily/videos");
  return { ok: true };
}

async function toVideoItem(video: VideoRow): Promise<AdminVideoItem> {
  return {
    ...video,
    sort_order: video.sort_order ?? 0,
    signed_video_url: await createSignedUrl(video.storage_path),
    signed_thumbnail_url: await createSignedUrl(video.thumbnail_url),
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
