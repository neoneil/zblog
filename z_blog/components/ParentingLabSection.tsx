import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const cards = [
  {
    title: "Ask Tarot Mom",
    href: "/parentinglab/asktarotmom",
    adminHref: "/tarot-ai",
    badge: "Tarot",
    description: "Intuitive support for parents through tarot-inspired reflection.",
  },
  {
    title: "Healing Daily",
    href: "/parentinglab/healingdaily",
    adminHref: "/parentinglab/healingdaily/videos",
    badge: "Care",
    description: "Gentle emotional care, small rituals, and everyday healing moments.",
  },
  {
    title: "Music Therapy",
    href: "/parentinglab/musictherapy",
    adminHref: "/admin/tarot-gallery",
    badge: "Sound",
    description: "Creative sound, rhythm, and music-centered ideas for children.",
  },
];

type ParentingLabSectionProps = {
  isAdmin?: boolean;
};

export default function ParentingLabSection({
  isAdmin = false,
}: ParentingLabSectionProps) {
  return (
    <section className="py-8 sm:py-10">
      <Card className="overflow-hidden bg-[var(--card)]">
        <CardHeader className="border-b border-[var(--border)] bg-[var(--card-soft)] px-5 py-6 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Badge variant="secondary">Parenting Lab</Badge>
              <CardTitle className="mt-3 text-2xl sm:text-3xl">
                Cosmic Parenting Lab
              </CardTitle>
              <CardDescription className="max-w-2xl leading-6">
                Tools and reflections for parenting with more intuition, care, and creative rhythm.
              </CardDescription>
            </div>

            <ButtonLink href="/parentinglab" variant="secondary" size="sm">
              View Lab
            </ButtonLink>
          </div>
        </CardHeader>

        <CardContent className="grid gap-5 p-5 lg:grid-cols-[1fr_320px] sm:p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {cards.map((card) => (
              <Link
                key={card.title}
                href={isAdmin ? card.adminHref : card.href}
                className="group block"
              >
                <Card className="h-full overflow-hidden bg-[var(--card)] hover:-translate-y-1 hover:shadow-[var(--shadow-md)]">
                  <div className="flex h-32 items-center justify-center border-b border-[var(--border)] bg-[linear-gradient(135deg,var(--bg-soft),var(--card-muted))] px-4">
                    <div className="flex flex-col items-center gap-2">
                      <Badge variant="default">{card.badge}</Badge>
                      {isAdmin && (
                        <Badge variant="outline">Admin View</Badge>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="text-base font-semibold text-[var(--text)] transition group-hover:text-[var(--primary)]">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
                      {card.description}
                    </p>
                    {isAdmin && (
                      <p className="mt-3 text-sm font-medium text-[var(--primary)]">
                        Open admin tool →
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <Card className="bg-[var(--card-soft)]">
            <CardHeader className="px-5 py-5">
              <Badge variant="outline">Newsletter</Badge>
              <CardTitle className="mt-3 text-xl">
                Stay Connected
              </CardTitle>
              <CardDescription className="leading-6">
                Gentle updates, inspiration, and future community news.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 px-5 pb-5 pt-0">
              <Input type="email" placeholder="你的邮箱" />
              <ButtonLink href="/newsletter" variant="primary" fullWidth>
                Subscribe
              </ButtonLink>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </section>
  );
}
