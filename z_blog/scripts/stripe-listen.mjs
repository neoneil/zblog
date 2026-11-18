import { execFileSync, spawn } from "node:child_process";
import {
  readFile,
  readdir,
  mkdtemp,
  writeFile,
  rename,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseEnv } from "node:util";
import { createInterface } from 'node:readline';

const file = fileURLToPath(new URL("../.env.local", import.meta.url));
const source = await readFile(file, "utf8");
const env = { ...parseEnv(source), ...process.env };
if (!env.STRIPE_SECRET_KEY?.startsWith("sk_test_"))
  throw new Error(
    "Local forwarding requires a Stripe TEST key. Live mode is forbidden.",
  );
const origin = new URL(env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001");
if (!["localhost", "127.0.0.1"].includes(origin.hostname))
  throw new Error("Local forwarding requires a localhost site URL.");
const root = join(tmpdir(), "zblog-stripe-cli");
const versions = (await readdir(root))
  .filter((name) => /^v[\d.]+$/.test(name))
  .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
if (!versions.length)
  throw new Error("Run node scripts/install-stripe-cli.mjs first.");
const binary = join(root, versions[0], "stripe");
const childEnv = { ...process.env, STRIPE_API_KEY: env.STRIPE_SECRET_KEY };
let secret;
try {
  const output = execFileSync(
    binary,
    ["listen", "--print-secret", "--skip-update"],
    {
      env: childEnv,
      encoding: "utf8",
      timeout: 30000,
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  secret = output.match(/whsec_[A-Za-z0-9]+/)?.[0];
} catch {
  throw new Error(
    "Unable to prepare the local Stripe listener. Check the test key and network connection.",
  );
}
if (!secret) throw new Error("Stripe CLI did not return a signing secret.");
const previous = parseEnv(source).STRIPE_WEBHOOK_SECRET;
if (secret !== previous) {
  if (previous) {
    const backup = await mkdtemp(join(tmpdir(), "zblog-stripe-secret-backup-"));
    await writeFile(join(backup, "previous-webhook-secret"), previous, {
      mode: 0o600,
    });
    console.log(`Previous webhook secret backed up privately in ${backup}`);
  }
  const pattern = /^\s*(?:export\s+)?STRIPE_WEBHOOK_SECRET\s*=.*$/m;
  const updated = pattern.test(source)
    ? source.replace(pattern, `STRIPE_WEBHOOK_SECRET=${secret}`)
    : `${source.trimEnd()}\nSTRIPE_WEBHOOK_SECRET=${secret}\n`;
  const temporary = `${file}.stripe-${process.pid}`;
  await writeFile(temporary, updated, { mode: 0o600 });
  await rename(temporary, file);
}
console.log(
  "Local TEST webhook secret synchronized. No key or secret is printed by preparation.",
);
console.log("The checkout feature flag was not changed.");
if (!process.argv.includes("--prepare-only")) {
  const events =
    "checkout.session.completed,checkout.session.async_payment_succeeded,checkout.session.async_payment_failed,checkout.session.expired,charge.refunded,charge.dispute.created";
  const child = spawn(
    binary,
    [
      "listen",
      "--skip-update",
      "--latest",
      "--events",
      events,
      "--forward-to",
      `${origin.origin}/api/stripe/webhook`,
    ],
    { env: childEnv, stdio: ['ignore', 'pipe', 'pipe'] },
  );
  for (const stream of [child.stdout, child.stderr]) {
    const lines = createInterface({ input: stream });
    lines.on('line', line => console.log(line.replace(/whsec_[A-Za-z0-9]+/g, '[webhook secret redacted]').replace(/sk_(?:test|live)_[A-Za-z0-9]+/g, '[API key redacted]')));
  }
  process.on("SIGINT", () => child.kill("SIGINT"));
  process.on("SIGTERM", () => child.kill("SIGTERM"));
  child.on("error", () => {
    console.error("Unable to start Stripe CLI.");
    process.exitCode = 1;
  });
  child.on("exit", (code) => {
    process.exitCode = code || 0;
  });
} else console.log("Preparation complete; no persistent listener was started.");
