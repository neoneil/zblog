import Link from "next/link";
import Container from "./container";

const footerColumns = [
  {
    title: "Main Categories",
    links: [
      { label: "Understanding Children", href: "/" },
      { label: "Learning and Education", href: "/" },
      { label: "Emotional Wisdom", href: "/" },
      { label: "Cosmic Imagination", href: "/" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Latest Posts", href: "/" },
      { label: "Featured Topics", href: "/" },
      { label: "Resources", href: "/" },
      { label: "Reading Guide", href: "/" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Partners", href: "/" },
      { label: "Collaborators", href: "/" },
      { label: "Guest Writers", href: "/" },
      { label: "Newsletter", href: "/" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Our Story", href: "/" },
      { label: "Mission", href: "/" },
      { label: "Contact", href: "/" },
      { label: "Support", href: "/" },
    ],
  },
  {
    title: "More",
    links: [
      { label: "Privacy", href: "/" },
      { label: "Terms", href: "/" },
      { label: "FAQ", href: "/" },
      { label: "Home", href: "/" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-black/30 shadow-[0_-8px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl">
      <Container>
        <div className="py-10 sm:py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-1">
              <h2 className="text-lg font-bold tracking-tight text-white">
                Cosmic Childhood
              </h2>
              <p className="mt-3 max-w-xs text-sm leading-7 text-white/60">
                A reflective space for childhood, learning, emotion, and
                imagination.
              </p>
            </div>

            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-white/55">
                  {column.title}
                </h3>

                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/70 transition hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Z&apos;s Blog. All rights reserved.</p>
            <p>
              Built by <span className="font-medium text-white/75">Chi</span>
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}