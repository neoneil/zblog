"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { tarotCardBack } from "@/lib/tarot/full-deck";
import type { TarotCard } from "@/types/tarot";

type TarotDeckProps = {
  cards: TarotCard[];
  stage: "idle" | "shuffling" | "selecting" | "revealing" | "reading" | "done";
  selectedIds: string[];
  onSelectCard: (card: TarotCard) => void;
};

function getSpreadStyle(index: number, total: number) {
  const center = (total - 1) / 2;
  const offset = index - center;

  const horizontalGap = 16;
  const arcHeight = 0.07;
  const rotateFactor = 0.58;
  const cardWidth = 122;

  return {
    x: offset * horizontalGap - cardWidth / 2,
    y: Math.pow(offset, 2) * arcHeight,
    rotate: offset * rotateFactor,
    zIndex: index + 1,
  };
}

export default function TarotDeck({
  cards,
  stage,
  selectedIds,
  onSelectCard,
}: TarotDeckProps) {
  const isSelectable = stage === "selecting";

  if (stage === "idle") {
    return (
      <div className="flex min-h-[230px] items-center justify-center rounded-[30px] border border-dashed border-[var(--border)] bg-[var(--card-soft)] text-center text-[var(--text-faint)]">
        输入问题后点击“开始洗牌”
      </div>
    );
  }

  if (stage === "shuffling") {
    return (
      <div className="relative min-h-[250px] overflow-hidden rounded-[30px] border border-[var(--border)] bg-[var(--card-soft)]">
        <div className="absolute inset-0">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              layoutId={`tarot-card-${card.id}`}
              animate={{
                x: [0, -8 + (index % 4) * 3, 6 - (index % 3) * 2, -4, 0],
                y: [0, -5, 3, -2, 0],
                rotate: [0, -5 + (index % 5) * 1.5, 4 - (index % 4), -3, 0],
                scale: [1, 1.01, 0.992, 1.006, 1],
              }}
              transition={{
                duration: 1.05 + index * 0.018,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.025,
              }}
              className="absolute h-[220px] w-[140px] overflow-hidden rounded-[22px] border border-[var(--border)] shadow-[var(--shadow-lg)]"
              style={{
                left: "70px",
                top: "50%",
                translate: "0 -50%",
                zIndex: 90 - index,
              }}
            >
              <Image
                src={encodeURI(tarotCardBack)}
                alt="Tarot card back"
                fill
                sizes="140px"
                className="object-cover"
              />
            </motion.div>
          ))}
        </div>

        <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-[var(--border)] bg-[var(--card-muted)] px-4 py-2 text-sm text-[var(--text-soft)] backdrop-blur">
          正在洗牌……
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[30px] border border-[var(--border)] bg-[var(--card-soft)] px-3 py-4 sm:px-5 sm:py-5">
      {cards.length === 0 ? (
        <div className="flex min-h-[260px] items-center justify-center text-sm text-[var(--text-faint)]">
          已选完三张牌
        </div>
      ) : (
        <div className="relative min-h-[260px] overflow-hidden overflow-y-visible">
          {cards.map((card, index) => {
            if (selectedIds.includes(card.id)) return null;

            const spread = getSpreadStyle(index, cards.length);

            return (
              <motion.button
                key={card.id}
                type="button"
                layoutId={`tarot-card-${card.id}`}
                onClick={() => onSelectCard(card)}
                disabled={!isSelectable}
                initial={false}
                animate={{
                  opacity: 1,
                  x: spread.x,
                  y: spread.y,
                  rotate: spread.rotate,
                  scale: 1,
                }}
                transition={{
                  duration: 0.35,
                  ease: "easeOut",
                }}
                whileHover={
                  isSelectable
                    ? {
                        y: spread.y - 8,
                        scale: 1.03,
                        boxShadow: "0 16px 36px rgba(0,0,0,0.28)",
                        transition: { duration: 0.16 },
                      }
                    : undefined
                }
                whileTap={isSelectable ? { scale: 0.985 } : undefined}
                className="absolute top-8 h-[190px] w-[122px] overflow-hidden rounded-[20px] border border-[var(--border)] bg-[var(--card-soft)] shadow-[var(--shadow-md)] transition disabled:cursor-default"
                style={{
                  left: "50%",
                  zIndex: spread.zIndex,
                }}
              >
                <Image
                  src={encodeURI(tarotCardBack)}
                  alt="Tarot card back"
                  fill
                  sizes="122px"
                  className="object-cover"
                />
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}
// "use client";    // 原版

// import Image from "next/image";
// import { motion } from "framer-motion";
// import { tarotCardBack } from "@/lib/tarot/full-deck";
// import type { TarotCard } from "@/types/tarot";

// type TarotDeckProps = {
//   cards: TarotCard[];
//   stage: "idle" | "shuffling" | "selecting" | "revealing" | "reading" | "done";
//   selectedIds: string[];
//   onSelectCard: (card: TarotCard) => void;
// };

// export default function TarotDeck({
//   cards,
//   stage,
//   selectedIds,
//   onSelectCard,
// }: TarotDeckProps) {
//   const visibleCards = cards.filter((card) => !selectedIds.includes(card.id));

//   if (stage === "idle") {
//     return (
//       <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-dashed border-[var(--border)] text-center text-[var(--text-faint)]">
//         输入问题后点击“开始洗牌”
//       </div>
//     );
//   }

//   if (stage === "shuffling") {
//     return (
//       <div className="relative flex min-h-[340px] items-center justify-center overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card-soft)]">
//         {visibleCards.map((card, index) => (
//           <motion.div
//             key={card.id}
//             layoutId={`tarot-card-${card.id}`}
//             animate={{
//               x: [0, -32 + (index % 4) * 8, 28 - (index % 3) * 10, -16, 0],
//               y: [0, -12, 8, -6, 0],
//               rotate: [0, -14 + (index % 5) * 3, 10 - (index % 4) * 2, -8, 0],
//               scale: [1, 1.02, 0.98, 1.01, 1],
//             }}
//             transition={{
//               duration: 1.25 + index * 0.03,
//               repeat: Infinity,
//               ease: "easeInOut",
//               delay: index * 0.04,
//             }}
//             className="absolute h-[220px] w-[140px] overflow-hidden rounded-3xl border border-[var(--border)] shadow-[var(--shadow-lg)]"
//             style={{ zIndex: 50 - index }}
//           >
//             <Image
//               src={encodeURI(tarotCardBack)}
//               alt="Tarot card back"
//               fill
//               sizes="140px"
//               className="object-cover"
//             />
//           </motion.div>
//         ))}

//         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-[var(--border)] bg-[var(--card-muted)] px-4 py-2 text-sm text-[var(--text-soft)]">
//           正在洗牌……
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="rounded-3xl border border-[var(--border)] bg-[var(--card-soft)] p-4">
//       <div className="flex min-h-[320px] flex-wrap items-center justify-center gap-3">
//         {visibleCards.length === 0 ? (
//           <div className="text-sm text-[var(--text-faint)]">已选完三张牌</div>
//         ) : (
//           visibleCards.map((card, index) => (
//             <motion.button
//               key={card.id}
//               type="button"
//               layoutId={`tarot-card-${card.id}`}
//               onClick={() => onSelectCard(card)}
//               disabled={stage !== "selecting"}
//               initial={{ opacity: 0, y: 24 }}
//               animate={{ opacity: 1, y: 0, rotate: 0 }}
//               transition={{
//                 duration: 0.4,
//                 delay: index * 0.04,
//                 ease: "easeOut",
//               }}
//               whileHover={stage === "selecting" ? { y: -6, scale: 1.02 } : undefined}
//               whileTap={stage === "selecting" ? { scale: 0.98 } : undefined}
//               className="relative h-[190px] w-[122px] overflow-hidden rounded-2xl border border-[var(--border)] shadow-[var(--shadow-md)] transition disabled:cursor-default"
//             >
//               <Image
//                 src={encodeURI(tarotCardBack)}
//                 alt="Tarot card back"
//                 fill
//                 sizes="122px"
//                 className="object-cover"
//               />
//             </motion.button>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }