"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Send } from "lucide-react";
import { usePreferences } from "@/components/site/preferences-provider";
import type { BirthForm } from "@/lib/astrology/natal-chart";
import type { ReadingPeriod } from "../lib/app-analysis";
import styles from "./stella.module.css";

export default function StellaAsk({
  birth,
  date,
  period,
  enterBirth,
}: {
  birth: BirthForm | null;
  date: Date;
  period: ReadingPeriod;
  enterBirth: () => void;
}) {
  const { language, t } = usePreferences();
  const [question, setQuestion] = useState("");
  const [results, setResults] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [access, setAccess] = useState("");
  const controller = useRef<AbortController | null>(null);
  const pending = useRef(false);
  useEffect(() => () => controller.current?.abort(), []);
  async function ask(event: FormEvent) {
    event.preventDefault();
    if (!birth || !question.trim() || pending.current) return;
    pending.current = true;
    setBusy(true);
    setError("");
    setAccess("");
    const request = new AbortController();
    controller.current = request;
    try {
      const response = await fetch("/api/stella-reading", {
        method: "POST",
        signal: request.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birth,
          topic: "personal",
          style: "detailed",
          period,
          date: date.toISOString(),
          detail: question.trim(),
          language,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setAccess(
          response.status === 401
            ? "/login?next=%2Fstella"
            : data.upgradeUrl || "",
        );
        throw new Error(
          data.error || t({ en: "Reading unavailable.", zh: "暂时无法解读。" }),
        );
      }
      setResults((previous) => ({ ...previous, [language]: data.reading }));
    } catch (error) {
      if (!request.signal.aborted)
        setError(
          error instanceof Error
            ? error.message
            : t({ en: "Reading unavailable.", zh: "暂时无法解读。" }),
        );
    } finally {
      pending.current = false;
      if (!request.signal.aborted) setBusy(false);
    }
  }
  return (
    <>
      <section className={styles.section}>
        <h2>{t({ en: "Ask Your Chart", zh: "问问你的星盘" })}</h2>
        <p>
          {t({
            en: "Ask anything about your chart — each question is answered fresh.",
            zh: "提出你关心的星盘问题，每一次提问都会重新解读。",
          })}
        </p>
      </section>
      <form className={styles.askForm} onSubmit={ask}>
        <label className={styles.displayOnly} htmlFor="stella-question">
          {t({ en: "Your question", zh: "你的问题" })}
        </label>
        <textarea
          id="stella-question"
          className={styles.input}
          maxLength={1500}
          required
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={t({
            en: "What is my chart telling me right now?",
            zh: "此刻，我的星盘在告诉我什么？",
          })}
        />
        <button
          type="submit"
          className={styles.primary}
          disabled={!birth || !question.trim() || busy}
        >
          <Send size={14} />
          {busy
            ? t({ en: "Reading…", zh: "解读中…" })
            : t({ en: "Ask", zh: "提问" })}
        </button>
      </form>
      {!birth && (
        <button type="button" className={styles.secondary} onClick={enterBirth}>
          {t({ en: "Enter My Chart", zh: "输入我的星盘" })}
        </button>
      )}
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      {access && (
        <Link className={styles.secondary} href={access}>
          {t({ en: "Sign in / view access", zh: "登录或查看权限" })}
        </Link>
      )}
      {results[language] && (
        <div className={styles.answer}>
          <ReactMarkdown>{results[language]}</ReactMarkdown>
        </div>
      )}
    </>
  );
}
