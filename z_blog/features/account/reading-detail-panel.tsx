"use client";

import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { usePreferences } from "@/components/site/preferences-provider";
import { NatalWheelCN } from "@/app/astroplate/natal-wheel-cn-v3";
import SynastryWheel from "@/features/synastry/components/synastry-wheel";
import { isRecord, type OpenAIChartJson } from "@/lib/astrology/natal-chart";
import { isBilingualSynastryReading, relationships, topics, type SynastryResult } from "@/lib/astrology/synastry";
import { tarotDeck } from "@/lib/tarot/full-deck";
import { isTarotReadingMode, tarotModes } from "@/lib/tarot/reading-modes";
import { isTarotReadingResult } from "@/lib/tarot/reading-result";
import type { ReadingArchive, ReadingDetail } from "./reading-archive";

function Markdown({ children }: { children: string }) {
  return (
    <div className="break-words text-sm leading-7 [&_h2]:my-3 [&_h2]:font-semibold [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5">
      <ReactMarkdown skipHtml disallowedElements={["img"]}>{children}</ReactMarkdown>
    </div>
  );
}

function isChart(value: unknown): value is OpenAIChartJson {
  return isRecord(value) && isRecord(value.meta) && isRecord(value.meta.birth) &&
    [value.planets, value.angles, value.houses, value.aspects].every((list) =>
      Array.isArray(list) && list.every(isRecord));
}

function ChartData({ chart, label, showTime = true }: { chart: OpenAIChartJson; label?: string; showTime?: boolean }) {
  const { language, t } = usePreferences();
  const birth = chart.meta.birth;
  const pad = (value: number) => String(value).padStart(2, "0");

  return (
    <section className="min-w-0 space-y-3">
      <h3 className="text-lg font-semibold">
        {label ? [label, chart.meta.name].filter(Boolean).join(" · ") : chart.meta.name || t({ zh: "个人星盘", en: "Natal chart" })}
      </h3>
      <dl className="grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-medium">{t({ zh: "出生日期与时间", en: "Birth date and time" })}</dt>
          <dd>{birth.year}-{pad(birth.month)}-{pad(birth.day)} · {showTime
            ? `${pad(birth.hour)}:${pad(birth.minute)}`
            : t({ zh: "时间未知", en: "Time unknown" })}</dd>
        </div>
        <div>
          <dt className="font-medium">{t({ zh: "出生地经纬度", en: "Birth coordinates" })}</dt>
          <dd>{birth.latitude}, {birth.longitude}</dd>
        </div>
        <div>
          <dt className="font-medium">{t({ zh: "黄道与宫位系统", en: "Zodiac and house system" })}</dt>
          <dd>{language === "zh" ? chart.meta.zodiacZh : chart.meta.zodiac} · {language === "zh" ? chart.meta.houseSystemZh : chart.meta.houseSystem}</dd>
        </div>
      </dl>
      <NatalWheelCN chartJson={chart} language={language} />
      <details open className="rounded-md border border-[var(--border)] p-3 text-sm">
        <summary className="cursor-pointer font-medium">{t({ zh: "行星、宫位与相位数据", en: "Planetary, house and aspect data" })}</summary>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <ul className="space-y-1">
            {[...chart.planets, ...chart.angles].map((point) => (
              <li key={point.key}>
                {language === "zh" ? point.labelZh : point.label} · {language === "zh" ? point.signZh : point.sign} {point.signDegrees}°
                {point.retrograde ? " ℞" : ""}{point.house ? ` · ${t({ zh: "第 " + point.house + " 宫", en: "House " + point.house })}` : ""}
              </li>
            ))}
          </ul>
          <ul className="space-y-1">
            {chart.houses.map((house) => <li key={house.house}>
              {t({ zh: "第 " + house.house + " 宫", en: "House " + house.house })} · {language === "zh" ? house.signZh : house.sign} {house.signDegrees}°
            </li>)}
            {chart.aspects.map((aspect, index) => <li key={index}>
              {language === "zh" ? aspect.point1LabelZh : aspect.point1Label} · {language === "zh" ? aspect.labelZh : aspect.label} · {language === "zh" ? aspect.point2LabelZh : aspect.point2Label} ({aspect.orb}°)
            </li>)}
          </ul>
        </div>
      </details>
    </section>
  );
}

