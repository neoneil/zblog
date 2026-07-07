import Link from "next/link";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/auth/require-user";

const adminCards = [
  {
    title: "上传博客文章",
    description: "上传blog文章后你的博客文章页才能脱胎换骨.",
    href: "/admin/posts",
  },
  {
    title: "手动用户订阅特权",
    description: "权宜之计， 以后可能删除这个功能.",
    href: "/admin/subscribe-authorized",
  },
  {
    title: "AI 提示词自动化",
    description: "估计你现在没玩明白，还需要打磨",
    href: "/admin/ai-video-prompt",
  },
  {
    title: "你的上传视频页面",
    description: "这个页面上传的视频都存在你的 cloudflare 的R2存储中",
    href: "/admin/videos",
  },
  {
    title: "飞书文档 第一版只有文字，图片都是不可用链接，所以我暂时不知道有什么用，现在有所有图片的zip了",
    description: "Review tarot Markdown knowledge files.",
    href: "/tarot-demo",
  },
  {
    title: "塔罗图片知识库",
    description: "图片知识库所有塔罗图片，我分组整理了，也是存在R2里面（我自己的R2）",
    href: "/admin/tarot-gallery",
  },
];

export default async function AdminPage() {
  const { profile } = await requireRole(["admin", "editor"]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 text-[var(--text)]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">管理后台</h1>
        <p className="mt-2 text-sm text-[var(--text)]">
          Welcome, {profile.email}
        </p>
        <p className="text-sm text-[var(--text)]">
          Role: {profile.role}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {adminCards.map((card) => (
          <Link key={card.href} href={card.href}>
            <Card className="h-full cursor-pointer transition-all hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-[var(--shadow-md)]">
              <CardContent className="flex h-full flex-col justify-between p-6">
                <div>
                  <CardTitle className="mb-3 text-lg text-[var(--text)]">
                    {card.title}
                  </CardTitle>

                  <p className="text-sm text-[var(--text-soft)]">
                    {card.description}
                  </p>
                </div>

                <div className="mt-6 text-sm font-medium text-[var(--primary)]">
                  Open →
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
