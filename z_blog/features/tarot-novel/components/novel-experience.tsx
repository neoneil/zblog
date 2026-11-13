"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type PointerEvent,
} from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BookOpen,
  ChevronDown,
} from "lucide-react";
import Container from "@/components/site/container";
import { usePreferences } from "@/components/site/preferences-provider";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { NovelChapter } from "../lib/chapters";
import type { NovelComment } from "../lib/comments";
import {
  acts,
  appleLore,
  closing,
  guardians,
  guardianIntroduction,
  novelTitle,
  plannedChapters,
  protagonists,
  promotion,
  synopsis,
  trials,
  type NovelCopy,
  type PlannedChapter,
} from "../lib/novel-world";
import { youtubeEmbed } from "../lib/youtube";
import ReaderComments from "./reader-comments";
import styles from "./novel-world.module.css";

function useNovelText() {
  const { language, t } = usePreferences();
  return { language, t, text: (zh: string, en: string) => t({ zh, en }) };
}

function Paragraphs({ value }: { value: NovelCopy }) {
  const { t } = useNovelText();
  return (
    <div className={styles.prose}>
      {t(value)
        .split(/\n\s*\n/)
        .filter(Boolean)
        .map((p, i) => (
          <p key={i}>{p}</p>
        ))}
    </div>
  );
}

function WorldFrame({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const { text } = useNovelText();
  const tooltipId = useId();
  useEffect(() => {
    const root = ref.current;
    if (
      !root ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    )
      return;
    root.dataset.animate = "true";
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.revealed = "true";
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.03 },
    );
    root
      .querySelectorAll("[data-reveal]")
      .forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
      delete root.dataset.animate;
    };
  }, []);
  return (
    <main ref={ref} className={styles.world}>
      <Container>{children}</Container>
      <ButtonLink
        href="/tarot-novel#novel-directory"
        variant="ghost"
        size="icon"
        className={styles.backToDirectory}
        aria-label={text("返回目录", "Back to directory")}
        aria-describedby={tooltipId}
      >
        <ArrowUp size={22} aria-hidden="true" />
        <span id={tooltipId} role="tooltip" className={styles.directoryTooltip}>
          {text("返回目录", "Back to directory")}
        </span>
      </ButtonLink>
    </main>
  );
}

function Art({
  src,
  label,
  priority = false,
}: {
  src: string;
  label: NovelCopy;
  priority?: boolean;
}) {
  const { t } = useNovelText();
  return (
    <figure className={styles.art}>
      <Image
        src={src}
        alt={t(label)}
        width={1200}
        height={680}
        sizes="(max-width: 1200px) 100vw, 1152px"
        priority={priority}
      />
    </figure>
  );
}

function Heading({
  number,
  title,
  subtitle,
}: {
  number: string;
  title: NovelCopy;
  subtitle?: NovelCopy;
}) {
  const { t } = useNovelText();
  return (
    <header className={styles.sectionHeading}>
      <span className={styles.eyebrow}>{number} · STARDUST STORIES</span>
      <h2>{t(title)}</h2>
      {subtitle && <p>{t(subtitle)}</p>}
    </header>
  );
}

