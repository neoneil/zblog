import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type PostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PostDetailPage({ params }: PostPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, content, published_at, created_at")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !post) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <article>
        <h1 className="mb-4 text-4xl font-bold">{post.title}</h1>

        <p className="mb-8 text-sm text-gray-500">
          {post.published_at
            ? new Date(post.published_at).toLocaleDateString()
            : new Date(post.created_at).toLocaleDateString()}
        </p>

        {post.excerpt && (
          <p className="mb-6 text-lg text-gray-700">{post.excerpt}</p>
        )}

        <div className="prose max-w-none whitespace-pre-wrap">
          {post.content}
        </div>
      </article>
    </main>
  );
}