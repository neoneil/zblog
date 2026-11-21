import Container from "@/components/site/container";
import { PageShell } from "@/components/site/page-shell";
import { TarotCollection } from "@/components/site/home-tool-sections";

export const metadata = { title: "塔罗秘典 · Tarot Grimoire" };

export default function TarotLibraryPage() {
  return (
    <PageShell>
      <Container>
        <div className="mx-auto max-w-5xl py-6 sm:py-10">
          <TarotCollection kind="library" />
        </div>
      </Container>
    </PageShell>
  );
}
