import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import Container from "@/components/site/container";
import { PageShell } from "@/components/site/page-shell";
import { productFields, type PhysicalProduct } from "@/features/services/lib/physical-products";
import ProductManager from "./product-manager";

export const metadata = { title: "实物商品管理" };

export default async function AdminProductsPage() {
  await requireAdmin("/admin/products");
  const { data, error } = await createAdminClient().from("physical_products")
    .select(productFields).eq("archived", false).order("created_at").order("slug");
  return (
    <PageShell>
      <Container>
        <main className="space-y-6 py-8">
          <h1 className="text-3xl font-semibold">实物商品管理</h1>
          {error ? <p role="status">商品数据库暂不可用。请确认已执行商品表 SQL 后再刷新。</p>
            : <ProductManager products={(data ?? []) as PhysicalProduct[]} />}
        </main>
      </Container>
    </PageShell>
  );
}
