import { requireAdmin } from "@/lib/auth/require-admin";
import { PageShell, PageHero, PageSection } from "@/components/site/page-shell";
import { ButtonLink } from "@/components/ui/button";
import ChapterEditor from "@/features/tarot-novel/components/chapter-editor";
import type { NovelChapter } from "@/features/tarot-novel/lib/chapters";

export default async function NovelAdminPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const { supabase } = await requireAdmin("/admin/novel");
  const { edit } = await searchParams;
  const { data, error } = await supabase.from("novel_chapters").select("*").order("chapter_number");
  const chapters = (data ?? []) as NovelChapter[];
  const chapter = chapters.find((item) => item.id === edit);
  const comments = [];
  let commentsError = false;
  if (chapter) {
    for (let offset = 0; ; offset += 1000) {
      const { data: batch, error: loadError } = await supabase.from("novel_comments").select("id,chapter_id,display_name,body,created_at").eq("chapter_id", chapter.id).order("created_at", { ascending: false }).order("id").range(offset, offset + 999);
      if (loadError) { commentsError = true; break; }
      comments.push(...(batch ?? []));
      if (!batch || batch.length < 1000) break;
    }
  }
  return <PageShell><PageHero title="小说更新" description="维护中英文小说章节、YouTube 视频和发布状态。" /><PageSection>
    {error ? <p role="alert">暂时无法读取小说表。首次使用请先执行 supabase/novel-chapters.sql；如已执行，请检查数据库连接和权限。</p> : <>
      <div className="mb-8 flex flex-wrap gap-3"><ButtonLink href="/admin/novel">新建章节</ButtonLink>
        {chapters.map((item) => <ButtonLink key={item.id} href={`/admin/novel?edit=${item.id}`} variant="secondary">{item.chapter_number} · {item.subtitle_zh}（{item.status === "published" ? "已发布" : "草稿"}）</ButtonLink>)}
      </div>
      <h2 className="mb-6 text-xl">{chapter ? "编辑章节" : "新建章节"}</h2>
      {commentsError && <p role="alert">评论加载失败，请刷新重试。</p>}
      <ChapterEditor key={chapter?.id ?? "new"} chapter={chapter} comments={comments} />
    </>}
  </PageSection></PageShell>;
}
