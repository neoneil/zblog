"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { GalleryDirectory } from "@/features/tarot-gallery/lib/r2-gallery";

type TarotGalleryClientProps = {
  directories: GalleryDirectory[];
};

function formatBytes(bytes: number) {
  if (bytes <= 0) return "0 MB";
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function TarotGalleryClient({
  directories,
}: TarotGalleryClientProps) {
  const [activeDirectoryId, setActiveDirectoryId] = useState(directories[0]?.id ?? "");
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [selectedImage, setSelectedImage] = useState<GalleryDirectory["images"][number] | null>(
    null,
  );

  const activeDirectory = useMemo(
    () =>
      directories.find((directory) => directory.id === activeDirectoryId) ??
      directories[0],
    [activeDirectoryId, directories],
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedImage(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function markImageLoaded(key: string) {
    setLoadedImages((current) => ({
      ...current,
      [key]: true,
    }));
  }

  if (!activeDirectory) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-[var(--text-soft)]">
          R2 中还没有可展示的图片。
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
      <Card className="overflow-hidden">
        <CardHeader className="items-start border-b border-[var(--border)] bg-[var(--card-soft)]">
          <div>
            <CardTitle>图片目录</CardTitle>
            <CardDescription>
              按原始文件夹层级整理，点击左侧目录即可切换右侧图片。
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="max-h-[calc(100vh-260px)] space-y-3 overflow-y-auto p-3">
          {directories.map((directory) => {
            const isActive = directory.id === activeDirectory.id;

            return (
              <button
                key={directory.id}
                type="button"
                onClick={() => setActiveDirectoryId(directory.id)}
                className={[
                  "grid w-full grid-cols-[76px_minmax(0,1fr)] gap-3 rounded-[var(--radius-sm)] border p-2 text-left transition",
                  isActive
                    ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                    : "border-[var(--border)] bg-[var(--bg-soft)] hover:border-[var(--primary)]",
                ].join(" ")}
              >
                <div className="relative aspect-square overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card)]">
                  {!loadedImages[`cover-${directory.id}`] && (
                    <div className="gallery-shimmer absolute inset-0" />
                  )}
                  {directory.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={directory.coverUrl}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                      onLoad={() => markImageLoaded(`cover-${directory.id}`)}
                      onError={() => markImageLoaded(`cover-${directory.id}`)}
                    />
                  ) : null}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--text)]">
                    {directory.name}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--text-soft)]">
                    {directory.path}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="outline">{directory.imageCount} images</Badge>
                    <span className="text-xs text-[var(--text-soft)]">
                      {formatBytes(directory.totalSize)}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </CardContent>
      </Card>

      <div className="space-y-5">
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-[var(--border)] bg-[var(--card-soft)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <Badge variant="secondary">Selected Folder</Badge>
                <CardTitle className="mt-3 text-2xl sm:text-3xl">
                  {activeDirectory.name}
                </CardTitle>
                <CardDescription className="mt-2 break-all">
                  {activeDirectory.path}
                </CardDescription>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:min-w-[220px]">
                <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-soft)] p-3">
                  <p className="text-xs text-[var(--text-soft)]">Images</p>
                  <p className="mt-1 text-xl font-semibold text-[var(--text)]">
                    {activeDirectory.imageCount}
                  </p>
                </div>
                <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-soft)] p-3">
                  <p className="text-xs text-[var(--text-soft)]">Size</p>
                  <p className="mt-1 text-xl font-semibold text-[var(--text)]">
                    {formatBytes(activeDirectory.totalSize)}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {activeDirectory.images.map((image) => (
            <Card key={image.key} className="overflow-hidden">
              <button
                type="button"
                onClick={() => setSelectedImage(image)}
                className="relative block w-full bg-[var(--bg-soft)] text-left"
              >
                {!loadedImages[image.key] && (
                  <div className="gallery-shimmer absolute inset-0" />
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.signedUrl}
                  alt={image.name}
                  className="aspect-[4/3] w-full object-contain"
                  loading="lazy"
                  onLoad={() => markImageLoaded(image.key)}
                  onError={() => markImageLoaded(image.key)}
                />
              </button>
              <CardContent className="space-y-2 p-4">
                <p className="break-all text-sm font-medium text-[var(--text)]">
                  {image.name}
                </p>
                <p className="text-xs text-[var(--text-soft)]">
                  {formatBytes(image.size)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[color:var(--bg)]/85 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-md)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--card-soft)] px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[var(--text)]">
                  {selectedImage.name}
                </p>
                <p className="truncate text-xs text-[var(--text-soft)]">
                  {activeDirectory.path}
                </p>
              </div>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card)] text-xl leading-none text-[var(--text)] transition hover:bg-[var(--bg-soft)]"
                aria-label="Close image preview"
                onClick={() => setSelectedImage(null)}
              >
                ×
              </button>
            </div>

            <div className="relative flex max-h-[calc(92vh-58px)] items-center justify-center bg-[var(--bg-soft)] p-3">
              {!loadedImages[`modal-${selectedImage.key}`] && (
                <div className="gallery-shimmer absolute inset-0" />
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedImage.signedUrl}
                alt={selectedImage.name}
                className="max-h-[calc(92vh-82px)] w-full object-contain"
                onLoad={() => markImageLoaded(`modal-${selectedImage.key}`)}
                onError={() => markImageLoaded(`modal-${selectedImage.key}`)}
              />
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes gallery-shimmer-sweep {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .gallery-shimmer {
          overflow: hidden;
          background: var(--bg-soft);
        }

        .gallery-shimmer::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent,
            var(--card-soft),
            transparent
          );
          animation: gallery-shimmer-sweep 1.4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
