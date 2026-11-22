import "server-only";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getStarCard } from "./cards";

async function signPng(key: string, filename?: string) {
  const endpoint = process.env.CLOUDFLARE_R2_S3_API_ENDPOINT;
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
  if (!endpoint || !accessKeyId || !secretAccessKey) throw new Error("Missing R2 configuration");
  const client = new S3Client({ region: "auto", endpoint, forcePathStyle: true, credentials: { accessKeyId, secretAccessKey } });
  return getSignedUrl(client, new GetObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET ?? "videos",
    Key: key,
    ResponseContentType: "image/png",
    ...(filename && { ResponseContentDisposition: `attachment; filename="${filename}"` }),
  }), { expiresIn: 3600 });
}

export async function starCardImage(cardId: number, download = false) {
  const card = getStarCard(cardId);
  if (!card) throw new Error("Invalid reflection card");
  return signPng(card.key, download ? `stellarnests-${cardId}.png` : undefined);
}

export function starCardBackImage() {
  return signPng("star-message/Stellarnests Golden Celestial Card.png");
}
