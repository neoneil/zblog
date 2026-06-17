import Link from "next/link";
import Container from "./container";
import { LocalizedText } from "./preferences-provider";
import { footerColumns, siteCopy } from "@/lib/i18n/copy";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[var(--border)] bg-[var(--card-muted)] shadow-[var(--shadow-md)] backdrop-blur-xl">
      <Container>
        <div className="py-10 sm:py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-1">
              <h2 className="text-lg font-bold tracking-tight text-[var(--text)]">
                <LocalizedText copy={siteCopy.brand} />
              </h2>
              <p className="mt-3 max-w-xs text-sm leading-7 text-[var(--text-soft)]">
                <LocalizedText copy={siteCopy.footerDescription} />
              </p>
            </div>

            {footerColumns.map((column) => (
              <div key={column.title.zh}>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
                  <LocalizedText copy={column.title} />
                </h3>

                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label.zh}>
                      <Link
                        href={link.href}
                        className="text-sm text-[var(--text-soft)] transition hover:text-[var(--text)]"
                      >
                        <LocalizedText copy={link.label} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

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
