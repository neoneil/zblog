"use client";

import { useRef, useState, type FormEvent } from "react";
import { LoaderCircle, Send } from "lucide-react";
import { usePreferences } from "@/components/site/preferences-provider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button, ButtonLink } from "@/components/ui/button";
import { PageShell } from "@/components/site/page-shell";
import styles from "./contact.module.css";

const errors: Record<string, { en: string; zh: string }> = {
  INVALID_MESSAGE: {
    en: "Please check your email and message, then try again.",
    zh: "请检查邮箱和留言内容，然后重试。",
  },
  RATE_LIMITED: {
    en: "Too many attempts. Please try again in 15 minutes.",
    zh: "发送次数过多，请在15分钟后重试。",
  },
  MAIL_NOT_CONFIGURED: {
    en: "Email is temporarily unavailable. Please try again later.",
    zh: "邮件服务暂时不可用，请稍后重试。",
  },
  SEND_FAILED: {
    en: "Your message could not be sent. Please try again.",
    zh: "留言发送失败，请重试。",
  },
};

export default function AboutContact() {
  return (
    <PageShell>
      <AboutSection />
      <ContactSection />
      <NewsletterPlaceholder />
    </PageShell>
  );
}

export function AboutSection({ embedded = false }: { embedded?: boolean }) {
  const { t } = usePreferences();
  const Heading = embedded ? "h2" : "h1";
  return (
    <section id={embedded ? "home-about" : undefined} className={styles.about}>
      <p className={styles.eyebrow}>{t({ en: "About Us", zh: "关于我们" })}</p>
      <Heading>{t({ en: "Stellarnests", zh: "星辰之巢" })}</Heading>
      <p>
        {t({
          en: "We bring astrology, tarot and thoughtful learning into a space for curiosity, self-understanding and meaningful connection.",
          zh: "我们把占星、塔罗与用心的学习汇聚在一起，为好奇心、自我理解与有意义的连接留出空间。",
        })}
      </p>
      <p>
        {t({
          en: "Through birth charts, symbolic stories and structured courses, we explore patterns and perspectives while leaving room for your own experience and choices.",
          zh: "通过出生星盘、象征故事与结构化课程，我们探索不同模式与视角，也始终为你的亲身经验和自主选择保留空间。",
        })}
      </p>
      <ButtonLink href="/services" variant="secondary">
        {t({ en: "Explore Services", zh: "浏览课程与服务" })}
      </ButtonLink>
    </section>
  );
}

export function ContactSection() {
  const { t } = usePreferences();
  const [busy, setBusy] = useState(false),
    [status, setStatus] = useState<string | null>(null);
  const sending = useRef(false),
    submission = useRef<{ value: string; id: string } | null>(null);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    const form = event.currentTarget,
      data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
      website: String(data.get("website") ?? ""),
    };
    const value = JSON.stringify(payload);
    if (!submission.current || submission.current.value !== value)
      submission.current = { value, id: crypto.randomUUID() };
    sending.current = true;
    setBusy(true);
    setStatus(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          submissionId: submission.current.id,
        }),
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      if (!response.ok || !result.ok)
        setStatus(errors[result.code] ? result.code : "SEND_FAILED");
      else {
        setStatus("SENT");
        form.reset();
        submission.current = null;
      }
    } catch {
      setStatus("SEND_FAILED");
    } finally {
      sending.current = false;
      setBusy(false);
    }
  }
  return (
    <section className={styles.contact} aria-labelledby="contact-title">
      <h2 id="contact-title">{t({ en: "Contact", zh: "联系我们" })}</h2>
      <form onSubmit={submit} className={styles.form} aria-busy={busy}>
        <div className={styles.row}>
          <label>
            {t({ en: "Name", zh: "姓名" })}
            <Input
              name="name"
              autoComplete="name"
              maxLength={100}
              disabled={busy}
            />
          </label>
          <label>
            {t({ en: "Email", zh: "邮箱" })} *
            <Input
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              disabled={busy}
            />
          </label>
        </div>
        <label>
          {t({ en: "Message", zh: "留言" })} *
          <Textarea
            name="message"
            required
            maxLength={5000}
            disabled={busy}
            className={styles.message}
          />
        </label>
        <div className={styles.honeypot} aria-hidden="true">
          <label>
            Website
            <Input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        {status && (
          <p
            role={status === "SENT" ? "status" : "alert"}
            className={status === "SENT" ? styles.success : styles.error}
          >
            {status === "SENT"
              ? t({
                  en: "Thank you. Your message has been sent.",
                  zh: "谢谢，你的留言已发送。",
                })
              : t(errors[status] ?? errors.SEND_FAILED)}
          </p>
        )}
        <Button type="submit" disabled={busy}>
          {busy ? (
            <LoaderCircle size={16} className="animate-spin" aria-hidden />
          ) : (
            <Send size={16} aria-hidden />
          )}
          <span>
            {t(
              busy
                ? { en: "Sending…", zh: "发送中…" }
                : { en: "Send", zh: "发送" },
            )}
          </span>
        </Button>
      </form>
    </section>
  );
}

export function NewsletterPlaceholder() {
  const { t } = usePreferences();
  return (
    <section className={styles.newsletter} aria-labelledby="newsletter-title">
      <h2 id="newsletter-title">{t({ en: "Newsletter", zh: "订阅通讯" })}</h2>
      <p>
        {t({
          en: "Notes on astrology, tarot and new learning experiences.",
          zh: "关于占星、塔罗与新学习体验的来信。",
        })}
      </p>
      <div className={styles.subscribe}>
        <label className="sr-only" htmlFor="newsletter-email">
          {t({ en: "Email address", zh: "邮箱地址" })}
        </label>
        <Input
          id="newsletter-email"
          type="email"
          placeholder={t({ en: "Email address", zh: "邮箱地址" })}
          disabled
        />
        <Button disabled>
          {t({ en: "Subscribe · Coming soon", zh: "订阅 · 待开发" })}
        </Button>
      </div>
    </section>
  );
}
