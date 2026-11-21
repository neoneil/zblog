import Container from "@/components/site/container";
import { PageShell } from "@/components/site/page-shell";
import TonightStarMessage from "@/components/site/tonight-star-message";

export const metadata = { title: "写给每一位来到这里的你 · Tonight's Star Message" };

export default function StarMessagePage() {
  return (
    <PageShell>
      <Container>
        <TonightStarMessage />
      </Container>
    </PageShell>
  );
}
