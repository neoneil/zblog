"use client";

import { useState, useTransition, type FormEvent } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/features/services/lib/catalog";
import type { PhysicalProduct } from "@/features/services/lib/physical-products";
import { archivePhysicalProduct, savePhysicalProduct, type ProductActionResult } from "./actions";

const initial: ProductActionResult = { ok: false, message: "" };
const fields = [
  { name: "title_zh", label: "中文标题", limit: 120 },
  { name: "title_en", label: "英文标题", limit: 120 },
  { name: "subtitle_zh", label: "中文副标题", limit: 500 },
  { name: "subtitle_en", label: "英文副标题", limit: 500 },
] as const;
const inputClass = "w-full rounded-md border border-[var(--border)] bg-[var(--bg)] p-2 text-[var(--text)]";

function Editor({ product }: { product?: PhysicalProduct }) {
  const [result, setResult] = useState(initial);
  const [pending, startTransition] = useTransition();

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const element = event.currentTarget;
    const form = new FormData(element);
    startTransition(async () => {
      try {
        const response = await savePhysicalProduct(form);
        setResult(response);
        if (response.ok && !product) element.reset();
      } catch {
        setResult({ ok: false, message: "保存失败，请稍后重试。" });
      }
    });
  }

  function remove() {
    if (!product || !window.confirm(`从商店移除「${product.title_zh}」？`)) return;
    const form = new FormData();
    form.set("slug", product.slug);
    form.set("version", product.updated_at);
    startTransition(async () => {
      try {
        setResult(await archivePhysicalProduct(form));
      } catch {
        setResult({ ok: false, message: "删除失败，请稍后重试。" });
      }
    });
  }

  return (
    <form onSubmit={save} className="space-y-4 py-4">
      {product && <>
        <input type="hidden" name="slug" value={product.slug} />
        <input type="hidden" name="version" value={product.updated_at} />
        <Image src={product.image} alt={product.title_zh} width={100} height={100} className="size-24 rounded-md object-cover" />
      </>}
      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map(({ name, label, limit }) => (
          <label key={name} className="space-y-1 text-sm">
            <span>{label}</span>
            <input name={name} required maxLength={limit} defaultValue={product?.[name]} className={inputClass} />
          </label>
        ))}
        <label className="space-y-1 text-sm">
          <span>价格（AUD）</span>
          <input name="price_aud" type="number" required min={0.01} max={1000000} step={0.01} defaultValue={product && (product.price_stars / 100).toFixed(2)} className={inputClass} />
        </label>
        <label className="space-y-1 text-sm">
          <span>{product ? "替换图片（可选）" : "商品图片"} · PNG、JPEG 或 WebP，最多 5 MB</span>
          <input name="image" type="file" accept="image/png,image/jpeg,image/webp" required={!product} className={inputClass} />
        </label>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>{pending ? "处理中…" : "保存商品"}</Button>
        {product && <Button type="button" variant="danger" disabled={pending} onClick={remove}>删除商品</Button>}
      </div>
      {result.message && <p role="status">{result.message}</p>}
    </form>
  );
}

export default function ProductManager({ products }: { products: PhysicalProduct[] }) {
  const [search, setSearch] = useState("");
  const term = search.trim().toLowerCase();
  const matches = products.filter((item) => [item.title_zh, item.title_en, item.slug].some((value) => value.toLowerCase().includes(term)));
  return (
    <div className="space-y-5">
      <details open className="rounded-lg border border-[var(--border)] px-4 py-3">
        <summary className="cursor-pointer font-semibold">新增实物商品</summary>
        <Editor />
      </details>
      <label className="block max-w-sm space-y-1 text-sm">
        <span>搜索商品</span>
        <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} className={inputClass} />
      </label>
      {!matches.length && <p>暂无匹配商品。</p>}
      {matches.map((product) => (
        <details key={product.slug} className="rounded-lg border border-[var(--border)] px-4 py-3">
          <summary className="cursor-pointer font-semibold">{product.title_zh} · {formatPrice(product.price_stars, "zh")}</summary>
          <Editor key={product.updated_at} product={product} />
        </details>
      ))}
    </div>
  );
}
