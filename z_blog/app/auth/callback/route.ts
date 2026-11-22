import { NextResponse } from "next/server";
import { safeReturnPath } from "@/lib/auth/return-path";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeReturnPath(searchParams.get("next"));

  const authFailure = searchParams.get("method") === "google" ? "google_failed" : "auth_failed";

  function failed(reason: "unavailable" | typeof authFailure) {
    const login = new URL("/login", origin);
    login.searchParams.set("next", next);
    login.searchParams.set("auth_error", reason);
    return NextResponse.redirect(login);
  }

  if (!code) {
    if (searchParams.has("error")) return failed(authFailure);
    return NextResponse.redirect(`${origin}${next}`);
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return failed(error.name === "AuthRetryableFetchError" ? "unavailable" : authFailure);
    return NextResponse.redirect(`${origin}${next}`);
  } catch {
    return failed("unavailable");
  }
}
