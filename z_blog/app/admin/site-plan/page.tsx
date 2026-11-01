import { requireAdmin } from "@/lib/auth/require-admin";
import SitePlanDocument from "@/features/site-plan/components/site-plan-document";

export const metadata = {
  title: "网页布局和会员详情",
  robots: { index: false, follow: false },
};
export default async function SitePlanPage() {
  await requireAdmin("/admin/site-plan");
  return <SitePlanDocument />;
}
