"use client";

import Link from "next/link";
import { siteNavigation } from "./navigation-data";
import { usePreferences } from "./preferences-provider";
import styles from "./footer-navigation.module.css";

export default function FooterNavigation() {
  const { language, t } = usePreferences();

  return (
    <nav aria-label={t({ zh: "页脚导航", en: "Footer navigation" })}>
      <ul className={styles.directLinks}>
        {siteNavigation.filter((entry) => !entry.children).map((entry) => (
          <li key={entry.id}>
            <Link href={entry.href!}>{t(entry.label)}</Link>
          </li>
        ))}
      </ul>
      <div className={styles.groups}>
        {siteNavigation.filter((entry) => entry.children).map((entry) => (
          <section key={entry.id} aria-labelledby={`footer-${entry.id}`}>
            <h3 id={`footer-${entry.id}`} className={styles.title}>
              {t(entry.label)}
            </h3>
            <ul className={styles.children}>
              {entry.children!.map((child) => (
                <li key={child.href}>
                  <Link href={child.localizedQuery ? `${child.href}?lang=${language}` : child.href}>
                    {t(child.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </nav>
  );
}
