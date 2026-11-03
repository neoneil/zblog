"use client";

import { useState } from "react";
import { usePreferences } from "@/components/site/preferences-provider";
import { Select } from "@/components/ui/select";
import {
  selectProducts,
  products,
  type ProductFilter,
  type ProductSort,
} from "../lib/catalog";
import { ProductCard, ShopShell, styles } from "./shop-shared";
import archiveStyles from "@/features/thoth/components/knowledge-entries.module.css";

export default function ServicesList({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  const { t } = usePreferences();
  const [filter, setFilter] = useState<ProductFilter>("all"),
    [sort, setSort] = useState<ProductSort | "featured">("featured");
  const selected = sort === "featured" ? products.filter((item) => filter === "all" || item.category === filter) : selectProducts(filter, sort);
  const Heading = embedded ? "h2" : "h1";
  const content = (
    <>
      <header className={styles.header}>
        <Heading>{t({ en: "THE ARCANE SHOP", zh: "奥秘商店" })}</Heading>
        <div className={`${archiveStyles.subtitle} mt-3`}>{t({
          en: "From Ancient Wisdom to Everyday Magic — Discover Courses, Readings & Mystical Treasures.",
          zh: "从古老智慧到日常魔法——探索神秘学课程、专属解读与魔法珍藏。",
        })}</div>
      </header>
      <div className={styles.toolbar}>
        <label>
          {t({ en: "Filter by", zh: "筛选" })}
          <Select
            aria-label={t({ en: "Filter by", zh: "筛选" })}
            value={filter}
            onChange={(event) => setFilter(event.target.value as ProductFilter)}
          >
            <option value="all">
              {t({ en: "All products", zh: "全部产品" })}
            </option>
            <option value="courses">
              {t({ en: "Online courses", zh: "线上课程" })}
            </option>
            <option value="readings">
              {t({ en: "Readings", zh: "解读服务" })}
            </option>
            <option value="physical">{t({ en: "Physical goods", zh: "实物商品" })}</option>
          </Select>
        </label>
        <label>
          {t({ en: "Sort by", zh: "排序" })}
          <Select
            aria-label={t({ en: "Sort by", zh: "排序" })}
            value={sort}
            onChange={(event) => setSort(event.target.value as ProductSort | "featured")}
          >
            <option value="featured">{t({ en: "Featured", zh: "推荐顺序" })}</option>
            {(
              [
                ["title-asc", { en: "Alphabetically, A-Z", zh: "名称 A-Z" }],
                ["title-desc", { en: "Alphabetically, Z-A", zh: "名称 Z-A" }],
                ["price-asc", { en: "Price, low to high", zh: "价格由低到高" }],
                [
                  "price-desc",
                  { en: "Price, high to low", zh: "价格由高到低" },
                ],
                ["date-asc", { en: "Date, old to new", zh: "日期由旧到新" }],
                ["date-desc", { en: "Date, new to old", zh: "日期由新到旧" }],
              ] as const
            ).map(([value, label]) => (
              <option key={value} value={value}>
                {t(label)}
              </option>
            ))}
          </Select>
        </label>
        <p aria-live="polite">
          {t({
            en: `${selected.length} products`,
            zh: `${selected.length} 项产品`,
          })}
        </p>
      </div>
      <div className={styles.onlineGrid}>
        {selected.filter((product) => product.category !== "physical").map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className={styles.physicalGrid}>
        {selected.filter((product) => product.category === "physical").map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </>
  );
  return embedded ? (
    <section id="home-services" className={styles.embedded}>
      {content}
    </section>
  ) : (
    <ShopShell>{content}</ShopShell>
  );
}
