"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { usePreferences } from "@/components/site/preferences-provider";
import { Button, ButtonLink } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { publishComment, removeComment } from "@/app/tarot-novel/comment-actions";
import type { NovelComment } from "../lib/comments";
import CommentTime from "./comment-time";

export default function ReaderComments({ comments, chapterId, slug, commentCount = 0, signedIn = false, isAdmin = false }: { comments: NovelComment[]; chapterId?: string; slug?: string; commentCount?: number; signedIn?: boolean; isAdmin?: boolean }) {
  const { t } = usePreferences();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [used, setUsed] = useState(commentCount);
  const count = Math.max(used, commentCount);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  return <section className="mt-8 border-t border-[var(--border)] pt-6">
    <h2>{t({ zh: chapterId ? "章节评论" : "读者反馈", en: chapterId ? "Chapter comments" : "Reader Says" })}</h2>
    {chapterId && (signedIn ? <form ref={formRef} className="mb-8 grid gap-4" action={(form) => startTransition(async () => {
      if (count >= 3) return;
      setMessage("");
      try {
        const result = await publishComment(form);
        if (result === "limit") {
          setUsed(3);
          setMessage(t({ zh: "每位用户每章最多评论 3 条。", en: "You can post up to 3 comments per chapter." }));
          return;
        }
        setMessage(t(result === "ok" ? { zh: "评论已发布。", en: "Comment published." } : result === "login" ? { zh: "请先登录。", en: "Please sign in." } : result === "invalid" ? { zh: "请填写昵称和评论，评论最多 2000 字。", en: "Enter a name and a comment of up to 2,000 characters." } : { zh: "发布失败，请确认评论表已创建，或稍后再试（每分钟限一条）。", en: "Could not publish. Please try again later (one comment per minute)." }));
        if (result === "ok") { setUsed(count + 1); formRef.current?.reset(); router.refresh(); }
      } catch { setMessage(t({ zh: "发布失败，请稍后重试。", en: "Could not publish. Please try again." })); }
    })}>
      <input type="hidden" name="chapter_id" value={chapterId} />
      <label>{t({ zh: "评论", en: "Comment" })}<Textarea name="body" required maxLength={2000} /></label>
      <p>{t({ zh: `每章最多 3 条评论，剩余 ${Math.max(0, 3 - count)} 条。`, en: `Up to 3 comments per chapter. ${Math.max(0, 3 - count)} remaining.` })}</p>
      <Button type="submit" disabled={pending || count >= 3}>{t({ zh: pending ? "发布中…" : "发表评论", en: pending ? "Publishing…" : "Publish comment" })}</Button>
    </form> : <ButtonLink href={`/login?next=${encodeURIComponent(`/tarot-novel/${slug}`)}`} variant="secondary">{t({ zh: "登录后发表评论", en: "Sign in to comment" })}</ButtonLink>)}
    <p role="status" aria-live="polite">{message}</p>
    {!comments.length && <p>{t({ zh: "暂无评论。", en: "No comments yet." })}</p>}
    <div className="grid gap-5">
      {comments.map((comment) => <blockquote key={comment.id} className="border-b border-[var(--border)] py-4">
        <p className="whitespace-pre-wrap break-words">{comment.body}</p>
        <footer className="mt-3 flex flex-wrap items-center gap-3 text-sm"><span>{comment.display_name}</span>
          <CommentTime value={comment.created_at} />
          {isAdmin && <Button type="button" variant="ghost" size="icon" disabled={pending} aria-label={t({ zh: "删除评论", en: "Delete comment" })} title={t({ zh: "删除评论", en: "Delete comment" })} onClick={() => {
            if (!window.confirm(t({ zh: "确定删除此评论？", en: "Delete this comment?" }))) return;
            startTransition(async () => { try { if (await removeComment(comment.id)) router.refresh(); else throw new Error(); } catch { setMessage(t({ zh: "删除失败。", en: "Could not delete comment." })); } });
          }}><Trash2 size={16} /></Button>}
        </footer>
      </blockquote>)}
    </div>
  </section>;
}
