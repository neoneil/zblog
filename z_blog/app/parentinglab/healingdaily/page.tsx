import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HealingDailyPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] px-4 py-10 text-[var(--text)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <Card className="overflow-hidden">
          <CardHeader className="bg-[var(--card-soft)]">
            <Badge variant="secondary">Healing Daily</Badge>
            <CardTitle className="mt-3 text-3xl sm:text-4xl">
              每日疗愈
            </CardTitle>
            <CardDescription className="max-w-2xl leading-6">
              Gentle emotional care, small rituals, and everyday healing moments.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
            <Card className="bg-[var(--card-soft)]">
              <CardHeader>
                <CardTitle>Healing Daily Videos</CardTitle>
                <CardDescription>
                  Watch private Healing Daily videos through secure signed playback.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ButtonLink href="/parentinglab/healingdaily/videos" variant="primary">
                  每日疗愈视频
                </ButtonLink>
              </CardContent>
            </Card>

            <Card className="bg-[var(--card-soft)]">
              <CardHeader>
                <CardTitle>Reserved Content</CardTitle>
                <CardDescription>
                  This page is reserved for your Healing Daily content.
                </CardDescription>
              </CardHeader>
            </Card>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
