"use client";

import Image from "next/image";
import { usePreferences } from "@/components/site/preferences-provider";

export default function AppleTreeExperience() {
  const { t } = usePreferences();
  return (
    <section aria-labelledby="apple-tree-title" className="py-6 sm:py-10">
      <h1 id="apple-tree-title" className="sr-only">
        {t({ zh: "种下我的苹果树", en: "Plant My Apple Tree" })}
      </h1>
      <Image
        src="/appletree.png"
        data-brand-art
        alt={t({
          zh: "星空湖畔两棵挂满心愿卡的苹果树",
          en: "Two apple trees filled with wish cards beside a starlit lake",
        })}
        width={1755}
        height={896}
        sizes="(max-width: 1280px) 100vw, 1280px"
        priority
        className="block h-auto w-full rounded-[var(--radius-md)]"
      />
    </section>
  );
}
