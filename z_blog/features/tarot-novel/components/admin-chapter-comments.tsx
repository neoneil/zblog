"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { removeComment } from "@/app/tarot-novel/comment-actions";
import type { NovelComment } from "../lib/comments";
import CommentTime from "./comment-time";

export default function AdminChapterComments({ comments }: { comments: NovelComment[] }) {
  const [pending, startTransition] = useTransition();
  const [removed, setRemoved] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const visible = comments.filter((comment) => !removed.includes(comment.id));
  return <details className="rounded-[var(--radius-md)] border border-[var(--border)] p-4">
    <summary className="cursor-pointer font-semibold">编辑评论（{visible.length}）</summary>
    <p role="status" aria-live="polite">{message}</p>
    <div className="mt-4 grid gap-3">
      {!visible.length && <p>本章暂无评论。</p>}
      {visible.map((comment) => <Card key={comment.id}>
        <CardContent className="relative p-4 pr-16">
          <p className="break-words font-semibold">{comment.display_name}</p>
          <CommentTime value={comment.created_at} />
          <p className="mt-2 whitespace-pre-wrap break-words text-sm text-[var(--text-soft)]">{comment.body}</p>
          <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-2" title="删除评论" aria-label={`删除 ${comment.display_name} 的评论`} disabled={pending} onClick={() => {
            startTransition(async () => {
              setMessage("");
              try {
                if (!await removeComment(comment.id)) throw new Error();
                setRemoved((ids) => [...ids, comment.id]);
                router.refresh();
              } catch { setMessage("删除失败，请稍后重试。"); }
            });
          }}><X size={18} /></Button>
        </CardContent>
      </Card>)}
    </div>
  </details>;
}
