"use client";

import { ExploreShell } from "./explore-shared";
import { categories } from "@/lib/categories";
import { stellaExplorerTools } from "../lib/explore-config";

export default function StellaToolsOverview() {
  return (
    <ExploreShell
      title={categories[0].title}
      tools={stellaExplorerTools}
      description={{
        en: "Compatibility, the sky, lunar rhythms and eight ways to explore astrology.",
        zh: "从星座配对到行星与月相节奏，探索八项占星工具。",
      }}
    >
      {null}
    </ExploreShell>
  );
}
