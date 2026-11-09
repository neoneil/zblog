"use client";

import { usePreferences } from "@/components/site/preferences-provider";
import { tarotModes, type TarotReadingMode } from "@/lib/tarot/reading-modes";
import styles from "./tarot-spreads.module.css";

export default function TarotSpreadGuide({ mode }: { mode: TarotReadingMode }) {
  const { t } = usePreferences();
  const config = tarotModes[mode];
  if (!config.fixedQuestion) return null;
  return <section className={styles.guide} aria-label={t({ zh: "牌阵说明", en: "Spread guide" })}>
    <p className={styles.theme}>{t(config.fixedQuestion)}</p>
    <ol className={styles.positions}>
      {config.positions.map((position, index) => <li key={position.key}>
        <span className={styles.number} aria-hidden="true">{index + 1}</span>
        <div><h2>{t(position.label)}</h2>{position.description && <p>{t(position.description)}</p>}</div>
      </li>)}
    </ol>
    <p className={styles.note}>{t({ zh: "无需输入问题，可在心中保留你的情境。解读用于自我探索，不代表确定的未来。", en: "No typed question is needed; keep your situation in mind. Readings support reflection, not certain predictions." })}</p>
  </section>;
}
