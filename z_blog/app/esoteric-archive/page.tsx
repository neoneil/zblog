import Container from "@/components/site/container";
import { PageShell } from "@/components/site/page-shell";
import { LocalizedText } from "@/components/site/preferences-provider";
import { KnowledgeEntries } from "@/features/thoth/components/knowledge-entries";

export const metadata = { title: "秘学之源 · The Esoteric Archive" };

export default function EsotericArchivePage() {
  return (
    <PageShell>
      <Container>
        <div className="py-8 sm:py-12">
          <h1 className="sr-only">
            <LocalizedText
              copy={{ zh: "秘学之源", en: "The Esoteric Archive" }}
            />
          </h1>
          <KnowledgeEntries />
        </div>
      </Container>
    </PageShell>
  );
}
