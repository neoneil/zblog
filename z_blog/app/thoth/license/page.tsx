import { readFile } from 'node:fs/promises';
import path from 'node:path';

export default async function LicensePage() {
  const license = await readFile(path.join(process.cwd(),'features/thoth/LICENSE'),'utf8');
  return <main className="min-h-screen bg-[var(--bg)] p-6 text-[var(--text)]"><div className="mx-auto max-w-3xl"><h1 className="mb-5 text-2xl font-semibold">MIT License</h1><pre className="whitespace-pre-wrap text-sm leading-7">{license}</pre></div></main>;
}
