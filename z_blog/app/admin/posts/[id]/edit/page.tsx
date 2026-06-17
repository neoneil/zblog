import { redirect } from "next/navigation";
import EditPostForm from "@/components/admin/edit-post-form";
import { requireRole } from "@/lib/auth/require-user";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params;
  const { supabase } = await requireRole(["admin", "editor"]);

  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (!post) {
    redirect("/admin/posts");
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-6 text-3xl font-bold">编辑文章</h1>

      <EditPostForm post={post} />
    </main>
  );
}
