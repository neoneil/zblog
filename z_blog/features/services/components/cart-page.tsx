"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Trash2 } from "lucide-react";
import { usePreferences } from "@/components/site/preferences-provider";
import { Button, ButtonLink } from "@/components/ui/button";
import { formatPrice, formatProductPrice, products, productHref, videoCourses, type Product } from "../lib/catalog";
import { useCart } from "./use-cart";
import { QuantityControl, ShopShell, styles } from "./shop-shared";
import { EMAIL_READING_PRODUCT_ID } from "../lib/email-reading-order";
import {
  useEmailReadingDraft,
  setEmailReadingDraft,
} from "./use-email-reading-draft";
import emailStyles from "./email-reading.module.css";

export default function CartPage({ catalog = [...products, ...videoCourses] }: { catalog?: Product[] }) {
  const { t, language } = usePreferences(),
    { cart, setQuantity } = useCart();
  const byId = new Map(catalog.map((product) => [product.id, product]));
  const subtotal = cart.reduce((total, line) => {
    const product = byId.get(line.productId);
    return total + (product?.priceCents ?? 0) * line.quantity;
  }, 0);
  const emailDraft = useEmailReadingDraft();
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
                const product = byId.get(line.productId);
                if (!product) return (
                  <tr key={line.productId}>
                    <td colSpan={3}>{t({ zh: "此商品暂不可用", en: "This product is unavailable" })}</td>
                    <td><Button variant="ghost" onClick={() => setQuantity(line.productId, 0)}>{t({ zh: "移除", en: "Remove" })}</Button></td>
                  </tr>
                );
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
                            onClick={() => {
                              setQuantity(product.id, 0);
                              if (product.id === EMAIL_READING_PRODUCT_ID)
                                setEmailReadingDraft(null);
                            }}
                            aria-label={`${t({ en: "Remove", zh: "移除" })}: ${t(product.title)}`}
                            title={t({ en: "Remove item", zh: "移除商品" })}
                          >
                            <Trash2 size={14} aria-hidden />
                            {t({ en: "Remove", zh: "移除" })}
                          </Button>
                          {product.id === EMAIL_READING_PRODUCT_ID && (
                            <>
                              {emailDraft &&
                              emailDraft.questions.length === line.quantity ? (
                                <details className={emailStyles.review}>
                                  <summary>
                                    {t({
                                      zh: "查看咨询资料",
                                      en: "Review consultation details",
                                    })}
                                  </summary>
                                  <p>
                                    {emailDraft.name} · {emailDraft.email}
                                  </p>
                                  {emailDraft.birthDate && (
                                    <p>{emailDraft.birthDate}</p>
                                  )}
                                  <ol>
                                    {emailDraft.questions.map(
                                      (question, index) => (
                                        <li key={index}>{question}</li>
                                      ),
                                    )}
                                  </ol>
                                  {emailDraft.background && (
                                    <p>{emailDraft.background}</p>
                                  )}
                                </details>
                              ) : (
                                <p>
                                  {t({
                                    zh: "咨询资料尚未填写或已随页面刷新清空。",
                                    en: "Consultation details are missing or were cleared on page refresh.",
                                  })}
                                </p>
                              )}
                              <Link
                                className={emailStyles.reviewLink}
                                href={`${productHref(product)}#email-reading-order`}
                              >
                                {t({
                                  zh: "填写或编辑问题",
                                  en: "Enter or edit questions",
                                })}
                              </Link>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                    <td data-label={t({ en: "Price", zh: "单价" })}>
                      {formatProductPrice(product, language)}
                    </td>
                    <td data-label={t({ en: "Quantity", zh: "数量" })}>
                      {product.id === EMAIL_READING_PRODUCT_ID ? (
                        <span>
                          {t({
                            zh: `${line.quantity} 个独立问题`,
                            en: `${line.quantity} independent question${line.quantity === 1 ? "" : "s"}`,
                          })}
                        </span>
                      ) : (
                        <QuantityControl
                          value={line.quantity}
                          onChange={(value) => setQuantity(product.id, value)}
                          label={`${t({ en: "Quantity", zh: "数量" })}: ${t(product.title)}`}
                        />
                      )}
                    </td>
                    <td data-label={t({ en: "Total", zh: "合计" })}>
                      {formatProductPrice(product, language, line.quantity)}
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
                {formatPrice(subtotal, language)}
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
