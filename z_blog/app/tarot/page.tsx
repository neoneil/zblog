import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ensureTarotCardShell } from "@/features/tarot/lib/tarot-actions";
import { getCurrentUserWithRole } from "@/lib/auth/current-user";
import { tarotDeck } from "@/lib/tarot/full-deck";
import type { TarotCard } from "@/types/tarot";

export const metadata = {
  title: "Tarot Card Library",
  description: "Browse and edit the 78-card tarot knowledge library.",
};

function slugifyCardName(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getCardNo(card: TarotCard) {
  if (card.arcana !== "major") return null;
  const number = card.id.replace("major-", "");
  const parsed = Number(number);
  return Number.isFinite(parsed) ? parsed : null;
}

function getArcanaLabel(card: TarotCard) {
  if (card.arcana === "major") return "Major Arcana";
  return card.suit ? `${card.suit} · Minor Arcana` : "Minor Arcana";
}

function getEditorPayload(card: TarotCard, orderIndex: number) {
  return {
    slug: slugifyCardName(card.name),
    cardNo: getCardNo(card),
    nameCn: card.nameCn,
    nameEn: card.name,
    arcana: card.arcana,
    suit: card.suit ?? null,
    orderIndex,
  };
}

export default async function TarotIndexPage() {
  const { role } = await getCurrentUserWithRole();
  const canEdit = role === "admin" || role === "editor";

  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <div className="bg-[linear-gradient(180deg,var(--bg-soft),var(--bg))] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <Card className="overflow-hidden">
            <CardHeader className="border-b border-[var(--border)] bg-[var(--card-soft)] px-5 py-6 sm:px-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <Badge variant={canEdit ? "warning" : "secondary"}>
                    {canEdit ? "Editor Library" : "Tarot Library"}
                  </Badge>
                  <CardTitle className="mt-4 text-3xl sm:text-4xl">
                    Tarot 78 Card Reader
                  </CardTitle>
                  <CardDescription className="max-w-2xl leading-6">
                    {canEdit
                      ? "Choose a card to create its editing shell and open the reader."
                      : "Choose a published card to read its image, symbols, cases, and practical use."}
                  </CardDescription>
                </div>

                <Badge variant="outline">78 Cards</Badge>
              </div>
            </CardHeader>
          </Card>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tarotDeck.map((card, index) => {
              const payload = getEditorPayload(card, index);
              const href = `/tarot/${payload.slug}?lang=zh`;
              const cardBody = (
                <Card className="h-full overflow-hidden bg-[var(--card)] text-left transition hover:-translate-y-1 hover:shadow-[var(--shadow-md)]">
                  <div className="grid grid-cols-[92px_1fr] gap-4 border-b border-[var(--border)] bg-[linear-gradient(135deg,var(--card-soft),var(--bg-soft))] p-4">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-soft)]">
                      <Image
                        src={card.imageSrc}
                        alt={card.nameCn}
                        fill
                        className="object-cover"
                        sizes="92px"
                      />
                    </div>

                    <div className="min-w-0">
                      <Badge variant={card.arcana === "major" ? "default" : "secondary"}>
                        {getArcanaLabel(card)}
                      </Badge>
                      <h2 className="mt-3 truncate text-lg font-semibold text-[var(--text)]">
                        {card.nameCn}
                      </h2>
                      <p className="mt-1 truncate text-sm text-[var(--text-soft)]">
                        {card.name}
                      </p>
                    </div>
                  </div>

                  <CardContent className="space-y-3 p-4">
                    <div className="flex flex-wrap gap-2">
                      {card.meaningUp.slice(0, 3).map((meaning) => (
                        <Badge key={meaning} variant="outline">
                          {meaning}
                        </Badge>
                      ))}
                    </div>

                    {canEdit ? (
                      <span className="inline-flex h-9 w-full items-center justify-center rounded-[var(--radius-md)] bg-[var(--primary)] px-4 text-sm font-medium text-[var(--text-inverse)] shadow-[var(--shadow-sm)] transition group-hover:bg-[var(--primary-hover)]">
                        Create / Edit
                      </span>
                    ) : (
                      <p className="text-sm text-[var(--text-soft)]">
                        Open reader
                      </p>
                    )}
                  </CardContent>
                </Card>
              );

              if (canEdit) {
                const openCard = ensureTarotCardShell.bind(null, payload);

                return (
                  <form key={card.id} action={openCard} className="h-full">
                    <button type="submit" className="group block h-full w-full">
                      {cardBody}
                    </button>
                  </form>
                );
              }

              return (
                <Link key={card.id} href={href} className="block h-full">
                  {cardBody}
                </Link>
              );
            })}
          </section>
        </div>
      </div>
    </main>
  );
}
