"use client";

import { ExploreShell } from "./explore-shared";
import { categories } from "@/lib/categories";

export default function StellaToolsOverview() {
  return (
    <ExploreShell
      title={categories[0].title}
      description={{
        en: "Birth charts, planetary rhythms and the symbolic language of astrology.",
        zh: "出生星盘、行星节奏，以及占星的象征语言。",
      }}
    >
      {null}
    </ExploreShell>
  );
}
