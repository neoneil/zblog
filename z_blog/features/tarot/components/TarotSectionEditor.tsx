"use client";

import Image from "next/image";
import { useMemo, useRef, useState, useTransition } from "react";
import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { Rnd } from "react-rnd";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createTarotImageBlock,
  createTarotTextBlock,
  deleteTarotBlock,
  updateTarotBlock,
} from "@/features/tarot/lib/tarot-actions";
import type {
  TarotCardSection,
  TarotLanguage,
  TarotSectionBlock,
} from "@/features/tarot/types";
import { TAROT_SECTION_LABELS } from "@/features/tarot/types";

type TarotSectionEditorProps = {
  cardSlug: string;
  section: TarotCardSection;
  lang: TarotLanguage;
  canEdit: boolean;
};

type EditableBlock = TarotSectionBlock;

function getBlockWidth(block: TarotSectionBlock) {
  return block.width ?? (block.block_type === "image" ? 360 : 460);
}

function getBlockHeight(block: TarotSectionBlock) {
  return block.height ?? (block.block_type === "image" ? 260 : 180);
}

function getBlockX(block: TarotSectionBlock, index: number) {
  return block.x ?? (index % 2) * 430;
}

function getBlockY(block: TarotSectionBlock, index: number) {
  return block.y ?? Math.floor(index / 2) * 260;
}

function getCanvasHeight(blocks: TarotSectionBlock[]) {
  if (blocks.length === 0) return 360;

  return Math.max(
    360,
    ...blocks.map((block, index) => (
      getBlockY(block, index) + getBlockHeight(block) + 80
    )),
  );
}

function isImageBlock(block: TarotSectionBlock) {
  return block.block_type === "image";
}

function ReadBlock({ block }: { block: TarotSectionBlock }) {
  const hasPosition = block.x !== null || block.y !== null;
  const style = {
    "--tarot-block-x": `${block.x ?? 0}px`,
    "--tarot-block-y": `${block.y ?? 0}px`,
    "--tarot-block-width": `${getBlockWidth(block)}px`,
    "--tarot-block-height": `${getBlockHeight(block)}px`,
    textAlign: block.align ?? "left",
    fontSize: block.font_size ? `${block.font_size}px` : undefined,
    fontWeight: block.font_weight ?? undefined,
  } as CSSProperties;

  return (
    <div
      className={[
        "rounded-[var(--radius-md)] border border-[var(--border)] bg-[color:var(--card)]/86 p-4 shadow-[var(--shadow-sm)]",
        hasPosition
          ? "md:absolute md:left-[var(--tarot-block-x)] md:top-[var(--tarot-block-y)] md:h-[var(--tarot-block-height)] md:w-[var(--tarot-block-width)]"
          : "",
      ].join(" ")}
      style={style}
    >
      {isImageBlock(block) ? (
        block.signed_image_url ? (
          <div className="relative h-full min-h-[220px] overflow-hidden rounded-[var(--radius-sm)]">
            <Image
              src={block.signed_image_url}
              alt=""
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 720px"
            />
          </div>
        ) : (
          <div className="flex min-h-[180px] items-center justify-center rounded-[var(--radius-sm)] border border-dashed border-[var(--border)] text-sm text-[var(--text-soft)]">
            Image unavailable
          </div>
        )
      ) : (
        <div className="whitespace-pre-wrap leading-7 text-[var(--text)]">
          {block.content}
        </div>
      )}
    </div>
  );
}

