import { FeatureCard } from "@/components/site/feature-card";
import { PageHero, PageSection, PageShell } from "@/components/site/page-shell";

const circleCards = [
  {
    title: "亲子议题",
    description: "用于沉淀家庭教育、情绪陪伴和日常沟通中的长期问题。",
    href: "/categories/family-education",
    badge: "Family",
  },
  {
    title: "教学实践",
    description: "整理课堂观察、活动设计和教育者反思，方便后续扩展文章内容。",
    href: "/categories/teaching-practice",
    badge: "Practice",
  },
  {
    title: "教师反思",
    description: "保留给专业成长、自我照顾和工作复盘的内容方向。",
    href: "/categories/teacher-reflection",
    badge: "Reflection",
  },
];

export default function CirclePage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Community"
        title="早期教育智慧圈"
        description="这里作为社区与内容主题的中转入口，先把讨论方向整理清楚，后续可以继续接论坛、问答或会员社群。"
      />

      <PageSection className="pt-0">
        <div className="grid gap-5 md:grid-cols-3">
          {circleCards.map((card) => (
            <FeatureCard key={card.href} {...card} />
          ))}
        </div>
      </PageSection>
    </PageShell>
  );
}
