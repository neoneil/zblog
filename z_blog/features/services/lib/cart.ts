import { getProduct } from "./catalog";

export type CartLine = { productId: string; quantity: number };
export const CART_KEY = "cosmic-childhood-cart-v1";
export const MAX_QUANTITY = 99;
export function normaliseCart(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return [];
  const quantities = new Map<string, number>();
  for (const line of value.slice(0, 100)) {
    if (
      !line ||
      typeof line !== "object" ||
      !getProduct(line.productId) ||
      !Number.isInteger(line.quantity) ||
      line.quantity < 1 ||
      line.quantity > MAX_QUANTITY
    )
      continue;
    quantities.set(
      line.productId,
      Math.min(
        MAX_QUANTITY,
        (quantities.get(line.productId) ?? 0) + line.quantity,
      ),
    );
  }
  return [...quantities].map(([productId, quantity]) => ({
    productId,
    quantity,
  }));
}
export function changeQuantity(
  cart: CartLine[],
  productId: string,
  quantity: number,
) {
  if (
    !getProduct(productId) ||
    !Number.isInteger(quantity) ||
    quantity < 0 ||
    quantity > MAX_QUANTITY
  )
    return cart;
  const others = cart.filter((line) => line.productId !== productId);
  if (quantity === 0) return others;
  return normaliseCart([
    ...cart.map((line) =>
      line.productId === productId ? { productId, quantity } : line,
    ),
    ...(!cart.some((line) => line.productId === productId)
      ? [{ productId, quantity }]
      : []),
  ]);
}
export function cartTotals(cart: CartLine[]) {
  return normaliseCart(cart).reduce(
    (total, line) => ({
      count: total.count + line.quantity,
      subtotalCents:
        total.subtotalCents +
        getProduct(line.productId)!.priceCents * line.quantity,
    }),
    { count: 0, subtotalCents: 0 },
  );
}
