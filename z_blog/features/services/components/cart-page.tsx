"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Trash2 } from "lucide-react";
import { usePreferences } from "@/components/site/preferences-provider";
import { Button, ButtonLink } from "@/components/ui/button";
import { formatPrice, getProduct, productHref } from "../lib/catalog";
import { useCart } from "./use-cart";
import { QuantityControl, ShopShell, styles } from "./shop-shared";

export default function CartPage() {
  const { t, language } = usePreferences(),
    { cart, subtotalCents, setQuantity } = useCart();
  return (
    <ShopShell>
      <header className={styles.cartHeader}>
        <h1>{t({ en: "Your cart", zh: "你的购物车" })}</h1>
        <Link href="/services">
          {t({ en: "Continue shopping", zh: "继续购物" })}
        </Link>
      </header>
      {cart.length === 0 ? (
        <div className={styles.empty}>
          <ShoppingBag size={48} aria-hidden />
          <p>
            {t({
              en: "Your cart is currently empty.",
              zh: "你的购物车目前是空的。",
            })}
          </p>
          <ButtonLink href="/services">
            {t({ en: "Browse products", zh: "浏览产品" })}
          </ButtonLink>
        </div>
      ) : (
        <>
          <table className={styles.table}>
            <caption className="sr-only">
              {t({ en: "Shopping cart items", zh: "购物车商品明细" })}
            </caption>
            <thead>
              <tr>
                {[
                  { en: "Product", zh: "商品" },
                  { en: "Price", zh: "单价" },
                  { en: "Quantity", zh: "数量" },
                  { en: "Total", zh: "合计" },
                ].map((label) => (
                  <th key={label.en} scope="col">
                    {t(label)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cart.map((line) => {
                const product = getProduct(line.productId)!;
                return (
                  <tr key={line.productId} data-product-id={line.productId}>
                    <td>
                      <div className={styles.lineProduct}>
                        <Image
                          src={product.image}
                          alt=""
                          width={88}
                          height={88}
                        />
                        <div>
                          <Link href={productHref(product)}>
                            {t(product.title)}
                          </Link>
                          <Button
                            variant="ghost"
                            onClick={() => setQuantity(product.id, 0)}
                            aria-label={`${t({ en: "Remove", zh: "移除" })}: ${t(product.title)}`}
                            title={t({ en: "Remove item", zh: "移除商品" })}
                          >
                            <Trash2 size={14} aria-hidden />
                            {t({ en: "Remove", zh: "移除" })}
                          </Button>
                        </div>
                      </div>
                    </td>
                    <td data-label={t({ en: "Price", zh: "单价" })}>
                      {formatPrice(product.priceCents, language)}
                    </td>
                    <td data-label={t({ en: "Quantity", zh: "数量" })}>
                      <QuantityControl
                        value={line.quantity}
                        onChange={(value) => setQuantity(product.id, value)}
                        label={`${t({ en: "Quantity", zh: "数量" })}: ${t(product.title)}`}
                      />
                    </td>
                    <td data-label={t({ en: "Total", zh: "合计" })}>
                      {formatPrice(
                        product.priceCents * line.quantity,
                        language,
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <section className={styles.summary} aria-live="polite">
            <p>
              {t({ en: "Subtotal", zh: "小计" })}{" "}
              <strong data-testid="cart-subtotal">
                {formatPrice(subtotalCents, language)}
              </strong>
            </p>
            <p className={styles.minor}>
              {t({
                en: "Checkout is not available yet. No payment will be taken.",
                zh: "结算暂未开放，目前不会收取任何款项。",
              })}
            </p>
            <Button disabled>
              {t({ en: "Checkout · Coming soon", zh: "结算 · 待开发" })}
            </Button>
          </section>
        </>
      )}
    </ShopShell>
  );
}
