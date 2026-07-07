import {
  GetObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const R2_BUCKET = process.env.CLOUDFLARE_R2_BUCKET ?? "videos";
const GALLERY_PREFIX = "video/澳洲网站版知识库/";
const SIGNED_URL_TTL = 60 * 60;

export type GalleryImage = {
  key: string;
  name: string;
  signedUrl: string;
  size: number;
};

export type GalleryDirectory = {
  id: string;
  name: string;
  path: string;
  coverUrl: string;
  imageCount: number;
  totalSize: number;
  images: GalleryImage[];
};

function getR2Client() {
  const endpoint = process.env.CLOUDFLARE_R2_S3_API_ENDPOINT;
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error("Missing Cloudflare R2 S3 environment variables.");
  }

  return new S3Client({
    region: "auto",
    endpoint,
    forcePathStyle: true,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

function isImageKey(key: string) {
  return /\.(png|jpe?g|webp|gif|svg)$/i.test(key);
}

function getContentType(key: string) {
  if (/\.png$/i.test(key)) return "image/png";
  if (/\.jpe?g$/i.test(key)) return "image/jpeg";
  if (/\.webp$/i.test(key)) return "image/webp";
  if (/\.gif$/i.test(key)) return "image/gif";
  if (/\.svg$/i.test(key)) return "image/svg+xml";
  return "application/octet-stream";
}

function getDirectoryId(path: string) {
  return path
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function getDisplayName(path: string) {
  return path.split("/").filter(Boolean).at(-1) ?? path;
}

function getImageName(key: string) {
  return key.split("/").filter(Boolean).at(-1) ?? key;
}

async function signImage(client: S3Client, key: string) {
  return getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      ResponseContentType: getContentType(key),
    }),
    { expiresIn: SIGNED_URL_TTL },
  );
}

export async function listTarotGalleryDirectories() {
  const client = getR2Client();
  const objects: { key: string; size: number }[] = [];
  let continuationToken: string | undefined;

  do {
    const result = await client.send(
      new ListObjectsV2Command({
        Bucket: R2_BUCKET,
        Prefix: GALLERY_PREFIX,
        ContinuationToken: continuationToken,
      }),
    );

    for (const item of result.Contents ?? []) {
      if (item.Key && isImageKey(item.Key)) {
        objects.push({
          key: item.Key,
          size: item.Size ?? 0,
        });
      }
    }

    continuationToken = result.NextContinuationToken;
  } while (continuationToken);

  const directoryMap = new Map<string, { key: string; size: number }[]>();

  for (const object of objects) {
    const relativePath = object.key.slice(GALLERY_PREFIX.length);
    const segments = relativePath.split("/").filter(Boolean);
    const directoryPath = segments.slice(0, -1).join("/");

    if (!directoryPath) continue;

    const current = directoryMap.get(directoryPath) ?? [];
    current.push(object);
    directoryMap.set(directoryPath, current);
  }

  const directories = await Promise.all(
    Array.from(directoryMap.entries()).map(async ([directoryPath, files]) => {
      const sortedFiles = files.sort((a, b) => a.key.localeCompare(b.key, "zh-Hans-CN"));
      const images = await Promise.all(
        sortedFiles.map(async (file) => ({
          key: file.key,
          name: getImageName(file.key),
          signedUrl: await signImage(client, file.key),
          size: file.size,
        })),
      );

      return {
        id: getDirectoryId(directoryPath),
        name: getDisplayName(directoryPath),
        path: directoryPath,
        coverUrl: images[0]?.signedUrl ?? "",
        imageCount: images.length,
        totalSize: images.reduce((sum, image) => sum + image.size, 0),
        images,
      } satisfies GalleryDirectory;
    }),
  );

  return directories.sort((a, b) => a.path.localeCompare(b.path, "zh-Hans-CN"));
}
