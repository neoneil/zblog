"use server";
import { randomUUID } from "node:crypto";
import { requireAdmin } from "@/lib/auth/require-admin";
import { defaultTemplate, safeLink, type WelcomeTemplate } from "@/features/newsletter/lib/template";
import { revalidatePath } from "next/cache";
export async function saveWelcome(form: FormData) {
  const { supabase } = await requireAdmin("/admin/newsletter");
  const template = { ...defaultTemplate };
  for (const key of Object.keys(template) as (keyof WelcomeTemplate)[]) {
    const value = String(form.get(key) ?? "").trim();
    if (value.length > (key.startsWith("body_") ? 10000 : 2000)) return "内容过长。";
    template[key] = value;
  }
  for (const key of ["subject_zh", "subject_en", "heading_zh", "heading_en", "body_zh", "body_en", "button_zh", "button_en"] as const) if (!template[key]) return "请填写中英文邮件内容。";
  if (/[\r\n]/.test(template.subject_zh + template.subject_en)) return "邮件主题不可换行。";
  if (!safeLink(template.button_url) || (template.image_link && !safeLink(template.image_link)) || (template.image_url && !safeLink(template.image_url))) return "网址请使用 HTTPS 或以 / 开头的站内路径。";
  const image = form.get("image");
  if (image instanceof File && image.size) {
    const ext = ({ "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" } as Record<string, string>)[image.type];
    if (!ext || image.size > 750 * 1024) return "图片须为 PNG、JPEG 或 WebP，且不超过 750KB。";
    const path = `newsletter/${randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("images").upload(path, image, { contentType: image.type });
    if (error) return "图片上传失败，请检查现有 images 存储桶权限。";
    template.image_url = supabase.storage.from("images").getPublicUrl(path).data.publicUrl;
  }
  const { error } = await supabase.from("newsletter_settings").upsert({ id: 1, template });
  if (error) return "保存失败，请先执行 Newsletter SQL。";
  revalidatePath("/admin/newsletter");
  return "保存成功";
}
