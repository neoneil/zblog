import { promises as fs } from "fs";
import path from "path";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth/require-admin";

type MarkdownBlock =
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "image"; alt: string; src: string }
  | { type: "hr" };

type TarotDocument = {
  id: string;
  title: string;
  fileName: string;
  category: string;
  categoryLabel: string;
  categorySummary: string;
  blocks: MarkdownBlock[];
  sectionCount: number;
  imageCount: number;
  wordCount: number;
};

const KNOWLEDGE_ROOT = path.join(process.cwd(), "public", "飞书文档");

const CATEGORY_COPY: Record<string, { label: string; summary: string }> = {
  大牌: {
    label: "Major Arcana",
    summary: "核心原型、人生阶段与关键转折",
  },
  "小牌-风": {
    label: "Swords · Air",
    summary: "认知、判断、沟通与策略",
  },
  "小牌-火": {
    label: "Wands · Fire",
    summary: "行动、创造、动力与事业推进",
  },
  "小牌-水": {
    label: "Cups · Water",
    summary: "情绪、关系、直觉与内在需求",
  },
  "小牌-土": {
    label: "Pentacles · Earth",
    summary: "资源、结果、现实经营与长期价值",
  },
};

const CATEGORY_ORDER = ["大牌", "小牌-风", "小牌-火", "小牌-水", "小牌-土"];

const CHINESE_NUMBER_ORDER: Record<string, number> = {
  一: 1,
  二: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9,
  十: 10,
};

function parseMarkdown(markdown: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = [];
  const paragraph: string[] = [];

  function flushParagraph() {
    const text = paragraph.join(" ").trim();
    if (text) {
      blocks.push({ type: "paragraph", text });
    }
    paragraph.length = 0;
  }

  for (const rawLine of markdown.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      continue;
    }

    const imageMatch = line.match(/^!\[(.*?)]\((.*?)\)$/);
    if (imageMatch) {
      flushParagraph();
      blocks.push({
        type: "image",
        alt: imageMatch[1] || "Knowledge image",
        src: imageMatch[2],
      });
      continue;
    }

    if (/^-{3,}$/.test(line)) {
      flushParagraph();
      blocks.push({ type: "hr" });
      continue;
    }

    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      blocks.push({
        type: "heading",
        level: headingMatch[1].length as 1 | 2 | 3,
        text: cleanInlineText(headingMatch[2]),
      });
      continue;
    }

    paragraph.push(line);
  }

  flushParagraph();
  return blocks;
}

function cleanInlineText(text: string) {
  return text.replace(/\\([._*[\]()&])/g, "$1").trim();
}

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|\[[^\]]+]\([^)]+\)|https?:\/\/\S+)/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > cursor) {
      nodes.push(cleanInlineText(text.slice(cursor, match.index)));
    }

    const token = match[0];

    if (token.startsWith("**") && token.endsWith("**")) {
      nodes.push(<strong key={nodes.length}>{cleanInlineText(token.slice(2, -2))}</strong>);
    } else if (token.startsWith("[")) {
      const linkMatch = token.match(/^\[([^\]]+)]\(([^)]*)\)$/);
      const label = cleanInlineText(linkMatch?.[1] ?? token);
      const href = linkMatch?.[2] || label;

      nodes.push(
        <a
          key={nodes.length}
          href={href}
          className="font-medium text-[var(--primary)] underline-offset-4 hover:underline"
          rel="noreferrer"
          target="_blank"
        >
          {label}
        </a>,
      );
    } else {
      nodes.push(
        <a
          key={nodes.length}
          href={cleanInlineText(token)}
          className="font-medium text-[var(--primary)] underline-offset-4 hover:underline"
          rel="noreferrer"
          target="_blank"
        >
          {cleanInlineText(token)}
        </a>,
      );
    }

    cursor = match.index + token.length;
  }

  if (cursor < text.length) {
    nodes.push(cleanInlineText(text.slice(cursor)));
  }

  return nodes;
}

