"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePreferences } from "./preferences-provider";
import { siteNavigation } from "./navigation-data";
import styles from "./site-navigation.module.css";

export default function SiteNavigation({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const { t, language } = usePreferences();
  const [open, setOpen] = useState<string | null>(null);
  const root = useRef<HTMLElement>(null);
  const prefix = useId();
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!root.current?.querySelector(`[data-nav-group="${open}"]`)?.contains(event.target as Node)) setOpen(null);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open]);

  return <nav ref={root} className={mobile ? styles.mobile : styles.desktop} aria-label={t({ en: "Main navigation", zh: "主导航" })}>
    <ul className={styles.items}>
      {siteNavigation.map(entry => <li key={entry.id} className={styles.item} data-nav-group={entry.id}
        onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(current => current === entry.id ? null : current); }}
        onKeyDown={event => {
          if (event.key === "Escape" && open === entry.id) {
            event.preventDefault(); setOpen(null);
            event.currentTarget.querySelector<HTMLButtonElement>("button")?.focus();
          }
        }}>
        {entry.children ? <>
          <Button type="button" variant="ghost" className={styles.trigger} aria-expanded={open === entry.id} aria-controls={`${prefix}-${entry.id}`}
            onClick={() => setOpen(open === entry.id ? null : entry.id)}
            onKeyDown={event => {
              if (event.key === "ArrowDown") {
                event.preventDefault(); setOpen(entry.id);
                const button = event.currentTarget;
                requestAnimationFrame(() => button.parentElement?.querySelector<HTMLAnchorElement>("ul a")?.focus());
              }
            }}>
            <span>{t(entry.label)}</span><ChevronDown size={13} aria-hidden="true" className={open === entry.id ? styles.chevronOpen : ""} />
          </Button>
          <ul id={`${prefix}-${entry.id}`} hidden={open !== entry.id} className={styles.panel} aria-label={t(entry.label)}
            onKeyDown={event => {
              if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
              event.preventDefault();
              const links = Array.from(event.currentTarget.querySelectorAll<HTMLAnchorElement>("a"));
              const index = links.indexOf(document.activeElement as HTMLAnchorElement);
              const target = event.key === "Home" ? 0 : event.key === "End" ? links.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + links.length) % links.length;
              links[target]?.focus();
            }}>
            {entry.children.map(child => <li key={child.href}><Link href={child.localizedQuery ? `${child.href}?lang=${language}` : child.href}
              onClick={() => { setOpen(null); onNavigate?.(); }}>{t(child.label)}</Link></li>)}
          </ul>
        </> : <Link className={styles.link} href={entry.href!} aria-current={pathname === entry.href ? "page" : undefined} onClick={() => { setOpen(null); onNavigate?.(); }}>{t(entry.label)}</Link>}
      </li>)}
    </ul>
  </nav>;
}
