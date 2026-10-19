"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { tarotDeck } from "@/lib/tarot/full-deck";
import type { TarotCard } from "@/types/tarot";
import styles from "./tarot-experience.module.css";
import TarotSparkBurst from "./tarot-spark-burst";
import type { TarotStage } from "./tarot-stage";

type TarotDeckProps = {
  cards: TarotCard[];
  stage: TarotStage;
  selectedIds: string[];
  onSelectCard: (card: TarotCard) => void;
};

export const experienceCardBack = "/tarot-experience/card-back.webp";

export default function TarotDeck({ cards, stage, selectedIds, onSelectCard }: TarotDeckProps) {
  const reducedMotion = useReducedMotion();
  const viewport = useRef<HTMLDivElement>(null);
  const idle = stage === "idle";
  const shuffling = stage === "shuffling";
  const finished = stage === "gathering" || stage === "ready" || stage === "revealing" || stage === "reading" || stage === "done";
  const visibleCards = idle ? tarotDeck.slice(0, 22) : cards;

  useEffect(() => {
    const element = viewport.current;
    if (element) element.scrollLeft = (element.scrollWidth - element.clientWidth) / 2;
  }, [stage]);

  return <div ref={viewport} className={styles.deckViewport} aria-hidden={finished}
    data-idle={idle} data-finished={finished}
    aria-label={idle ? "塔罗牌阵" : "选择塔罗牌 / Select tarot cards"}>
    <motion.div className={styles.wheel}
      animate={{ rotate: shuffling && !reducedMotion ? [0, -360, -720] : 0, opacity: finished ? 0 : 1 }}
      transition={{ rotate: { duration: shuffling ? 12 : 0, times: [0, 0.5, 1], ease: [0.3, 0, 0.14, 1] }, opacity: { duration: 0.6 } }}>
      {visibleCards.map((card, index) => {
        const angle = (index / Math.max(visibleCards.length - 1, 1) - 0.5) * 116;
        const selected = selectedIds.includes(card.id);
        return <motion.div key={card.id} className={styles.axis}
          initial={{ rotate: 0 }}
          animate={{ rotate: shuffling && !reducedMotion ? [angle, -60, angle, angle] : angle }}
          transition={shuffling && !reducedMotion ? {
            duration: 6, times: [0, 0.25, 0.72, 1], repeat: 1,
            ease: [0.3, 0, 0.14, 1], delay: index * 0.009,
          } : { duration: reducedMotion ? 0 : 1.5, delay: index * 0.012, ease: [0.3, 0, 0.14, 1] }}
          style={{ zIndex: selected ? visibleCards.length + index + 1 : index + 1 }}>
          {selected && <TarotSparkBurst seed={index} />}
          {!selected && <motion.button type="button"
            layoutId={idle ? undefined : `tarot-card-${card.id}`}
            className={styles.deckCard}
            disabled={stage !== "selecting"}
            aria-label={`选择第 ${index + 1} 张牌`}
            onClick={() => onSelectCard(card)}
            whileHover={stage === "selecting" ? { y: -22, scale: 1.035 } : undefined}
            whileFocus={stage === "selecting" ? { y: -22, scale: 1.035 } : undefined}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: reducedMotion ? 0 : 0.35 }}>
            <Image src={experienceCardBack} alt="" fill
              sizes="(max-width: 640px) 110px, 136px" className={styles.cardImage} />
            <span className={styles.cardGlare} />
          </motion.button>}
        </motion.div>;
      })}
    </motion.div>
  </div>;
}
