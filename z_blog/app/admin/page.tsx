import { FeatureCard } from "@/components/site/feature-card";
import { PageHero, PageSection, PageShell } from "@/components/site/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { requireRole } from "@/lib/auth/require-user";

const adminCards = [
  {
    title: "文章管理",
    description: "上传、编辑和发布站内博客文章，统一维护内容库。",
    href: "/admin/posts",
    badge: "Content",
  },
  {
    title: "用户权限",
    description: "临时为指定用户配置访问权益，用于内部测试与运营处理。",
    href: "/admin/subscribe-authorized",
    badge: "Access",
  },
  {
    title: "AI 提示词",
    description: "维护视频脚本与 AI 生成流程中使用的提示词模板。",
    href: "/admin/ai-video-prompt",
    badge: "AI",
  },
  {
    title: "视频管理",
    description: "上传 R2 视频与封面，管理发布状态，并同步写入 Supabase videos 表。",
    href: "/admin/videos",
    badge: "Video",
  },
  {
    title: "飞书文档",
    description: "查看已整理的 Markdown 文档版本，并与 R2 图片素材进行对应展示。",
    href: "/feishu-docs",
    badge: "Docs",
  },
  {
    title: "图片知识库",
    description: "按目录层级浏览 R2 中的原始图片素材，支持大图预览。",
    href: "/admin/tarot-gallery",
    badge: "Gallery",
  },
];

export default async function AdminPage() {
  const { profile } = await requireRole(["admin", "editor"]);

  return (
    <PageShell>
      <PageHero
        eyebrow="Admin Console"
        title="管理后台"
        description="集中管理内容、视频、素材和测试权限。页面只做本地结构整理，不会修改远程数据库。"
        aside={
          <Card className="bg-[var(--card-soft)]">
            <CardContent className="p-5">
              <Badge variant="outline">当前身份</Badge>
              <p className="mt-4 truncate text-sm font-medium text-[var(--text)]">
                {profile.email}
              </p>
              <p className="mt-2 text-sm text-[var(--text-soft)]">
                Role: {profile.role}
              </p>
            </CardContent>
          </Card>
        }
      />

      <PageSection className="pt-0">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {adminCards.map((card) => (
            <FeatureCard key={card.href} {...card} meta="管理" />
          ))}
        </div>
      </PageSection>
    </PageShell>
  );
}
