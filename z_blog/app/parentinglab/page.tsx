import ParentingLabSection from "@/components/ParentingLabSection";
import { PageHero, PageSection, PageShell } from "@/components/site/page-shell";

export default function ParentingLabPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Parenting Lab"
        title="亲子实验室"
        description="集中承接塔罗 AI、疗愈视频和素材知识库入口。前端保持简单，后台按权限显示可管理功能。"
      />

      <PageSection className="pt-0">
        <ParentingLabSection />
      </PageSection>
    </PageShell>
  );
}
