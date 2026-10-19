
"use client";

import { useMemo, useRef, useState } from "react";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import TarotAtmosphere from "./tarot-atmosphere";
import styles from "./tarot-experience.module.css";
import TarotCard from "@/components/tarot/tarot-card";
import TarotDeck from "@/components/tarot/tarot-deck";
import TarotReadingPanel from "@/components/tarot/tarot-reading-panel";
import type { AiAccessStatus } from "@/features/billing/lib/types";
import { tarotDeck as fullTarotDeck } from "@/lib/tarot/full-deck";
import { shuffleCards } from "@/lib/tarot/shuffle";
import type { DrawnTarotCard, TarotCard as TarotCardType } from "@/types/tarot";

import type { TarotStage } from "./tarot-stage";

const positionOrder: DrawnTarotCard["position"][] = ["past", "present", "future"];

const positionLabel: Record<DrawnTarotCard["position"], string> = {
  past: "过去",
  present: "现在",
  future: "未来",
};

type TarotClientProps = {
  accessStatus: AiAccessStatus;
};

export default function TarotClient({ accessStatus }: TarotClientProps) {
  const reducedMotion = useReducedMotion();
  const requestedFlips = useRef(new Set<string>());
  const completedFlips = useRef(new Set<string>());
  const readingRequested = useRef(false);
  const [revealedIds, setRevealedIds] = useState<string[]>([]);
  const cardsSource = useMemo(() => fullTarotDeck, []);
  const [dailyLimitReached, setDailyLimitReached] = useState(
    !accessStatus.isAdmin && !accessStatus.isPaid && accessStatus.remainingToday <= 0,
  );
  const [question, setQuestion] = useState("");
  const [stage, setStage] = useState<TarotStage>("idle");
  const [tableCards, setTableCards] = useState<TarotCardType[]>([]);
  const [selectedCards, setSelectedCards] = useState<DrawnTarotCard[]>([]);
  const [reading, setReading] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedIds = selectedCards.map((card) => card.id);

  async function generateReading(cards: DrawnTarotCard[]) {
    setLoading(true);
    setStage("reading");

    try {
      const res = await fetch("/api/tarot-reading", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          cards,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data?.code === "daily_limit_reached") {
          setDailyLimitReached(true);
        }

        throw new Error(data?.error || "生成解读失败。");
      }

      setReading(data.reading ?? "");
      setStage("done");
    } catch (error) {
      console.error(error);
      setReading(
        error instanceof Error
          ? `解读生成失败：${error.message}`
          : "解读生成失败，请稍后再试。"
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
    setLoading(false);
    setStage("idle");
  }

  function handleSelectCard(card: TarotCardType) {
    if (stage !== "selecting") return;
    if (selectedIds.includes(card.id)) return;
    if (selectedCards.length >= 3) return;

    const nextCard: DrawnTarotCard = {
      ...card,
      position: positionOrder[selectedCards.length],
      reversed: Math.random() < 0.5,
    };

    const nextSelected = [...selectedCards, nextCard];
    setSelectedCards(nextSelected);

    if (nextSelected.length === 3) {
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
    // Start the request only after every card's actual 3D animation finishes.
    if (completedFlips.current.size === 3 && !readingRequested.current) {
      readingRequested.current = true;
      void generateReading(selectedCards);
    }
  }

  const actionLabel =
    stage === "idle"
      ? "开始洗牌"
      : stage === "shuffling"
        ? "停止洗牌"
        : stage === "selecting"
          ? `请选择三张牌（${selectedCards.length}/3）`
          : stage === "gathering"
            ? "三张牌正在归位…"
          : stage === "ready" || stage === "revealing"
            ? "点击卡牌翻面"
            : stage === "reading"
              ? "正在解读..."
              : "再次抽牌";

  const actionDisabled =
    dailyLimitReached ||
    stage === "selecting" ||
    stage === "gathering" ||
    stage === "ready" ||
    stage === "revealing" ||
    stage === "reading";

  const accessLabel = accessStatus.isAdmin
    ? "Admin 无限制使用"
    : accessStatus.isPaid
      ? "已开通付费权限，无限制使用"
      : dailyLimitReached
        ? "今日免费次数已用完"
        : "普通用户每日可免费使用 1 次";

  const collected = stage === "gathering" || stage === "ready" || stage === "revealing" || stage === "reading" || stage === "done";
  const canFlip = stage === "ready" || stage === "revealing";

  return (
    <main className={styles.experience} data-stage={stage}>
      <TarotAtmosphere />
      <LayoutGroup id="tarot-experience">
        <div className={styles.content}>
          <header className={styles.heading}>
            <p className={styles.eyebrow}>三张牌 · 过去 / 现在 / 未来</p>
            <div className={styles.sigil} aria-hidden="true">☽ ✧ ☾</div>
            <h1>{stage === "idle" ? <>向塔罗<br />轻声提问</> : collected ? "你的三张牌" : "想着你的问题"}</h1>
            <p className={styles.access}>{accessLabel}</p>
          </header>

          <section className={styles.table} aria-label="塔罗抽牌">
            {stage === "idle" ? (
              <div className={styles.questionForm}>
                <div className={styles.moons} aria-hidden="true">☽ ☽ ● ☾ ☾</div>
                <label className={styles.srOnly} htmlFor="tarot-question">你的问题</label>
                <textarea id="tarot-question" value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="在这里写下你的问题……" className={styles.question} />
              </div>
            ) : (
              <div className={styles.counter} aria-live="polite">
                <p>{question || "静心，感受此刻的直觉"}</p>
                {!collected && <div className={styles.counterLine}>
                  <span>还需选择</span><strong>{3 - selectedCards.length}</strong><span>张牌</span>
                </div>}
              </div>
            )}

            <div className={styles.actions}>
              <button type="button"
                onClick={stage === "idle" || stage === "done" ? handleStartShuffle : handleStopShuffle}
                disabled={actionDisabled} className={styles.action}>
                <span>{actionLabel}</span>
              </button>
              {stage !== "idle" && <button type="button" onClick={handleReset} disabled={loading}
                className={styles.reset} aria-label="重置抽牌" title="重置抽牌">↺</button>}
            </div>
            {dailyLimitReached && <p className={styles.notice}>今日免费次数已用完，开通 Tarot AI 时间包后可继续使用。</p>}
            <p className={styles.stageStatus} role="status">
              {stage === "shuffling" && "静心片刻，准备好时停止洗牌"}
              {stage === "selecting" && "凭直觉，依次选择属于你的三张牌"}
              {stage === "gathering" && "三张牌正在汇聚"}
              {stage === "ready" && "翻开一张牌"}
              {stage === "revealing" && "点击尚未翻开的牌，三张牌全部揭晓后开始解读"}
              {stage === "reading" && "正在为你解读牌中的讯息"}
              {stage === "done" && "你的解读已生成"}
            </p>

            <div className={styles.cardScene} data-collected={collected} data-idle={stage === "idle"}>
              <TarotDeck cards={tableCards} stage={stage} selectedIds={selectedIds} onSelectCard={handleSelectCard} />
            {selectedCards.length > 0 && <motion.div layout className={styles.selected} aria-label="已选塔罗牌"
              animate={stage === "gathering" && !reducedMotion
                ? { rotate: [0, -18, 342, 360], scale: [0.76, 0.65, 0.76, 1] }
                : { rotate: collected ? 360 : 0, scale: 1 }}
              transition={{ duration: reducedMotion ? 0 : stage === "gathering" ? 3.6 : 0.7, ease: "easeInOut", layout: { duration: reducedMotion ? 0 : 1 } }}
              onAnimationComplete={() => { if (stage === "gathering") setStage("ready"); }}>
              {positionOrder.map((position, index) => {
                const card = selectedCards.find((item) => item.position === position);
                return <div key={position} className={styles.selectedSlot}>
                  <p className={styles.position}>{positionLabel[position]}</p>
                  {card ? <TarotCard key={card.id} card={card} index={index} revealed={revealedIds.includes(card.id)}
                    gathering={stage === "gathering"} canFlip={canFlip}
                    onFlip={handleFlipCard} onFlipped={handleFlipComplete}
                    layoutId={`tarot-card-${card.id}`} /> : null}
                </div>;
              })}
            </motion.div>}
            </div>
          </section>
          {(loading || reading) && <section className={styles.reading} aria-label="塔罗解读结果" aria-live="polite">
            <TarotReadingPanel reading={reading} loading={loading} />
          </section>}
        </div>
      </LayoutGroup>
    </main>
  );
}
