import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { products, type Product } from "./catalog";

export const imageBucket = "physical-product-images";
export const productFields = "slug,title_zh,title_en,subtitle_zh,subtitle_en,price_stars,image,created_at,updated_at,archived";

export type PhysicalProduct = {
  slug: string;
  title_zh: string;
  title_en: string;
  subtitle_zh: string;
  subtitle_en: string;
  price_stars: number;
  image: string;
  created_at: string;
  updated_at: string;
  archived: boolean;
};

const managed = new Set(["stellar-soul-sigil", "celestial-jewelry", "mystic-fragrances", "arcane-creations"]);

function asProduct(row: PhysicalProduct): Product {
  const original = products.find((item) => item.slug === row.slug);
  const subtitle = { zh: row.subtitle_zh, en: row.subtitle_en };
  return {
    ...original,
    id: original?.id ?? row.slug,
    slug: row.slug,
    title: { zh: row.title_zh, en: row.title_en },
    image: row.image,
    // The legacy column stores 100 units per AUD, matching Australian cents.
    priceCents: row.price_stars,
    category: "physical",
    date: row.created_at.slice(0, 10),
    intro: subtitle,
    sections: [],
    availabilityNote: { zh: "结算暂未开放。", en: "Checkout is not available yet." },
  };
}

export const shopProducts = cache(async (): Promise<Product[]> => {
  const { data, error } = await (await createClient()).from("physical_products")
    .select(productFields).eq("archived", false).order("created_at").order("slug");
  // Keep the original shop working while the migration is awaiting installation.
  if (error?.code === "PGRST205" || error?.code === "42P01") return products;
  const published = ((data ?? []) as PhysicalProduct[]).map(asProduct);
  const replacements = new Map(published.map((item) => [item.slug, item]));
  const existing = products.flatMap((item) => managed.has(item.slug) ? replacements.get(item.slug) ?? [] : item);
  return [...existing, ...published.filter((item) => !managed.has(item.slug))];
});
