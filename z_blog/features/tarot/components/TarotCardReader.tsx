"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TarotSectionEditor from "@/features/tarot/components/TarotSectionEditor";
import { setTarotCardPublished } from "@/features/tarot/lib/tarot-actions";
import type {
  TarotCard,
  TarotCardSection,
  TarotLanguage,
  TarotSectionKey,
} from "@/features/tarot/types";
import { TAROT_SECTION_LABELS } from "@/features/tarot/types";

type TarotCardReaderProps = {
  card: TarotCard;
  sections: TarotCardSection[];
  lang: TarotLanguage;
  canEdit: boolean;
};

function getCardName(card: TarotCard, lang: TarotLanguage) {
  return lang === "zh" ? card.name_cn : card.name_en;
}

export default function TarotCardReader({
  card,
  sections,
  lang,
  canEdit,
}: TarotCardReaderProps) {
  const [activeSection, setActiveSection] = useState<TarotSectionKey>(
    sections[0]?.section_key ?? "image_explanation",
  );

  const visibleSections = useMemo(
    () =>
      sections
        .filter((section) => section.section_key in TAROT_SECTION_LABELS)
        .sort((a, b) => a.order_index - b.order_index),
    [sections],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target.id) {
          setActiveSection(visibleEntry.target.id as TarotSectionKey);
        }
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0.1, 0.35, 0.6],
      },
    );

    visibleSections.forEach((section) => {
      const element = document.getElementById(section.section_key);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [visibleSections]);

  function scrollToSection(sectionKey: TarotSectionKey) {
    document.getElementById(sectionKey)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  const togglePublish = setTarotCardPublished.bind(
    null,
    card.id,
    card.slug,
    !card.is_published,
  );
  const previewHref = `/tarot/${card.slug}?lang=${lang}&preview=user`;

  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <div className="bg-[linear-gradient(180deg,var(--bg-soft),var(--bg))] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <Card className="overflow-hidden">
              <CardHeader className="border-b border-[var(--border)] bg-[var(--card-soft)] px-5 py-5">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">{card.arcana ?? "Tarot"}</Badge>
                  {card.suit && <Badge variant="secondary">{card.suit}</Badge>}
                  {canEdit && <Badge variant="warning">Edit mode</Badge>}
                </div>
                <CardTitle className="mt-4 text-2xl">
                  {getCardName(card, lang)}
                </CardTitle>
                <CardDescription>
                  {lang === "zh"
                    ? `编号 ${card.card_no ?? card.order_index ?? "-"}`
                    : `Card ${card.card_no ?? card.order_index ?? "-"}`}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-3">
                <nav
                  aria-label="Tarot card sections"
                  className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
                >
                  {visibleSections.map((section) => {
                    const isActive = activeSection === section.section_key;

                    return (
                      <Button
                        key={section.section_key}
                        type="button"
                        variant={isActive ? "primary" : "ghost"}
                        size="sm"
                        className="shrink-0 justify-start lg:w-full"
                        onClick={() => scrollToSection(section.section_key)}
                      >
                        {TAROT_SECTION_LABELS[section.section_key][lang]}
                      </Button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </aside>

          <section className="min-w-0 space-y-5">
            <Card className="overflow-hidden">
              <CardHeader className="border-b border-[var(--border)] bg-[var(--card-soft)] px-5 py-5 sm:px-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">
                        {lang === "zh" ? "塔罗知识库" : "Tarot Knowledge Base"}
                      </Badge>
                      {canEdit && (
                        <Badge variant={card.is_published ? "success" : "warning"}>
                          {card.is_published
                            ? lang === "zh" ? "已发布" : "Published"
                            : lang === "zh" ? "草稿" : "Draft"}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="mt-4 text-3xl sm:text-4xl">
                      {getCardName(card, lang)}
                    </CardTitle>
                    <CardDescription className="max-w-2xl leading-6">
                      {lang === "zh"
                        ? "按照画面、符号、案例与实战四个维度阅读这张牌。"
                        : "Read this card through image, symbols, cases, and practical use."}
                    </CardDescription>
                  </div>

                  {canEdit && (
                    <div className="flex flex-wrap gap-2 sm:justify-end">
                      <ButtonLink href={previewHref} variant="secondary" size="sm">
                        {lang === "zh" ? "预览用户视图" : "Preview as user"}
                      </ButtonLink>

                      <form action={togglePublish}>
                        <Button
                          type="submit"
                          variant={card.is_published ? "secondary" : "primary"}
                          size="sm"
                        >
                          {card.is_published
                            ? lang === "zh" ? "取消发布" : "Unpublish"
                            : lang === "zh" ? "发布" : "Publish"}
                        </Button>
                      </form>
                    </div>
                  )}
                </div>
              </CardHeader>
            </Card>

            {visibleSections.map((section) => (
              <TarotSectionEditor
                key={`${section.id}-${section.blocks.map((block) => block.id).join("-")}`}
                cardSlug={card.slug}
                section={section}
                lang={lang}
                canEdit={canEdit}
              />
            ))}
          </section>
        </div>
      </div>
    </main>
  );
}
