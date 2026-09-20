import Link from "next/link";
import { PageHero, PageSection, PageShell } from "@/components/site/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/server";

type PostsPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const { q } = await searchParams;
  const keyword = q?.trim() ?? "";

  const supabase = await createClient();

  let query = supabase
    .from("posts")
    .select("id, title, slug, excerpt, cover_image, published_at, created_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (keyword) {
    query = query.or(
      `title.ilike.%${keyword}%,excerpt.ilike.%${keyword}%,content.ilike.%${keyword}%`
    );
  }

  const { data: posts, error } = await query;

  return (
    <PageShell>
      <PageHero
        eyebrow="Posts"
        title="文章"
        description="阅读站内已发布内容，支持按标题、摘要和正文关键词搜索。"
      >
        <form action="/posts" className="flex flex-col gap-3 sm:flex-row">
          <Input
            type="text"
            name="q"
            defaultValue={keyword}
            placeholder="搜索文章..."
            className="bg-[var(--card)]"
          />
          <Button type="submit" variant="primary" className="sm:w-28">
            搜索
          </Button>
        </form>
      </PageHero>

      <PageSection className="pt-0">
        {keyword ? (
          <p className="mb-6 text-sm text-[var(--text-soft)]">
            搜索结果：
            <span className="font-medium text-[var(--text)]">{keyword}</span>
          </p>
        ) : null}

        {error ? (
          <Card>
            <CardContent className="p-6 text-sm text-[var(--danger)]">
              加载失败：{error.message}
            </CardContent>
          </Card>
        ) : !posts || posts.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-sm text-[var(--text-soft)]">
              没有找到文章。
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <article key={post.id}>
                <Link href={`/posts/${post.slug}`} className="group block h-full">
                  <Card className="h-full overflow-hidden bg-[var(--card)] hover:-translate-y-1 hover:shadow-[var(--shadow-md)]">
                    {post.cover_image ? (
                      <div className="aspect-video overflow-hidden border-b border-[var(--border)] bg-[var(--bg-soft)]">
                        {/* eslint-disable-next-line @next/next/no-img-element -- Post covers can be user-provided remote URLs outside configured Next image hosts. */}
                        <img
                          src={post.cover_image}
                          alt={post.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : null}

                    <CardContent className="p-5">
                      <Badge variant="secondary">
                        {post.published_at
                          ? new Date(post.published_at).toLocaleDateString()
                          : new Date(post.created_at).toLocaleDateString()}
                      </Badge>
                      <h2 className="mt-4 text-xl font-semibold text-[var(--text)] transition group-hover:text-[var(--primary)]">
                        {post.title}
                      </h2>
                      {post.excerpt ? (
                        <p className="mt-3 text-sm leading-6 text-[var(--text-soft)]">
                          {post.excerpt}
                        </p>
                      ) : null}
                      <p className="mt-5 text-sm font-semibold text-[var(--primary)]">
                        阅读更多 →
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </article>
            ))}
          </div>
        )}
      </PageSection>
    </PageShell>
  );
}
