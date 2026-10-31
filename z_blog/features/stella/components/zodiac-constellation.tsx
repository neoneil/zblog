import Image from "next/image";
import type { ReactNode } from "react";
import { signSlugs } from "../lib/explore-config";
import styles from "./zodiac-constellation.module.css";

type Size = "small" | "compact" | "tiny" | "table";
type Props = { sign: number | string; size?: Size };

export function ZodiacConstellation({ sign, size = "small" }: Props) {
  const index =
    typeof sign === "number" ? sign : signSlugs.indexOf(sign.toLowerCase());
  const slug = signSlugs[index];
  if (!slug) return null;
  return (
    <Image
      src={`/stella/constellations/${slug}.svg`}
      alt=""
      aria-hidden="true"
      width={112}
      height={76}
      unoptimized
      draggable={false}
      data-zodiac={slug}
      className={`${styles.figure} ${size === "small" ? "" : styles[size]}`}
    />
  );
}

export function ZodiacLabel({
  sign,
  size,
  children,
}: Props & { children: ReactNode }) {
  return (
    <span className={styles.label}>
      <span className={styles.text}>{children}</span>
      <ZodiacConstellation sign={sign} size={size} />
    </span>
  );
}