function getTitle(fileName: string, blocks: MarkdownBlock[]) {
  const heading = blocks.find(
    (block): block is Extract<MarkdownBlock, { type: "heading" }> =>
      block.type === "heading" && block.level === 1,
  );

  return cleanInlineText(heading?.text ?? fileName.replace(/\.md$/, ""));
}

function getSortRank(fileName: string) {
  const numberPrefix = fileName.match(/^(\d+)/)?.[1];
  if (numberPrefix) return Number(numberPrefix);

  const chineseRank = Object.entries(CHINESE_NUMBER_ORDER).find(([key]) =>
    fileName.includes(key),
  );

  return chineseRank?.[1] ?? 99;
}

function sortDocuments(a: TarotDocument, b: TarotDocument) {
  const rankDiff = getSortRank(a.fileName) - getSortRank(b.fileName);
  if (rankDiff !== 0) return rankDiff;

  return a.title.localeCompare(b.title, "zh-Hans-CN");
}

function getDocumentId(category: string, fileName: string) {
  return `${category}-${fileName}`
    .replace(/\.md$/, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "");
}

async function loadDocuments() {
  const categoryNames = (await fs.readdir(KNOWLEDGE_ROOT, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort(
      (a, b) =>
        CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b) ||
        a.localeCompare(b, "zh-Hans-CN"),
    );

  const groups = await Promise.all(
    categoryNames.map(async (category) => {
      const categoryPath = path.join(KNOWLEDGE_ROOT, category);
      const files = (await fs.readdir(categoryPath, { withFileTypes: true }))
        .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
        .map((entry) => entry.name);

      const documents = await Promise.all(
        files.map(async (fileName) => {
          const markdown = await fs.readFile(path.join(categoryPath, fileName), "utf8");
          const blocks = parseMarkdown(markdown);
          const title = getTitle(fileName, blocks);
          const copy = CATEGORY_COPY[category] ?? {
            label: category,
            summary: "知识条目",
          };

          return {
            id: getDocumentId(category, fileName),
            title,
            fileName,
            category,
            categoryLabel: copy.label,
            categorySummary: copy.summary,
            blocks,
            sectionCount: blocks.filter((block) => block.type === "heading" && block.level > 1)
              .length,
            imageCount: blocks.filter((block) => block.type === "image").length,
            wordCount: blocks
              .filter((block) => block.type === "paragraph")
              .reduce((total, block) => total + block.text.length, 0),
          } satisfies TarotDocument;
        }),
      );

      return {
        name: category,
        label: CATEGORY_COPY[category]?.label ?? category,
        summary: CATEGORY_COPY[category]?.summary ?? "知识条目",
        documents: documents.sort(sortDocuments),
      };
    }),
  );

  return groups;
}

function MarkdownContent({ blocks }: { blocks: MarkdownBlock[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const Heading = `h${block.level}` as "h1" | "h2" | "h3";
          const className =
            block.level === 1
              ? "text-2xl font-semibold text-[var(--text)]"
              : block.level === 2
                ? "border-b border-[var(--border)] pb-2 text-lg font-semibold text-[var(--primary)]"
                : "text-base font-semibold text-[var(--text)]";

          return (
            <Heading key={index} className={className}>
              {renderInline(block.text)}
            </Heading>
          );
        }

        if (block.type === "image") {
          return (
            <figure
              key={index}
              className="overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-soft)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={block.src}
                alt={block.alt}
                className="max-h-[680px] w-full object-contain"
                loading="lazy"
              />
              {block.alt && block.alt !== "Image" && (
                <figcaption className="border-t border-[var(--border)] px-4 py-3 text-sm leading-6 text-[var(--text-soft)]">
                  {block.alt}
                </figcaption>
              )}
            </figure>
          );
        }

        if (block.type === "hr") {
          return <hr key={index} className="border-[var(--border)]" />;
        }

        return (
          <p key={index} className="text-sm leading-7 text-[var(--text)] sm:text-base">
            {renderInline(block.text)}
          </p>
        );
      })}
    </div>
  );
}

