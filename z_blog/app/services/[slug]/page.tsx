import { notFound } from "next/navigation";
import { products } from "@/features/services/lib/catalog";
import ProductDetail from "@/features/services/components/product-detail";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  return {
    title: product
      ? `${product.title.zh} · ${product.title.en}`
      : "Product not found",
  };
}
export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
