"use client";

import Image from "next/image";
import { useState } from "react";
import Container from "@/components/site/container";
import { usePreferences } from "@/components/site/preferences-provider";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { NovelChapter } from "../lib/chapters";
import { youtubeEmbed } from "../lib/youtube";
import styles from "./novel.module.css";
import ReaderComments from "./reader-comments";
import type { NovelComment } from "../lib/comments";

export function AstrologyTarotNovel({ chapters = [], chapter, comments = [], commentCount = 0, signedIn = false, isAdmin = false }: { chapters?: NovelChapter[]; chapter?: NovelChapter; comments?: NovelComment[]; commentCount?: number; signedIn?: boolean; isAdmin?: boolean }) {
  const { language, t } = usePreferences();
  const [selected, setSelected] = useState(chapters[0]?.id);
  const current = chapter ?? chapters.find((item) => item.id === selected) ?? chapters[0];
  const text = (zh: string, en: string) => t({ zh, en });
  const embed = current ? youtubeEmbed(current.youtube_url) : null;
  const field = (item: NovelChapter, name: "title" | "subtitle" | "content") => language === "zh" ? item[`${name}_zh`] : item[`${name}_en`];
  return (
    <main className={styles.page}><Container><div className="py-8 sm:py-12">
      <ButtonLink href={chapter ? "/tarot-novel#chapters" : "/"} variant="ghost">{text(chapter ? "返回章节目录" : "返回首页", chapter ? "Back to chapters" : "Back home")}</ButtonLink>
      {!chapter && <section className={styles.hero} tabIndex={0} aria-label={text("星尘物语：让我们再死一次", "Stardust Stories: Let Us Die Once More")}>
        <div className={styles.heroMedia}>
          <Image src="/stardust-stories-hero.png" alt="" width={1672} height={941} sizes="(max-width: 1152px) 100vw, 1152px" priority className={styles.heroImage} />
        </div>
        <div className={styles.heroOverlay} aria-hidden="true" />
        <div className={styles.heroText}>
          <p>{text("星尘物语", "STARDUST STORIES")}</p>
          <h1 className={styles.bookTitle}>{text("让我们再死一次", "LET US DIE ONCE MORE")}</h1>
          <p>{text("星辰是宇宙的秩序，描绘命运的轨迹；星尘是灵魂的自由，书写自由的篇章。", "The Stars Hold Order. Stardust Holds Freedom.")}</p>
          <ButtonLink href="#chapters" variant="hero">{text("开始阅读", "Start reading")}</ButtonLink>
        </div>
      </section>}
      {!chapter && <section id="chapters" className={styles.chapters}>
        <Card><CardContent className="p-5">
          {current ? <div className={embed ? styles.chapterPreview : undefined}>
            {embed && <iframe className={`${styles.video} ${styles.previewVideo}`} src={embed} title={text("章节视频", "Chapter video")} allow="encrypted-media; picture-in-picture" allowFullScreen />}
            <div className={styles.previewCopy}>
              <p>{text("当前章节", "Current chapter")}</p>
              <h2>{field(current, "subtitle")}</h2>
              <ButtonLink href={`/tarot-novel/${current.slug}`} variant="hero">{text("阅读本章节", "Read this chapter")}</ButtonLink>
            </div>
          </div> : <><p>{text("当前章节", "Current chapter")}</p><p role="status">{text("小说章节即将发布。", "Chapters are coming soon.")}</p></>}
        </CardContent></Card>
        <aside><h2>{text("故事进度 · 章节目录", "Story progress · Chapters")}</h2><div className={styles.directory}>
          {chapters.map((item) => <Button key={item.id} variant={item.id === current?.id ? "secondary" : "ghost"} onClick={() => setSelected(item.id)} aria-pressed={item.id === current?.id}>{String(item.chapter_number).padStart(2, "0")} · {field(item, "subtitle")}</Button>)}
        </div></aside>
      </section>}
      {!chapter && <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card><CardContent className="p-6">
          <h2>{text("关于这个故事", "About this story")}</h2>
          <p>{text("这是一个将神话叙事、占星符号与塔罗意象结合的成长系列。每一章围绕一个清晰主题，适合独立阅读，也适合亲子共同讨论。", "A story series weaving mythology, astrological symbols and tarot imagery. Each chapter explores a theme for independent or shared reading.")}</p>
          <p className="mt-4">{text("每周更新 · 全年龄", "Weekly updates · All ages")}</p>
        </CardContent></Card>
        <Card><CardContent className="p-6">
          <h2>{text("不错过下一章", "Never miss a chapter")}</h2>
          <p className="mb-5">{text("新章节发布后，可通过站内 Newsletter 获取更新。", "Receive new chapter updates through our newsletter.")}</p>
          <ButtonLink href="/newsletter" variant="secondary">{text("订阅更新", "Subscribe for updates")}</ButtonLink>
        </CardContent></Card>
        <div className="lg:col-span-2"><ReaderComments comments={comments} isAdmin={isAdmin} /></div>
      </div>}
      {chapter && current ? <article className={styles.reader}>
        <h1>{field(current, "title")}</h1><h2>{field(current, "subtitle")}</h2>
        {embed && <iframe className={styles.video} src={embed} title={text("章节视频", "Chapter video")} allow="encrypted-media; picture-in-picture" allowFullScreen />}
        <div className={styles.body}>{field(current, "content")}</div>
        <ReaderComments comments={comments} chapterId={current.id} slug={current.slug} commentCount={commentCount} signedIn={signedIn} isAdmin={isAdmin} />
      </article> : null}
    </div></Container></main>
  );
}
