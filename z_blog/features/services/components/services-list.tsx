"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePreferences } from "@/components/site/preferences-provider";
import { Select } from "@/components/ui/select";
import {
  selectProducts,
  products,
  type Product,
  type ProductFilter,
  type ProductSort,
} from "../lib/catalog";
import { ProductCard, ShopShell, styles } from "./shop-shared";
import archiveStyles from "@/features/thoth/components/knowledge-entries.module.css";

export default function ServicesList({
  embedded = false,
  catalog = products,
}: {
  embedded?: boolean;
  catalog?: Product[];
}) {
  const { t } = usePreferences();
  const [filter, setFilter] = useState<ProductFilter>("all"),
    [sort, setSort] = useState<ProductSort | "featured">("featured");
  const [view, setView] = useState<"grid" | "list">("grid");
  const selected =
    sort === "featured"
      ? catalog.filter((item) => filter === "all" || item.category === filter)
      : selectProducts(filter, sort, catalog);
  const title = t({ en: "THE ARCANE SHOP", zh: "奥秘商店" });
  const introduction = t({
    en: "From Ancient Wisdom to Everyday Magic — Discover Courses, Readings & Mystical Treasures.",
    zh: "从古老智慧到日常魔法——探索神秘学课程、专属解读与魔法珍藏。",
  });
  if (embedded)
    return (
      <section id="home-services" className={styles.embedded}>
        <header className={styles.header}>
          <h2>{title}</h2>
          <div className={`${archiveStyles.subtitle} mt-3`}>{introduction}</div>
        </header>
        <Link href="/services" className={styles.shopEntry}>
          <Card className={styles.productCard}>
            <div className={styles.entryImage}>
              <Image
                src="/products/arcane-creations.png"
                alt={t({
                  zh: "塔罗与星辰主题的神秘珍藏",
                  en: "Mystical treasures inspired by tarot and the stars",
                })}
                fill
                sizes="(max-width: 767px) 100vw, 640px"
              />
            </div>
            <CardContent className={styles.entryCopy}>
              <h3>{title}</h3>
              <p>{introduction}</p>
              <span>
                {t({ zh: "浏览全部商品", en: "Browse all products" })}
                <ArrowRight size={18} aria-hidden="true" />
              </span>
            </CardContent>
          </Card>
        </Link>
      </section>
    );
  const content = (
    <>
      <header className={styles.header}>
        <h1>{title}</h1>
        <div className={`${archiveStyles.subtitle} mt-3`}>{introduction}</div>
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
            <option value="physical">
              {t({ en: "Physical goods", zh: "实物商品" })}
            </option>
            <option value="special">{t({zh:"主题活动与特别企划",en:"Events & special projects"})}</option>
          </Select>
        </label>
        <label>
          {t({ en: "Sort by", zh: "排序" })}
          <Select
            aria-label={t({ en: "Sort by", zh: "排序" })}
            value={sort}
            onChange={(event) =>
              setSort(event.target.value as ProductSort | "featured")
            }
          >
            <option value="featured">
              {t({ en: "Featured", zh: "推荐顺序" })}
            </option>
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
        <div
          className={styles.viewToggle}
          role="group"
          aria-label={t({ zh: "商品显示方式", en: "Product view" })}
        >
          {(
            [
              {
                id: "grid",
                icon: LayoutGrid,
                label: { zh: "卡片视图", en: "Grid view" },
              },
              {
                id: "list",
                icon: List,
                label: { zh: "列表视图", en: "List view" },
              },
            ] as const
          ).map(({ id, icon: Icon, label }) => (
            <Button
              key={id}
              type="button"
              variant="ghost"
              size="icon"
              title={t(label)}
              aria-label={t(label)}
              aria-pressed={view === id}
              onClick={() => setView(id)}
            >
              <Icon size={20} aria-hidden="true" />
            </Button>
          ))}
        </div>
      </div>
      {view === "list" ? (
        <div className={styles.productList}>
          {selected.map((product) => (
            <ProductCard key={product.id} product={product} layout="list" />
          ))}
        </div>
      ) : (
        <>
          <div className={styles.onlineGrid}>
            {selected
              .filter((product) => product.category !== "physical")
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
          <div className={styles.physicalGrid}>
            {selected
              .filter((product) => product.category === "physical")
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </>
      )}
    </>
  );
  return <ShopShell>{content}</ShopShell>;
}
