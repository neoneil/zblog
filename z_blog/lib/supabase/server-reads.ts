import type { User } from "@supabase/supabase-js";

const authDeadlineMs = 4000;
const readDeadlineMs = 6000;

type AuthClient = {
  auth: { getUser: () => Promise<{ data: { user: User | null }; error: { name: string } | null }> };
};

export const fetchWithReadDeadline: typeof fetch = async (input, init) => {
  const request = input instanceof Request ? input : null;
  const method = (init?.method ?? request?.method ?? "GET").toUpperCase();
  const isRead = method === "GET" || method === "HEAD";
  const url = new URL(request?.url ?? String(input), process.env.NEXT_PUBLIC_SUPABASE_URL);
  const grant = method === "POST" && url.pathname.endsWith("/auth/v1/token")
    ? url.searchParams.get("grant_type")
    : null;
  const isSessionRequest =
    (method === "GET" && url.pathname.endsWith("/auth/v1/user")) ||
    grant === "refresh_token" || grant === "pkce";
  const currentSignal = init?.signal ?? request?.signal;
  const deadline = isRead || grant === "pkce" ? AbortSignal.timeout(readDeadlineMs) : undefined;
  const signal = deadline && currentSignal ? AbortSignal.any([currentSignal, deadline]) : deadline ?? currentSignal;

  try {
    return await fetch(input, { ...init, signal });
  } catch (error) {
    if (!isSessionRequest || (!deadline?.aborted &&
        !(error instanceof TypeError && error.message === "fetch failed"))) {
      throw error;
    }

    // Auth JS handles a 503 as a retryable outage and keeps the current session.
    return Response.json({ message: "Sign-in service temporarily unavailable" }, { status: 503 });
  }
};

export async function readServerUser(client: AuthClient): Promise<{ user: User | null; unavailable: boolean }> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const unavailable = { user: null, unavailable: true };
  try {
    return await Promise.race([
      client.auth.getUser().then(({ data, error }) => ({
        user: data.user,
        unavailable: error?.name === "AuthRetryableFetchError" || error?.name === "AuthUnknownError",
      })).catch(() => unavailable),
      new Promise<typeof unavailable>((resolve) => {
        timer = setTimeout(() => resolve(unavailable), authDeadlineMs);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}
