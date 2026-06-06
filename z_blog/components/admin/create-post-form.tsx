"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u4e00-\u9fa5-]+/g, "")
    .replace(/--+/g, "-");
}
type PostCategory =
  | "Understanding Children"
  | "Teaching Practice"
  | "Family Education"
  | "Teacher Reflection";
export default function CreatePostForm() {
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [cover, setCover] = useState<File | null>(null);
  const [category, setCategory] = useState<PostCategory>("Understanding Children");
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setMessage("请先登录");
      setLoading(false);
      return;
    }

    const slug = slugify(title);

    if (!slug) {
      setMessage("标题无法生成链接标识");
      setLoading(false);
      return;
    }

    let coverUrl = null;

    if (cover) {
      const cleanName = cover.name.replace(/\s+/g, "-");
      const filename = `${Date.now()}-${cleanName}`;

      const { error } = await supabase.storage
        .from("images")
        .upload(filename, cover, {
          contentType: cover.type,
        });

      if (!error) {
        const { data } = supabase.storage
          .from("images")
          .getPublicUrl(filename);

        coverUrl = data.publicUrl;
      }
    }



    const { error } = await supabase.from("posts").insert({
      title,
      slug,
      excerpt: excerpt || null,
      content,
      status,
      author_id: user.id,
      cover_image: coverUrl,
      published_at: status === "published" ? new Date().toISOString() : null,
      category
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage("文章创建成功");
    setTitle("");
    setExcerpt("");
    setContent("");
    setStatus("draft");
    setCategory("Understanding Children");
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <input
        className="w-full rounded border px-3 py-2"
        placeholder="标题"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full rounded border px-3 py-2"
        placeholder="摘要"
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
        rows={3}
      />

      <textarea
        className="w-full rounded border px-3 py-2"
        // placeholder="Content"
        placeholder={`# 标题

        ## 副标题

        在这里编写 Markdown 内容...

        - 条目 1
        - 条目 2

        **加粗文字**
        `}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={12}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setCover(e.target.files?.[0] ?? null)}
      />
      <select
        name="category"
        value={category}
        onChange={(e) => setCategory(e.target.value as "Understanding Children" | "Teaching Practice" | "Family Education" | "Teacher Reflection")}
        className="border rounded px-3 py-2"
      >
        <option value="Understanding Children">理解儿童</option>
        <option value="Teaching Practice">教学实践</option>
        <option value="Family Education">家庭教育</option>
        <option value="Teacher Reflection">教师反思</option>
      </select>

      <select
        className="rounded border px-3 py-2"
        value={status}
        onChange={(e) => setStatus(e.target.value as "draft" | "published")}
      >
        <option value="draft">草稿</option>
        <option value="published">已发布</option>
      </select>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="rounded border px-4 py-2"
        >
          {loading ? "保存中..." : "创建文章"}
        </button>
      </div>

      {message && <p>{message}</p>}
    </form>
  );
}
