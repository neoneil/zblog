"use client";

import Link from "next/link";
import { ZodiacLabel } from "./zodiac-constellation";
import { Eclipse } from "lucide-react";
import { SIGN_NAMES, SIGN_SYMBOLS } from "../lib/sky";
import type { EclipseEvent } from "../lib/explore-calculations";
import { houseThemes } from "./birth-guide";
import { lunarEclipseIntroduction, eclipseAxisReflections, lunarEclipseReflections, eclipseHousePrompts } from "../lib/eclipse-content";
import eclipseStyles from "./eclipse.module.css";
import {
  ExploreShell,
  Section,
  YearNav,
  TimeText,
  Back,
  styles,
  useExplore,
} from "./explore-shared";

export default function EclipseExplorer({
  year,
  events,
  event,
}: {
  year: number;
  events: EclipseEvent[];
  event?: EclipseEvent;
}) {
  const { t, language } = useExplore();
  const kind = (e: EclipseEvent) =>
    t({
      en: `${e.kind[0].toUpperCase() + e.kind.slice(1)} ${e.body === "solar" ? "Solar" : "Lunar"} Eclipse`,
      zh: `${e.body === "solar" ? "日" : "月"}${({ total: "全食", partial: "偏食", annular: "环食", penumbral: "半影食" } as Record<string, string>)[e.kind] ?? "食"}`,
    });
  if (event) {
    const sign = Math.floor(event.longitude / 30);
    return (
      <ExploreShell
        title={{
          en: `${kind({ ...event })} — ${event.time.slice(0, 10)}`,
          zh: `${event.time.slice(0, 10)} · ${kind({ ...event })}`,
        }}
        description={{
          en: "Astronomical timing, zodiac position and a reflective guide to the eclipse.",
          zh: "日月食的天文时刻、黄道位置与反思指南。",
        }}
      >
        <div className={styles.header}>
          <Eclipse size={64} className="mx-auto" aria-hidden />
          <p>
            <ZodiacLabel sign={sign}>
              {SIGN_SYMBOLS[sign]} {SIGN_NAMES[language][sign]}
            </ZodiacLabel>{" "}
            {(event.longitude % 30).toFixed(2)}°
          </p>
        </div>
        <dl className={styles.facts}>
          <div>
            <dt>{t({ en: "Global peak (UTC)", zh: "全球峰值时刻（UTC）" })}</dt>
            <dd>
              <TimeText value={event.time} />
            </dd>
          </div>
          <div>
            <dt>{t({ en: "Type", zh: "类型" })}</dt>
            <dd>{kind(event)}</dd>
          </div>
          <div>
            <dt>{t({ en: "Sign axis", zh: "星座轴线" })}</dt>
            <dd>
              <ZodiacLabel sign={sign} size="compact">
                {SIGN_NAMES[language][sign]}
              </ZodiacLabel>{" "}
              –{" "}
              <ZodiacLabel sign={(sign + 6) % 12} size="compact">
                {SIGN_NAMES[language][(sign + 6) % 12]}
              </ZodiacLabel>
            </dd>
          </div>
          {event.body === "lunar" ? (
            <div>
              <dt>
                {t({
                  en: "Partial / total phase duration",
                  zh: "偏食阶段 / 全食阶段时长",
                })}
              </dt>
              <dd>
                {event.partialMinutes?.toFixed(0)} /{" "}
                {event.totalMinutes?.toFixed(0)} min
              </dd>
            </div>
          ) : null}
        </dl>
        <Section
          title={event.body === "lunar" ? { en: "What Is a Lunar Eclipse?", zh: "什么是月食？" } : { en: "What Is a Solar Eclipse?", zh: "什么是日食？" }}
        >
          {event.body === "lunar" ? lunarEclipseIntroduction.map((paragraph) => <p key={paragraph.en}>{t(paragraph)}</p>) :
          <p>
            {t({
                    en: "A solar eclipse occurs when the Moon passes between Earth and the Sun. The times here describe the global event; visibility, local contacts and duration depend on location. Never look directly at the Sun without certified solar-viewing protection.",
                    zh: "日食发生于月亮经过地球与太阳之间。本页给出全球事件时刻；当地可见性、接触时刻与持续时间取决于观察地点。没有合格的太阳观测防护时，切勿直视太阳。",
                  })}
          </p>}
        </Section>
        {event.body === "lunar" ? <Section title={{ en: "Astrological Significance", zh: "占星意义" }}>
          <p>{t({
            en: `The lunar position calculated for this eclipse is ${(event.longitude % 30).toFixed(2)}° ${SIGN_NAMES.en[sign]}, placing ${SIGN_NAMES.en[sign]} and ${SIGN_NAMES.en[(sign + 6) % 12]} on its opposing sign axis. In astrology, a full-moon eclipse is used to examine the relationship between these complementary themes. The degree is astronomical data; the meaning assigned to the axis is symbolic interpretation, not a forecast of a particular event.`,
            zh: `本次月食计算得到的月亮位置为${SIGN_NAMES.zh[sign]} ${(event.longitude % 30).toFixed(2)}°，对应${SIGN_NAMES.zh[sign]}与${SIGN_NAMES.zh[(sign + 6) % 12]}构成的对向轴线。占星学借满月食相检视这些互补主题之间的关系。度数属于天文数据，赋予轴线的意义则属于象征诠释，不是对特定事件的预言。`,
          })}</p>
          <p>{t(eclipseAxisReflections[sign % 6])}</p>
          {lunarEclipseReflections.map((paragraph) => <p key={paragraph.en}>{t(paragraph)}</p>)}
        </Section> : null}
        <Section
          title={{
            en: "How This Eclipse Connects with Your Sign",
            zh: "与十二星座的象征联系",
          }}
        >
          <p className={styles.small}>
            {t({
              en: "Whole-sign solar-house convention; not a personalised natal forecast.",
              zh: "以下采用太阳星座整宫法，不是个人本命行运预测。",
            })}
          </p>
          <div className={eclipseStyles.signCards}>
            {SIGN_NAMES[language].map((name, i) => {
              const house = (sign - i + 12) % 12;
              return (
                <article key={name} className={styles.card}>
                  <h3>
                    <ZodiacLabel sign={i}>
                      {SIGN_SYMBOLS[i]} {name} · {house + 1}
                    </ZodiacLabel>
                  </h3>
                  <p>
                    {t({
                      en: `Reflect on ${houseThemes[house].en}. Notice what needs attention or a fresh perspective without assuming a predetermined event.`,
                      zh: `可以围绕${houseThemes[house].zh}反思，留意哪些事情需要关注或新的视角，而非假设必然会发生特定事件。`,
                    })}
                  </p>
                  <p>{t(eclipseHousePrompts[house])}</p>
                </article>
              );
            })}
          </div>
        </Section>
        <Back
          href={`/stella/eclipse?year=${year}`}
          label={{ en: "All eclipses", zh: "全部日月食" }}
        />
      </ExploreShell>
    );
  }
  return (
    <ExploreShell
      title={{
        en: "Eclipse Calendar & Astrology Guide",
        zh: "日月食日历与指南",
      }}
      description={{
        en: "Calculated solar and lunar eclipses, with peak times and zodiac positions.",
        zh: "通过实际计算查看日食、月食、峰值时刻与黄道位置。",
      }}
    >
      <YearNav slug="eclipse" year={year} />
      <div className={styles.grid}>
        {events.map((e) => {
          const sign = Math.floor(e.longitude / 30);
          return (
            <Link
              key={e.id}
              className={styles.card}
              href={`/stella/eclipse/${e.id}`}
            >
              <div className={styles.row}>
                <Eclipse aria-hidden />
                <h3>{kind(e)}</h3>
              </div>
              <p>
                <ZodiacLabel sign={sign} size="compact">
                  {SIGN_SYMBOLS[sign]} {SIGN_NAMES[language][sign]}
                </ZodiacLabel>{" "}
                {(e.longitude % 30).toFixed(2)}°
              </p>
              <TimeText value={e.time} />
            </Link>
          );
        })}
      </div>
      <Section title={{ en: "What Are Eclipses?", zh: "什么是日月食？" }}>
        <p>
          {t({
            en: "An eclipse occurs when the Sun, Earth and Moon align closely enough for one body to cast its shadow on another. A solar eclipse takes place near a new moon, when the Moon passes between Earth and the Sun and obscures some or all of the Sun from particular locations. A lunar eclipse happens near a full moon, when Earth lies between the Sun and Moon and the Moon moves through Earth's shadow.",
            zh: "当太阳、地球与月亮的排列足够接近一条直线，使一个天体的影子落到另一个天体上时，就可能发生食。日食发生在新月附近：月亮经过地球与太阳之间，使特定地区看到的太阳被部分或全部遮挡。月食发生在满月附近：地球位于太阳与月亮之间，月亮进入地球的影子。",
          })}
        </p>
        <p>
          {t({
            en: "These events do not accompany every new or full moon because the Moon's orbital plane is tilted relative to Earth's path around the Sun. Most months, the alignment passes above or below the necessary shadow. Eclipses become possible when a new or full moon occurs close to the points where those orbital planes intersect, called the lunar nodes. The geometry and apparent sizes of the bodies determine whether a solar eclipse is partial, total or annular, or whether a lunar eclipse is penumbral, partial or total.",
            zh: "并不是每次新月或满月都会发生食，因为月球轨道平面相对地球绕太阳运行的平面存在倾角。大多数月份，排列会从所需影区的上方或下方经过。只有当新月或满月出现在两个轨道平面的交点附近，也就是月球交点附近时，才可能发生食。天体的几何位置与视大小决定日食表现为偏食、全食或环食，以及月食表现为半影食、偏食或全食。",
          })}
        </p>
        <p>
          {t({
            en: "This calendar calculates eclipse dates and global peak times within the application using Astronomy Engine, without retrieving an event schedule from an external service or database. A global peak describes the eclipse as a whole; it does not establish when the event begins or ends at your location, whether the Sun or Moon is above your horizon, or how much of the eclipse you will see. Local visibility, duration and contact times require location-specific calculations. Converting UTC into your local time zone changes the clock display, not the region of visibility.",
            zh: "本日历在应用内使用 Astronomy Engine 计算日月食日期与全球峰值时刻，不从外部服务或数据库读取事件日程。全球峰值描述整体事件，并不代表所在地的开始或结束时刻，也不能证明当地太阳或月亮在地平线以上，或能够看到多大程度的食。当地可见性、持续时间与接触时刻需要针对观察地点另行计算。将 UTC 转换为本地时区，只改变时钟显示，不会改变可见区域。",
          })}
        </p>
        <p>{t({
          en: "Astronomical calculation and astrological interpretation answer different questions. Orbital models can establish timing and geometry; themes such as renewal, culmination or change belong to symbolic traditions and are not verified predictions of personal events. If you use an eclipse for reflection, relate those themes to your actual circumstances and choices rather than assuming that a date guarantees a crisis, ending or new beginning. A general zodiac position is not a personalised birth-chart reading.",
          zh: "天文计算与占星诠释回答的是不同问题。轨道模型可以确定时刻与几何关系；更新、阶段完成或变化等主题则属于象征传统，不是对个人事件经过验证的预测。如果借日月食进行反思，应把这些主题与真实处境及自主选择联系起来，而不是认定某个日期必然带来危机、结束或新开始。一般黄道位置也不等于个人出生星盘解读。",
        })}</p>
        <p>{t({
          en: "For solar observation, follow specialist safety guidance: ordinary sunglasses are not solar viewers, and cameras, binoculars and telescopes need appropriate front-mounted solar filters. Never look at the exposed Sun without suitable protection; the brief fully covered phase of totality is a distinct exception that requires reliable local timing and proper guidance. Lunar eclipses can be viewed with the unaided eye without solar-viewing protection. Plan from a location-specific visibility guide, not the global peak time alone.",
          zh: "观测太阳时，应遵循专业安全指导：普通太阳镜不能替代太阳观测镜，相机、双筒望远镜与天文望远镜需要适当的前置太阳滤镜。太阳亮面仍有任何部分露出时，切勿在没有合适防护的情况下直视；日全食中太阳被完全遮住的短暂全食阶段属于特殊例外，需要可靠的当地时刻与正确指导。月食可直接用肉眼观看，无需太阳观测防护。请依据具体地点的可见性指南规划，而不只参考全球峰值。",
        })}</p>
      </Section>
    </ExploreShell>
  );
}
