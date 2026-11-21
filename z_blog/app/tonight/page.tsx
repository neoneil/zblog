import Container from "@/components/site/container";
import { PageShell } from "@/components/site/page-shell";
import TonightExperience from "@/components/site/tonight-experience";

export const metadata = { title: "今夜星辰想对你说 · Tonight, the Stars Speak" };

export default function TonightPage() {
  return (
    <PageShell>
      <Container>
        <TonightExperience />
      </Container>
    </PageShell>
  );
}
