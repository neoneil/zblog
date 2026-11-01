import { createContactHandler } from "@/lib/contact/server";

export const runtime = "nodejs";
const handle = createContactHandler({ env: process.env });
export async function POST(request: Request) {
  return handle(request);
}
