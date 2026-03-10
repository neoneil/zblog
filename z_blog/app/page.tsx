
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/auth/logout-button";

export default async function HomePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: posts, error } = await supabase
    .from("posts")
    .select("title, slug, excerpt, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(5);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-6 text-3xl font-bold">My Blog</h1>
      <p className="mb-8 text-gray-600">
        Thoughts on parenting and Tarot.
      </p>
      <div className="mb-8">
        <Link href="/posts" className="rounded border px-3 py-2">
          View Posts
        </Link>
      </div>

      {user ? (
        <div className="mb-10 space-y-4">
          <p>已登录：{user.email}</p>
          <LogoutButton />
        </div>
      ) : (
        <div className="mb-10 space-x-4">
          <Link href="/login" className="rounded border px-3 py-2">
            Login
          </Link>
          <Link href="/sign-up" className="rounded border px-3 py-2">
            Sign up
          </Link>
        </div>
      )}

      <section>
        <h2 className="mb-6 text-2xl font-semibold">Latest Posts</h2>

        {error ? (
          <p>加载文章失败：{error.message}</p>
        ) : !posts || posts.length === 0 ? (
          <p>还没有已发布的文章。</p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <article key={post.slug} className="rounded-lg border p-5">
                <h3 className="mb-2 text-xl font-semibold">
                  <Link
                    href={`/posts/${post.slug}`}
                    className="hover:underline"
                  >
                    {post.title}
                  </Link>
                </h3>

                <p className="mb-3 text-sm text-gray-500">
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString()
                    : ""}
                </p>

                {post.excerpt && (
                  <p className="text-gray-700">{post.excerpt}</p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
// import Link from "next/link";
// import { createClient } from "@/lib/supabase/server";
// import LogoutButton from "@/components/auth/logout-button";

// export default async function HomePage() {
//   const supabase = await createClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   return (
//     <main className="mx-auto max-w-4xl px-6 py-12">
//       <h1 className="mb-6 text-3xl font-bold">My Blog</h1>


//       <div className="mb-8">
//         <Link href="/posts" className="rounded border px-3 py-2">
//           View Posts
//         </Link>
//       </div>




//       {user ? (
//         <div className="space-y-4">
//           <p>已登录：{user.email}</p>
//           <LogoutButton />
//         </div>
//       ) : (
//         <div className="space-x-4">
//           <Link href="/login" className="rounded border px-3 py-2">
//             Login
//           </Link>
//           <Link href="/sign-up" className="rounded border px-3 py-2">
//             Sign up
//           </Link>
//         </div>
//       )}
//     </main>
//   );
// }