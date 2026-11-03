import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";

const require = createRequire(import.meta.url),
  exports = {};
const { outputText } = ts.transpileModule(
  readFileSync(new URL("../lib/contact/server.ts", import.meta.url), "utf8"),
  {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  },
);
new Function("require", "exports", outputText)(require, exports);
const {
  validateContact,
  createContactHandler,
  createContactLimiter,
  sendContactEmail,
} = exports;
const env = {
  RESEND_API_KEY: "test-key",
  CONTACT_FROM_EMAIL: "Site <site@example.com>",
  CONTACT_TO_EMAIL: "owner@example.com",
};
const body = {
  name: "Test Reader",
  email: "reader@example.com",
  message: "A course question.\nThank you.",
  website: "",
  submissionId: "12345678-1234-4123-8123-123456789abc",
};
const request = (value = body, headers = {}) =>
  new Request("https://example.com/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://example.com",
      ...headers,
    },
    body: typeof value === "string" ? value : JSON.stringify(value),
  });

test("optional WeChat is validated and preserved", () => {
  assert.equal(validateContact({ ...body, wechat: " reader_123 " }).wechat, "reader_123");
  assert.ok(validateContact(body));
  for (const wechat of [42, "a".repeat(101), "bad\nvalue"]) assert.equal(validateContact({ ...body, wechat }), null);
});

test("validation accepts bilingual text but rejects invalid emails, controls and empty/oversized messages", () => {
  assert.ok(
    validateContact({
      name: "小明",
      email: body.email,
      message: "课程咨询\n谢谢",
    }),
  );
  assert.ok(
    validateContact({ name: "", email: body.email, message: body.message }),
  );
  for (const patch of [
    { email: "bad" },
    { email: "x@example.com\r\nBcc: x@bad.com" },
    { name: "a\nb" },
    { message: " " },
    { message: "x".repeat(5001) },
    { message: "x\u0000y" },
  ])
    assert.equal(validateContact({ ...body, ...patch }), null);
  assert.equal(validateContact(null), null);
  assert.equal(validateContact([]), null);
});

test("API sends only validated content and uses stable payload-specific idempotency", async () => {
  const sent = [];
  const handler = createContactHandler({
    env,
    send: async (...args) => {
      sent.push(args);
    },
  });
  assert.equal((await handler(request())).status, 200);
  assert.equal((await handler(request())).status, 200);
  assert.equal(sent.length, 2);
  assert.deepEqual(sent[0][0], {
    name: body.name,
    email: body.email,
    message: body.message,
  });
  assert.equal(sent[0][2], sent[1][2]);
  await handler(request({ ...body, message: "Different question" }));
  assert.notEqual(sent[0][2], sent[2][2]);
});

test("API rejects foreign origins, malformed/oversized bodies, honeypots and missing submission IDs before sending", async () => {
  let sent = 0;
  for (const [req, status] of [
    [request(body, { Origin: "https://evil.example" }), 403],
    [request(body, { Origin: "" }), 403],
    [request(body, { "Content-Type": "text/plain" }), 415],
    [request("{"), 400],
    [request({ ...body, website: "spam.example" }), 400],
    [request({ ...body, submissionId: "bad" }), 400],
    [request({ ...body, message: "x".repeat(20000) }), 413],
    [request(null), 400],
  ]) {
    const handler = createContactHandler({
      env,
      send: async () => {
        sent++;
      },
    });
    assert.equal((await handler(req)).status, status);
  }
  assert.equal(sent, 0);
});

test("body limit also applies to streams without a content-length header", async () => {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode("x".repeat(17000)));
      controller.close();
    },
  });
  const req = new Request("https://example.com/api/contact", {
    method: "POST",
    duplex: "half",
    headers: {
      Origin: "https://example.com",
      "Content-Type": "application/json",
    },
    body: stream,
  });
  const result = await createContactHandler({
    env,
    send: async () => {
      throw Error("must not send");
    },
  })(req);
  assert.equal(result.status, 413);
});

test("missing configuration and upstream failures return safe errors without exposing secrets", async () => {
  const missing = await createContactHandler({ env: {} })(request());
  assert.equal(missing.status, 503);
  const fail = await createContactHandler({
    env,
    send: async () => {
      throw Error("secret-key-upstream-details");
    },
  })(request());
  assert.equal(fail.status, 502);
  assert.equal((await fail.json()).code, "SEND_FAILED");
});

test("limiter isolates clients, blocks the sixth attempt and expires after fifteen minutes", () => {
  const limit = createContactLimiter();
  for (let i = 0; i < 5; i++) assert.equal(limit("a", 0), true);
  assert.equal(limit("a", 1000), false);
  assert.equal(limit("b", 1000), true);
  assert.equal(limit("a", 900000), true);
});

test("provider adapter uses fixed recipients, reply_to, plaintext, idempotency and a timeout", async () => {
  const original = globalThis.fetch;
  let called;
  globalThis.fetch = async (url, options) => {
    called = { url, options };
    return Response.json({ id: "mock-email-id" });
  };
  try {
    await sendContactEmail(validateContact(body), env, "stable-key");
    assert.equal(called.url, "https://api.resend.com/emails");
    assert.equal(called.options.headers.Authorization, "Bearer test-key");
    assert.equal(called.options.headers["Idempotency-Key"], "stable-key");
    const payload = JSON.parse(called.options.body);
    assert.equal(payload.from, env.CONTACT_FROM_EMAIL);
    assert.deepEqual(payload.to, [env.CONTACT_TO_EMAIL]);
    assert.equal(payload.reply_to, body.email);
    assert.equal(payload.html, undefined);
    assert.ok(payload.text.includes(body.message));
    assert.ok(called.options.signal);
    globalThis.fetch = async () =>
      Response.json({ error: "private" }, { status: 401 });
    await assert.rejects(
      () => sendContactEmail(validateContact(body), env, "key"),
      /MAIL_PROVIDER_REJECTED/,
    );
  } finally {
    globalThis.fetch = original;
  }
});
