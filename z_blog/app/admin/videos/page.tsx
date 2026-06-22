import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AdminVideosClient from "@/features/video/components/admin-videos-client";
import { listAdminVideos } from "@/features/video/lib/video-actions";

export const metadata = {
  title: "Video Manager",
  description: "Manage Healing Daily videos.",
};

export default async function AdminVideosPage() {
  const videos = await listAdminVideos();

  return (
    <main className="min-h-screen bg-[var(--bg)] px-4 py-8 text-[var(--text)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <Card className="overflow-hidden">
          <CardHeader className="bg-[var(--card-soft)]">
            <Badge variant="secondary">Admin</Badge>
            <CardTitle className="mt-3 text-3xl">
              Video Manager
            </CardTitle>
            <CardDescription>
              Manage Healing Daily videos stored in the private zblog bucket.
            </CardDescription>
          </CardHeader>
        </Card>

        <AdminVideosClient videos={videos} />
      </div>
    </main>
  );
}
