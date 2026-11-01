import { createHash } from "node:crypto";

export type ContactMessage = { name: string; email: string; message: string };
type Environment = Record<string, string | undefined>;
type Send = (
  message: ContactMessage,
  env: Environment,
  key: string,
) => Promise<void>;
const MAX_BYTES = 16000;
const WINDOW = 15 * 60 * 1000;

export function validateContact(value: unknown): ContactMessage | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const v = value as Record<string, unknown>;
  if (
    typeof v.name !== "string" ||
    typeof v.email !== "string" ||
    typeof v.message !== "string"
  )
    return null;
  const name = v.name.trim(),
    email = v.email.trim(),
    message = v.message.trim();
  if (
    name.length > 100 ||
    /[\r\n\x00-\x1f\x7f]/.test(name) ||
    email.length > 254 ||
    !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) ||
    /[\x00-\x1f\x7f]/.test(email) ||
    !message ||
    message.length > 5000 ||
    /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(message)
  )
    return null;
  return { name, email, message };
}

export function createContactLimiter() {
  const attempts = new Map<string, { count: number; reset: number }>();
  return (key: string, now: number) => {
    for (const [id, entry] of attempts)
      if (entry.reset <= now) attempts.delete(id);
    const entry = attempts.get(key);
    if (entry && entry.count >= 5) return false;
    if (!entry && attempts.size >= 10000) return false;
    attempts.set(key, {
      count: (entry?.count ?? 0) + 1,
      reset: entry?.reset ?? now + WINDOW,
    });
    return true;
  };
}

export async function sendContactEmail(
  message: ContactMessage,
  env: Environment,
  key: string,
) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": key,
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM_EMAIL,
      to: [env.CONTACT_TO_EMAIL],
      reply_to: message.email,
      subject: "Website contact · Cosmic Childhood",
      text: `Name: ${message.name || "Not provided"}\nEmail: ${message.email}\n\n${message.message}`,
    }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error("MAIL_PROVIDER_REJECTED");
  const result = await response.json();
  if (!result || typeof result.id !== "string")
    throw new Error("MAIL_PROVIDER_INVALID_RESPONSE");
}

async function readLimitedBody(request: Request) {
  if (Number(request.headers.get("content-length")) > MAX_BYTES)
    throw new Error("TOO_LARGE");
  if (!request.body) throw new Error("INVALID_BODY");
  const reader = request.body.getReader(),
    chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) {
        await reader.cancel();
        throw new Error("TOO_LARGE");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  return JSON.parse(new TextDecoder().decode(bytes));
}

export function createContactHandler({
  env,
  send = sendContactEmail,
  limit = createContactLimiter(),
  now = Date.now,
}: {
  env: Environment;
  send?: Send;
  limit?: ReturnType<typeof createContactLimiter>;
  now?: () => number;
}) {
  return async (request: Request) => {
    const json = (status: number, code: string, headers?: HeadersInit) =>
      Response.json(
        { ok: status === 200, code },
        { status, headers: { "Cache-Control": "no-store", ...headers } },
      );
    const origin = request.headers.get("origin");
    if (!origin || origin !== new URL(request.url).origin)
      return json(403, "FORBIDDEN");
    if (
      request.headers.get("content-type")?.split(";")[0].trim() !==
      "application/json"
    )
      return json(415, "INVALID_CONTENT_TYPE");
    // A per-process abuse brake, not a distributed production rate-limit service.
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const client = createHash("sha256").update(ip).digest("hex");
    if (!limit(client, now()))
      return json(429, "RATE_LIMITED", { "Retry-After": "900" });
    let body: Record<string, unknown>;
    try {
      body = await readLimitedBody(request);
    } catch (error) {
      return json(
        error instanceof Error && error.message === "TOO_LARGE" ? 413 : 400,
        "INVALID_MESSAGE",
      );
    }
    if (!body || typeof body !== "object" || Array.isArray(body))
      return json(400, "INVALID_MESSAGE");
    if (typeof body.website !== "string" || body.website.trim())
      return json(400, "INVALID_MESSAGE");
    const message = validateContact(body);
    if (!message) return json(400, "INVALID_MESSAGE");
    if (
      ![env.RESEND_API_KEY, env.CONTACT_FROM_EMAIL, env.CONTACT_TO_EMAIL].every(
        (value) => value?.trim(),
      )
    )
      return json(503, "MAIL_NOT_CONFIGURED");
    const submissionId = body.submissionId;
    if (
      typeof submissionId !== "string" ||
      !/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i.test(
        submissionId,
      )
    )
      return json(400, "INVALID_MESSAGE");
    const key = `contact-${createHash("sha256")
      .update(JSON.stringify([submissionId, message]))
      .digest("hex")}`;
    try {
      await send(message, env, key);
      return json(200, "SENT");
    } catch {
      return json(502, "SEND_FAILED");
    }
  };
}
