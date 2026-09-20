"use client";

import Link from "next/link";
import Image from "next/image";
import { categories } from "@/lib/categories";
import { usePreferences } from "@/components/site/preferences-provider";

export default function CategoriesSection() {
  const { language, t } = usePreferences();
  const imageAltSuffix = language === "zh" ? "背景" : " background";

  return (
    <section className="mb-14 sm:mb-16">
      <div className="mb-6 sm:mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-soft)] sm:text-sm">
          {t({ zh: "内容分类", en: "Main Categories" })}
        </p>

        <h2 className="text-2xl font-bold text-[var(--text)] sm:text-3xl">
          {t({ zh: "四个长期内容方向", en: "Explore the core themes" })}
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-soft)] sm:text-base">
          {t({
            zh: "从儿童理解、教学实践、家庭教育与教师反思四个方向，统一承接文章与后续课程内容。",
            en: "Discover the four main directions of the site through ideas on children, learning, family education, and teacher reflection.",
          })}
        </p>
      </div>

      <div className="grid gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
        {categories.map((category) => (
          <div
            key={category.slug}
            className="group relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-sm)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]"
          >
            <div className="absolute inset-0">
              <Image
                src={category.backgroundImage}
                alt={`${t(category.title)}${imageAltSuffix}`}
                fill
                className="object-cover object-left-top opacity-35"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>

            <div className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--card)_88%,transparent),var(--card-soft))]" />

            <div className="relative z-10 flex h-full flex-col p-5 sm:p-6">
              {/* Icon + heading */}
              <div className="mb-4 flex items-start gap-3">
                <h3 className="mb-4 text-[1.35rem] font-semibold leading-tight tracking-tight text-[var(--text)]">
                  {t(category.title)}
                </h3>
              </div>

              <p className="mb-6 text-sm leading-7 text-[var(--text-soft)]">
                {t(category.description)}
              </p>

              <div className="mt-auto flex justify-center">
                <Link
                  href={`/categories/${category.slug}`}
                  className={`topic-btn topic-btn-${category.buttonVariant}`}
                >
                  {t({ zh: "探索主题", en: "Explore Topics" })}
                  <span className="topic-btn-arrow">›</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
