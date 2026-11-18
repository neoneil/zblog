import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/require-user";
import {
  billingUser,
  walletSnapshot,
} from "@/features/billing/lib/stardust-server";
import { COURSES } from "@/features/billing/lib/stardust-config";
import { listPublishedVideos } from "@/features/video/lib/video-actions";
import VideoPlayer from "@/components/video/video-player";
import { PageShell } from "@/components/site/page-shell";
import { ButtonLink } from "@/components/ui/button";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const { course } = await params;
  if (!Object.prototype.hasOwnProperty.call(COURSES, course)) notFound();
  await requireUser(`/learn/${course}`);
  const context = await billingUser();
  const snapshot = await walletSnapshot();
  const authorized =
    context?.isAdmin ||
    (snapshot?.ready &&
      !snapshot.wallet?.blocked &&
      (snapshot.memberships.some((item) => item.plan === "annual") ||
        snapshot.courses.some((item) => item.course === course)));
  const videos = authorized
    ? await listPublishedVideos(`course-${course}`)
    : [];
  return (
    <PageShell className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6 text-[var(--text)]">
        <h1 className="text-2xl font-semibold">
          {COURSES[course as keyof typeof COURSES].zh}
        </h1>
        {!authorized ? (
          <>
            <p>此课程需要有效的年度会员或课程观看权限。</p>
            <ButtonLink href="/wallet">会员与钱包</ButtonLink>
          </>
        ) : videos.length ? (
          videos.map((video) => (
            <section
              key={video.id}
              className="space-y-3 border-b border-[var(--border)] pb-6"
            >
              <h2 className="text-lg font-medium">{video.title}</h2>
              <VideoPlayer
                signedUrl={video.signed_video_url}
                title={video.title}
                posterUrl={video.signed_thumbnail_url}
              />
              {video.description && (
                <p className="text-sm text-[var(--text-soft)]">
                  {video.description}
                </p>
              )}
            </section>
          ))
        ) : (
          <p>课程内容准备中。</p>
        )}
      </div>
    </PageShell>
  );
}
