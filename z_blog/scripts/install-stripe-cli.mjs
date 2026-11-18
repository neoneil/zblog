import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdir, writeFile, chmod, access } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

if (process.platform !== "linux" || process.arch !== "x64")
  throw new Error("This installer is for WSL Linux x64.");
async function download(url, json = false) {
  const response = await fetch(url, {
    headers: { "User-Agent": "zblog-local-stripe-setup" },
    signal: AbortSignal.timeout(60000),
  });
  if (!response.ok)
    throw new Error(
      `Official Stripe CLI download failed: HTTP ${response.status}`,
    );
  return json ? response.json() : Buffer.from(await response.arrayBuffer());
}
const release = await download(
  "https://api.github.com/repos/stripe/stripe-cli/releases/latest",
  true,
);
if (!/^v[\d.]+$/.test(release.tag_name))
  throw new Error("Unexpected release tag.");
const asset = release.assets.find((item) =>
  item.name.endsWith("_linux_x86_64.tar.gz"),
);
const checksums = release.assets.find(
  (item) => item.name === "stripe-linux-checksums.txt",
);
if (!asset || !checksums)
  throw new Error(
    `Official Linux archive or checksum is missing. Available assets: ${release.assets.map((item) => item.name).join(", ")}`,
  );
const directory = join(tmpdir(), "zblog-stripe-cli", release.tag_name);
await mkdir(directory, { recursive: true, mode: 0o700 });
const binary = join(directory, "stripe");
try {
  await access(binary);
} catch {
  const archive = await download(asset.browser_download_url);
  const manifest = (await download(checksums.browser_download_url)).toString(
    "utf8",
  );
  const entry = manifest
    .split(/\r?\n/)
    .map((line) => line.trim().split(/\s+/))
    .find((parts) => parts[1] === asset.name || parts[1] === `*${asset.name}`);
  if (!entry || createHash("sha256").update(archive).digest("hex") !== entry[0])
    throw new Error("Stripe CLI checksum verification failed.");
  const file = join(directory, asset.name);
  await writeFile(file, archive, { mode: 0o600 });
  execFileSync("tar", ["-xzf", file, "-C", directory, "stripe"]);
  await chmod(binary, 0o700);
}
console.log(execFileSync(binary, ["--version"], { encoding: "utf8" }).trim());
console.log(`Installed locally: ${binary}`);
console.log("No Stripe listener was started and no credentials were changed.");
