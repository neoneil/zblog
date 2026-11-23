import { shopProducts } from "@/features/services/lib/physical-products";
import { videoCourses } from "@/features/services/lib/catalog";
import CartPage from "@/features/services/components/cart-page";

export const metadata = { title: "购物车 · Cart" };
export default async function Cart() {
  return <CartPage catalog={[...await shopProducts(), ...videoCourses]} />;
}