export default function ReadingDetailPanel({ detail }: { detail: ReadingDetail }) {
  const { language, t } = usePreferences();
  if (!isRecord(detail.result)) return null;
  const result = detail.result;
  const archive = isRecord(result.archive) ? result.archive as ReadingArchive : null;
  const older = !archive && <p className="text-sm text-[var(--text-soft)]">
    {t({ zh: "这份旧记录保留了原始解读。未随解读保存的提问或输入资料无法补回。", en: "This older record contains the original reading. Inputs that weren’t saved with it cannot be recovered." })}
  </p>;

  if (detail.sku === "synastry") {
    const chartResult = isRecord(result.result) && isChart(result.result.chartA) && isChart(result.result.chartB)
      && Array.isArray(result.result.aspects) && Array.isArray(result.result.aInB) && Array.isArray(result.result.bInA)
      ? result.result as SynastryResult : null;
    const reading = isBilingualSynastryReading(result.reading) ? result.reading[language] : null;
    const input = archive?.kind === "synastry" ? archive.input : null;
    const relationship = relationships.find((item) => item.key === input?.relationship);
    return (
      <div className="space-y-6">
        {older}
        {relationship && <p className="whitespace-pre-wrap break-words text-sm">
          {t({ zh: "关系", en: "Relationship" })} · {t(relationship)}{input?.otherRelationship && ` · ${input.otherRelationship}`}
        </p>}
        {chartResult && <>
          <div className="grid gap-5 lg:grid-cols-2">
            <ChartData chart={chartResult.chartA} label={t({ zh: "人物 A", en: "Person A" })} showTime={chartResult.timeKnownA} />
            <ChartData chart={chartResult.chartB} label={t({ zh: "人物 B", en: "Person B" })} showTime={chartResult.timeKnownB} />
          </div>
          <SynastryWheel result={chartResult} language={language} />
          <details open className="rounded-md border border-[var(--border)] p-3 text-sm">
            <summary className="cursor-pointer font-medium">{t({ zh: "跨盘相位与双向宫位", en: "Cross-chart aspects and house overlays" })}</summary>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <ul className="space-y-1">
                {chartResult.aspects.map((item, index) => <li key={index}>
                  {language === "zh" ? item.aZh : item.aEn} · {item[language]} · {language === "zh" ? item.bZh : item.bEn} ({item.orb}°){item.provisional ? " *" : ""}
                </li>)}
              </ul>
              <div className="space-y-2">
                {([{ label: "A → B", items: chartResult.aInB }, { label: "B → A", items: chartResult.bInA }]).map((group) => (
                  <div key={group.label}>
                    <p className="font-medium">{group.label}</p>
                    <ul>{group.items.map((item) => <li key={item.key}>{item[language]} · {t({ zh: "第 " + item.house + " 宫", en: "House " + item.house })}{item.provisional ? " *" : ""}</li>)}</ul>
                  </div>
                ))}
              </div>
            </div>
          </details>
        </>}
        {reading ? <section className="space-y-4">
          <h3 className="text-lg font-semibold">{t({ zh: "AI 解读", en: "AI reading" })}</h3>
          <Markdown>{reading.overview}</Markdown>
          {topics.map((topic) => <div key={topic.key}>
            <h4 className="mb-1 font-semibold">{t(topic)}</h4>
            <Markdown>{reading.sections[topic.key]}</Markdown>
          </div>)}
        </section> : typeof result.reading === "string" && <Markdown>{result.reading}</Markdown>}
      </div>
    );
  }

  if (detail.sku === "natal") {
    const natal = archive?.kind === "natal" ? archive : null;
    return (
      <div className="space-y-6">
        {older}
        {natal?.question && <div>
          <h3 className="font-semibold">{t({ zh: "当时的问题", en: "Your question" })}</h3>
          <p className="mt-1 whitespace-pre-wrap break-words text-sm">{natal.question}</p>
        </div>}
        {isChart(natal?.chart) && <ChartData chart={natal.chart} />}
        {typeof result.reading === "string" && <section lang={natal?.language}>
          <h3 className="mb-2 text-lg font-semibold">{t({ zh: "AI 解读", en: "AI reading" })}</h3>
          <Markdown>{result.reading}</Markdown>
        </section>}
      </div>
    );
  }

  const tarot = archive?.kind === "tarot" ? archive : null;
  const mode = isTarotReadingMode(result.mode) ? result.mode : isTarotReadingMode(tarot?.mode) ? tarot.mode : "three-cards";
  const spread = tarotModes[mode];
  const fixedQuestion = tarot?.fixedQuestion ?? spread.fixedQuestion;
  const question = fixedQuestion ? t(fixedQuestion) : tarot?.question;
  const sections = isTarotReadingResult(result.sections, mode) ? result.sections : null;
  return (
    <div className="space-y-6">
      {older}
      {question && <div>
        <h3 className="font-semibold">{t({ zh: "当时的问题", en: "Your question" })}</h3>
        <p className="mt-1 whitespace-pre-wrap break-words text-sm">{question}</p>
      </div>}
      {tarot && <ul className="flex flex-wrap gap-4">
        {tarot.cards.map(({ id, position, reversed }) => {
          const card = tarotDeck.find((item) => item.id === id);
          if (!card) return null;
          const label = spread.positions.find((item) => item.key === position)?.label;
          const name = language === "zh" ? card.nameCn : card.name;
          return (
            <li key={position} className="w-28 space-y-1 text-sm">
              <Image src={card.imageSrc} alt={name} width={112} height={188} className={`h-auto w-full rounded-md ${reversed ? "rotate-180" : ""}`} />
              {label && <p className="text-[var(--text-soft)]">{t(label)}</p>}
              <p className="font-medium">{name}</p>
              <p className="text-xs text-[var(--text-soft)]">{reversed
                ? t({ zh: "逆位", en: "Reversed" }) : t({ zh: "正位", en: "Upright" })}</p>
            </li>
          );
        })}
      </ul>}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">{t({ zh: "AI 解读", en: "AI reading" })}</h3>
        {sections ? <>
          {sections.answer && <p className="font-medium">{t({ zh: "牌面倾向", en: "Card tendency" })} · {
            sections.answer === "yes" ? t({ zh: "是", en: "Yes" }) :
            sections.answer === "no" ? t({ zh: "否", en: "No" }) : t({ zh: "尚不明确", en: "Unclear" })
          }</p>}
          <Markdown>{t(sections.overview)}</Markdown>
          {spread.positions.map(({ key, label }) => {
            const text = sections[key];
            return text && <div key={key}><h4 className="font-semibold">{t(label)}</h4><Markdown>{t(text)}</Markdown></div>;
          })}
          <div><h4 className="font-semibold">{t({ zh: "综合分析", en: "Synthesis" })}</h4><Markdown>{t(sections.synthesis)}</Markdown></div>
          <div><h4 className="font-semibold">{t({ zh: "建议", en: "Advice" })}</h4><Markdown>{sections.advice.map((item, index) => `${index + 1}. ${t(item)}`).join("\n\n")}</Markdown></div>
        </> : typeof result.reading === "string" && <Markdown>{result.reading}</Markdown>}
      </section>
    </div>
  );
}
