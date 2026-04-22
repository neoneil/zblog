import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import Container from "@/components/site/container";

const readerNotes = [
  {
    quote:
      "Beautiful insight. It helped me understand my son with much more patience.",
    author: "Emma, Parent",
  },
  {
    quote:
      "This space feels warm, thoughtful, and deeply reassuring for families.",
    author: "Lily, Educator",
  },
  {
    quote:
      "So practical and gentle. I always leave with one useful idea to try at home.",
    author: "Sarah, Mother of Two",
  },
  {
    quote:
      "The writing is calm and clear, with a lovely sense of wisdom behind it.",
    author: "Olivia, Teacher",
  },
];

export default async function Family() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    role = profile?.role ?? null;
  }

  const canManagePosts = role === "admin" || role === "editor";

  const { data: posts } = await supabase
    .from("posts")
    .select("title, slug, excerpt, published_at, cover_image")
    .eq("status", "published")
    .eq("category", "Family Education")
    .order("published_at", { ascending: false });

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="relative z-10 pt-4 pb-10 sm:pt-6 sm:pb-12 lg:pt-8 lg:pb-14">
        <Container>
          {/* HERO */}
          <section className="mb-10 sm:mb-12">
            <div className="relative overflow-hidden rounded-[2rem] shadow-2xl">
              <div
                className="absolute inset-0"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)",
                  WebkitMaskComposite: "source-in",
                  maskImage:
                    "linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)",
                  maskComposite: "intersect",
                }}
              >
                <Image
                  src="/hero.png"
                  alt="Hero background"
                  fill
                  priority
                  className="object-cover"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_28%,rgba(255,255,255,0.06),transparent_26%)]" />

              <div className="relative z-10 flex min-h-[440px] items-center px-5 py-8 sm:px-8 sm:py-10 lg:min-h-[560px] lg:px-12 lg:py-14">
                <div className="max-w-2xl">
                  <p className="mb-3 inline-flex items-center rounded-full border border-white/15 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/75 sm:text-xs">
                    Family Education
                  </p>

                  <h1 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-6xl lg:leading-tight">
                    Family 
                    <span className="block text-white/95">Education</span>
                  </h1>

                  <p className="mt-4 max-w-xl text-sm leading-7 text-white/80 sm:text-base lg:text-lg">
                    A soulful space for early childhood education, creative
                    learning and astrology parenting.
                  </p>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link
                      href="/posts"
                      className="inline-flex items-center rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                    >
                      All Articles
                    </Link>

                    {canManagePosts && (
                      <Link
                        href="/admin/posts/new"
                        className="inline-flex items-center rounded-2xl border border-white/20 bg-[#f2dfca]/90 px-5 py-3 text-sm font-semibold text-[#5a4236] shadow-lg shadow-black/10 transition hover:scale-[1.02] hover:bg-[#f5e7d6]"
                      >
                        New Post
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CONTENT: POSTS + READER NOTES */}
          <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            {/* LEFT: POSTS */}
            <div className="rounded-3xl border border-white/10 bg-black/25 p-4 shadow-2xl backdrop-blur-md sm:p-5">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="mb-1 text-sm uppercase tracking-[0.2em] text-white/55">
                    Category Archive
                  </p>
                  <h2 className="text-2xl font-semibold text-white">
                    Family Education
                  </h2>
                </div>

                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
                  {posts?.length ?? 0} articles
                </span>
              </div>

              {!posts || posts.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
                  No published posts in this category yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <article
                      key={post.slug}
                      className="group overflow-hidden rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.08)] p-3 shadow-lg backdrop-blur-sm transition hover:bg-[rgba(255,255,255,0.11)]"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row">
                        <Link
                          href={`/posts/${post.slug}`}
                          className="relative block h-[170px] w-full shrink-0 overflow-hidden rounded-xl sm:h-[140px] sm:w-[220px]"
                        >
                          {post.cover_image ? (
                            <img
                              src={post.cover_image}
                              alt={post.title}
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-white/5 text-sm text-white/45">
                              No image
                            </div>
                          )}
                        </Link>

                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-white/45">
                            Understanding Children
                          </div>

                          <h3 className="text-lg font-semibold leading-snug text-white sm:text-xl">
                            <Link
                              href={`/posts/${post.slug}`}
                              className="transition hover:text-white/85"
                            >
                              {post.title}
                            </Link>
                          </h3>

                          {post.excerpt && (
                            <p className="mt-3 line-clamp-3 text-sm leading-7 text-white/72 sm:text-[15px]">
                              {post.excerpt}
                            </p>
                          )}

                          <div className="mt-4 flex items-end justify-between gap-3">
                            <p className="text-sm text-white/50">
                              {post.published_at
                                ? new Date(post.published_at).toLocaleDateString()
                                : ""}
                            </p>

                            <Link
                              href={`/posts/${post.slug}`}
                              className="inline-flex items-center rounded-xl border border-white/12 bg-white/8 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/14"
                            >
                              Read Article
                            </Link>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: WHAT READERS SAY */}
            <aside className="rounded-3xl border border-white/10 bg-black/25 p-4 shadow-2xl backdrop-blur-md sm:p-5">
              <div className="mb-5">
                <p className="mb-1 text-sm uppercase tracking-[0.2em] text-white/55">
                  Community
                </p>
                <h2 className="text-2xl font-semibold text-white">
                  What Readers Say
                </h2>
              </div>

              <div className="space-y-4">
                {readerNotes.map((note, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.08)] p-4"
                  >
                    <p className="text-sm leading-7 text-white/78">
                      “{note.quote}”
                    </p>
                    <p className="mt-3 text-sm font-medium text-white/52">
                      — {note.author}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-dashed border-white/12 bg-white/[0.04] p-4 text-sm leading-7 text-white/55">
                Future area for comments, reader reflections, and community notes.
              </div>
            </aside>
          </section>
        </Container>
      </div>
    </main>
  );
}