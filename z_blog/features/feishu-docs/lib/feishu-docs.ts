import fs from "node:fs/promises";
import path from "node:path";
import {
  GetObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const DOCS_ROOT = path.join(process.cwd(), "public", "飞书文档");
const R2_BUCKET = process.env.CLOUDFLARE_R2_BUCKET ?? "videos";
const R2_PREFIX = "video/澳洲网站版知识库/";
const KNOWLEDGE_ROOT = "网站版知识库";
const SIGNED_URL_TTL = 60 * 60;

const CATEGORY_ORDER = ["大牌", "小牌-火", "小牌-水", "小牌-风", "小牌-土"];
const SUIT_FOLDER_MAP = [
  { prefix: "圣杯", folder: "圣杯组" },
  { prefix: "宝剑", folder: "宝剑组" },
  { prefix: "权杖", folder: "权杖组" },
  { prefix: "星币", folder: "星币组" },
] as const;

type R2ImageObject = {
  key: string;
  signedUrl: string;
  size: number;
};

export type FeishuDocImage = {
  key: string;
  signedUrl: string;
  missing: false;
};

export type FeishuDoc = {
  id: string;
  title: string;
  cardName: string;
  category: string;
  sourcePath: string;
  markdown: string;
  imageCount: number;
  missingImageCount: number;
  images: FeishuDocImage[];
};

export type FeishuDocsData = {
  documents: FeishuDoc[];
  categories: string[];
  totalImages: number;
  missingImages: number;
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

function slugify(input: string) {
  return input
    .replace(/\.[^.]+$/, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function cleanTitle(input: string) {
  return input.replace(/[✅✔︎️]/g, "").trim();
}

function getCardName(filePath: string) {
  return path.basename(filePath, path.extname(filePath));
}

function getCategory(filePath: string) {
  const relative = path.relative(DOCS_ROOT, filePath);
  return relative.split(path.sep)[0] ?? "未分类";
}

function getTitle(markdown: string, filePath: string) {
  const heading = markdown.match(/^#\s+(.+)$/m)?.[1];
  return cleanTitle(heading ?? getCardName(filePath));
}

function getDocOrder(cardName: string) {
  const numericPrefix = cardName.match(/^(\d+)/)?.[1];
  if (numericPrefix) return Number(numericPrefix);

  const rankOrder = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "侍从", "骑士", "皇后", "国王"];
  const rank = rankOrder.findIndex((value) => cardName.endsWith(value));

  return rank === -1 ? Number.MAX_SAFE_INTEGER : rank + 1;
}

function sortDocPaths(a: string, b: string) {
  const categoryA = getCategory(a);
  const categoryB = getCategory(b);
  const categoryOrderA = CATEGORY_ORDER.indexOf(categoryA);
  const categoryOrderB = CATEGORY_ORDER.indexOf(categoryB);
  const safeOrderA = categoryOrderA === -1 ? Number.MAX_SAFE_INTEGER : categoryOrderA;
  const safeOrderB = categoryOrderB === -1 ? Number.MAX_SAFE_INTEGER : categoryOrderB;

  if (safeOrderA !== safeOrderB) return safeOrderA - safeOrderB;

  const cardOrderA = getDocOrder(getCardName(a));
  const cardOrderB = getDocOrder(getCardName(b));

  if (cardOrderA !== cardOrderB) return cardOrderA - cardOrderB;

  return a.localeCompare(b, "zh-Hans-CN");
}

async function listMarkdownFiles(directory: string): Promise<string[]> {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);

      if (entry.isDirectory()) return listMarkdownFiles(entryPath);
      if (entry.isFile() && entry.name.endsWith(".md")) return [entryPath];

      return [];
    }),
  );

  return files.flat();
}

