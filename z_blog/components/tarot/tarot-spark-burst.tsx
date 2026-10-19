import type { CSSProperties } from "react";
import styles from "./tarot-experience.module.css";

function scatter(index: number, channel: number) {
  let value = Math.imul(index + 1, 374761393) ^ Math.imul(channel + 1, 668265263);
  value = Math.imul(value ^ (value >>> 13), 1274126177);
  return ((value ^ (value >>> 16)) >>> 0) / 4294967296;
}

export default function TarotSparkBurst({ delay = 0, orbit = false, seed = 0 }: { delay?: number; orbit?: boolean; seed?: number }) {
  return <span className={orbit ? styles.orbitBurst : styles.sparkBurst} aria-hidden="true">
    {Array.from({ length: 96 }, (_, particle) => {
      const index = particle + seed * 97;
      const dx = (scatter(index, 2) - (orbit ? 0.5 : 0.68)) * (orbit ? 100 : 85);
      const dy = (scatter(index, 3) - (orbit ? 0.48 : 0.72)) * (orbit ? 115 : 95);
      return <i key={index} className={index % 7 === 0 ? styles.goldStar : styles.goldMote}
        style={{
          "--origin-x": `${8 + scatter(index, 0) * (orbit ? 84 : 70)}%`,
          "--origin-y": `${8 + scatter(index, 1) * (orbit ? 84 : 62)}%`,
          "--dx": `${dx}px`,
          "--dy": `${dy}px`,
          "--mid-x": `${dx * 0.55 + (scatter(index, 4) - 0.5) * 24}px`,
          "--mid-y": `${dy * 0.55 - scatter(index, 5) * 22}px`,
          "--spin": `${(scatter(index, 6) - 0.5) * 160}deg`,
          "--mote-size": `${2 + scatter(index, 7) * 4}px`,
          "--star-size": `${7 + scatter(index, 8) * 7}px`,
          "--burst-delay": `${delay + scatter(index, 9) * 0.55}s`,
          "--burst-duration": `${(orbit ? 2.5 : 2) + scatter(index, 10) * 0.64}s`,
          "--twinkle-duration": `${0.25 + scatter(index, 11) * 0.65}s`,
          "--peak-opacity": 0.55 + scatter(index, 12) * 0.45,
        } as CSSProperties} />;
    })}
  </span>;
}
