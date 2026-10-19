import type { CSSProperties } from "react";
import styles from "./tarot-experience.module.css";

export default function TarotAtmosphere() {
  return <div className={styles.atmosphere} aria-hidden="true">
    <div className={styles.lightA} />
    <div className={styles.lightB} />
    <div className={styles.orbit} />
    {Array.from({ length: 48 }, (_, index) => <i key={index}
      className={styles.spark}
      style={{
        "--left": `${(index * 37 + 11) % 100}%`,
        "--top": `${(index * 23 + 7) % 100}%`,
        "--size": `${index % 7 === 0 ? 4 : 2}px`,
        "--delay": `${-(index * 0.73)}s`,
        "--duration": `${6 + index % 9}s`,
      } as CSSProperties} />)}
  </div>;
}
