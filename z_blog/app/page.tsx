import Image from "next/image";
import heroStyles from "@/components/site/home-hero.module.css";
import { KnowledgeEntries } from "@/features/thoth/components/knowledge-entries";
import { ParentingNewsletter } from "@/components/ParentingLabSection";
import {
  TarotHomeSection,
  CalculatorsHomeSection,
} from "@/components/site/home-tool-sections";
import {
  AboutSection,
} from "@/features/contact/components/about-contact";
import ServicesList from "@/features/services/components/services-list";
import ContactEntry from "@/features/contact/components/contact-entry";
import Container from "@/components/site/container";
import CategoriesSection from "@/components/site/categories-section";
import HomeHeroContent from "@/components/site/home-hero-content";
import StellarHousesEntry from "@/components/site/stellar-houses-entry";

export default async function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] bg-[image:var(--app-gradient)] text-[var(--text)]">
      <div className="pt-4 pb-10 sm:pt-6 sm:pb-12 lg:pt-8 lg:pb-14">
        <Container>
          <section id="home-novel" className="mb-14 sm:mb-16">
            <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--text-white)]/10 bg-[var(--surface-raised)] shadow-[var(--shadow-lg)]">
              <div className="absolute inset-0">
                <Image
                  src="/home-stellarnests-hero.png"
                  alt="星辰之巢首页背景"
                  fill
                  priority
                  className={heroStyles.image}
                />
              </div>

              <div className={heroStyles.overlay} aria-hidden="true" />

              <div className={`${heroStyles.stage} relative z-10 flex min-h-[440px] items-center px-5 py-8 sm:px-8 sm:py-10 lg:min-h-[560px] lg:px-12 lg:py-14`}>
                <HomeHeroContent />
              </div>
            </div>
          </section>

          <KnowledgeEntries />

          <TarotHomeSection />
          <CalculatorsHomeSection />
          <CategoriesSection homeLayout />

          <ServicesList embedded />
          <StellarHousesEntry />
          <div className="grid items-stretch gap-6 lg:grid-cols-2">
            <ContactEntry />
            <section
              id="home-newsletter"
              className="flex w-full min-w-0 flex-col py-8 sm:py-10"
            >
              <ParentingNewsletter />
            </section>
          </div>
          <AboutSection embedded />
        </Container>
      </div>
    </main>
  );
}
