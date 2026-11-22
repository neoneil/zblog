import { NextResponse } from "next/server";
import { safeReturnPath } from "@/lib/auth/return-path";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const origin = new URL(request.url).origin;
  if (request.headers.get("origin") !== origin) {
    return NextResponse.json({ error: "invalid_origin" }, { status: 403 });
  }

  try {
    const health = await fetch(new URL("/auth/v1/health", process.env.NEXT_PUBLIC_SUPABASE_URL), {
      headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY! },
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (health.status >= 500 || health.status === 429) return NextResponse.json({ error: "unavailable" }, { status: 503 });

    const { next } = await request.json();
    const callback = new URL("/auth/callback", origin);
    callback.searchParams.set("next", safeReturnPath(next));
    callback.searchParams.set("method", "google");
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callback.toString(), skipBrowserRedirect: true },
    });
    if (error || !data.url) {
      return NextResponse.json({ error: "start_failed" }, { status: 502 });
    }
    return NextResponse.json({ url: data.url });
  } catch {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
}
