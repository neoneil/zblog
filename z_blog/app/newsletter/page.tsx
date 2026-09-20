import { PageHero, PageSection, PageShell } from "@/components/site/page-shell";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function NewsletterPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Newsletter"
        title="订阅通讯"
        description="这里先作为后续邮件订阅和会员内容通知的入口，前端保持简洁，等订阅服务确定后再接入提交逻辑。"
      />

      <PageSection className="pt-0">
        <Card className="mx-auto max-w-2xl bg-[var(--card)]">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <Input type="email" placeholder="你的邮箱" />
            <ButtonLink href="/pricing" variant="primary" fullWidth>
              先查看会员权益
            </ButtonLink>
          </CardContent>
        </Card>
      </PageSection>
    </PageShell>
  );
}
