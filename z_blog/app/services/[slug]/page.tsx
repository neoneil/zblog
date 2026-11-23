import { videoCourses } from "@/features/services/lib/catalog";
import { notFound } from "next/navigation";
import { shopProducts } from "@/features/services/lib/physical-products";
import ProductDetail from "@/features/services/components/product-detail";

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = [...videoCourses, ...await shopProducts()].find((item) => item.slug === slug);
  return {
    title: product
      ? `${product.title.zh} · ${product.title.en}`
      : "Product not found",
  };
}
export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const catalog = await shopProducts();
  const product = [...videoCourses, ...catalog].find((item) => item.slug === slug);
  if (!product) notFound();
  return <ProductDetail product={product} catalog={catalog} />;
}
