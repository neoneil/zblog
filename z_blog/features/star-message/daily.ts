import "server-only";
import { createHmac, randomInt, randomUUID, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getStarCard, starCards } from "./cards";

const cookieName = "stellarnests-star-draw";
export function sydneyDay() {
  const parts = new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Sydney", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts();
  return ["year", "month", "day"].map((field) => parts.find((part) => part.type === field)?.value).join("-");
}

export type Draw = { day: string; cardId: number; id: string };

function sign(value: string) {
  const secret = process.env.STAR_DRAW_SECRET || process.env.SUPABASE_SECRET_KEY;
  if (!secret) throw new Error("Missing draw signing configuration");
  return createHmac("sha256", secret).update(value).digest("hex");
}

export async function readDraw() {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return null;
  const [day, card, id, mac, extra] = token.split(".");
  if (extra || !day || !id || !/^[a-f0-9]{64}$/.test(mac ?? "")) return null;
  const cardId = Number(card);
  const expected = sign(`${day}.${card}.${id}`);
  if (!timingSafeEqual(Buffer.from(mac, "hex"), Buffer.from(expected, "hex")) || !getStarCard(cardId)) return null;
  return { day, cardId, id };
}

export function pickDraw(position: number, day: string): Draw {
  const options = starCards.map(({ id }) => id);
  for (let index = options.length - 1; index > 0; index--) {
    const other = randomInt(index + 1);
    [options[index], options[other]] = [options[other], options[index]];
  }
  return { day, cardId: options[position], id: randomUUID() };
}

export async function writeDraw(draw: Draw) {
  const value = `${draw.day}.${draw.cardId}.${draw.id}`;
  (await cookies()).set(cookieName, `${value}.${sign(value)}`, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production",
    path: "/", maxAge: 7 * 24 * 60 * 60,
  });
}
