import { shopProducts } from "@/features/services/lib/physical-products";
import ServicesList from "@/features/services/components/services-list";

export const metadata = { title: "奥秘商店 · THE ARCANE SHOP" };
export default async function ServicesPage() {
  return <ServicesList catalog={await shopProducts()} />;
}