export default async function TarotDemoPage() {
  await requireAdmin("/tarot-demo");

  const groups = await loadDocuments();
  const documents = groups.flatMap((group) => group.documents);
  const imageCount = documents.reduce((total, document) => total + document.imageCount, 0);
  const sectionCount = documents.reduce((total, document) => total + document.sectionCount, 0);

  return (
    <main className="min-h-screen bg-[var(--bg)] px-4 py-6 text-[var(--text)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Card className="overflow-hidden">
            <CardHeader className="items-start border-b border-[var(--border)] bg-[var(--card-soft)]">
              <div className="space-y-4">
                <Badge variant="secondary">Admin Knowledge Base</Badge>
                <div className="space-y-2">
                  <CardTitle className="text-3xl">Tarot Business Demo</CardTitle>
                  <CardDescription className="max-w-3xl text-base leading-7">
                    将飞书导出的 Markdown 内容整理成面向运营、课程和内容编辑的知识库视图。
                    当前页面仅 admin 可访问，适合先审阅命名、结构、图片与文本呈现。
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="grid gap-3 p-5 sm:grid-cols-3">
              <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-soft)] p-4">
                <p className="text-sm text-[var(--text-soft)]">Documents</p>
                <p className="mt-2 text-3xl font-semibold text-[var(--text)]">
                  {documents.length}
                </p>
              </div>
              <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-soft)] p-4">
                <p className="text-sm text-[var(--text-soft)]">Sections</p>
                <p className="mt-2 text-3xl font-semibold text-[var(--text)]">
                  {sectionCount}
                </p>
              </div>
              <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-soft)] p-4">
                <p className="text-sm text-[var(--text-soft)]">Media Blocks</p>
                <p className="mt-2 text-3xl font-semibold text-[var(--text)]">
                  {imageCount}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="items-start">
              <div>
                <CardTitle>Content Map</CardTitle>
                <CardDescription>按导出文件夹聚合，点击可跳转到对应分组。</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {groups.map((group) => (
                <a
                  key={group.name}
                  href={`#${group.name}`}
                  className="flex items-center justify-between rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2 text-sm transition hover:border-[var(--primary)]"
                >
                  <span className="font-medium text-[var(--text)]">{group.name}</span>
                  <span className="text-[var(--text-soft)]">{group.documents.length}</span>
                </a>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="space-y-8">
          {groups.map((group) => (
            <div key={group.name} id={group.name} className="scroll-mt-6 space-y-4">
              <div className="flex flex-col gap-3 border-b border-[var(--border)] pb-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-semibold text-[var(--text)]">
                      {group.name}
                    </h2>
                    <Badge variant="outline">{group.label}</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
                    {group.summary}
                  </p>
                </div>
                <Badge variant="secondary">{group.documents.length} files</Badge>
              </div>

              <div className="grid gap-4">
                {group.documents.map((document, index) => (
                  <Card key={document.id} className="overflow-hidden">
                    <details open={index === 0 && group.name === "大牌"} className="group">
                      <summary className="flex cursor-pointer list-none flex-col gap-4 border-b border-[var(--border)] bg-[var(--card-soft)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="secondary">{document.categoryLabel}</Badge>
                            <span className="text-xs text-[var(--text-soft)]">
                              {document.fileName}
                            </span>
                          </div>
                          <h3 className="mt-2 text-xl font-semibold text-[var(--text)]">
                            {document.title}
                          </h3>
                          <p className="mt-1 text-sm text-[var(--text-soft)]">
                            {document.categorySummary}
                          </p>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center sm:min-w-[220px]">
                          <span className="rounded-[var(--radius-sm)] bg-[var(--bg-soft)] px-2 py-2 text-xs text-[var(--text-soft)]">
                            {document.sectionCount} sections
                          </span>
                          <span className="rounded-[var(--radius-sm)] bg-[var(--bg-soft)] px-2 py-2 text-xs text-[var(--text-soft)]">
                            {document.imageCount} media
                          </span>
                          <span className="rounded-[var(--radius-sm)] bg-[var(--bg-soft)] px-2 py-2 text-xs text-[var(--text-soft)]">
                            {document.wordCount} chars
                          </span>
                        </div>
                      </summary>

                      <CardContent className="p-5 sm:p-7">
                        <MarkdownContent blocks={document.blocks} />
                      </CardContent>
                    </details>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
