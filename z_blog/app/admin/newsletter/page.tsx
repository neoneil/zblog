import { requireAdmin } from "@/lib/auth/require-admin";
import { PageShell, PageHero, PageSection } from "@/components/site/page-shell";
import WelcomeEditor from "@/features/newsletter/components/welcome-editor";
import { defaultTemplate } from "@/features/newsletter/lib/template";
export default async function NewsletterAdminPage() {
  const { supabase } = await requireAdmin("/admin/newsletter");
  const { data, error } = await supabase.from("newsletter_settings").select("template").eq("id", 1).single();
  return <PageShell><PageHero title="欢迎邮件" description="编辑点击订阅后直接发送的双语欢迎邮件、出生星盘入口及可点击图片。" /><PageSection>
    {error && <p role="alert">请先执行 Newsletter SQL；当前显示默认模板。</p>}
    <WelcomeEditor template={{ ...defaultTemplate, ...data?.template }} />
  </PageSection></PageShell>;
}
