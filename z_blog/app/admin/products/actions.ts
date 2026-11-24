"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { imageBucket } from "@/features/services/lib/physical-products";

export type ProductActionResult = { ok: boolean; message: string };

function productPaths(slug: string) {
  revalidatePath("/admin/products");
  revalidatePath("/services");
  revalidatePath(`/services/${slug}`);
  revalidatePath("/cart");
}

export async function savePhysicalProduct(form: FormData): Promise<ProductActionResult> {
  await requireAdmin("/admin/products");
  const db = createAdminClient();
  const read = (name: string) => String(form.get(name) ?? "").trim();
  const original = read("slug");
  const slug = original || `physical-${randomUUID()}`;
  const version = read("version");
  if (original && (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(original) || !version)) {
    return { ok: false, message: "商品记录无效，请刷新页面。" };
  }
  const amount = read("price_aud");
  const priceCents = /^\d{1,7}(?:\.\d{1,2})?$/.test(amount) ? Math.round(Number(amount) * 100) : NaN;
  const descriptionZh = read("description_zh");
  const descriptionEn = read("description_en");
  if (descriptionZh.length > 5000 || descriptionEn.length > 5000) {
    return { ok: false, message: "每种语言的产品介绍最多 5000 字符。" };
  }
  const values = {
    title_zh: read("title_zh"), title_en: read("title_en"),
    subtitle_zh: read("subtitle_zh"), subtitle_en: read("subtitle_en"),
    price_stars: priceCents,
    ...(form.has("description_zh") && { description_zh: descriptionZh }),
    ...(form.has("description_en") && { description_en: descriptionEn }),
  };
  if (![values.title_zh, values.title_en].every((value) => value && value.length <= 120) ||
      ![values.subtitle_zh, values.subtitle_en].every((value) => value && value.length <= 500) ||
      !Number.isSafeInteger(values.price_stars) || values.price_stars < 1 || values.price_stars > 100000000) {
    return { ok: false, message: "请填写双语标题、副标题和有效的 AUD 价格（最多两位小数）。" };
  }

  const file = form.get("image");
  const bucket = db.storage.from(imageBucket);
  let uploaded: string | undefined;
  const fail = async (message: string) => {
    if (uploaded) await bucket.remove([uploaded]).catch(() => undefined);
    return { ok: false, message };
  };
  try {
    let image: string | undefined;
    if (file instanceof File && file.size > 0) {
      if (file.size > 5 * 1024 * 1024) return { ok: false, message: "图片不能超过 5 MB。" };
      const bytes = Buffer.from(await file.arrayBuffer());
      const format = bytes.subarray(0, 8).toString("hex") === "89504e470d0a1a0a" ? "png"
        : bytes.subarray(0, 3).toString("hex") === "ffd8ff" ? "jpeg"
        : bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP" ? "webp" : null;
      if (!format) return { ok: false, message: "仅支持 PNG、JPEG 或 WebP 图片。" };
      const path = `${slug}/${randomUUID()}.${format}`;
      const { error } = await bucket.upload(path, bytes, { contentType: `image/${format}`, cacheControl: "3600", upsert: false });
      if (error) return { ok: false, message: "图片上传失败，请检查商品图片存储配置。" };
      uploaded = path;
      image = bucket.getPublicUrl(path).data.publicUrl;
    }
    if (!original && !image) return { ok: false, message: "新增商品需要上传图片。" };
    const table = db.from("physical_products");
    const row = { ...values, ...(image ? { image } : {}), updated_at: new Date().toISOString() };
    const result = original
      ? await table.update(row).eq("slug", slug).eq("updated_at", version).eq("archived", false).select("slug").maybeSingle()
      : await table.insert({ ...row, slug, image }).select("slug").single();
    // A lost response may follow a committed write. Keep the image if the outcome is uncertain.
    if (result.error?.code === "PGRST204" && /description_(zh|en)/.test(result.error.message)) {
      return fail("请先执行产品介绍 SQL，再保存商品。");
    }
    if (result.error) return { ok: false, message: "商品保存状态无法确认，请刷新商品列表后再重试。" };
    if (!result.data) return fail("商品刚被修改或删除，请刷新后重试。");
  } catch {
    return { ok: false, message: "商品保存状态无法确认，请刷新商品列表后再重试。" };
  }
  productPaths(slug);
  return { ok: true, message: "商品已保存。" };
}

export async function archivePhysicalProduct(form: FormData): Promise<ProductActionResult> {
  await requireAdmin("/admin/products");
  const slug = String(form.get("slug") ?? "");
  const version = String(form.get("version") ?? "");
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) || !version) return { ok: false, message: "商品记录无效。" };
  const { data, error } = await createAdminClient().from("physical_products")
    .update({ archived: true, updated_at: new Date().toISOString() })
    .eq("slug", slug).eq("updated_at", version).eq("archived", false).select("slug").maybeSingle();
  if (error || !data) return { ok: false, message: "未能删除，请刷新商品记录后重试。" };
  productPaths(slug);
  return { ok: true, message: "商品已从商店移除。" };
}
