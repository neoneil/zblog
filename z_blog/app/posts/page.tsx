
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import Container from "@/components/site/container";

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
    <main className="relative min-h-screen overflow-hidden">
      {/* ✅ 背景：改成 fixed */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/cosmic-bg.webp"
          alt="Background"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* 遮罩 */}
      <div className="fixed inset-0 -z-10 bg-black/60" />

      {/* 渐变 */}
      <div className="absolute inset-0 bg-linear-to-b from-black/55 via-slate-950/45 to-black/70" />

      {/* 光感 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_34%)]" />

      <div className="relative z-10 py-12 sm:py-16">
        <Container>
          {/* 标题 + 搜索 */}
          <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              Posts
            </h1>

            <form action="/posts" className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                name="q"
                defaultValue={keyword}
                placeholder="Search posts..."
                className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 outline-none backdrop-blur-md"
              />

              <button
                type="submit"
                className="rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/15"
              >
                Search
              </button>
            </form>
          </div>

          {/* 搜索提示 */}
          {keyword ? (
            <p className="mb-6 text-sm text-white/60">
              Search result for:{" "}
              <span className="font-medium text-white">{keyword}</span>
            </p>
          ) : null}

          {/* 内容 */}
          {error ? (
            <p className="text-white/70">加载失败：{error.message}</p>
          ) : !posts || posts.length === 0 ? (
            <p className="text-white/70">没有找到文章。</p>
          ) : (
            <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-2xl border border-white/10 bg-white/10 p-5 shadow-xl backdrop-blur-sm transition duration-300 hover:bg-white/[0.14] hover:shadow-2xl sm:p-6"
                >
                  <h2 className="mb-2 text-xl font-semibold text-white sm:text-2xl">
                    <Link
                      href={`/posts/${post.slug}`}
                      className="transition hover:underline"
                    >
                      {post.title}
                    </Link>
                  </h2>

                  <p className="mb-3 text-sm text-white/60">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString()
                      : new Date(post.created_at).toLocaleDateString()}
                  </p>

                  {post.cover_image && (
                    <Link href={`/posts/${post.slug}`}>
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="mb-6 aspect-video w-full rounded-xl object-cover"
                      />
                    </Link>
                  )}

                  {post.excerpt && (
                    <p className="mb-4 text-white/75">{post.excerpt}</p>
                  )}

                  <Link
                    href={`/posts/${post.slug}`}
                    className="text-sm font-medium text-white hover:underline"
                  >
                    Read more →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </Container>
      </div>
    </main>
  );
}

// import Link from "next/link";
// import Image from "next/image";
// import { createClient } from "@/lib/supabase/server";
// import Container from "@/components/site/container";

// type PostsPageProps = {
//   searchParams: Promise<{
//     q?: string;
//   }>;
// };

// export default async function PostsPage({ searchParams }: PostsPageProps) {
//   const { q } = await searchParams;
//   const keyword = q?.trim() ?? "";

//   const supabase = await createClient();

//   let query = supabase
//     .from("posts")
//     .select("id, title, slug, excerpt, cover_image, published_at, created_at")
//     .eq("status", "published")
//     .order("published_at", { ascending: false });

//   if (keyword) {
//     query = query.or(
//       `title.ilike.%${keyword}%,excerpt.ilike.%${keyword}%,content.ilike.%${keyword}%`
//     );
//   }

//   const { data: posts, error } = await query;

//   return (
//     <main className="relative overflow-hidden">
//       {/* 背景（跟随页面） */}
//       <div className="absolute inset-0 -z-10">
//         <Image
//           src="/cosmic-bg.webp"
//           alt="Background"
//           fill
//           priority
//           className="object-cover object-center"
//         />
//       </div>

//       {/* 遮罩层 */}
//       <div className="absolute inset-0 -z-10 bg-black/55" />
//       <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/50 via-slate-950/35 to-black/70" />

//       {/* 光感 */}
//       <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_34%)]" />

