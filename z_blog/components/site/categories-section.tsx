"use client";

import Link from "next/link";
import Image from "next/image";
import { categories, type CategoryItem } from "@/lib/categories";
import { usePreferences } from "@/components/site/preferences-provider";
import styles from "./categories.module.css";

export function CategoryCard({ category }: { category: CategoryItem }) {
  const { language, t } = usePreferences();
  return (
    <div
      className={`${styles.card} group relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-sm)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]`}
    >
      <div className="absolute inset-0">
        <Image
          src={category.backgroundImage}
          alt={`${t(category.title)}${language === "zh" ? "背景" : " background"}`}
          fill
          className="object-cover object-left-top opacity-35"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--card)_88%,transparent),var(--card-soft))]" />
      <div className="relative z-10 flex h-full flex-col p-5 sm:p-6">
        <h3
          className={`${styles.title} mb-6 text-[1.35rem] font-semibold leading-tight text-[var(--text)]`}
        >
          {t(category.title)}
        </h3>
        <p className="mb-6 text-sm leading-7 text-[var(--text-soft)]">
          {t(category.description)}
        </p>
        <div className="mt-auto flex justify-center">
          <Link
            href={category.href ?? `/categories/${category.slug}`}
            className={`${styles.action} topic-btn topic-btn-${category.buttonVariant}`}
          >
            {t({ zh: "探索主题", en: "Explore Topics" })}
            <span className="topic-btn-arrow">›</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CategoriesSection({
  homeLayout = false,
}: {
  homeLayout?: boolean;
}) {
  const { t } = usePreferences();
  const entries: CategoryItem[] = homeLayout
    ? [
        ...categories.slice(0, 3),
        {
          ...categories[3],
          slug: "learning-videos",
          href: "/parentinglab/healingdaily/videos?category=general",
          title: { en: "Learn Videos", zh: "学习视频" },
          description: {
            en: "Astrology in motion: learning, images and stories.",
            zh: "星象影像、学习内容与故事。",
          },
        },
      ]
    : categories;
  return (
    <section
      className="mb-14 sm:mb-16"
      id={homeLayout ? "home-astrology" : undefined}
    >
      <div className="mb-6 sm:mb-8">
        <p className="mb-2 text-xs font-semibold uppercase text-[var(--text-soft)] sm:text-sm">
          {t(
            homeLayout
              ? { zh: "占星系统", en: "Stellar Astrology" }
              : { zh: "内容分类", en: "Main Categories" },
          )}
        </p>
        <h2 className="text-2xl font-bold text-[var(--text)] sm:text-3xl">
          {t(
            homeLayout
              ? { zh: "探索星象与学习", en: "Explore Astrology & Learning" }
              : { zh: "四个长期内容方向", en: "Explore the core themes" },
          )}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-soft)] sm:text-base">
          {t(
            homeLayout
              ? {
                  zh: "从 STELLAR 八项探索工具，到十二星座、运势与学习视频。",
                  en: "Explore eight STELLAR tools, zodiac signs, horoscopes and learning videos.",
                }
              : {
                  zh: "从占星工具、十二星座、星座运势与内心书写，发现值得停留的主题。",
                  en: "Explore astrology tools, zodiac signs, horoscopes, and your inner world.",
                },
          )}
        </p>
      </div>
      <div
        className={
          homeLayout
            ? styles.homeGrid
            : "grid gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-4"
        }
      >
        {entries.map((category) => (
          <CategoryCard key={category.slug} category={category} />
        ))}
      </div>
    </section>
  );
}

export function ReflectionEntry() {
  return (
    <div className={styles.extrasGrid}>
      <CategoryCard category={categories[3]} />
    </div>
  );
}
