import { FeatureCard } from "@/components/site/feature-card";
import { PageHero, PageSection, PageShell } from "@/components/site/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const capabilities = [
  {
    title: "AI 解读体验",
    description: "将塔罗与星盘内容转化为更易理解的中文分析，适合新手快速进入。",
    href: "/pricing",
    badge: "AI",
  },
  {
    title: "结构化知识库",
    description: "以牌库、Markdown 文档和图片素材为基础，逐步形成可运营的内容资产。",
    href: "/resources",
    badge: "Knowledge",
  },
  {
    title: "内容与课程承接",
    description: "为文章、视频、在线课堂与会员权益预留清晰的产品路径。",
    href: "/classroom",
    badge: "Growth",
  },
];

const values = [
  ["清晰", "复杂内容用结构化页面呈现，让用户知道下一步可以做什么。"],
  ["克制", "视觉保留神秘感，但以阅读效率、层级和可维护性为优先。"],
  ["可扩展", "AI、视频、文档和课程入口独立组织，方便后续继续增加产品线。"],
];

export default function AboutUsPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="About"
        title="关于星语童年"
        description="星语童年是一个围绕亲子成长、星盘观察与塔罗知识搭建的内容产品。当前阶段优先整理清晰入口、稳定权限与可持续维护的内容结构。"
      />

      <PageSection className="pt-0">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="grid gap-5 md:grid-cols-3">
            {capabilities.map((item) => (
              <FeatureCard key={item.href} {...item} />
            ))}
          </div>

          <Card className="bg-[var(--card)]">
            <CardContent className="p-6">
              <Badge variant="secondary">Principles</Badge>
              <h2 className="mt-4 text-2xl font-semibold text-[var(--text)]">
                当前设计原则
              </h2>
              <div className="mt-6 space-y-4">
                {values.map(([title, text]) => (
                  <div
                    key={title}
                    className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card-soft)] p-4"
                  >
                    <h3 className="font-semibold text-[var(--text)]">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </PageSection>
    </PageShell>
  );
}
