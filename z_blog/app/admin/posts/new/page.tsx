import CreatePostForm from "@/components/admin/create-post-form";
import { requireRole } from "@/lib/auth/require-user";

export default async function NewPostPage() {
  await requireRole(["admin", "editor"]);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12 text-[var(--text)]">
      <h1 className="mb-6 text-3xl font-bold">新建文章</h1>
      <CreatePostForm />
    </main>
  );
}
