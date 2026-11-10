"use client";

import { usePreferences } from "@/components/site/preferences-provider";
import { tarotReadingGuidance } from "@/lib/tarot/reading-guidance";
import styles from "./tarot-reading-notice.module.css";

export default function TarotReadingNotice() {
  const { t } = usePreferences();

  return (
    <aside className={styles.notice} aria-labelledby="tarot-reading-guidance-title">
      <h2 id="tarot-reading-guidance-title">{t(tarotReadingGuidance.title)}</h2>
      <ul>
        {tarotReadingGuidance.points.map((point) => (
          <li key={point.en}>{t(point)}</li>
        ))}
      </ul>
    </aside>
  );
}