//       <div className="relative z-10 py-12 sm:py-16">
//         <Container>
//           {/* 标题 + 搜索 */}
//           <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
//             <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
//               Posts
//             </h1>

//             <form action="/posts" className="flex flex-col gap-3 sm:flex-row">
//               <input
//                 type="text"
//                 name="q"
//                 defaultValue={keyword}
//                 placeholder="Search posts..."
//                 className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 outline-none backdrop-blur-md"
//               />

//               <button
//                 type="submit"
//                 className="rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/15"
//               >
//                 Search
//               </button>
//             </form>
//           </div>

//           {/* 搜索提示 */}
//           {keyword ? (
//             <p className="mb-6 text-sm text-white/60">
//               Search result for:{" "}
//               <span className="font-medium text-white">{keyword}</span>
//             </p>
//           ) : null}

//           {/* 内容 */}
//           {error ? (
//             <p className="text-white/70">加载失败：{error.message}</p>
//           ) : !posts || posts.length === 0 ? (
//             <p className="text-white/70">没有找到文章。</p>
//           ) : (
//             <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
//               {posts.map((post) => (
//                 <article
//                   key={post.id}
//                   className="rounded-2xl border border-white/10 bg-white/10 p-5 shadow-xl backdrop-blur-sm transition duration-300 hover:bg-white/[0.14] hover:shadow-2xl sm:p-6"
//                 >
//                   <h2 className="mb-2 text-xl font-semibold text-white sm:text-2xl">
//                     <Link
//                       href={`/posts/${post.slug}`}
//                       className="transition hover:underline"
//                     >
//                       {post.title}
//                     </Link>
//                   </h2>

//                   <p className="mb-3 text-sm text-white/60">
//                     {post.published_at
//                       ? new Date(post.published_at).toLocaleDateString()
//                       : new Date(post.created_at).toLocaleDateString()}
//                   </p>

//                   {post.cover_image && (
//                     <Link href={`/posts/${post.slug}`}>
//                       <img
//                         src={post.cover_image}
//                         alt={post.title}
//                         className="mb-6 aspect-video w-full rounded-xl object-cover"
//                       />
//                     </Link>
//                   )}

//                   {post.excerpt && (
//                     <p className="mb-4 text-white/75">{post.excerpt}</p>
//                   )}

//                   <Link
//                     href={`/posts/${post.slug}`}
//                     className="text-sm font-medium text-white hover:underline"
//                   >
//                     Read more →
//                   </Link>
//                 </article>
//               ))}
//             </div>
//           )}
//         </Container>
//       </div>
//     </main>
//   );
// }
// // import Link from "next/link";
// // import { createClient } from "@/lib/supabase/server";
// // import Container from "@/components/site/container";

// // type PostsPageProps = {
// //   searchParams: Promise<{
// //     q?: string;
// //   }>;
// // };

// // export default async function PostsPage({ searchParams }: PostsPageProps) {
// //   const { q } = await searchParams;
// //   const keyword = q?.trim() ?? "";

// //   const supabase = await createClient();

// //   let query = supabase
// //     .from("posts")
// //     .select("id, title, slug, excerpt, cover_image, published_at, created_at")
// //     .eq("status", "published")
// //     .order("published_at", { ascending: false });

// //   if (keyword) {
// //     query = query.or(
// //       `title.ilike.%${keyword}%,excerpt.ilike.%${keyword}%,content.ilike.%${keyword}%`
// //     );
// //   }

// //   const { data: posts, error } = await query;

// //   return (
// //     <main className="py-12 sm:py-16">
// //       <Container>
// //         <div className="mb-8">
// //           <h1 className="mb-4 text-3xl font-bold sm:text-4xl">Posts</h1>

// //           <form action="/posts" className="flex flex-col gap-3 sm:flex-row">
// //             <input
// //               type="text"
// //               name="q"
// //               defaultValue={keyword}
// //               placeholder="Search posts..."
// //               className="w-full rounded-xl border px-4 py-3"
// //             />
// //             <button
// //               type="submit"
// //               className="rounded-xl border px-5 py-3 text-sm font-medium hover:bg-gray-50"
// //             >
// //               Search
// //             </button>
// //           </form>
// //         </div>

