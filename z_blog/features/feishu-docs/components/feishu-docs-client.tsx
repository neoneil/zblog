"use client";

import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { FeishuDoc } from "@/features/feishu-docs/lib/feishu-docs";

type FeishuDocsClientProps = {
  documents: FeishuDoc[];
  categories: string[];
};

function getCategoryLabel(category: string) {
  if (category === "大牌") return "Major Arcana";
  if (category.startsWith("小牌")) return "Minor Arcana";
  return "Knowledge File";
}

function getCleanMarkdown(markdown: string) {
  return markdown.replace(/^#\s+.+$/m, "").trim();
}

export function FeishuDocsClient({
  documents,
  categories,
}: FeishuDocsClientProps) {
  const [activeId, setActiveId] = useState(documents[0]?.id ?? "");
  const [activeCategory, setActiveCategory] = useState("全部");

  const filteredDocuments = useMemo(() => {
    if (activeCategory === "全部") return documents;

    return documents.filter((document) => document.category === activeCategory);
  }, [activeCategory, documents]);

  const activeDocument =
    filteredDocuments.find((document) => document.id === activeId) ??
    filteredDocuments[0] ??
    documents[0];

  const groupedDocuments = useMemo(
    () =>
      categories.map((category) => ({
        category,
        documents: filteredDocuments.filter((document) => document.category === category),
      })),
    [categories, filteredDocuments],
  );

  return (
    <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
        <Card className="overflow-hidden bg-[var(--card)]">
          <CardHeader className="items-start gap-3 border-b border-[var(--border)] pb-5">
            <div>
              <CardTitle>文档目录</CardTitle>
              <CardDescription>
                塔罗知识库内容与图片素材
              </CardDescription>
            </div>
            <Badge variant="secondary">{filteredDocuments.length} files</Badge>
          </CardHeader>

          <CardContent className="space-y-4 p-4">
            <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-wrap">
              {["全部", ...categories].map((category) => (
                <Button
                  key={category}
                  type="button"
                  variant={activeCategory === category ? "primary" : "secondary"}
                  size="sm"
                  className="shrink-0"
                  onClick={() => {
                    setActiveCategory(category);
                    const nextDocument =
                      category === "全部"
                        ? documents[0]
                        : documents.find((document) => document.category === category);

                    if (nextDocument) setActiveId(nextDocument.id);
                  }}
                >
                  {category}
                </Button>
              ))}
            </div>

            <div className="max-h-[58vh] space-y-5 overflow-y-auto pr-1 lg:max-h-[calc(100vh-16rem)]">
              {groupedDocuments.map((group) =>
                group.documents.length > 0 ? (
                  <div key={group.category} className="space-y-2">
                    <div className="flex items-center justify-between gap-3 px-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
                        {group.category}
                      </p>
                      <span className="text-xs text-[var(--text-faint)]">
                        {group.documents.length}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {group.documents.map((document) => {
                        const isActive = activeDocument?.id === document.id;

                        return (
                          <button
                            key={document.id}
                            type="button"
                            onClick={() => setActiveId(document.id)}
                            className={[
                              "w-full rounded-[var(--radius-sm)] border px-3 py-3 text-left transition",
                              isActive
                                ? "border-[var(--primary)] bg-[var(--primary-soft)] shadow-[var(--shadow-sm)]"
                                : "border-[var(--border)] bg-[var(--card-soft)] hover:bg-[var(--card-muted)]",
                            ].join(" ")}
                          >
                            <span className="block text-sm font-semibold text-[var(--text)]">
                              {document.title}
                            </span>
                            <span className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--text-soft)]">
                              <span>{getCategoryLabel(document.category)}</span>
                              <span>{document.imageCount} images</span>
                              {document.missingImageCount > 0 && (
                                <Badge variant="warning">
                                  缺 {document.missingImageCount}
                                </Badge>
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null,
              )}
            </div>
          </CardContent>
        </Card>
      </aside>

      {activeDocument && (
        <article className="min-w-0">
          <Card className="overflow-hidden bg-[var(--card)]">
            <div className="border-b border-[var(--border)] bg-[var(--card-soft)] px-5 py-5 sm:px-7 sm:py-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Badge>{activeDocument.category}</Badge>
                    <Badge variant="secondary">{activeDocument.sourcePath}</Badge>
                    {activeDocument.missingImageCount > 0 && (
                      <Badge variant="warning">
                        图片缺失 {activeDocument.missingImageCount}
                      </Badge>
                    )}
                  </div>

                  <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-3xl">
                    {activeDocument.title}
                  </h1>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:min-w-44">
                  <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card)] p-3">
                    <p className="text-xs text-[var(--text-faint)]">图片</p>
                    <p className="mt-1 text-xl font-semibold text-[var(--text)]">
                      {activeDocument.imageCount}
                    </p>
                  </div>
                  <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card)] p-3">
                    <p className="text-xs text-[var(--text-faint)]">缺失</p>
                    <p className="mt-1 text-xl font-semibold text-[var(--text)]">
                      {activeDocument.missingImageCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <CardContent className="p-5 sm:p-7">
              <div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-headings:text-[var(--text)] prose-h2:mt-10 prose-h2:border-b prose-h2:border-[var(--border)] prose-h2:pb-3 prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-p:leading-8 prose-p:text-[var(--text-soft)] prose-strong:text-[var(--text)] prose-hr:border-[var(--border)] prose-li:text-[var(--text-soft)]">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    blockquote: ({ children }) => (
                      <blockquote className="my-6 rounded-[var(--radius-sm)] border border-[var(--warning)] bg-[var(--warning-soft)] px-4 py-3 text-sm font-medium text-[var(--warning)]">
                        {children}
                      </blockquote>
                    ),
                    a: () => null,
                  }}
                >
                  {getCleanMarkdown(activeDocument.markdown)}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </article>
      )}
    </div>
  );
}
