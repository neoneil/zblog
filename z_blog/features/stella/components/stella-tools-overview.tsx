"use client";

import { ExploreShell } from "./explore-shared";
import { categories } from "@/lib/categories";
import { stellaTools } from "../lib/explore-config";

export default function StellaToolsOverview() {
  return (
    <ExploreShell
      title={categories[0].title}
      tools={stellaTools}
      description={{
        en: "Explore eleven astrology tools, from birth charts and compatibility to lunar calendars, numerology and eclipses.",
        zh: "从出生星盘与星座配对，到月亮日历、生命数字和日月食，探索十一项占星工具。",
      }}
    >
      {null}
    </ExploreShell>
  );
}
