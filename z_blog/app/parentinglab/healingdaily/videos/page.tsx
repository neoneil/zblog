import AstrologyVideoHub from "@/features/video/components/astrology-video-hub";
import { requireAdmin } from "@/lib/auth/require-admin";

export const metadata = {
  title: "占星影像 · Astrology Videos",
  description: "Stellarnests 频道、小说影像与原创占星视频。",
};

export default async function HealingDailyVideosPage() {
  await requireAdmin("/parentinglab/healingdaily/videos");

  return <AstrologyVideoHub />;
}
