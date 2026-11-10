"use client";

import Link from "next/link";
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/components/site/preferences-provider";
import type { ServiceGuide, ServiceParagraph } from "../lib/service-guides";
import styles from "./service-guide-content.module.css";

function Paragraph({ copy }: { copy: ServiceParagraph }) {
  const { language } = usePreferences();
  const content = copy[language];
  return (
    <p className={styles.paragraph}>
      {typeof content === "string"
        ? content
        : content.map((part, index) =>
            typeof part === "string" ? (
              part
            ) : part.href ? (
              <Link key={index} href={part.href}>
                {part.label}
              </Link>
            ) : (
              <strong key={index}>{part.label}</strong>
            ),
          )}
    </p>
  );
}

export default function ServiceGuideContent({
  guide,
}: {
  guide: ServiceGuide;
}) {
  const { t } = usePreferences();
  return (
    <article
      className={styles.guide}
      aria-label={t({
        zh: "课程与咨询详情",
        en: "Course and Consultation Details",
      })}
    >
      <section
        className={styles.introduction}
        aria-label={t({ zh: "服务介绍", en: "Service Introduction" })}
      >
        {guide.introduction.map((paragraph, index) => (
          <Paragraph key={index} copy={paragraph} />
        ))}
      </section>
      {guide.sections.map((section) => (
        <section
          key={section.id}
          id={`service-${section.id}`}
          className={styles.section}
        >
          <header className={styles.heading}>
            <h2>{t(section.title)}</h2>
            {section.tagline && (
              <p className={styles.tagline}>{t(section.tagline)}</p>
            )}
          </header>
          {section.paragraphs?.map((paragraph, index) => (
            <Paragraph key={index} copy={paragraph} />
          ))}
          {section.lists && (
            <div className={styles.lists}>
              {section.lists.map((list) => (
                <div key={list.title.en}>
                  <h3>{t(list.title)}</h3>
                  <ul>
                    {list.items.map((item) => (
                      <li key={item.en}>{t(item)}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          {section.highlights && (
            <dl className={styles.highlights}>
              {section.highlights.map((item) => (
                <div key={item.label.en}>
                  <dt>{t(item.label)}</dt>
                  <dd>{t(item.text)}</dd>
                </div>
              ))}
            </dl>
          )}
          {section.note && <p className={styles.note}>{t(section.note)}</p>}
          {section.cta && (
            <div className={styles.actions}>
              <Button
                type="button"
                disabled
                title={t({
                  zh: "会员开通链接待确认",
                  en: "Membership enrolment link pending",
                })}
              >
                <Crown size={18} aria-hidden="true" />
                {t(section.cta)}
              </Button>
            </div>
          )}
        </section>
      ))}
      <section className={styles.closing}>
        <h2>{t(guide.closing.title)}</h2>
        <p className={styles.tagline}>{t(guide.closing.tagline)}</p>
        {guide.closing.paragraphs.map((paragraph) => (
          <Paragraph key={paragraph.en} copy={paragraph} />
        ))}
        <p className={styles.motto}>
          {t({
            zh: "身处混沌，始终自有中心。",
            en: "AMIDST CHAOS, ALWAYS CENTERED.",
          })}
        </p>
        <p className={styles.note}>{t(guide.closing.disclaimer)}</p>
      </section>
    </article>
  );
}
