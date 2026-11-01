import Image from "next/image";
import heroStyles from "@/components/site/home-hero.module.css";
import { KnowledgeEntries } from "@/features/thoth/components/knowledge-entries";
import ParentingLabSection, {
  ParentingNewsletter,
} from "@/components/ParentingLabSection";
import {
  TarotHomeSection,
  CalculatorsHomeSection,
  ExistingAdditionalEntries,
} from "@/components/site/home-tool-sections";
import {
  AboutSection,
  ContactSection,
} from "@/features/contact/components/about-contact";
import ServicesList from "@/features/services/components/services-list";
import Container from "@/components/site/container";
import CategoriesSection from "@/components/site/categories-section";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentUserWithRole } from "@/lib/auth/current-user";

export default async function HomePage() {
  const { role } = await getCurrentUserWithRole();
  const isAdmin = role === "admin";

  return (
    <main className="min-h-screen bg-[var(--bg)] bg-[image:var(--app-gradient)] text-[var(--text)]">
      <div className="pt-4 pb-10 sm:pt-6 sm:pb-12 lg:pt-8 lg:pb-14">
        <Container>
          <section id="home-novel" className="mb-14 sm:mb-16">
            <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--text-white)]/10 bg-[var(--surface-raised)] shadow-[var(--shadow-lg)]">
              <div className="absolute inset-0">
                <Image
                  src="/hero.png"
                  alt="星辰之巢首页背景"
                  fill
                  priority
                  className="object-cover"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-r from-[var(--hero-overlay-strong)] via-[var(--hero-overlay-soft)] to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_28%,var(--primary-soft),transparent_32%)] opacity-35" />

              <div className={`${heroStyles.stage} relative z-10 flex min-h-[440px] items-center px-5 py-8 sm:px-8 sm:py-10 lg:min-h-[560px] lg:px-12 lg:py-14`}>
                <div className={heroStyles.content}>
                  <p className={heroStyles.eyebrow}>✦ POLARIS · THE GUIDING STAR ✦</p>
                  <h1 className={heroStyles.title}>STELLARNESTS<span>星辰之巢</span></h1>
                  <div className={heroStyles.rule} aria-hidden="true" />
                  <p className={heroStyles.motto} lang="en">Amidst Chaos, Always Centered.</p>
                  <p className={heroStyles.translation}>身处混沌，始终自有中心。</p>

                  <div className={heroStyles.actions}>
                    <ButtonLink href="/tarot-novel" variant="hero" size="lg">
                      占星塔罗小说
                    </ButtonLink>
                    <ButtonLink href="/pricing" variant="hero" size="lg">
                      成为会员
                    </ButtonLink>
                    <ButtonLink href="/tarot-ai" variant="hero" size="lg">
                      体验塔罗 AI
                    </ButtonLink>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <KnowledgeEntries />

          <TarotHomeSection />
          <CalculatorsHomeSection />
          <CategoriesSection homeLayout />

          <ParentingLabSection isAdmin={isAdmin} includeNewsletter={false} />
          <ExistingAdditionalEntries />

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

          <ServicesList embedded />
          <ContactSection />
          <section
            id="home-newsletter"
            className="mx-auto max-w-2xl py-8 sm:py-10"
          >
            <ParentingNewsletter />
          </section>
          <AboutSection embedded />
        </Container>
      </div>
    </main>
  );
}
