"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { DrawnTarotCard } from "@/types/tarot";
import { experienceCardBack } from "./tarot-deck";
import TarotSparkBurst from "./tarot-spark-burst";
import styles from "./tarot-experience.module.css";
import { getTarotPositionLabel } from "@/lib/tarot/reading-modes";
import { usePreferences } from "@/components/site/preferences-provider";

type TarotCardProps = {
  card: DrawnTarotCard;
  index: number;
  revealed: boolean;
  gathering: boolean;
  canFlip: boolean;
  onFlip: (id: string) => void;
  onFlipped: (id: string) => void;
  layoutId?: string;
};

export default function TarotCard({ card, index, revealed, gathering, canFlip, onFlip, onFlipped, layoutId }: TarotCardProps) {
  const reducedMotion = useReducedMotion();
  const { t, language } = usePreferences();
  const completed = useRef(false);
  const [faceVisible, setFaceVisible] = useState(false);

  return <motion.div layoutId={layoutId} className={styles.selectedCard}
    initial={{ opacity: 0, y: -30, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: reducedMotion ? 0 : 0.95, delay: index * 0.04, ease: [0.23, 1, 0.32, 1] }}>
    {gathering && <TarotSparkBurst orbit seed={index + 100} />}
    {revealed && <TarotSparkBurst key="flip" seed={index + 200} />}
    <motion.button type="button" className={styles.flipper}
      disabled={!canFlip || revealed}
      aria-label={faceVisible ? (language === "zh" ? card.nameCn : card.name) : t({ zh: `翻开${getTarotPositionLabel(card.position, "zh")}的牌`, en: `Reveal ${getTarotPositionLabel(card.position, "en")}` })}
      onClick={() => onFlip(card.id)}
      animate={{ rotateY: revealed ? 180 : 0, rotateX: revealed ? [0, -12, 0] : 0, z: revealed ? [0, 45, 0] : 0 }}
      transition={{ duration: reducedMotion ? 0 : 2.5, ease: [0.45, 0, 0.25, 1] }}
      onAnimationComplete={() => {
        if (!revealed || completed.current) return;
        completed.current = true;
        setFaceVisible(true);
        onFlipped(card.id);
      }}>
      <span className={styles.cardBack} aria-hidden={faceVisible}>
        <Image src={experienceCardBack} alt="塔罗牌背面" fill
          sizes="(max-width: 640px) 26vw, 180px" className={styles.cardImage} />
      </span>
      <span className={styles.cardFace} aria-hidden={!faceVisible}>
        <Image src={encodeURI(card.imageSrc)} alt={faceVisible ? card.nameCn : "塔罗牌正面"} fill
          sizes="(max-width: 640px) 26vw, 180px"
          className={styles.cardImage} style={{ transform: card.reversed ? "rotate(180deg)" : undefined }} />
      </span>
    </motion.button>
    <div className={styles.cardCaption} aria-live="polite">
      <h3>{faceVisible ? (language === "zh" ? card.nameCn : card.name) : t(canFlip ? { zh: "点击翻牌", en: "Tap to reveal" } : { zh: "已选卡牌", en: "Selected card" })}</h3>
      <p>{t(faceVisible ? (card.reversed ? { zh: "逆位", en: "Reversed" } : { zh: "正位", en: "Upright" }) : { zh: "等待揭晓", en: "Awaiting reveal" })}</p>
    </div>
  </motion.div>;
}
