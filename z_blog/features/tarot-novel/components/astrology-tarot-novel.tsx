"use client";

import Container from "@/components/site/container";
import { usePreferences } from "@/components/site/preferences-provider";
import { ButtonLink } from "@/components/ui/button";
import type { NovelChapter } from "../lib/chapters";
import { novelTitle } from "../lib/novel-world";
import { youtubeEmbed } from "../lib/youtube";
import styles from "./novel.module.css";
import ReaderComments from "./reader-comments";
import type { NovelComment } from "../lib/comments";
import { NovelLanding } from "./novel-experience";

export function AstrologyTarotNovel({
  chapters = [],
  chapter,
  comments = [],
  commentCount = 0,
  signedIn = false,
  isAdmin = false,
}: {
  chapters?: NovelChapter[];
  chapter?: NovelChapter;
  comments?: NovelComment[];
  commentCount?: number;
  signedIn?: boolean;
  isAdmin?: boolean;
}) {
  const { language, t } = usePreferences();
  if (!chapter)
    return (
      <NovelLanding chapters={chapters} comments={comments} isAdmin={isAdmin} />
    );
  const current = chapter;
  const embed = youtubeEmbed(current.youtube_url);
  const field = (item: NovelChapter, name: "subtitle" | "content") =>
    language === "zh" ? item[`${name}_zh`] : item[`${name}_en`];
  return (
    <main className={styles.page}>
      <Container>
        <div className="py-8 sm:py-12">
          <ButtonLink href="/tarot-novel#chapters" variant="ghost">
            {t({ zh: "返回章节目录", en: "Back to chapters" })}
          </ButtonLink>
          <article className={styles.reader}>
            <h1>{t(novelTitle)}</h1>
            <h2>{field(current, "subtitle")}</h2>
            {embed && (
              <iframe
                className={styles.video}
                src={embed}
                title={t({ zh: "章节视频", en: "Chapter video" })}
                allow="encrypted-media; picture-in-picture"
                allowFullScreen
              />
            )}
            <div className={styles.body}>{field(current, "content")}</div>
            <ReaderComments
              comments={comments}
              chapterId={current.id}
              slug={current.slug}
              commentCount={commentCount}
              signedIn={signedIn}
              isAdmin={isAdmin}
            />
          </article>
        </div>
      </Container>
    </main>
  );
}