// //         {keyword ? (
// //           <p className="mb-6 text-sm text-gray-500">
// //             Search result for: <span className="font-medium">{keyword}</span>
// //           </p>
// //         ) : null}

// //         {error ? (
// //           <p>加载失败：{error.message}</p>
// //         ) : !posts || posts.length === 0 ? (
// //           <p className="text-gray-500">没有找到文章。</p>
// //         ) : (
// //           <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
// //             {posts.map((post) => (
// //               <article
// //                 key={post.id}
// //                 className="rounded-2xl border p-5 transition hover:-translate-y-0.5 hover:shadow-sm sm:p-6"
// //               >
// //                 <h2 className="mb-2 text-xl font-semibold sm:text-2xl">
// //                   <Link href={`/posts/${post.slug}`} className="hover:underline">
// //                     {post.title}
// //                   </Link>
// //                 </h2>

// //                 <p className="mb-3 text-sm text-gray-500">
// //                   {post.published_at
// //                     ? new Date(post.published_at).toLocaleDateString()
// //                     : new Date(post.created_at).toLocaleDateString()}
// //                 </p>
// //                 {post.cover_image && (
// //                   <Link href={`/posts/${post.slug}`}>
// //                     <img
// //                       src={post.cover_image}
// //                       alt={post.title}
// //                       className="aspect-video w-full object-cover rounded-sm mb-6"
// //                     />
// //                   </Link>
// //                 )}
// //                 {post.excerpt && (
// //                   <p className="mb-4 text-gray-700">{post.excerpt}</p>
// //                 )}

// //                 <Link
// //                   href={`/posts/${post.slug}`}
// //                   className="text-sm font-medium text-black hover:underline"
// //                 >
// //                   Read more →
// //                 </Link>
// //               </article>
// //             ))}
// //           </div>
// //         )}
// //       </Container>
// //     </main>
// //   );
// // }
// // // import Link from "next/link";
// // // import { createClient } from "@/lib/supabase/server";

// // // export default async function PostsPage() {
// // //   const supabase = await createClient();

// // //   const { data: posts, error } = await supabase
// // //     .from("posts")
// // //     .select("id, title, slug, excerpt, published_at, created_at")
// // //     .eq("status", "published")
// // //     .order("published_at", { ascending: false });

// // //   if (error) {
// // //     return (
// // //       <main className="mx-auto max-w-4xl px-6 py-12">
// // //         <h1 className="mb-6 text-3xl font-bold">Posts</h1>
// // //         <p>加载失败：{error.message}</p>
// // //       </main>
// // //     );
// // //   }

// // //   return (
// // //     <main className="mx-auto max-w-4xl px-6 py-12">
// // //       <h1 className="mb-8 text-3xl font-bold">Posts</h1>

// // //       {!posts || posts.length === 0 ? (
// // //         <p>还没有已发布的文章。</p>
// // //       ) : (
// // //         <div className="space-y-6">
// // //           {posts.map((post) => (
// // //             <article key={post.id} className="rounded-lg border p-5">
// // //               <h2 className="mb-2 text-2xl font-semibold">
// // //                 <Link href={`/posts/${post.slug}`} className="hover:underline">
// // //                   {post.title}
// // //                 </Link>
// // //               </h2>

// // //               <p className="mb-3 text-sm text-gray-500">
// // //                 {post.published_at
// // //                   ? new Date(post.published_at).toLocaleDateString()
// // //                   : "Unpublished"}
// // //               </p>

// // //               {post.excerpt && (
// // //                 <p className="mb-4 text-gray-700">{post.excerpt}</p>
// // //               )}

// // //               <Link
// // //                 href={`/posts/${post.slug}`}
// // //                 className="inline-block rounded border px-3 py-2 text-sm"
// // //               >
// // //                 Read more
// // //               </Link>
// // //             </article>
// // //           ))}
// // //         </div>
// // //       )}
// // //     </main>
// // //   );
// // // }