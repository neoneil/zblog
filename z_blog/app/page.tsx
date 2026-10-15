import Image from "next/image";
import { KnowledgeEntries } from '@/features/thoth/components/knowledge-entries';
import Astroplate from "@/components/Astroplate";
import Circle from "@/components/Circle";
import ParentingLabSection from "@/components/ParentingLabSection";
import { FeatureCard } from "@/components/site/feature-card";
import Container from "@/components/site/container";
import CategoriesSection from "@/components/site/categories-section";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentUserWithRole } from "@/lib/auth/current-user";

const productCards = [
  {
    title: "塔罗 AI",
    description: "围绕问题、情绪与家庭关系生成结构化解读，适合快速获得温柔但清晰的参考。",
    href: "/tarot-ai",
    badge: "AI",
  },
  {
    title: "星盘解析",
    description: "从日月升、宫位与核心能量切入，用更易读的方式理解亲子互动节奏。",
    href: "/astroplate",
    badge: "Astro",
  },
  {
    title: "塔罗牌库",
    description: "78 张塔罗牌知识入口，沉淀画面讲解、符号拆解、案例与实战使用。",
    href: "/tarot",
    badge: "Library",
  },
];

export default async function HomePage() {
  const { role } = await getCurrentUserWithRole();
  const isAdmin = role === "admin";

  return (
    <main className="min-h-screen bg-[var(--bg)] bg-[image:var(--app-gradient)] text-[var(--text)]">
      <div className="pt-4 pb-10 sm:pt-6 sm:pb-12 lg:pt-8 lg:pb-14">
        <Container>
          <section className="mb-14 sm:mb-16">
            <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--text-white)]/10 bg-[var(--surface-raised)] shadow-[var(--shadow-lg)]">
              <div className="absolute inset-0">
                <Image
                  src="/hero.png"
                  alt="星语童年首页背景"
                  fill
                  priority
                  className="object-cover"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-r from-[var(--hero-overlay-strong)] via-[var(--hero-overlay-soft)] to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_28%,var(--primary-soft),transparent_32%)] opacity-35" />

              <div className="relative z-10 flex min-h-[440px] items-end px-5 py-8 sm:px-8 sm:py-10 lg:min-h-[560px] lg:px-12 lg:py-14">
                <div className="max-w-2xl">
                  <p className="mb-3 inline-flex items-center rounded-full border border-[color:var(--text-inverse)]/45 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--text-white)] sm:text-xs">
                    星语童年
                  </p>

                  <h1 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-[var(--text-white)] sm:text-4xl lg:text-6xl lg:leading-tight">
                    占位文字1
                    <span className="block">占位文字2</span>
                  </h1>

                  <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--text-white)] sm:text-base lg:text-lg">
                    占位文字3
                  </p>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <ButtonLink href="/pricing" variant="hero" size="lg">
                      成为会员
                    </ButtonLink>
                    <ButtonLink href="/tarot-ai" variant="hero" size="lg">
                      体验塔罗 AI
                    </ButtonLink>
                    <ButtonLink href="/tarot-novel" variant="hero" size="lg">
                      占星塔罗小说
                    </ButtonLink>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12 grid gap-4 sm:grid-cols-3">
            {[
              ["AI 工具", "塔罗与星盘分开计时，付费后解锁对应产品。"],
              ["内容知识库", "塔罗文档、牌库与图片素材按入口集中管理。"],
              ["运营后台", "视频、文章、素材和权限入口只对管理员开放。"],
            ].map(([title, text]) => (
              <Card key={title} className="bg-[color:var(--card)]/92">
                <CardContent className="p-5">
                  <Badge variant="secondary">{title}</Badge>
                  <p className="mt-4 text-sm leading-6 text-[var(--text-soft)]">
                    {text}
                  </p>
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="mb-14">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-soft)]">
                Product Console
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--text)] sm:text-3xl">
                核心功能入口
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {productCards.map((card) => (
                <FeatureCard key={card.href} {...card} />
              ))}
            </div>
          </section>

          <KnowledgeEntries />

          <CategoriesSection />

          <section className="w-full py-6 sm:py-8">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Circle />
              <Astroplate imageSrc="/astroplate3.png" />
            </div>
          </section>

          <ParentingLabSection isAdmin={isAdmin} />
        </Container>
      </div>
    </main>
  );
}
