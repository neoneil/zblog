
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import Container from "@/components/site/container";
import CategoriesSection from "@/components/site/categories-section";
export default async function HomePage() {
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
    .order("published_at", { ascending: false })
    .limit(6);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/cosmic-bg.webp"
          alt="Cosmic background"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Base dark overlay */}
      <div className="fixed inset-0 -z-10 bg-black/60" />

      {/* Extra gradient depth */}
      <div className="absolute inset-0 bg-linear-to-b from-black/55 via-slate-950/45 to-black/70" />

      {/* Top spotlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_34%)]" />

      {/* Side glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.18),transparent_28%),radial-gradient(circle_at_80%_30%,rgba(56,189,248,0.14),transparent_24%)]" />

      {/* Subtle grid / texture */}
      <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-size-[48px_48px]" />

      {/* Content */}
      <div className="relative z-10 py-12 sm:py-16 lg:py-20">
        <Container>
          <section className="mb-14 sm:mb-16">
            <div className="max-w-3xl rounded-3xl border border-white/10 bg-white/8 p-6 shadow-2xl backdrop-blur-md sm:p-8 lg:p-10">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 sm:text-sm">
                Personal Blog
              </p>

              <h1 className="mb-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                A  space for childhood, emotion, and imagination.
              </h1>

              <p className="max-w-2xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
                I write about education, tools, and practical
                ideas worth sharing.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/posts"
                  className="inline-flex items-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
                >
                  Browse Posts
                </Link>

                {canManagePosts && (
                  <Link
                    href="/admin/posts/new"
                    className="inline-flex items-center rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                  >
                    Write Post
                  </Link>
                )}
              </div>
            </div>
          </section>
                <CategoriesSection />
          <section className="rounded-3xl border border-white/10 bg-black/25 p-5 shadow-2xl backdrop-blur-md sm:p-7">
            <div className="mb-6 flex items-center justify-between sm:mb-8">
              <h2 className="text-xl font-semibold text-white sm:text-2xl">
                Latest Posts
              </h2>

              <Link
                href="/posts"
                className="text-sm text-white/70 transition hover:text-white"
              >
                View all →
              </Link>
            </div>

            {!posts || posts.length === 0 ? (
              <p className="text-white/70">No published posts yet.</p>
            ) : (
              <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
                {posts.map((post) => (
                  <article
                    key={post.slug}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-5 shadow-xl backdrop-blur-sm transition duration-300 hover:bg-white/[0.14] hover:shadow-2xl"
                  >
                    {post.cover_image && (
                      <Link href={`/posts/${post.slug}`}>
                        <img
                          src={post.cover_image}
                          alt={post.title}
                          className="mb-4 aspect-video w-full rounded-xl object-cover"
                        />
                      </Link>
                    )}

                    <p className="mb-3 text-sm text-white/60">
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString()
                        : ""}
                    </p>

                    <h3 className="mb-3 text-xl font-semibold leading-tight text-white sm:text-2xl">
                      <Link
                        href={`/posts/${post.slug}`}
                        className="transition hover:underline"
                      >
                        {post.title}
                      </Link>
                    </h3>

                    {post.excerpt && (
                      <p className="mb-5 text-sm leading-7 text-white/75 sm:text-base">
                        {post.excerpt}
                      </p>
                    )}

                    <Link
                      href={`/posts/${post.slug}`}
                      className="text-sm font-medium text-white hover:underline"
                    >
                      Read article →
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </section>
        </Container>
      </div>
    </main>
  );
}

// import Link from "next/link";
// import { createClient } from "@/lib/supabase/server";
// import Container from "@/components/site/container";

// export default async function HomePage() {
//   const supabase = await createClient();

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   let role: string | null = null;

//   if (user) {
//     const { data: profile } = await supabase
//       .from("profiles")
//       .select("role")
//       .eq("id", user.id)
//       .single();

//     role = profile?.role ?? null;
//   }

//   const canManagePosts = role === "admin" || role === "editor";

//   const { data: posts } = await supabase
//     .from("posts")
//     .select("title, slug, excerpt, published_at, cover_image")
//     .eq("status", "published")
//     .order("published_at", { ascending: false })
//     .limit(6);

//   return (
//     <main className="py-12 sm:py-16 lg:py-20">
//       <Container>
//         <section className="mb-14 sm:mb-16">
//           <div className="max-w-3xl">
//             <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 sm:text-sm">
//               Personal Blog
//             </p>

//             <h1 className="mb-5 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
//               Thoughts on code, learning, and building things.
//             </h1>

//             <p className="max-w-2xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
//               I write about web development, education, tools, and practical
//               ideas worth sharing.
//             </p>

//             <div className="mt-8 flex flex-wrap gap-3">
//               <Link
//                 href="/posts"
//                 className="btn-primary"
//               >
//                 Browse Posts
//               </Link>

//               {canManagePosts && (
//                 <Link
//                   href="/admin/posts/new"
//                   className="btn-secondary"
//                 >
//                   Write Post
//                 </Link>
//               )}
//             </div>
//           </div>
//         </section>

//         <section>
//           <div className="mb-6 flex items-center justify-between sm:mb-8">
//             <h2 className="text-xl font-semibold sm:text-2xl">Latest Posts</h2>

//             <Link
//               href="/posts"
//               className="text-sm text-gray-500 hover:text-black"
//             >
//               View all →
//             </Link>
//           </div>

//           {!posts || posts.length === 0 ? (
//             <p className="text-gray-500">No published posts yet.</p>
//           ) : (
//             <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
//               {posts.map((post) => (
//                 <article
//                   key={post.slug}
//                   className="card overflow-hidden"
//                 >

//                   {post.cover_image && (
//                     <Link href={`/posts/${post.slug}`}>
//                       <img
//                         src={post.cover_image}
//                         alt={post.title}
//                         className="aspect-video w-full object-cover rounded-sm"
//                       />
//                     </Link>
//                   )}
//                   <p className="mb-3 text-sm text-gray-500">
//                     {post.published_at
//                       ? new Date(post.published_at).toLocaleDateString()
//                       : ""}
//                   </p>

//                   <h3 className="mb-3 text-xl font-semibold leading-tight sm:text-2xl">
//                     <Link href={`/posts/${post.slug}`} className="hover:underline">
//                       {post.title}
//                     </Link>
//                   </h3>

//                   {post.excerpt && (
//                     <p className="mb-5 text-sm leading-7 text-gray-600 sm:text-base">
//                       {post.excerpt}
//                     </p>
//                   )}

//                   <Link
//                     href={`/posts/${post.slug}`}
//                     className="text-sm font-medium text-black hover:underline"
//                   >
//                     Read article →
//                   </Link>
//                 </article>
//               ))}
//             </div>
//           )}
//         </section>
//       </Container>
//     </main>
//   );
// }
// // import Link from "next/link";
// // import { createClient } from "@/lib/supabase/server";
// // import LogoutButton from "@/components/auth/logout-button";

// // export default async function HomePage() {
// //   const supabase = await createClient();

// //   const {
// //     data: { user },
// //   } = await supabase.auth.getUser();

// //   const { data: posts, error } = await supabase
// //     .from("posts")
// //     .select("title, slug, excerpt, published_at")
// //     .eq("status", "published")
// //     .order("published_at", { ascending: false })
// //     .limit(5);

// //   return (
// //     <main className="mx-auto max-w-4xl px-6 py-12">
// //       <h1 className="mb-6 text-3xl font-bold">My Blog</h1>
// //       <p className="mb-8 text-gray-600">
// //         Thoughts on parenting and Tarot.
// //       </p>
// //       <div className="mb-8">
// //         <Link href="/posts" className="rounded border px-3 py-2">
// //           View Posts
// //         </Link>
// //       </div>

// //       {user ? (
// //         <div className="mb-10 space-y-4">
// //           <p>已登录：{user.email}</p>
// //           <LogoutButton />
// //         </div>
// //       ) : (
// //         <div className="mb-10 space-x-4">
// //           <Link href="/login" className="rounded border px-3 py-2">
// //             Login
// //           </Link>
// //           <Link href="/sign-up" className="rounded border px-3 py-2">
// //             Sign up
// //           </Link>
// //         </div>
// //       )}

// //       <section>
// //         <h2 className="mb-6 text-2xl font-semibold">Latest Posts</h2>

// //         {error ? (
// //           <p>加载文章失败：{error.message}</p>
// //         ) : !posts || posts.length === 0 ? (
// //           <p>还没有已发布的文章。</p>
// //         ) : (
// //           <div className="space-y-6">
// //             {posts.map((post) => (
// //               <article key={post.slug} className="rounded-lg border p-5">
// //                 <h3 className="mb-2 text-xl font-semibold">
// //                   <Link
// //                     href={`/posts/${post.slug}`}
// //                     className="hover:underline"
// //                   >
// //                     {post.title}
// //                   </Link>
// //                 </h3>

// //                 <p className="mb-3 text-sm text-gray-500">
// //                   {post.published_at
// //                     ? new Date(post.published_at).toLocaleDateString()
// //                     : ""}
// //                 </p>

// //                 {post.excerpt && (
// //                   <p className="text-gray-700">{post.excerpt}</p>
// //                 )}
// //               </article>
// //             ))}
// //           </div>
// //         )}
// //       </section>
// //     </main>
// //   );
// // }