async function listR2Images() {
  const client = getR2Client();
  const objects: { key: string; size: number }[] = [];
  let continuationToken: string | undefined;

  do {
    const result = await client.send(
      new ListObjectsV2Command({
        Bucket: R2_BUCKET,
        Prefix: R2_PREFIX,
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

  return Promise.all(
    objects.map(async (object) => ({
      key: object.key,
      size: object.size,
      signedUrl: await getSignedUrl(
        client,
        new GetObjectCommand({
          Bucket: R2_BUCKET,
          Key: object.key,
          ResponseContentType: getContentType(object.key),
        }),
        { expiresIn: SIGNED_URL_TTL },
      ),
    })),
  );
}

function getMajorFolder(cardName: string) {
  const match = cardName.match(/^(\d+)(.+)$/);
  if (!match) return null;

  return `${String(Number(match[1])).padStart(2, "0")}${match[2]}`;
}

function getMinorPatterns(cardName: string) {
  const suit = SUIT_FOLDER_MAP.find((item) => cardName.startsWith(item.prefix));

  if (!suit) return [];

  const patterns = [`${R2_PREFIX}${KNOWLEDGE_ROOT}/${suit.folder}/${cardName}`];

  if (cardName === "宝剑八") {
    patterns.push(`${R2_PREFIX}${KNOWLEDGE_ROOT}/${suit.folder}/宝八`);
  }

  return patterns;
}

function imageSortWeight(key: string) {
  const fileName = decodeURIComponent(key.split("/").pop() ?? key);

  if (/实战/.test(fileName)) return 40;
  if (/插画/.test(fileName)) return 20;
  if (/\(\d+\)/.test(fileName)) return 10;

  return 0;
}

function escapeHtmlAttribute(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function createImageFigure(image: R2ImageObject, altText: string, cardName: string) {
  const alt = escapeHtmlAttribute(altText || cardName);
  const src = escapeHtmlAttribute(image.signedUrl);

  return [
    "",
    `<figure class="my-8 overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-soft)] shadow-[var(--shadow-sm)]">`,
    `<div class="bg-[var(--card-soft)] p-2">`,
    `<img src="${src}" alt="${alt}" loading="lazy" class="mx-auto max-h-[680px] w-full rounded-[var(--radius-sm)] object-contain" />`,
    `</div>`,
    `</figure>`,
    "",
  ].join("\n");
}

function matchImagesForCard(cardName: string, images: R2ImageObject[]) {
  const majorFolder = getMajorFolder(cardName);
  const patterns = majorFolder
    ? [`${R2_PREFIX}${KNOWLEDGE_ROOT}/${majorFolder}/`]
    : getMinorPatterns(cardName);

  return images
    .filter((image) => patterns.some((pattern) => image.key.startsWith(pattern)))
    .sort((a, b) => {
      const weight = imageSortWeight(a.key) - imageSortWeight(b.key);

      if (weight !== 0) return weight;

      return a.key.localeCompare(b.key, "zh-Hans-CN", { numeric: true });
    });
}

function replaceMarkdownImages(markdown: string, images: R2ImageObject[], cardName: string) {
  let imageIndex = 0;

  return markdown.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, altText: string) => {
    const image = images[imageIndex];
    const currentIndex = imageIndex + 1;

    imageIndex += 1;

    if (!image) {
      return `> 图片缺失：${cardName} 第 ${currentIndex} 张图片素材未在 R2 中找到。`;
    }

    return createImageFigure(image, altText, cardName);
  });
}

export async function getFeishuDocsData(): Promise<FeishuDocsData> {
  const [markdownFiles, r2Images] = await Promise.all([
    listMarkdownFiles(DOCS_ROOT),
    listR2Images(),
  ]);

  const documents = await Promise.all(
    markdownFiles.sort(sortDocPaths).map(async (filePath) => {
      const markdown = await fs.readFile(filePath, "utf8");
      const cardName = getCardName(filePath);
      const matchedImages = matchImagesForCard(cardName, r2Images);
      const imageReferences = markdown.match(/!\[[^\]]*\]\([^)]+\)/g) ?? [];
      const missingImageCount = Math.max(0, imageReferences.length - matchedImages.length);
      const relativePath = path.relative(DOCS_ROOT, filePath).split(path.sep).join("/");

      return {
        id: slugify(relativePath),
        title: getTitle(markdown, filePath),
        cardName,
        category: getCategory(filePath),
        sourcePath: relativePath,
        markdown: replaceMarkdownImages(markdown, matchedImages, cardName),
        imageCount: Math.min(imageReferences.length, matchedImages.length),
        missingImageCount,
        images: matchedImages.slice(0, imageReferences.length).map((image) => ({
          key: image.key,
          signedUrl: image.signedUrl,
          missing: false,
        })),
      } satisfies FeishuDoc;
    }),
  );

  return {
    documents,
    categories: Array.from(new Set(documents.map((document) => document.category))),
    totalImages: documents.reduce((sum, document) => sum + document.imageCount, 0),
    missingImages: documents.reduce((sum, document) => sum + document.missingImageCount, 0),
  };
}
