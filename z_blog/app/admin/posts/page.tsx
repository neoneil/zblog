import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DeletePostButton from "@/components/admin/delete-post-button";
// import SubscribeAuthorized from "../subscribe-authorized/subscribe-authorized-client"
export default async function AdminPostsPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (!profile || (profile.role !== "admin" && profile.role !== "editor")) {
        redirect("/");
    }

    const { data: posts, error } = await supabase
        .from("posts")
        .select("id, title, slug, status, published_at, created_at")
        .order("created_at", { ascending: false });

    return (
        <main className="mx-auto max-w-5xl px-6 py-12">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Manage Posts</h1>

                <Link
                    href="/admin/posts/new"
                    className="rounded border px-4 py-2 text-white"
                >
                    New Post
                </Link>
                <Link
                    href="/admin/subscribe-authorized"
                    className="rounded border px-4 py-2 text-white"
                >
                    授权订阅
                </Link>
            </div>

            {error ? (
                <p>加载失败：{error.message}</p>
            ) : !posts || posts.length === 0 ? (
                <p>还没有文章。</p>
            ) : (
                <div className="space-y-4">
                    {posts.map((post) => (
                        <article
                            key={post.id}
                            className="rounded-lg border p-5 text-white"
                        >
                            <div className="flex items-start justify-between gap-4 text-white">
                                <div>
                                    <h2 className="text-xl font-semibold text-white">{post.title}</h2>
                                    <p className="mt-2 text-sm text-white">
                                        slug: {post.slug}
                                    </p>
                                    <p className="mt-1 text-sm text-white">
                                        status: {post.status}
                                    </p>
                                    <p className="mt-1 text-sm text-white">
                                        {post.published_at
                                            ? `published: ${new Date(post.published_at).toLocaleDateString()}`
                                            : `created: ${new Date(post.created_at).toLocaleDateString()}`}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <Link
                                        href={`/posts/${post.slug}`}
                                        className="rounded border px-3 py-2 text-sm"
                                    >
                                        View
                                    </Link>

                                    <Link
                                        href={`/admin/posts/${post.id}/edit`}
                                        className="rounded border px-3 py-2 text-sm"
                                    >
                                        Edit
                                    </Link>


                                    <DeletePostButton
                                        postId={post.id}
                                        postTitle={post.title}
                                    />



                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )
            }
        </main >
    );
}