function tilt(event: PointerEvent<HTMLElement>) {
  if (
    event.pointerType !== "mouse" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return;
  const box = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty(
    "--tilt-x",
    `${((event.clientY - box.top) / box.height - 0.5) * -5}deg`,
  );
  event.currentTarget.style.setProperty(
    "--tilt-y",
    `${((event.clientX - box.left) / box.width - 0.5) * 5}deg`,
  );
}
function resetTilt(event: PointerEvent<HTMLElement>) {
  event.currentTarget.style.removeProperty("--tilt-x");
  event.currentTarget.style.removeProperty("--tilt-y");
}

function ChapterDirectory({
  chapters,
  initialAct = 1,
}: {
  chapters: NovelChapter[];
  initialAct?: number;
}) {
  const { t, text, language } = useNovelText();
  const [actNumber, setActNumber] = useState(initialAct);
  const [selected, setSelected] = useState((initialAct - 1) * 10 + 1);
  const current = plannedChapters.find((item) => item.number === selected)!;
  const published = chapters.find((item) => item.chapter_number === selected);
  const embed = youtubeEmbed(published?.youtube_url ?? null);
  const href = `/tarot-novel/${published?.slug ?? current.slug}`;
  return (
    <section id="chapters" className={styles.section} data-reveal>
      <Heading
        number="02"
        title={{
          zh: "故事进度 · 五幕五十章",
          en: "Story Progress · Five Acts, Fifty Chapters",
        }}
        subtitle={{
          zh: "循着七颗星辰，走向诸神的审判。",
          en: "Follow seven stars toward the judgment of the gods.",
        }}
      />
      <div
        className={styles.actTabs}
        role="group"
        aria-label={text("选择分幕", "Choose an act")}
      >
        {acts.map((act) => (
          <Button
            key={act.number}
            variant={act.number === actNumber ? "secondary" : "ghost"}
            aria-pressed={act.number === actNumber}
            onClick={() => {
              setActNumber(act.number);
              setSelected(act.chapters[0].number);
            }}
          >
            {t(act.name)}
          </Button>
        ))}
      </div>
      <div className={styles.chapterLayout}>
        <Card className={styles.preview}>
          <CardContent className="p-5 sm:p-7">
            <span className={styles.eyebrow}>
              {text("当前章节", "Current chapter")} ·{" "}
              {String(selected).padStart(2, "0")}
            </span>
            <div className={styles.previewInner}>
              {embed ? (
                <iframe
                  src={embed}
                  className={styles.previewVideo}
                  title={text("章节视频", "Chapter video")}
                  allow="encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <Image
                  src={acts[current.act - 1].image}
                  alt={t(acts[current.act - 1].name)}
                  width={320}
                  height={180}
                  className={styles.previewImage}
                  sizes="240px"
                />
              )}
              <div>
                <h3>
                  {published
                    ? published[`subtitle_${language}`]
                    : t(current.title)}
                </h3>
                <p>{t(current.summary)}</p>
                <p className={styles.status}>
                  {published
                    ? text("已发布", "Published")
                    : text(
                        "章节规划 · 正文待更新",
                        "Chapter outline · Story coming soon",
                      )}
                </p>
                <ButtonLink href={href} variant="secondary">
                  <BookOpen size={16} />
                  {text("阅读本章节", "Read this chapter")}
                </ButtonLink>
              </div>
            </div>
          </CardContent>
        </Card>
        <div
          className={styles.chapterList}
          aria-label={text("章节目录", "Chapter directory")}
        >
          {plannedChapters
            .filter((item) => item.act === actNumber)
            .map((item) => (
              <Button
                key={item.number}
                className={styles.chapterButton}
                variant={selected === item.number ? "secondary" : "ghost"}
                aria-pressed={selected === item.number}
                onClick={() => setSelected(item.number)}
              >
                <span>{String(item.number).padStart(2, "0")}</span>
                <span>{t(item.title)}</span>
                {chapters.some((row) => row.chapter_number === item.number) && (
                  <BookOpen
                    size={14}
                    aria-label={text("已发布", "Published")}
                  />
                )}
              </Button>
            ))}
        </div>
      </div>
    </section>
  );
}

function ActCards() {
  const { t, text } = useNovelText();
  return (
    <div className={styles.actGrid}>
      {acts.map((act) => (
        <Link
          className={styles.actCard}
          key={act.number}
          href={`/tarot-novel/acts/${act.slug}`}
          onPointerMove={tilt}
          onPointerLeave={resetTilt}
        >
          <Image
            src={act.image}
            alt={t(act.name)}
            width={1200}
            height={680}
            sizes="(max-width: 767px) 100vw, 560px"
          />
          <div>
            <span className={styles.eyebrow}>
              {text(
                `第 ${(act.number - 1) * 10 + 1}–${act.number * 10} 章`,
                `Chapters ${(act.number - 1) * 10 + 1}–${act.number * 10}`,
              )}
            </span>
            <h3>{t(act.name)}</h3>
            <p>{t(act.content)}</p>
            <span className={styles.linkText}>
              {text("探索本幕", "Explore this act")}
              <ArrowRight size={16} />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function NovelLanding({
  chapters,
  comments,
  isAdmin,
}: {
  chapters: NovelChapter[];
  comments: NovelComment[];
  isAdmin: boolean;
}) {
  const { t, text, language } = useNovelText();
  const tarotHref = `/thoth-tarot?lang=${language}`;
  const tarotCast = [
    ["0", "愚者", "Fool", "星尘旅人", "The Stardust Wanderer"],
    ["I", "魔术师", "Magus", "水星守护者", "Mercury Guardian"],
    ["II", "女祭司", "Priestess", "北极星白雪公主", "Polaris / Snow White"],
    ["III", "皇后", "Empress", "金星守护者", "Venus Guardian"],
    ["IV", "皇帝", "Emperor", "赤焰帝王", "The Crimson Emperor"],
    ["V", "教皇", "Hierophant", "圣殿大祭司", "The High Hierophant"],
    ["VI", "恋人", "Lovers", "双魂神使", "The Twin-Souled Oracle"],
    ["VII", "战车", "Chariot", "星界骑士", "The Celestial Knight"],
    ["VIII", "调整", "Adjustment", "天平审判官", "The Keeper of Balance"],
    ["IX", "隐士", "Hermit", "无名先知", "The Nameless Oracle"],
    ["X", "命运", "Fortune", "木星守护者", "Jupiter Guardian"],
    ["XI", "欲", "Lust", "狮心女王", "The Lionheart Queen"],
    ["XII", "倒吊人", "Hanged Man", "永眠的献祭者", "The Eternal Sacrifice"],
    ["XIII", "死神", "Death", "海王星死神", "Neptune / Death"],
    ["XIV", "艺术", "Art", "炼金术女王", "The Alchemical Queen"],
    ["XV", "恶魔", "Devil", "冥王星恶魔", "Pluto / The Devil"],
    ["XVI", "高塔", "Tower", "火星守护者", "Mars Guardian"],
    ["XVII", "星星", "Star", "天界叛逆者", "The Celestial Rebel"],
    ["XVIII", "月亮", "Moon", "月亮守护者", "Moon Guardian"],
    ["XIX", "太阳", "Sun", "太阳守护者", "Sun Guardian"],
    ["XX", "永劫", "Aeon", "新纪元之子", "The Child of the New Aeon"],
    ["XXI", "宇宙", "Universe", "土星守护者", "Saturn Guardian"],
  ];
  const introduction = (
    <section className={styles.hero}>
      <div className={styles.heroMedia}>
        <Image
          src="/stardust-stories-hero.png"
          alt={text(
            "白雪公主、禁果与死亡的星辰世界",
            "Snow White, the forbidden apple, and a celestial world of death",
          )}
          width={1672}
          height={941}
          sizes="(max-width: 1200px) 100vw, 1152px"
          priority
        />
        <div className={styles.scan} aria-hidden="true" />
        <div className={styles.heroOverlay} aria-hidden="true" />
        <header className={styles.heroCopy}>
          <span className={styles.eyebrow}>
            {text(
              "星尘物语 · STELLARNESTS 原创小说",
              "STARDUST STORIES · A STELLARNESTS ORIGINAL",
            )}
          </span>
          <h1>{t(novelTitle)}</h1>
          <p>
            {text(
              "七颗星辰，一位失落的神明，一颗足以终结诸神统治的禁果。",
              "Seven stars. One lost goddess. A forbidden apple that could end the reign of the gods.",
            )}
          </p>
          <div className={styles.actions}>
            <ButtonLink href="#chapters" variant="secondary">
              <BookOpen size={17} />
              {text("开始阅读", "Start reading")}
            </ButtonLink>
            <ButtonLink href="#synopsis" variant="ghost">
              {text("探索故事", "Explore the story")}
              <ArrowDown size={17} />
            </ButtonLink>
          </div>
        </header>
      </div>
    </section>
  );
  return (
    <WorldFrame>
      {introduction}
      <nav
        id="novel-directory"
        tabIndex={-1}
        className={styles.jumpNav}
        aria-label={text("小说导览", "Novel navigation")}
      >
        {[
          ["acts", "五幕故事", "Five Acts"],
          ["chapters", "章节目录", "Chapters"],
          ["synopsis", "故事概要", "Synopsis"],
          ["relationships", "人物关系网", "Relationships"],
          ["characters", "核心人物", "Characters"],
          ["astrology", "七星守护者", "Guardians"],
          ["trials", "命运试炼", "Trials"],
          ["forbidden-apple", "禁果之谜", "The Apple"],
        ].map(([id, zh, en]) => (
          <Link href={`#${id}`} key={id}>
            {text(zh, en)}
          </Link>
        ))}
      </nav>
      <section id="acts" className={styles.section}>
        <Heading
          number="01"
          title={{
            zh: "五幕故事 · 从苏醒到审判",
            en: "Five Acts · From Awakening to Judgment",
          }}
        />
        <ActCards />
      </section>
      <ChapterDirectory chapters={chapters} />
      <section id="synopsis" className={styles.section} data-reveal>
        <Heading
          number="03"
          title={{
            zh: "一个童话背后，未曾结束的审判",
            en: "Behind a Fairy Tale, a Judgment That Never Ended",
          }}
        />
        <div className={styles.synopsis}>
          <p className={styles.lead}>
            {text(
              "这一次，白雪公主不会等待王子的吻。",
              "This time, Snow White will not wait for a prince's kiss.",
            )}
          </p>
          <Paragraphs value={synopsis} />
        </div>
      </section>
      <section className={styles.section} data-reveal>
        <Heading
          number="04"
          title={{ zh: "人物与命运档案", en: "Characters & Destiny Archives" }}
        />
        <div className={styles.archiveGrid}>
          {(
            [
              [
                "relationships",
                "人物关系网",
                "The Character Relationship Network",
                "/novel/image1.png",
                "探索四位主角、七星守护者与十一位试炼人物之间的连接。",
                "Explore the connections between four protagonists, seven guardians, and eleven trial characters.",
              ],
              [
                "characters",
                "四大星辰命运 · 核心人物档案",
                "Four Celestial Destinies · Character Archives",
                "/novel/image2.png",
                "走近白雪公主、死神、恶魔与天界叛逆者，阅读他们的故事与成长弧线。",
                "Meet Snow White, Death, the Devil, and the Celestial Rebel through their stories and growth arcs.",
              ],
            ] as const
          ).map(([slug, zh, en, image, descriptionZh, descriptionEn]) => (
            <Link
              id={slug}
              key={slug}
              href={`/tarot-novel/world/${slug}`}
              className={styles.actCard}
            >
              <Image
                src={image}
                alt={text(zh, en)}
                width={1200}
                height={680}
                sizes="(max-width: 767px) 100vw, 600px"
              />
              <div>
                <h3>{text(zh, en)}</h3>
                <p>{text(descriptionZh, descriptionEn)}</p>
                <span className={styles.linkText}>
                  {text("打开档案", "Open archive")}
                  <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section id="astrology" className={styles.section} data-reveal>
        <Heading
          number="05"
          title={{ zh: "星辰神权体系", en: "Astrology · The Celestial Order" }}
          subtitle={{
            zh: "北极星、七大古典行星与三大外行星，交织成 STELLARNESTS 的星辰世界。",
            en: "Polaris, seven classical planets, and three outer planets form the celestial world of STELLARNESTS.",
          }}
        />
        <Art
          src="/novel/image3.png"
          label={{
            zh: "星辰神权体系的十一位核心人物",
            en: "The eleven central figures of the celestial order",
          }}
        />
        <h3 className={styles.subheading}>
          {text(
            "七个小矮人 · 七大古典行星 · 七星守护者",
            "The Seven Dwarfs · Seven Classical Planets · Seven Guardians",
          )}
        </h3>
        <p className={styles.intro}>{t(guardianIntroduction)}</p>
        <Art
          src="/novel/image4.png"
          label={{
            zh: "白雪公主的七位星辰守护者",
            en: "Snow White's seven celestial guardians",
          }}
        />
        <div className={styles.guardianGrid}>
          {guardians.map((person) => (
            <Card
              className={styles.characterCard}
              key={person.name.en}
              onPointerMove={tilt}
              onPointerLeave={resetTilt}
            >
              <div className={styles.characterImage}>
                <Image
                  src={person.image}
                  alt={t(person.name)}
                  width={600}
                  height={900}
                  sizes="(max-width: 639px) 90vw, (max-width: 1023px) 45vw, 280px"
                />
              </div>
              <CardContent className="p-5">
                <h3>{t(person.name)}</h3>
                <p>{t(person.content)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <ButtonLink href="/stella" variant="secondary">
          {text("探索星辰命盘", "Explore your birth chart")}
          <ArrowRight size={16} />
        </ButtonLink>
      </section>
      <section id="trials" className={styles.section} data-reveal>
        <Heading
          number="06"
          title={{
            zh: "塔罗 · 人物命运原型",
            en: "Tarot · Archetypes of Destiny",
          }}
          subtitle={{
            zh: "二十二张大阿尔卡纳，对应二十二位核心角色。",
            en: "Twenty-two Major Arcana. Twenty-two central characters.",
          }}
        />
        <div className={styles.arcanaGrid}>
          {tarotCast.map(([number, zh, en, nameZh, nameEn]) => (
            <Link href={tarotHref} key={number} className={styles.arcana}>
              <span>{number}</span>
              <div>
                <h3>{text(zh, en)}</h3>
                <p>{text(nameZh, nameEn)}</p>
              </div>
              <ArrowRight size={14} />
            </Link>
          ))}
        </div>
        <h3 className={styles.subheading}>
          {text(
            "十一场试炼 · 十一项命运选择",
            "Eleven Trials · Eleven Choices of Fate",
          )}
        </h3>
        <p className={styles.intro}>
          {text(
            "七星解决她能不能审判；十一场试炼回答她有没有资格审判。力量不意味着有权替世界作出所有选择。",
            "The seven stars determine whether she can judge. Eleven trials determine whether she is worthy to do so. The power to change the world does not confer the right to choose for it.",
          )}
        </p>
        <div className={styles.trialGrid}>
          {trials.map((trial, i) => (
            <Card
              key={trial.name.en}
              className={styles.trialCard}
              onPointerMove={tilt}
              onPointerLeave={resetTilt}
            >
              <div className={styles.trialImage}>
                <Image
                  src={trial.image}
                  alt={t(trial.name)}
                  width={600}
                  height={900}
                  sizes="(max-width: 639px) 40vw, 320px"
                />
              </div>
              <CardContent className="p-5">
                <span className={styles.eyebrow}>
                  {text(`第 ${i + 1} 场`, `Trial ${i + 1}`)} · {t(trial.place)}
                </span>
                <h3>{t(trial.name)}</h3>
                <p className={styles.symbol}>{t(trial.symbol)}</p>
                <details
                  className={`${styles.disclosure} ${styles.trialDisclosure}`}
                >
                  <summary>
                    {text("展开试炼故事", "Read the trial story")}
                    <ChevronDown size={17} />
                  </summary>
                  <p>{t(trial.content)}</p>
                </details>
                <blockquote>{t(trial.lesson)}</blockquote>
                <p className={styles.status}>
                  {text("试炼印记", "Trial mark")} · {t(trial.token)}
                </p>
                <Link
                  href={`/tarot-novel/chapter-${trial.chapter}`}
                  className={styles.linkText}
                >
                  {text(
                    `第 ${trial.chapter} 章完成`,
                    `Completed in chapter ${trial.chapter}`,
                  )}
                  <ArrowRight size={15} />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        <ButtonLink href={tarotHref} variant="secondary">
          {text("探索透特塔罗原型", "Explore Thoth Tarot archetypes")}
          <ArrowRight size={16} />
        </ButtonLink>
      </section>
      <section id="forbidden-apple" className={styles.section} data-reveal>
        <Heading
          number="07"
          title={{
            zh: "禁果衍生系列 · 原初审判禁果",
            en: "The Forbidden Apple · The Original Judgment",
          }}
        />
        <div className={styles.appleLayout}>
          <Image
            src="/novel/image10.jpeg"
            alt={text(
              "黑色绸缎上的红色禁果",
              "A red forbidden apple on black silk",
            )}
            width={445}
            height={352}
            sizes="(max-width: 767px) 100vw, 400px"
          />
          <div>
            <Paragraphs value={appleLore} />
            <ButtonLink href="/services" variant="secondary">
              {text("探索奥秘商店", "Explore the Arcane Shop")}
              <ArrowRight size={16} />
            </ButtonLink>
          </div>
        </div>
      </section>
      <section className={`${styles.section} ${styles.ending}`} data-reveal>
        <Heading
          number="08"
          title={{ zh: "星尘物语", en: "Stardust Stories" }}
        />
        <Paragraphs value={closing} />
        <details className={styles.disclosure}>
          <summary>
            {text(
              "四种信仰，一场跨越千年的审判",
              "Four beliefs. A judgment a millennium in the making.",
            )}
            <ChevronDown size={17} />
          </summary>
          <Paragraphs value={promotion} />
        </details>
        <div className={styles.actions}>
          <ButtonLink href="#chapters" variant="secondary">
            {text("打开章节目录", "Open the chapters")}
            <BookOpen size={16} />
          </ButtonLink>
          <ButtonLink href="/#home-newsletter" variant="ghost">
            {text("订阅星辰来信", "Letters from the Stars")}
            <ArrowRight size={16} />
          </ButtonLink>
        </div>
        <p className={styles.caption}>
          {text(
            "小说中的行星权能与塔罗对应为虚构世界设定。",
            "Planetary powers and tarot correspondences on this page belong to a fictional world.",
          )}
        </p>
      </section>
      <section className={styles.section}>
        <ReaderComments comments={comments} isAdmin={isAdmin} />
      </section>
    </WorldFrame>
  );
}

export function NovelArchive({
  section,
}: {
  section: "relationships" | "characters";
}) {
  const { t, text } = useNovelText();
  const relationships = section === "relationships";
  return (
    <WorldFrame>
      <div className={styles.back}>
        <ButtonLink href="/tarot-novel#novel-directory" variant="ghost">
          <ArrowLeft size={16} />
          {text("返回小说目录", "Back to the novel directory")}
        </ButtonLink>
      </div>
      <header className={styles.actHeader}>
        <span className={styles.eyebrow}>{t(novelTitle)}</span>
        <h1>
          {relationships
            ? text("人物关系网", "The Character Relationship Network")
            : text(
                "四大星辰命运 · 核心人物档案",
                "Four Celestial Destinies · Character Archives",
              )}
        </h1>
      </header>
      <Art
        src={relationships ? "/novel/image1.png" : "/novel/image2.png"}
        label={
          relationships
            ? {
                zh: "四位主角、七位守护者与十一位试炼人物的关系网",
                en: "Relationships between four protagonists, seven guardians, and eleven trial characters",
              }
            : {
                zh: "四大主角的命运之网",
                en: "The four protagonists' intertwined destinies",
              }
        }
        priority
      />
      {relationships ? (
        <p className={styles.caption}>
          {text(
            "神明可以指引命运，却不能拥有命运。",
            "Gods may guide destiny. They cannot own it.",
          )}
        </p>
      ) : (
        <div className={styles.protagonists}>
          {protagonists.map((person, index) => (
            <article
              key={person.name.en}
              className={styles.profile}
              data-reveal
            >
              <div className={styles.portrait}>
                <Image
                  src={person.image}
                  alt={t(person.name)}
                  width={600}
                  height={900}
                  sizes="(max-width: 767px) 90vw, 340px"
                />
              </div>
              <div className={styles.profileCopy}>
                <span className={styles.eyebrow}>
                  {String(index + 1).padStart(2, "0")} ·{" "}
                  {text("人物档案", "CHARACTER ARCHIVE")}
                </span>
                <h2>{t(person.name)}</h2>
                <p className={styles.symbol}>{t(person.symbol)}</p>
                <details className={styles.disclosure}>
                  <summary>
                    {text("人物故事与权能", "Story and powers")}
                    <ChevronDown size={17} />
                  </summary>
                  <p className={styles.symbol}>
                    {text("小说权能", "Fictional powers")} · {t(person.powers)}
                  </p>
                  <Paragraphs value={person.content} />
                </details>
                <h3>{text("人物成长弧线", "Character growth arc")}</h3>
                <ol className={styles.arc}>
                  {person.arc.map((stage, i) => (
                    <li key={i}>
                      <span>{String(i + 1).padStart(2, "0")}</span>
                      <p>{t(stage)}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </article>
          ))}
        </div>
      )}
    </WorldFrame>
  );
}

export function NovelAct({
  number,
  chapters,
}: {
  number: number;
  chapters: NovelChapter[];
}) {
  const { t, text, language } = useNovelText();
  const act = acts[number - 1];
  return (
    <WorldFrame>
      <div className={styles.back}>
        <ButtonLink href="/tarot-novel#acts" variant="ghost">
          <ArrowLeft size={16} />
          {text("返回星尘物语", "Back to Stardust Stories")}
        </ButtonLink>
      </div>
      <header className={styles.actHeader}>
        <span className={styles.eyebrow}>{t(novelTitle)}</span>
        <h1>{t(act.name)}</h1>
        <p>{t(act.content)}</p>
      </header>
      <Art src={act.image} label={act.name} priority />
      <section className={styles.section}>
        <h2>{text("本幕章节", "Chapters in this act")}</h2>
        <div className={styles.outlineList}>
          {act.chapters.map((item) => {
            const published = chapters.find(
              (row) => row.chapter_number === item.number,
            );
            return (
              <Link
                key={item.number}
                className={styles.outlineLink}
                href={`/tarot-novel/${published?.slug ?? item.slug}`}
              >
                <span className={styles.chapterNumber}>
                  {String(item.number).padStart(2, "0")}
                </span>
                <div>
                  <h3>
                    {published
                      ? published[`subtitle_${language}`]
                      : t(item.title)}
                  </h3>
                  <p>{t(item.summary)}</p>
                  <span className={styles.status}>
                    {published
                      ? text("已发布", "Published")
                      : text(
                          "章节规划 · 正文待更新",
                          "Chapter outline · Story coming soon",
                        )}
                  </span>
                </div>
                <ArrowRight size={20} />
              </Link>
            );
          })}
        </div>
        <div className={styles.actions}>
          {number > 1 && (
            <ButtonLink
              href={`/tarot-novel/acts/act-${number - 1}`}
              variant="ghost"
            >
              <ArrowLeft size={16} />
              {text("上一幕", "Previous act")}
            </ButtonLink>
          )}
          {number < 5 && (
            <ButtonLink
              href={`/tarot-novel/acts/act-${number + 1}`}
              variant="secondary"
            >
              {text("下一幕", "Next act")}
              <ArrowRight size={16} />
            </ButtonLink>
          )}
        </div>
      </section>
    </WorldFrame>
  );
}

export function NovelPlannedChapter({ chapter }: { chapter: PlannedChapter }) {
  const { t, text } = useNovelText();
  const act = acts[chapter.act - 1];
  return (
    <WorldFrame>
      <div className={styles.back}>
        <ButtonLink href={`/tarot-novel/acts/${act.slug}`} variant="ghost">
          <ArrowLeft size={16} />
          {t(act.name)}
        </ButtonLink>
      </div>
      <article className={styles.plannedReader}>
        <header className={styles.actHeader}>
          <span className={styles.eyebrow}>{t(novelTitle)}</span>
          <h1>
            {text(`第 ${chapter.number} 章 · `, `Chapter ${chapter.number} · `)}
            {t(chapter.title)}
          </h1>
        </header>
        <Art src={act.image} label={act.name} priority />
        <section className={styles.section}>
          <h2>{text("章节梗概", "Chapter outline")}</h2>
          <p className={styles.lead}>{t(chapter.summary)}</p>
          <p className={styles.pending} role="status">
            {text(
              "本章正文尚未发布。作者更新后，完整正文和章节视频将在这里呈现。",
              "This chapter's story has not been published yet. The full text and any chapter video will appear here after the author publishes an update.",
            )}
          </p>
          <div className={styles.actions}>
            {chapter.number > 1 && (
              <ButtonLink
                href={`/tarot-novel/chapter-${chapter.number - 1}`}
                variant="ghost"
              >
                <ArrowLeft size={16} />
                {text("上一章", "Previous chapter")}
              </ButtonLink>
            )}
            {chapter.number < 50 && (
              <ButtonLink
                href={`/tarot-novel/chapter-${chapter.number + 1}`}
                variant="secondary"
              >
                {text("下一章", "Next chapter")}
                <ArrowRight size={16} />
              </ButtonLink>
            )}
            <ButtonLink href="/tarot-novel#chapters" variant="ghost">
              {text("章节目录", "All chapters")}
            </ButtonLink>
          </div>
        </section>
      </article>
    </WorldFrame>
  );
}
