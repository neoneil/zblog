import { NextResponse } from "next/server";
import {
  beginReading,
  type ReadingLease,
} from "@/features/billing/lib/reading-billing";
import { readingSpreads } from "@/features/thoth/data/reading-spreads";
import { catalogCards, cardMeaning } from "@/features/thoth/lib/card-catalog";
import { readingDignities } from "@/features/thoth/lib/reading-engine";
import type { DrawnThothCard } from "@/features/thoth/lib/reading-engine";

export async function POST(request: Request) {
  let lease: ReadingLease | undefined;
  try {
    const raw = await request.text();
    if (raw.length > 16000)
      return NextResponse.json(
        { error: "请求过大 / Request too large." },
        { status: 413 },
      );
    const body = JSON.parse(raw);
    const spread = readingSpreads.find((item) => item.id === body.spread);
    if (
      !spread ||
      !Array.isArray(body.cards) ||
      !["zh", "en"].includes(body.language) ||
      !body.cards.length ||
      body.cards.length > (spread.successive ? 78 : spread.positions.length) ||
      (!spread.successive && body.cards.length !== spread.positions.length)
    )
      return NextResponse.json(
        { error: "无效牌阵 / Invalid spread." },
        { status: 400 },
      );
    const cards: DrawnThothCard[] = [];
    const seen = new Set<string>();
    for (const picked of body.cards) {
      const card = catalogCards.find((item) => item.id === picked?.id);
      if (!card || seen.has(card.id) || typeof picked.reversed !== "boolean")
        return NextResponse.json(
          { error: "无效卡牌 / Invalid cards." },
          { status: 400 },
        );
      seen.add(card.id);
      cards.push({ card, reversed: picked.reversed });
    }
    lease = await beginReading(request, "thoth", {
      spread: spread.id,
      cards: cards.map(({ card, reversed }) => ({ id: card.id, reversed })),
      language: body.language,
    });
    if (lease.response) return lease.response;
    const dignities = readingDignities(cards, spread);
    const report = cards.map(({ card, reversed }, index) => {
      const meaning = cardMeaning(card, body.language);
      const dignity = dignities[index];
      return {
        id: card.id,
        reversed,
        dignity,
        interpretation:
          !reversed && dignity === "well"
            ? [meaning.wellDignified]
            : !reversed && dignity === "ill"
              ? [meaning.illDignified]
              : meaning.meaning,
      };
    });
    return await lease.complete({
      spread: spread.id,
      language: body.language,
      report,
    });
  } catch {
    await lease?.release();
    return NextResponse.json(
      { error: "解读未完成，请稍后重试。 / Unable to complete this reading." },
      { status: 500 },
    );
  }
}
