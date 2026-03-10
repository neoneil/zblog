"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

export default function CreatePostForm() {
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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

    const { error } = await supabase.from("posts").insert({
      title,
      slug,
      excerpt: excerpt || null,
      content,
      status,
      author_id: user.id,
      published_at: status === "published" ? new Date().toISOString() : null,
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
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <input
        className="w-full rounded border px-3 py-2"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full rounded border px-3 py-2"
        placeholder="Excerpt"
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
        rows={3}
      />

      <textarea
        className="w-full rounded border px-3 py-2"
        // placeholder="Content"
        placeholder={`# Title

        ## Subtitle

        Write your markdown here...

        - item 1
        - item 2

        **bold**
        `}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={12}
      />

      <select
        className="rounded border px-3 py-2"
        value={status}
        onChange={(e) => setStatus(e.target.value as "draft" | "published")}
      >
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </select>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="rounded border px-4 py-2"
        >
          {loading ? "Saving..." : "Create Post"}
        </button>
      </div>

      {message && <p>{message}</p>}
    </form>
  );
}