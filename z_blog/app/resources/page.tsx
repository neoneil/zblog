import DownloadPdfButton from "@/components/download-pdf-button";
import { FeatureCard } from "@/components/site/feature-card";
import { PageHero, PageSection, PageShell } from "@/components/site/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const resourceCards = [
  {
    title: "塔罗牌库",
    description: "查看 78 张牌的结构化内容，适合用于学习、编辑与后续课程拆解。",
    href: "/tarot",
    badge: "Tarot",
  },
  {
    title: "飞书文档",
    description: "由 Markdown 自动整理的内部文档展示页，图片通过 R2 签名读取。",
    href: "/feishu-docs",
    badge: "Docs",
  },
  {
    title: "每日疗愈视频",
    description: "展示已发布的视频内容，支持业务化视频播放体验。",
    href: "/parentinglab/healingdaily/videos",
    badge: "Video",
  },
];

export default function ResourcesPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Resources"
        title="资源中心"
        description="把学习资料、塔罗文档、疗愈视频和下载内容集中到一个入口，减少重复链接。"
      />

      <PageSection className="pt-0">
        <div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
          <DownloadPdfButton>
            <Card className="group h-full cursor-pointer overflow-hidden bg-[var(--card)]">
              <div className="border-b border-[var(--border)] bg-[var(--section-gradient)] p-5">
                <Badge variant="secondary">Download</Badge>
                <h2 className="mt-4 text-xl font-semibold text-[var(--text)]">
                  占星学习手册
                </h2>
                <p className="mt-3 text-sm leading-6 text-[var(--text-soft)]">
                  下载当前站内保留的 PDF 资料，用于后续课程和会员内容承接。
                </p>
              </div>
              <CardContent className="p-5">
                <div className="relative mx-auto aspect-[3/4] max-w-[240px] overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-soft)]">
                  {/* eslint-disable-next-line @next/next/no-img-element -- Static public asset. */}
                  <img
                    src="/tarotCover.png"
                    alt="占星学习手册封面"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="mt-5 text-sm font-semibold text-[var(--primary)]">
                  下载资料 →
                </p>
              </CardContent>
            </Card>
          </DownloadPdfButton>

          <div className="grid gap-5 md:grid-cols-3">
            {resourceCards.map((card) => (
              <FeatureCard key={card.href} {...card} />
            ))}
          </div>
        </div>
      </PageSection>
    </PageShell>
  );
}
