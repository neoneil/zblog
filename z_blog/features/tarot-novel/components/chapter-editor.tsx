"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveChapter, deleteChapter } from "@/app/admin/novel/actions";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { NovelChapter } from "../lib/chapters";
import type { NovelComment } from "../lib/comments";
import AdminChapterComments from "./admin-chapter-comments";
import { novelTitle } from "../lib/novel-world";

export default function ChapterEditor({ chapter, comments = [] }: { chapter?: NovelChapter; comments?: NovelComment[] }) {
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  return <form className="grid gap-5" action={(form) => startTransition(async () => {
    setMessage("");
    try { const result = await saveChapter(form); setMessage(result); if (result === "保存成功") router.refresh(); }
    catch { setMessage("保存失败，请稍后重试。"); }
  })}>
    <input type="hidden" name="id" value={chapter?.id ?? ""} />
    <label>章节编号<Input name="chapter_number" type="number" min={1} max={10000} defaultValue={chapter?.chapter_number ?? 1} required /></label>
    <label>链接标识（如 chapter-1，发布后建议保持不变）<Input name="slug" pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={120} defaultValue={chapter?.slug ?? ""} required /></label>
    <div className="grid gap-5 sm:grid-cols-2">
      {(["zh", "en"] as const).map((lang) => <div key={lang} className="grid gap-5">
        <label>{lang === "zh" ? "中文主标题" : "英文主标题"}<Input name={`title_${lang}`} maxLength={300} defaultValue={chapter?.[`title_${lang}`] ?? novelTitle[lang]} required /></label>
        <label>{lang === "zh" ? "中文副标题 / 章节名称" : "英文副标题 / Chapter title"}<Input name={`subtitle_${lang}`} maxLength={300} defaultValue={chapter?.[`subtitle_${lang}`] ?? ""} required /></label>
        <label>{lang === "zh" ? "中文正文" : "英文正文"}<Textarea name={`content_${lang}`} rows={18} maxLength={200000} defaultValue={chapter?.[`content_${lang}`] ?? ""} /></label>
      </div>)}
    </div>
    <label>YouTube 视频链接（可选）<Input name="youtube_url" type="url" defaultValue={chapter?.youtube_url ?? ""} /></label>
    <label className="flex items-center gap-3"><input type="checkbox" name="status" value="published" defaultChecked={chapter?.status === "published"} />发布（不选则保存为草稿）</label>
    <input type="hidden" name="status" value="draft" />
    <Button type="submit" disabled={pending}>{pending ? "保存中…" : "保存章节"}</Button>
    {chapter && <AdminChapterComments comments={comments} />}
    {chapter && <Button type="button" variant="danger" disabled={pending} onClick={() => {
      if (!window.confirm("确定永久删除本章节及其所有评论？此操作无法撤销。")) return;
      startTransition(async () => {
        try {
          const result = await deleteChapter(chapter.id);
          setMessage(result);
          if (result === "删除成功") { router.replace("/admin/novel"); router.refresh(); }
        } catch { setMessage("删除失败，请稍后重试。"); }
      });
    }}><Trash2 size={16} className="mr-2" />删除章节</Button>}
    <p role="status" aria-live="polite">{message}</p>
  </form>;
}
