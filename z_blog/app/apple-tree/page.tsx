import Container from "@/components/site/container";
import { PageShell } from "@/components/site/page-shell";
import AppleTreeExperience from "@/components/site/apple-tree-experience";

export const metadata = { title: "种下我的苹果树 · Plant My Apple Tree" };

export default function AppleTreePage() {
  return (
    <PageShell>
      <Container>
        <AppleTreeExperience />
      </Container>
    </PageShell>
  );
}
