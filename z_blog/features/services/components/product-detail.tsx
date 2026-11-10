"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  Share2,
  Pin,
  ShoppingBag,
  MessageCircle,
  X,
} from "lucide-react";
import { usePreferences } from "@/components/site/preferences-provider";
import { Button, ButtonLink } from "@/components/ui/button";
import { products, formatPrice, type Product } from "../lib/catalog";
import { useCart } from "./use-cart";
import { MAX_QUANTITY } from "../lib/cart";
import { ProductCard, QuantityControl, ShopShell, styles } from "./shop-shared";
import { serviceGuides } from "../lib/service-guides";
import ServiceGuideContent from "./service-guide-content";

export default function ProductDetail({ product }: { product: Product }) {
  const guide = serviceGuides[product.id];
  const { t, language } = usePreferences(),
    cart = useCart();
  const [quantity, setQuantity] = useState(1),
    [open, setOpen] = useState(false);
  const canAdd =
    (cart.cart.find((line) => line.productId === product.id)?.quantity ?? 0) +
      quantity <=
    MAX_QUANTITY;
  return (
    <ShopShell>
      <Link className={styles.back} href="/services">
        <ArrowLeft size={16} aria-hidden />
        {t({ en: "All products", zh: "全部产品" })}
      </Link>
      <div className={styles.detail}>
        <figure className={styles.mainImage}>
          <Image
            src={product.image}
            alt={t(product.title)}
            fill
            priority
            sizes="(min-width:900px) 532px, 90vw"
          />
        </figure>
        <div className={styles.productInfo}>
          <h1>{t(product.title)}</h1>
          <p className={styles.price}>
            {formatPrice(product.priceCents, language)}
          </p>
          <div className={styles.buy}>
            <div>
              <p>{t({ en: "Quantity", zh: "数量" })}</p>
              <QuantityControl
                value={quantity}
                onChange={setQuantity}
                label={t({ en: "Product quantity", zh: "商品数量" })}
              />
            </div>
            {!canAdd && (
              <p role="status" className="text-[var(--danger)]">
                {t({
                  en: "A maximum of 99 of this item can be added to your cart.",
                  zh: "购物车中此商品的数量上限为99。",
                })}
              </p>
            )}
            <Button
              disabled={!canAdd}
              onClick={() => {
                cart.add(product.id, quantity);
                setOpen(true);
              }}
            >
              <ShoppingBag size={18} aria-hidden />
              {t({ en: "Add to cart", zh: "加入购物车" })}
            </Button>
          </div>
          <div className={styles.copy}>
            {guide ? (
              <p className={styles.serviceTagline}>{t(guide.tagline)}</p>
            ) : (
              <>
                <p>{t(product.intro)}</p>
                {product.sections.map((section) => (
                  <section key={section.title.en}>
                    <h2>{t(section.title)}</h2>
                    {section.paragraphs?.map((paragraph) => (
                      <p key={paragraph.en}>{t(paragraph)}</p>
                    ))}
                    {section.bullets && (
                      <ul>
                        {section.bullets.map((item) => (
                          <li key={item.en}>{t(item)}</li>
                        ))}
                      </ul>
                    )}
                  </section>
                ))}
              </>
            )}
            <Link
              href={guide ? "/contact" : "/aboutus#contact-title"}
              className="text-[var(--primary)]"
            >
              {t({ en: "Contact us", zh: "联系我们" })}
            </Link>
          </div>
          <nav
            className={styles.social}
            aria-label={t({ en: "Social links", zh: "社交链接" })}
          >
            <Link href="/">
              <Share2 size={16} aria-hidden />
              {t({ en: "Share", zh: "分享" })}
            </Link>
            <Link href="/">
              <MessageCircle size={16} aria-hidden />
              {t({ en: "Tweet", zh: "推文" })}
            </Link>
            <Link href="/">
              <Pin size={16} aria-hidden />
              {t({ en: "Pin it", zh: "收藏" })}
            </Link>
          </nav>
        </div>
      </div>
      {guide && <ServiceGuideContent guide={guide} />}
      <section className={styles.recommend}>
        <h2>{t({ en: "You May Also Like", zh: "你可能也喜欢" })}</h2>
        <div className={styles.grid}>
          {products
            .filter((item) => item.id !== product.id)
            .map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
        </div>
      </section>
      <AddedToCart
        product={product}
        quantity={quantity}
        open={open}
        onClose={() => setOpen(false)}
        count={cart.count}
      />
    </ShopShell>
  );
}

function AddedToCart({
  product,
  quantity,
  open,
  onClose,
  count,
}: {
  product: Product;
  quantity: number;
  open: boolean;
  onClose: () => void;
  count: number;
}) {
  const { t } = usePreferences(),
    ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (open && !ref.current?.open) ref.current?.showModal();
    else if (!open && ref.current?.open) ref.current.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={styles.popup}
      aria-labelledby="cart-added-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        )
          onClose();
      }}
    >
      <header>
        <Check size={20} aria-hidden />
        <h2 id="cart-added-title">
          {t({ en: "Just added to your cart", zh: "已加入购物车" })}
        </h2>
        <Button
          size="icon"
          variant="ghost"
          onClick={onClose}
          title={t({ en: "Close", zh: "关闭" })}
          aria-label={t({
            en: "Close cart notification",
            zh: "关闭购物车提示",
          })}
        >
          <X size={18} aria-hidden />
        </Button>
      </header>
      <div className={styles.popupProduct}>
        <Image src={product.image} alt="" width={80} height={80} />
        <div>
          <p>{t(product.title)}</p>
          <p>
            {t({ en: "Quantity", zh: "数量" })}: {quantity}
          </p>
        </div>
      </div>
      <div className={styles.popupActions}>
        <ButtonLink href="/cart" onClick={onClose}>
          {t({ en: "View cart", zh: "查看购物车" })} ({count})
        </ButtonLink>
        <Button variant="ghost" onClick={onClose}>
          {t({ en: "Continue shopping", zh: "继续购物" })}
        </Button>
      </div>
    </dialog>
  );
}
