"use client";

export type ReadingConsentDetail = {
  stars: number;
  resolve: (value: boolean) => void;
};
const uncertainRequests = new Map<string, string>();
export async function readingFetch(url: string, body: unknown) {
  const payload = JSON.stringify(body);
  const key = `${url}:${payload}`;
  const id = uncertainRequests.get(key) || crypto.randomUUID();
  uncertainRequests.set(key, id);
  let confirmed = false;
  for (let attempt = 0; attempt < 5; attempt++) {
    let response: Response;
    try {
      response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": id,
          ...(confirmed ? { "X-Stardust-Confirm": "yes" } : {}),
        },
        body: payload,
      });
    } catch (error) {
      if (attempt === 4) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1500));
      continue;
    }
    const result = await response
      .clone()
      .json()
      .catch(() => ({}));
    if (response.status === 402 && result.code === "confirm_stars") {
      const allowed = await new Promise<boolean>((resolve) =>
        window.dispatchEvent(
          new CustomEvent<ReadingConsentDetail>("stardust-consent", {
            detail: { stars: result.stars, resolve },
          }),
        ),
      );
      if (!allowed) {
        uncertainRequests.delete(key);
        return new Response(
          JSON.stringify({
            error: "已取消积分支付。 / STARS payment cancelled.",
            code: "cancelled",
          }),
          { status: 402 },
        );
      }
      confirmed = true;
      continue;
    }
    if (
      response.status === 409 &&
      result.code === "processing" &&
      attempt < 4
    ) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      continue;
    }
    if (response.ok || (response.status < 500 && result.code !== "processing"))
      uncertainRequests.delete(key);
    return response;
  }
  throw new Error(
    "请求仍在处理中，请在钱包中查看报告。 / Check your wallet for the report.",
  );
}
