import Container from "./container";
import FooterNavigation from "./footer-navigation";
import { LocalizedText } from "./preferences-provider";
import { siteCopy } from "@/lib/i18n/copy";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[var(--border)] bg-[var(--card-muted)] shadow-[var(--shadow-md)] backdrop-blur-xl">
      <Container>
        <div className="py-10 sm:py-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[var(--text)]">
              <LocalizedText copy={siteCopy.brand} />
            </h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-[var(--subtitle-ink)]">
              <LocalizedText copy={siteCopy.footerDescription} />
            </p>
          </div>
          <FooterNavigation />
          <div className="mt-10 flex flex-col gap-3 border-t border-[var(--border)] pt-6 text-sm text-[var(--text-faint)] sm:flex-row sm:items-center sm:justify-between">
            <p>
              © 2026 <LocalizedText copy={siteCopy.brand} />.{" "}
              <LocalizedText copy={siteCopy.footerRights} />
            </p>
            <p>
              <LocalizedText copy={siteCopy.footerBuiltBy} />
              <span className="font-medium text-[var(--text-soft)]">Chi</span>
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