export default function TarotSectionEditor({
  cardSlug,
  section,
  lang,
  canEdit,
}: TarotSectionEditorProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [blocks, setBlocks] = useState<EditableBlock[]>(section.blocks);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const label = TAROT_SECTION_LABELS[section.section_key][lang];

  const canvasHeight = useMemo(() => getCanvasHeight(blocks), [blocks]);

  function updateLocalBlock(blockId: string, patch: Partial<EditableBlock>) {
    setBlocks((current) =>
      current.map((block) =>
        block.id === blockId ? { ...block, ...patch } : block,
      ),
    );
  }

  function saveBlock(block: EditableBlock) {
    setMessage(null);
    startTransition(async () => {
      const result = await updateTarotBlock(
        {
          id: block.id,
          content: block.content,
          image_url: block.image_url,
          order_index: block.order_index,
          x: block.x,
          y: block.y,
          width: block.width,
          height: block.height,
          align: block.align,
          font_size: block.font_size,
          font_weight: block.font_weight,
        },
        cardSlug,
      );

      setMessage(result.ok ? "Saved." : result.error ?? "Save failed.");
      router.refresh();
    });
  }

  function createTextBlock() {
    setMessage(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.set("sectionId", section.id);
      formData.set("cardSlug", cardSlug);
      formData.set("content", "");
      formData.set("orderIndex", String(blocks.length));
      formData.set("x", "0");
      formData.set("y", String(canvasHeight));
      formData.set("width", "420");
      formData.set("height", "180");

      const result = await createTarotTextBlock(formData);
      setMessage(result.ok ? "Text block added." : result.error ?? "Create failed.");
      router.refresh();
    });
  }

  function createImageBlock(file: File) {
    setMessage(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.set("sectionId", section.id);
      formData.set("sectionKey", section.section_key);
      formData.set("cardSlug", cardSlug);
      formData.set("orderIndex", String(blocks.length));
      formData.set("x", "460");
      formData.set("y", String(canvasHeight));
      formData.set("width", "360");
      formData.set("height", "260");
      formData.set("file", file);

      const result = await createTarotImageBlock(formData);
      setMessage(result.ok ? "Image block added." : result.error ?? "Upload failed.");
      router.refresh();

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    });
  }

  function removeBlock(block: EditableBlock) {
    setMessage(null);
    startTransition(async () => {
      const result = await deleteTarotBlock(block.id, cardSlug);
      setMessage(result.ok ? "Block deleted." : result.error ?? "Delete failed.");
      router.refresh();
    });
  }

  return (
    <section id={section.section_key} className="scroll-mt-28">
      <Card className="overflow-hidden bg-[color:var(--card)]/92">
        <CardHeader className="flex-col items-start gap-3 border-b border-[var(--border)] bg-[var(--card-soft)] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge variant="secondary">{label}</Badge>
            <CardTitle className="mt-3 text-2xl">{label}</CardTitle>
            <CardDescription>
              {lang === "zh" ? "按顺序阅读这一部分的文字与图片。" : "Read this section through its ordered text and image blocks."}
            </CardDescription>
          </div>

          {canEdit && (
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={isPending}
                onClick={createTextBlock}
              >
                Add Text
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={isPending}
                onClick={() => fileInputRef.current?.click()}
              >
                Upload Image
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) createImageBlock(file);
                }}
              />
            </div>
          )}
        </CardHeader>

        <CardContent className="p-4 sm:p-5">
          {message && canEdit && (
            <p className="mb-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2 text-sm text-[var(--text-soft)]">
              {message}
            </p>
          )}

          {canEdit ? (
            <>
              <div
                className="relative hidden rounded-[var(--radius-md)] border border-dashed border-[var(--border)] bg-[var(--bg-soft)] p-3 md:block"
                style={{ minHeight: canvasHeight }}
              >
                {blocks.map((block, index) => (
                  <Rnd
                    key={block.id}
                    bounds="parent"
                    size={{
                      width: getBlockWidth(block),
                      height: getBlockHeight(block),
                    }}
                    position={{
                      x: getBlockX(block, index),
                      y: getBlockY(block, index),
                    }}
                    minWidth={180}
                    minHeight={120}
                    onDragStop={(_, data) => {
                      updateLocalBlock(block.id, {
                        x: Math.round(data.x),
                        y: Math.round(data.y),
                      });
                    }}
                    onResizeStop={(_, __, ref, ___, position) => {
                      updateLocalBlock(block.id, {
                        width: Math.round(ref.offsetWidth),
                        height: Math.round(ref.offsetHeight),
                        x: Math.round(position.x),
                        y: Math.round(position.y),
                      });
                    }}
                  >
                    <div className="flex h-full flex-col overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-sm)]">
                      <div className="flex items-center justify-between gap-2 border-b border-[var(--border)] px-3 py-2">
                        <Badge variant={isImageBlock(block) ? "default" : "outline"}>
                          {block.block_type}
                        </Badge>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            disabled={isPending}
                            onClick={() => saveBlock(block)}
                          >
                            Save
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="danger"
                            disabled={isPending}
                            onClick={() => removeBlock(block)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>

                      <div className="min-h-0 flex-1 p-3">
                        {isImageBlock(block) ? (
                          block.signed_image_url ? (
                            <div className="relative h-full min-h-[80px] overflow-hidden rounded-[var(--radius-sm)] bg-[var(--bg-soft)]">
                              <Image
                                src={block.signed_image_url}
                                alt=""
                                fill
                                className="object-contain"
                                sizes="420px"
                              />
                            </div>
                          ) : (
                            <div className="flex h-full items-center justify-center text-sm text-[var(--text-soft)]">
                              Image unavailable
                            </div>
                          )
                        ) : (
                          <Textarea
                            value={block.content ?? ""}
                            className="h-full min-h-0 resize-none"
                            onChange={(event) =>
                              updateLocalBlock(block.id, {
                                content: event.target.value,
                              })
                            }
                          />
                        )}
                      </div>

                      {!isImageBlock(block) && (
                        <div className="grid grid-cols-3 gap-2 border-t border-[var(--border)] p-3">
                          <Input
                            aria-label="Font size"
                            type="number"
                            value={block.font_size ?? 16}
                            onChange={(event) =>
                              updateLocalBlock(block.id, {
                                font_size: Number(event.target.value) || 16,
                              })
                            }
                          />
                          <Input
                            aria-label="Font weight"
                            value={block.font_weight ?? "400"}
                            onChange={(event) =>
                              updateLocalBlock(block.id, {
                                font_weight: event.target.value,
                              })
                            }
                          />
                          <select
                            aria-label="Text align"
                            className="h-11 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] px-3 text-sm text-[var(--text)]"
                            value={block.align ?? "left"}
                            onChange={(event) =>
                              updateLocalBlock(block.id, {
                                align: event.target.value as "left" | "center" | "right",
                              })
                            }
                          >
                            <option value="left">Left</option>
                            <option value="center">Center</option>
                            <option value="right">Right</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </Rnd>
                ))}
              </div>

              <div className="space-y-4 md:hidden">
                {blocks.map((block) => (
                  <ReadBlock key={block.id} block={block} />
                ))}
              </div>
            </>
          ) : (
            <div className="relative space-y-4 md:min-h-[420px] md:space-y-0">
              {blocks.length > 0 ? (
                blocks.map((block) => <ReadBlock key={block.id} block={block} />)
              ) : (
                <p className="rounded-[var(--radius-md)] border border-dashed border-[var(--border)] bg-[var(--bg-soft)] p-6 text-sm text-[var(--text-soft)]">
                  {lang === "zh" ? "这一部分还没有内容。" : "This section has no content yet."}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
