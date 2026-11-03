"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { saveWelcome } from "@/app/admin/newsletter/actions";
import type { WelcomeTemplate } from "../lib/template";
export default function WelcomeEditor({ template }: { template: WelcomeTemplate }) {
  const [message, setMessage] = useState(""), [pending, startTransition] = useTransition();
  const router = useRouter();
  return <form className="grid gap-5" action={(form) => startTransition(async () => {
    try { const result = await saveWelcome(form); setMessage(result); if (result === "保存成功") router.refresh(); } catch { setMessage("保存失败，请稍后重试。"); }
  })}>
    <div className="grid gap-6 md:grid-cols-2">{(["zh", "en"] as const).map((lang) => <fieldset key={lang} className="grid gap-4"><legend>{lang === "zh" ? "中文邮件" : "English email"}</legend>
      <label>邮件主题<Input name={`subject_${lang}`} defaultValue={template[`subject_${lang}`]} required /></label>
      <label>标题<Input name={`heading_${lang}`} defaultValue={template[`heading_${lang}`]} required /></label>
      <label>正文<Textarea name={`body_${lang}`} defaultValue={template[`body_${lang}`]} rows={8} required /></label>
      <label>星盘入口按钮文字<Input name={`button_${lang}`} defaultValue={template[`button_${lang}`]} required /></label>
    </fieldset>)}</div>
    <label>星盘按钮链接<Input name="button_url" defaultValue={template.button_url} required /></label>
    <label>上传图片（PNG / JPEG / WebP，最多 750KB）<Input type="file" name="image" accept="image/png,image/jpeg,image/webp" /></label>
    <label>图片网址（也可填写已有图片的 HTTPS URL 或站内路径；留空可移除图片）<Input name="image_url" defaultValue={template.image_url} /></label>
    <label>点击图片跳转网址<Input name="image_link" defaultValue={template.image_link} /></label>
    <Button type="submit" disabled={pending}>{pending ? "保存中…" : "保存欢迎邮件"}</Button>
    <p role="status">{message}</p>
  </form>;
}
