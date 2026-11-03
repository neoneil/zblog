"use client";

import { useSyncExternalStore } from "react";
import { usePreferences } from "@/components/site/preferences-provider";

const subscribe = () => () => {};
const browserTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;
const serverTimeZone = () => "UTC";

export default function CommentTime({ value }: { value: string }) {
  const { language } = usePreferences();
  const timeZone = useSyncExternalStore(subscribe, browserTimeZone, serverTimeZone);
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return null;
  const label = new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en-AU", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit", timeZone,
  }).format(date);
  return <time dateTime={value} title={`${label} (${timeZone})`} className="text-xs text-[var(--text-soft)]">{label}</time>;
}
