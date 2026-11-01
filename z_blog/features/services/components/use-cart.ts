"use client";

import { useSyncExternalStore } from "react";
import {
  CART_KEY,
  MAX_QUANTITY,
  normaliseCart,
  changeQuantity,
  cartTotals,
  type CartLine,
} from "../lib/cart";

const empty: CartLine[] = [];
let snapshot = empty,
  lastRaw: string | null = null;
const eventName = "cosmic-cart-change";
function getSnapshot() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (raw !== lastRaw) {
      lastRaw = raw;
      try {
        snapshot = normaliseCart(raw ? JSON.parse(raw) : []);
      } catch {
        snapshot = empty;
      }
    }
  } catch {
    /* Keep a memory-only cart when browser storage is unavailable. */
  }
  return snapshot;
}
function subscribe(listener: () => void) {
  window.addEventListener(eventName, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(eventName, listener);
    window.removeEventListener("storage", listener);
  };
}
function persist(cart: CartLine[]) {
  snapshot = normaliseCart(cart);
  lastRaw = JSON.stringify(snapshot);
  try {
    localStorage.setItem(CART_KEY, lastRaw);
  } catch {
    // Preserve the memory cart even when reads work but writes are blocked.
    try {
      lastRaw = localStorage.getItem(CART_KEY);
    } catch {
      /* Storage is fully blocked. */
    }
  }
  window.dispatchEvent(new Event(eventName));
}
export function useCart() {
  const cart = useSyncExternalStore(subscribe, getSnapshot, () => empty);
  return {
    cart,
    ...cartTotals(cart),
    setQuantity: (id: string, quantity: number) =>
      persist(changeQuantity(getSnapshot(), id, quantity)),
    add: (id: string, quantity = 1) => {
      if (
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > MAX_QUANTITY
      )
        return;
      const current = getSnapshot();
      persist(
        changeQuantity(
          current,
          id,
          Math.min(
            MAX_QUANTITY,
            (current.find((line) => line.productId === id)?.quantity ?? 0) +
              quantity,
          ),
        ),
      );
    },
  };
}
