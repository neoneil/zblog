"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { usePreferences } from "@/components/site/preferences-provider";
import { Button } from "@/components/ui/button";
import glassStyles from "@/components/ui/glass-action.module.css";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatPrice, productHref, type Product } from "../lib/catalog";
import { MAX_QUANTITY } from "../lib/cart";
import { useCart } from "./use-cart";
import styles from "./services.module.css";

export { styles };
export function ShopShell({ children }: { children: React.ReactNode }) {
  return (
    <main className={styles.root}>
      <div className={styles.inner}>{children}</div>
    </main>
  );
}
export function ProductCard({ product }: { product: Product }) {
  const { t, language } = usePreferences();
  return (
    <Card className={styles.productCard}>
      <Link className={styles.productLink} href={productHref(product)}>
        <div className={`${styles.cardImage} ${product.category !== "physical" ? styles.onlineImage : ""}`}>
          <Image
            src={product.image}
            alt={t(product.title)}
            fill
            sizes="(min-width:900px) 350px, (min-width:640px) 45vw, 90vw"
          />
        </div>
        <div className={styles.cardContent}>
          <h2>{t(product.title)}</h2>
          {product.category !== "physical" && <div className={styles.cardDescription}>{t(product.intro)}</div>}
          <p>{formatPrice(product.priceCents, language)}</p>
        </div>
      </Link>
    </Card>
  );
}
export function QuantityControl({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (value: number) => void;
  label: string;
}) {
  const { t } = usePreferences();
  return (
    <div className={styles.quantity}>
      <Button
        size="icon"
        variant="ghost"
        aria-label={`${t({ en: "Decrease quantity", zh: "减少数量" })}: ${label}`}
        title={t({ en: "Decrease quantity", zh: "减少数量" })}
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
        type="button"
      >
        <Minus size={14} aria-hidden />
      </Button>
      <Input
        type="number"
        min={1}
        max={MAX_QUANTITY}
        step={1}
        value={value}
        aria-label={label}
        onChange={(event) => {
          const v = Number(event.target.value);
          if (Number.isInteger(v) && v >= 1 && v <= MAX_QUANTITY) onChange(v);
        }}
      />
      <Button
        size="icon"
        variant="ghost"
        aria-label={`${t({ en: "Increase quantity", zh: "增加数量" })}: ${label}`}
        title={t({ en: "Increase quantity", zh: "增加数量" })}
        disabled={value >= MAX_QUANTITY}
        onClick={() => onChange(value + 1)}
        type="button"
      >
        <Plus size={14} aria-hidden />
      </Button>
    </div>
  );
}
export function CartLink() {
  const { count } = useCart(),
    { t } = usePreferences();
  const label = `${t({ en: "Cart", zh: "购物车" })} (${count})`;
  return (
    <Link
      href="/cart"
      className={`${styles.cartLink} ${glassStyles.action}`}
      aria-label={label}
      title={label}
    >
      <ShoppingCart size={20} aria-hidden />
      {count > 0 && (
        <span aria-hidden className={`${styles.badge} ${glassStyles.badge}`}>
          {count}
        </span>
      )}
    </Link>
  );
}
