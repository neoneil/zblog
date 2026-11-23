
"use client";
import { readingFetch } from "@/features/billing/lib/reading-fetch";
import { MembershipActions } from "@/features/billing/components/membership-actions";

import { useMemo, useRef, useState } from "react";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { situationSlotWidth } from "@/lib/tarot/situation-spreads";
import { tarotModes, tarotModeOrder, type TarotReadingMode } from "@/lib/tarot/reading-modes";
import { getYesNoAnswer, tarotAnswerLabels } from "@/lib/tarot/yes-no";
import TarotAtmosphere from "./tarot-atmosphere";
import TarotSpreadGuide from "./tarot-spread-guide";
import TarotReadingNotice from "./tarot-reading-notice";
import spreadStyles from "./tarot-spreads.module.css";
import styles from "./tarot-experience.module.css";
import TarotCard from "@/components/tarot/tarot-card";
import TarotDeck from "@/components/tarot/tarot-deck";
import TarotReadingPanel from "@/components/tarot/tarot-reading-panel";
import type { AiAccessStatus } from "@/features/billing/lib/types";
import { tarotDeck as fullTarotDeck } from "@/lib/tarot/full-deck";
import { shuffleCards } from "@/lib/tarot/shuffle";
import { isTarotReadingResult, type TarotReadingResult } from "@/lib/tarot/reading-result";
import type { DrawnTarotCard, TarotCard as TarotCardType } from "@/types/tarot";

import type { TarotStage } from "./tarot-stage";
import { usePreferences } from "@/components/site/preferences-provider";

type TarotClientProps = {
  accessStatus: AiAccessStatus;
  mode?: TarotReadingMode;
  manualReading?: boolean;
};

