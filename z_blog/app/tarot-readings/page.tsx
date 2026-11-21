import Container from "@/components/site/container";
import { PageShell } from "@/components/site/page-shell";
import { TarotCollection } from "@/components/site/home-tool-sections";

export const metadata = { title: "塔罗在线测算 · Tarot Online Reading" };

export default function TarotReadingsPage() {
  return (
    <PageShell>
      <Container>
        <div className="mx-auto max-w-5xl py-6 sm:py-10">
          <TarotCollection kind="readings" />
        </div>
      </Container>
    </PageShell>
  );
}
