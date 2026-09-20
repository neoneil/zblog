import CategoriesSection from "@/components/site/categories-section";
import { PageHero, PageSection, PageShell } from "@/components/site/page-shell";

export default function CategoriesPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Categories"
        title="主要分类"
        description="围绕儿童理解、教学实践、家庭教育与教师反思四个方向组织内容，后续文章与课程都可以归入这些长期栏目。"
      />

      <PageSection className="pt-0">
        <CategoriesSection />
      </PageSection>
    </PageShell>
  );
}
