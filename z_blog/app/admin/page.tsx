import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

const adminCards = [
  {
    title: "Posts",
    description: "Manage blog posts and content.",
    href: "/admin/posts",
  },
  {
    title: "Subscribe Authorized",
    description: "Manage subscription authorizations.",
    href: "/admin/subscribe-authorized",
  },
  {
    title: "ai-video-prompt",
    description: "ai-video-prompt.",
    href: "/admin/ai-video-prompt",
  },
  {
    title: "Reserved 4",
    description: "Coming soon.",
    href: "/admin/reserved-4",
  },
  {
    title: "Reserved 5",
    description: "Coming soon.",
    href: "/admin/reserved-5",
  },
];

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, role")
    .eq("id", user.id)
    .single();

  if (!profile || (profile.role !== "admin" && profile.role !== "editor")) {
    redirect("/");
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 text-(--text-white)">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-(--text-white)">
          Welcome, {profile.email}
        </p>
        <p className="text-sm text-(--text-white)">
          Role: {profile.role}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {adminCards.map((card) => (
          <Link key={card.href} href={card.href}>
            <Card className="h-full cursor-pointer transition-all hover:-translate-y-1 hover:border-primary hover:shadow-lg">
              <CardContent className="flex h-full flex-col justify-between p-6">
                <div>
                  <CardTitle className="mb-3 text-lg text-(--text-white)">
                    {card.title}
                  </CardTitle>

                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </div>

                <div className="mt-6 text-sm font-medium text-primary">
                  Open →
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}