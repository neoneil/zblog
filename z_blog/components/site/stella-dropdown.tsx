"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import {
  BookOpen, CalendarDays, ChevronDown, Circle, Eclipse, Hash, Heart,
  Moon, Orbit, RotateCcw, Sparkles, Sun, Telescope,
} from "lucide-react";
import { usePreferences } from "./preferences-provider";

const entries = [
  { en: "Birth Chart Calculator", zh: "本命星盘计算器", icon: Orbit },
  { en: "Compatibility", zh: "星盘配对", icon: Heart },
  { en: "Birth Chart Guide", zh: "本命星盘指南", icon: BookOpen },
  { en: "Today's Sky", zh: "今日星象", icon: Telescope },
  { en: "Moon Calendar", zh: "月相日历", icon: CalendarDays },
  { en: "Retrograde Tracker", zh: "逆行追踪", icon: RotateCcw },
  { en: "Void of Course Moon", zh: "月亮空亡", icon: Moon },
  { en: "Planets in Signs", zh: "行星落座", icon: Circle },
  { en: "Numerology", zh: "数字命理", icon: Hash },
  { en: "Birthday Horoscope", zh: "生日运势", icon: Sun },
  { en: "Eclipses", zh: "日月食", icon: Eclipse },
];

type StellaDropdownProps = {
  mobile?: boolean;
  onNavigate?: () => void;
};

export default function StellaDropdown({ mobile = false, onNavigate }: StellaDropdownProps) {
  const { t } = usePreferences();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const focusOnOpen = useRef(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    if (focusOnOpen.current) {
      linkRef.current?.focus();
      focusOnOpen.current = false;
    }
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const itemClass = "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm";

  return (
    <div
      ref={rootRef}
      className={mobile ? "relative min-w-0" : "relative shrink-0"}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            if (open) linkRef.current?.focus();
            else {
              focusOnOpen.current = true;
              setOpen(true);
            }
          }
        }}
        className={`inline-flex items-center gap-2 text-sm font-medium text-[var(--text-soft)] transition hover:bg-[var(--card-muted)] hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] ${mobile ? "w-full justify-start rounded-xl px-3 py-2" : "min-w-max justify-center whitespace-nowrap rounded-full px-4 py-2"}`}
      >
        <Sparkles aria-hidden="true" className="h-4 w-4 shrink-0" />
        {t({ zh: "Stella 星象", en: "Stella" })}
        <ChevronDown aria-hidden="true" className={`h-4 w-4 shrink-0 transition-transform ${mobile ? "ml-auto" : ""} ${open ? "rotate-180" : ""}`} />
      </button>
      <div
        id={panelId}
        hidden={!open}
        className={mobile
          ? "mt-1 max-h-[60dvh] overflow-y-auto border-l border-[var(--border)] pl-2"
          : "absolute right-0 top-full z-50 mt-2 max-h-[70dvh] w-72 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--card)] p-2 shadow-lg"}
      >
        <ul aria-label={t({ zh: "Stella 星象工具", en: "Stella tools" })}>
          {entries.map((entry, index) => {
            const Icon = entry.icon;
            const content = <><Icon aria-hidden="true" className="h-4 w-4 shrink-0" /><span className="min-w-0 break-words">{t(entry)}</span></>;
            return (
              <li key={entry.en}>
                {index === 0 ? (
                  <Link
                    ref={linkRef}
                    href="/stella"
                    className={`${itemClass} text-[var(--text)] transition hover:bg-[var(--card-muted)] focus-visible:outline-2 focus-visible:outline-[var(--primary)]`}
                    onClick={() => { setOpen(false); onNavigate?.(); }}
                  >{content}</Link>
                ) : (
                  <button type="button" disabled className={`${itemClass} cursor-not-allowed text-[var(--text-soft)] opacity-75`}>
                    {content}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
