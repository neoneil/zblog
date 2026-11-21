"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import Container from "@/components/site/container";
import { usePreferences } from "@/components/site/preferences-provider";
import { aboutUsContent as content } from "../aboutus-content";
import glowStyles from "@/components/site/navigation-link.module.css";
import styles from "./about-us-page.module.css";

export default function AboutUsPage() {
  const { t } = usePreferences();
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = root.current;
    if (
      !element ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    )
      return;
    element.dataset.motion = "true";
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.visible = "true";
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.04 },
    );
    element
      .querySelectorAll("[data-about-section]")
      .forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
      delete element.dataset.motion;
    };
  }, []);
  return (
    <main ref={root} className={styles.page}>
      <Container>
        <section className={styles.hero} aria-labelledby="about-us-title">
          <Image
            src="/about/two-sides-one-universe.png"
            data-brand-art
            alt={t({
              zh: "现实中的自己与星辰下的另一个自己，在湖畔相遇",
              en: "Two sides of the founder meet beneath the stars beside a lake",
            })}
            fill
            priority
            sizes="(max-width: 1440px) 100vw, 1312px"
            className={styles.heroImage}
          />
          <div className={styles.scrim} aria-hidden="true" />
          <header className={styles.heroCopy}>
            <p>
              {t({
                zh: "关于我们 · STELLARNESTS",
                en: "ABOUT US · STELLARNESTS",
              })}
            </p>
            <h1 id="about-us-title">{t(content.title)}</h1>
          </header>
        </section>
        <section
          className={styles.manifesto}
          aria-label={t({
            zh: "创始人宣言与品牌承诺",
            en: "The founder's declaration and promise",
          })}
        >
          <h2>{t(content.declaration)}</h2>
          <p className={styles.promise}>{t(content.promise)}</p>
          <p className={styles.brand}>
            {t({ zh: "STELLARNESTS · 星辰之巢", en: "STELLARNESTS" })}
          </p>
          <p className={styles.motto}>
            {t({
              zh: "身处混沌，始终自有中心。",
              en: "AMIDST CHAOS, ALWAYS CENTERED.",
            })}
          </p>
          <p>{t(content.reflection)}</p>
        </section>
        <div className={styles.story}>
          <section
            id="the-woman-and-the-soul"
            className={styles.section}
            data-about-section
          >
            <header>
              <span className={styles.index}>01 · STELLARNESTS</span>
              <h2>{t(content.portrait.title)}</h2>
            </header>
            <div className={styles.prose}>
              {content.portrait.paragraphs.map((copy, index) => (
                <p key={index}>{t(copy)}</p>
              ))}
            </div>
          </section>
          <section
            id="why-stellarnests"
            className={styles.section}
            data-about-section
          >
            <header>
              <span className={styles.index}>02 · STELLARNESTS</span>
              <h2>{t(content.purpose.title)}</h2>
            </header>
            <div className={styles.prose}>
              {content.purpose.paragraphs.map((copy, index) => (
                <p key={index}>{t(copy)}</p>
              ))}
            </div>
            <div className={styles.experiences}>
              <h3>{t(content.purpose.moreTitle)}</h3>
              <p>{t(content.purpose.moreIntroduction)}</p>
              <ul>
                {content.purpose.experiences.map((item) => (
                  <li key={item.href}>
                    <Link className={glowStyles.link} href={item.href}>
                      <span>{t(item.copy)}</span>
                      <ArrowRight size={18} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
              <p>{t(content.purpose.invitation)}</p>
            </div>
          </section>
        </div>
      </Container>
    </main>
  );
}
