"use client";

import { ExploreShell } from "./explore-shared";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { usePreferences } from "@/components/site/preferences-provider";
import {
  celestialEntries,
  celestialSectionCopy,
} from "../lib/celestial-entries";
import archiveStyles from "@/features/thoth/components/knowledge-entries.module.css";
import { stellaTools } from "../lib/explore-config";

export default function StellaToolsOverview() {
  const { t } = usePreferences();
  return (
    <ExploreShell
      title={celestialEntries[0].title}
      subtitle={celestialSectionCopy.description}
      tools={stellaTools.slice(0, 11)}
      toolsHeading={{ zh: "13 个探索模块", en: "13 Exploration Modules" }}
      description={celestialEntries[0].description}
      afterTools={
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {celestialEntries.slice(1, 3).map((entry, index) => {
            const slug = index === 0 ? "zodiac" : "horoscope";
            return (
              <Link
                key={slug}
                href={`/stella/${slug}`}
                data-stella-tool={slug}
                data-tool-index={index + 12}
                className="group block h-full"
              >
                <Card
                  className={`${archiveStyles.card} transition-colors group-hover:border-[var(--primary)]`}
                >
                  <div className={archiveStyles.media}>
                    <Image
                      src={entry.backgroundImage}
                      alt=""
                      fill
                      sizes="(max-width: 767px) 100vw, 50vw"
                      className={archiveStyles.image}
                    />
                  </div>
                  <CardContent className={archiveStyles.copy}>
                    <h3 className="break-words text-lg font-semibold">
                      {t(entry.title)}
                    </h3>
                    <p className="flex-1">{t(entry.description)}</p>
                    <span className="text-sm font-medium">
                      {t({ zh: "进入", en: "Explore" })} →
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      }
    >
      <p className="text-sm leading-7 text-[var(--explore-muted)]">
        {t({
          en: "Explore eleven astrology tools, from birth charts and compatibility to lunar calendars, numerology and eclipses.",
          zh: "从出生星盘与星座配对，到月亮日历、生命数字和日月食，探索十一项占星工具。",
        })}
      </p>
    </ExploreShell>
  );
}
