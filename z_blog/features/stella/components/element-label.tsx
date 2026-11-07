"use client";

import { usePreferences } from "@/components/site/preferences-provider";
import type { Copy } from "../lib/explore-config";
import styles from "./element-label.module.css";

export function ElementLabel({ element }: { element: Copy }) {
  const { t } = usePreferences();
  return <span className={styles.label} data-element={element.en}>{t(element)}</span>;
}

export function ElementHeading({ text }: { text: string }) {
  return <>{text.split(/(\b(?:Fire|Earth|Air|Water)\b|火象|土象|风象|水象)/g).map((part, index) => {
    const name = ({ 火象: "Fire", 土象: "Earth", 风象: "Air", 水象: "Water" } as Record<string, string>)[part] ?? part;
    return ["Fire", "Earth", "Air", "Water"].includes(name)
      ? <span className={styles.label} data-element={name} key={index}>{part}</span> : part;
  })}</>;
}
