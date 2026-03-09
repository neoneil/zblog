import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function PostsPage() {
  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, published_at, created_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="mb-6 text-3xl font-bold">Posts</h1>
        <p>加载失败：{error.message}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold">Posts</h1>

      {!posts || posts.length === 0 ? (
        <p>还没有已发布的文章。</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <article key={post.id} className="rounded-lg border p-5">
              <h2 className="mb-2 text-2xl font-semibold">
                <Link href={`/posts/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </h2>

              <p className="mb-3 text-sm text-gray-500">
                {post.published_at
                  ? new Date(post.published_at).toLocaleDateString()
                  : "Unpublished"}
              </p>

              {post.excerpt && (
                <p className="mb-4 text-gray-700">{post.excerpt}</p>
              )}

              <Link
                href={`/posts/${post.slug}`}
                className="inline-block rounded border px-3 py-2 text-sm"
              >
                Read more
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}