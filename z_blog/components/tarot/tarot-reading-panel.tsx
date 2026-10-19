"use client";

import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { DrawnTarotCard } from "@/types/tarot";
import type { BilingualReadingText, TarotReadingResult } from "@/lib/tarot/reading-result";
import styles from "./tarot-reading.module.css";
import { tarotModes, type TarotReadingMode } from "@/lib/tarot/reading-modes";

type TarotReadingPanelProps = {
  reading: string;
  cards: DrawnTarotCard[];
  sections: TarotReadingResult | null;
  loading?: boolean;
  mode?: TarotReadingMode;
};

function BilingualText({ text }: { text: BilingualReadingText }) {
  return <div className={styles.bilingual}>
    <div lang="zh-CN"><ReactMarkdown remarkPlugins={[remarkGfm]}>{text.zh}</ReactMarkdown></div>
    <div lang="en"><ReactMarkdown remarkPlugins={[remarkGfm]}>{text.en}</ReactMarkdown></div>
  </div>;
}

function ReadingSkeleton() {
  return <div className={styles.skeleton} aria-hidden="true">
    <span /><span /><span /><span />
  </div>;
}

export default function TarotReadingPanel({ reading, cards, sections, loading, mode = "three-cards" }: TarotReadingPanelProps) {
  const positions = tarotModes[mode].positions;
  return <div className={styles.panel} aria-busy={loading}>
    {loading && <header className={styles.header}>
      <span role="status">正在解读 / Reading your cards…</span>
    </header>}

    {sections || loading ? <>
      <section className={styles.summary} aria-labelledby="tarot-overview">
        <h3 id="tarot-overview">总览 / Overview</h3>
        {sections ? <BilingualText text={sections.overview} /> : <ReadingSkeleton />}
      </section>

      {positions.map(({ key, label }) => {
        const card = cards.find(item => item.position === key);
        return <section key={key} className={styles.cardRow} aria-labelledby={`reading-${key}`}>
          <figure className={styles.cardFigure}>
            {card && <>
              <div className={styles.cardImage}>
                <Image src={encodeURI(card.imageSrc)} alt={`${card.nameCn} / ${card.name}`} fill
                  sizes="(min-width: 640px) 176px, 150px" className={card.reversed ? styles.reversed : undefined} />
              </div>
              <figcaption>
                <span lang="zh-CN">{card.nameCn}</span>
                <span lang="en">{card.name}</span>
                <small>{card.reversed ? "逆位 / Reversed" : "正位 / Upright"}</small>
              </figcaption>
            </>}
          </figure>
          <div className={styles.explanation}>
            <h3 id={`reading-${key}`}>{label.zh} / {label.en}</h3>
            {sections?.[key] ? <BilingualText text={sections[key]} /> : <ReadingSkeleton />}
          </div>
        </section>;
      })}

      <section className={styles.summary} aria-labelledby="tarot-synthesis">
        <h3 id="tarot-synthesis">综合分析 / Synthesis</h3>
        {sections ? <BilingualText text={sections.synthesis} /> : <ReadingSkeleton />}
      </section>
      <section className={styles.summary} aria-labelledby="tarot-advice">
        <h3 id="tarot-advice">建议 / Advice</h3>
        {sections ? <ol className={styles.advice}>{sections.advice.map((text, index) =>
          <li key={index}><BilingualText text={text} /></li>)}</ol> : <ReadingSkeleton />}
      </section>
    </> : <div className={styles.fallback} role={reading ? "status" : undefined}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {reading || "翻开所有牌后显示解读。 / Your reading appears after all cards are revealed."}
      </ReactMarkdown>
    </div>}
  </div>;
}