export default function TarotClient({ accessStatus, mode = "three-cards", manualReading = false }: TarotClientProps) {
  const { t, language } = usePreferences();
  const config = tarotModes[mode];
  const positionOrder = config.positions.map(position => position.key);
  const cardCount = positionOrder.length;
  const useGuidedStyles = Boolean(config.fixedQuestion && !config.layout);
  const countLabel = ({ 1: "一", 2: "两", 3: "三", 5: "五", 6: "六", 10: "十" } as Record<number, string>)[cardCount] || String(cardCount);
  const reducedMotion = useReducedMotion();
  const requestedFlips = useRef(new Set<string>());
  const completedFlips = useRef(new Set<string>());
  const readingRequested = useRef(false);
  const [revealedIds, setRevealedIds] = useState<string[]>([]);
  const cardsSource = useMemo(() => fullTarotDeck, []);
  const [dailyLimitReached, setDailyLimitReached] = useState(
    accessStatus.authenticated && !accessStatus.isAdmin && !accessStatus.isPaid && accessStatus.remainingToday <= 0,
  );
  const [question, setQuestion] = useState("");
  const [stage, setStage] = useState<TarotStage>("idle");
  const [tableCards, setTableCards] = useState<TarotCardType[]>([]);
  const [selectedCards, setSelectedCards] = useState<DrawnTarotCard[]>([]);
  const [reading, setReading] = useState("");
  const [readingSections, setReadingSections] = useState<TarotReadingResult | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedIds = selectedCards.map((card) => card.id);

  async function generateReading(cards: DrawnTarotCard[]) {
    if (readingRequested.current) return;
    readingRequested.current = true;
    setLoading(true);
    setStage("reading");

    try {
      const res = await readingFetch("/api/tarot-reading", {question,cards,mode});

      const data = await res.json();

      if (!res.ok) {
        if (data?.code === "insufficient" || data?.code === "unpriced") {
          setDailyLimitReached(true);
        }

        throw new Error(data?.error || "生成解读失败。 / Failed to generate the reading.");
      }

      setReading(data.reading ?? "");
      setReadingSections(isTarotReadingResult(data.sections, mode) ? data.sections : null);
      setStage("done");
    } catch (error) {
      console.error(error);
      setReading(
        error instanceof Error
          ? `解读生成失败 / Reading failed: ${error.message}`
          : "解读生成失败，请稍后再试。 / Failed to generate the reading. Please try again."
      );
      setStage("done");
    } finally {
      setLoading(false);
    }
  }

  function handleStartShuffle() {
    if (dailyLimitReached) return;

    const nextTableCards = shuffleCards(cardsSource).slice(0, 50);
    requestedFlips.current.clear();
    completedFlips.current.clear();
    readingRequested.current = false;
    setRevealedIds([]);
    setTableCards(nextTableCards);
    setSelectedCards([]);
    setReading("");
    setReadingSections(null);
    setLoading(false);
    setStage("shuffling");
  }

  function handleStopShuffle() {
    if (stage !== "shuffling") return;
    setStage("selecting");
  }

  function handleReset() {
    requestedFlips.current.clear();
    completedFlips.current.clear();
    readingRequested.current = false;
    setRevealedIds([]);
    setQuestion("");
    setTableCards([]);
    setSelectedCards([]);
    setReading("");
    setReadingSections(null);
    setLoading(false);
    setStage("idle");
  }

  function handleSelectCard(card: TarotCardType) {
    if (stage !== "selecting") return;
    if (selectedIds.includes(card.id)) return;
    if (selectedCards.length >= cardCount) return;

    const nextCard: DrawnTarotCard = {
      ...card,
      position: positionOrder[selectedCards.length],
      reversed: mode === "yes-no" ? false : Math.random() < 0.5,
    };

    const nextSelected = [...selectedCards, nextCard];
    setSelectedCards(nextSelected);

    if (nextSelected.length === cardCount) {
      setStage("gathering");
    }
  }

  function handleFlipCard(id: string) {
    if (stage !== "ready" && stage !== "revealing") return;
    if (!selectedIds.includes(id) || requestedFlips.current.has(id)) return;
    requestedFlips.current.add(id);
    setRevealedIds([...requestedFlips.current]);
    setStage("revealing");
  }

  function handleFlipComplete(id: string) {
    if (stage !== "ready" && stage !== "revealing") return;
    if (!requestedFlips.current.has(id) || !selectedIds.includes(id)) return;
    completedFlips.current.add(id);
    if (completedFlips.current.size !== cardCount) return;
    if (!accessStatus.authenticated) {
      setStage("done");
    } else if (manualReading) {
      setStage("awaiting-reading");
    } else {
      void generateReading(selectedCards);
    }
  }

  const actionLabelZh =
    stage === "idle"
      ? "开始洗牌"
      : stage === "shuffling"
        ? "停止洗牌"
        : stage === "selecting"
          ? `请选择${countLabel}张牌（${selectedCards.length}/${cardCount}）`
          : stage === "gathering"
            ? `${countLabel}张牌正在归位…`
          : stage === "ready" || stage === "revealing"
            ? "点击卡牌翻面"
            : stage === "reading"
              ? "正在解读..."
              : "再次抽牌";
  const awaitingReading = stage === "awaiting-reading";
  const actionLabel = t({ zh: actionLabelZh, en:
    stage === "idle" ? "Start shuffling" : stage === "shuffling" ? "Stop shuffling"
      : stage === "selecting" ? `Choose ${cardCount} cards (${selectedCards.length}/${cardCount})`
      : stage === "gathering" ? "Gathering your cards…"
      : stage === "ready" || stage === "revealing" ? "Tap a card to reveal"
      : stage === "reading" ? "Reading your cards…" : "Draw again",
  });

  const actionDisabled =
    dailyLimitReached ||
    (mode === "yes-no" && (stage === "idle" || stage === "done") && !question.trim()) ||
    stage === "selecting" ||
    stage === "gathering" ||
    stage === "ready" ||
    stage === "revealing" ||
    stage === "reading";

  const accessLabel = !accessStatus.authenticated
    ? t({ zh: "访客可体验洗牌和翻牌。登录后可生成并保存 AI 解读。", en: "Guests can shuffle and reveal cards. Sign in to generate and save an AI reading." })
    : accessStatus.isAdmin
    ? null
    : dailyLimitReached
      ? t({zh:"暂无可用次数或积分，请前往星尘钱包。",en:"No available allowance or STARS. Visit your wallet."})
      : t({zh:`剩余免费／会员次数 ${accessStatus.remainingReadings??0}；积分付费前会请你确认。`,en:`${accessStatus.remainingReadings??0} free/member readings remain. STARS payments require confirmation.`});

  const collected = stage === "gathering" || stage === "ready" || stage === "revealing" || awaitingReading || stage === "reading" || stage === "done";
  const canFlip = stage === "ready" || stage === "revealing";
  const board = collected ? config.layout : undefined;
  const isFinanceSituation = config.href.startsWith("/tarot-ai/finances/");

  return (
    <main className={`${styles.experience} ${useGuidedStyles ? spreadStyles.guided : ""}`} data-mode={mode} data-stage={stage} data-card-count={cardCount} data-situation-layout={Boolean(config.layout)}>
      <TarotAtmosphere showLights={false} />
      <LayoutGroup id="tarot-experience">
        <div className={styles.content}>
          <nav className={styles.modeNav} aria-label={t({ zh: "塔罗牌阵", en: "Tarot spreads" })}>
            <Link href="/parentinglab/asktarotmom">{t({ zh: "全部牌阵", en: "All readings" })}</Link>
            {tarotModeOrder.map(key => <Link key={key} href={tarotModes[key].href} aria-current={mode === key ? "page" : undefined}>{t(tarotModes[key].title)}</Link>)}
            {isFinanceSituation ? (
              <Link href="/tarot-ai/finances" aria-current="location">{t({ zh: "财务情境", en: "Financial Situations" })}</Link>
            ) : (
              <Link href="/tarot-ai/relationships" aria-current={config.layout ? "location" : undefined}>{t({ zh: "关系情境", en: "Relationship Situations" })}</Link>
            )}
          </nav>
          <header className={styles.heading}>
            <p className={styles.eyebrow}>{t(config.title)} · {cardCount} {t({ zh: "张牌", en: cardCount === 1 ? "card" : "cards" })}</p>
            <h1>{stage === "idle" ? mode === "three-cards" ? t({ zh: "向塔罗轻声提问", en: "Whisper to the Tarot" }) : config.title[language] : collected ? t({ zh: `你的${countLabel}张牌`, en: "Your cards" }) : t({ zh: "想着你的问题", en: "Focus on your question" })}</h1>
            {accessLabel && <p className={styles.access}>{accessLabel}</p>}
            {mode === "love" && (
              <Link href="/tarot-ai/relationships" className={styles.relationshipLink}>
                {t({ zh: "查看全部 121 种关系情境", en: "Explore all 121 relationship situations" })}
              </Link>
            )}
          </header>
          {stage === "idle" && <TarotReadingNotice />}

          <section className={styles.table} aria-label="塔罗抽牌">
            {stage === "idle" ? config.fixedQuestion ? <TarotSpreadGuide mode={mode} /> : (
              <div className={styles.questionForm}>
                <label className={styles.srOnly} htmlFor="tarot-question">你的问题</label>
                <textarea id="tarot-question" value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={mode === "yes-no" ? "写下一个是非问题 / Ask a clear yes-or-no question…" : "在这里写下你的问题…… / Ask your question…"} aria-required={mode === "yes-no"} className={styles.question} />
              </div>
            ) : (
              <div className={styles.counter} aria-live="polite">
                <p>{config.fixedQuestion ? t(config.fixedQuestion) : question || t({ zh: "静心，感受此刻的直觉", en: "Take a quiet moment and follow your intuition." })}</p>
                {!collected && <div className={styles.counterLine}>
                  <span>{t({ zh: "还需选择", en: "Choose" })}</span><strong>{cardCount - selectedCards.length}</strong><span>{t({ zh: "张牌", en: "more cards" })}</span>
                </div>}
              </div>
            )}

            <div className={styles.actions}>
              {!awaitingReading && <button type="button"
                onClick={stage === "idle" || stage === "done" ? handleStartShuffle : handleStopShuffle}
                disabled={actionDisabled} className={styles.action}>
                <span>{actionLabel}</span>
              </button>}
              {stage !== "idle" && <button type="button" onClick={handleReset} disabled={loading}
                className={styles.reset} aria-label={t({ zh: "重置抽牌", en: "Reset reading" })} title={t({ zh: "重置抽牌", en: "Reset reading" })}>↺</button>}
            </div>
            {dailyLimitReached && <p className={styles.notice}>{t({ zh: "暂无可用次数或足够积分，请前往会员与钱包查看。", en: "No allowance or sufficient STARS available. Please check Membership & Wallet." })}</p>}
            <p className={styles.stageStatus} role="status">
              {stage === "shuffling" && t({ zh: "静心片刻，准备好时停止洗牌", en: "Take a quiet moment, then stop shuffling when you are ready." })}
              {stage === "selecting" && t({ zh: `凭直觉，依次选择属于你的${countLabel}张牌`, en: `Follow your intuition and select ${cardCount} cards.` })}
              {stage === "gathering" && t({ zh: `${countLabel}张牌正在汇聚`, en: "Your cards are gathering." })}
              {stage === "ready" && t({ zh: "翻开一张牌", en: "Reveal a card." })}
              {stage === "revealing" && (manualReading
                ? t({ zh: "请翻开剩余的牌", en: "Reveal the remaining cards." })
                : t({ zh: "点击尚未翻开的牌，全部揭晓后开始解读", en: "Reveal the remaining cards to begin your reading." }))}
              {stage === "reading" && t({ zh: "正在为你解读牌中的讯息", en: "Your reading is being prepared." })}
              {stage === "done" && (!accessStatus.authenticated
                ? t({ zh: "牌面已翻开。登录或免费注册后可使用 AI 解读。", en: "Your cards are revealed. Sign in or register for free to access AI readings." })
                : readingSections && t({ zh: "你的解读已生成，已经自动保存到了我的星巢", en: "Your reading is ready in My Account." }))}
            </p>

            <div className={styles.cardScene} data-collected={collected} data-idle={stage === "idle"}>
              <TarotDeck cards={tableCards} stage={stage} selectedIds={selectedIds} onSelectCard={handleSelectCard} />
            {selectedCards.length > 0 && <motion.div layout className={`${styles.selected} ${board ? styles.situationBoard : ""} ${useGuidedStyles ? spreadStyles.selected : ""}`}
              style={board ? { aspectRatio: board.ratio } : undefined}
              data-spread-board={board ? "" : undefined}
              aria-label={t({ zh: "已选塔罗牌", en: "Selected tarot cards" })}
              animate={stage === "gathering" && !reducedMotion
                ? { rotate: [0, -18, 342, 360], scale: cardCount === 5 ? [0.6, 0.4, 0.6, 1] : [0.76, 0.65, 0.76, 1] }
                : { rotate: collected ? 360 : 0, scale: 1 }}
              transition={{ duration: reducedMotion ? 0 : stage === "gathering" ? 3.6 : 0.7, ease: "easeInOut", layout: { duration: reducedMotion ? 0 : 1 } }}
              onAnimationComplete={() => { if (stage === "gathering") setStage("ready"); }}>
              {positionOrder.map((position, index) => {
                const card = selectedCards.find((item) => item.position === position);
                const slot = board?.cards[index];
                return <div key={position} className={`${styles.selectedSlot} ${useGuidedStyles ? spreadStyles.slot : ""}`}
                  data-spread-position={slot ? index + 1 : undefined}
                  style={slot && board ? {
                    left: `${slot.x}%`, top: `${slot.y}%`,
                    width: `${situationSlotWidth(board, index)}%`,
                    rotate: `${slot.rotation}deg`,
                  } : undefined}>
                  <p className={styles.position}>{config.fixedQuestion ? `${index + 1}. ` : ""}{t(config.positions[index].label)}</p>
                  {card ? <TarotCard key={card.id} card={card} index={index} revealed={revealedIds.includes(card.id)}
                    gathering={stage === "gathering"} canFlip={canFlip}
                    onFlip={handleFlipCard} onFlipped={handleFlipComplete}
                    layoutId={`tarot-card-${card.id}`} positionLabel={t(config.positions[index].label)} /> : null}
                </div>;
              })}
            </motion.div>}
            </div>
            {awaitingReading && (
              <>
                <div className={styles.actions}>
                  <button type="button" className={styles.action} disabled={actionDisabled}
                    onClick={() => void generateReading(selectedCards)}>
                    <span>{t({ zh: "AI 解读", en: "AI Reading" })}</span>
                  </button>
                </div>
                <p className={styles.stageStatus} role="status">
                  {t({ zh: "所有牌已翻开，准备好后点击「AI 解读」。", en: "All cards are revealed. Select AI Reading when you are ready." })}
                </p>
              </>
            )}
          </section>
          {!accessStatus.authenticated && stage === "done" && (
            <MembershipActions signedIn={false} actions={["signUp", "signIn"]} returnTo={config.href} />
          )}
          {stage !== "idle" && <TarotReadingNotice />}
          {mode === "yes-no" && (loading || reading) && <p className={styles.verdict} role="status">{tarotAnswerLabels[getYesNoAnswer(selectedCards)]}</p>}
          {(loading || reading) && <section className={styles.reading} aria-label="塔罗解读结果" aria-live="polite">
            <TarotReadingPanel reading={reading} sections={readingSections} cards={selectedCards} loading={loading} mode={mode} />
          </section>}
        </div>
      </LayoutGroup>
    </main>
  );
}
