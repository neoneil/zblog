import Image from "next/image";
import { ParentingNewsletter } from "@/components/ParentingLabSection";
import { CalculatorsHomeSection } from "@/components/site/home-tool-sections";
import HomeTarotPortals from "@/components/site/home-tarot-portals";
import { AboutSection } from "@/features/contact/components/about-contact";
import ContactEntry from "@/features/contact/components/contact-entry";
import Container from "@/components/site/container";
import EventAnnouncement from "@/features/services/components/event-announcement";
import HomeExploreStrip from "@/components/site/home-explore-strip";
import HomeHeroContent from "@/components/site/home-hero-content";
import HomeNovelBanner from "@/components/site/home-novel-banner";

export default async function HomePage() {
  return (
    <main className="brand-home min-h-screen text-[var(--text)]">
      <div className="brand-home-upper pt-4 sm:pt-6 lg:pt-8">
        <Container>
          <section id="home-novel" className="mb-6 sm:mb-8">
            <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--text-white)]/10 bg-[var(--surface-raised)] shadow-[var(--shadow-lg)]">
                <Image
                  src="/hero2111.png"
                  alt="星辰之巢首页背景"
                  width={1774}
                  height={887}
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  priority
                  data-brand-art
                  className="block h-auto w-full"
                />
                <HomeHeroContent />
            </div>
          </section>

          <HomeExploreStrip />

          <HomeTarotPortals />
          <HomeNovelBanner />
        </Container>
      </div>
      <div className="brand-home-lower pb-10 sm:pb-12 lg:pb-14">
        <Container>
          <CalculatorsHomeSection />

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
      <EventAnnouncement />
    </main>
  );
}
