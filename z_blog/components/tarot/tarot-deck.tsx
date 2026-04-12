
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

export default function TarotDeck({
  cards,
  stage,
  selectedIds,
  onSelectCard,
}: TarotDeckProps) {
  const visibleCards = cards.filter((card) => !selectedIds.includes(card.id));

  if (stage === "idle") {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-dashed border-white/10 text-center text-purple-100/60">
        输入问题后点击“开始洗牌”
      </div>
    );
  }

  if (stage === "shuffling") {
    return (
      <div className="relative flex min-h-[340px] items-center justify-center overflow-hidden rounded-3xl border border-white/8 bg-black/10">
        {visibleCards.map((card, index) => (
          <motion.div
            key={card.id}
            layoutId={`tarot-card-${card.id}`}
            animate={{
              x: [0, -32 + (index % 4) * 8, 28 - (index % 3) * 10, -16, 0],
              y: [0, -12, 8, -6, 0],
              rotate: [0, -14 + (index % 5) * 3, 10 - (index % 4) * 2, -8, 0],
              scale: [1, 1.02, 0.98, 1.01, 1],
            }}
            transition={{
              duration: 1.25 + index * 0.03,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.04,
            }}
            className="absolute h-[220px] w-[140px] overflow-hidden rounded-3xl border border-white/10 shadow-2xl"
            style={{ zIndex: 50 - index }}
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

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-purple-100/80">
          正在洗牌……
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/8 bg-black/10 p-4">
      <div className="flex min-h-[320px] flex-wrap items-center justify-center gap-3">
        {visibleCards.length === 0 ? (
          <div className="text-sm text-purple-100/55">已选完三张牌</div>
        ) : (
          visibleCards.map((card, index) => (
            <motion.button
              key={card.id}
              type="button"
              layoutId={`tarot-card-${card.id}`}
              onClick={() => onSelectCard(card)}
              disabled={stage !== "selecting"}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.04,
                ease: "easeOut",
              }}
              whileHover={stage === "selecting" ? { y: -6, scale: 1.02 } : undefined}
              whileTap={stage === "selecting" ? { scale: 0.98 } : undefined}
              className="relative h-[190px] w-[122px] overflow-hidden rounded-2xl border border-white/10 shadow-xl transition disabled:cursor-default"
            >
              <Image
                src={encodeURI(tarotCardBack)}
                alt="Tarot card back"
                fill
                sizes="122px"
                className="object-cover"
              />
            </motion.button>
          ))
        )}
      </div>
    </div>
  );
}

// "use client";

// import Image from "next/image";
// import { motion } from "framer-motion";
// import { tarotCardBack } from "@/lib/tarot/full-deck";

// type TarotDeckProps = {
//   disabled?: boolean;
// };

// export default function TarotDeck({ disabled }: TarotDeckProps) {
//   return (
//     <div className="relative mx-auto h-[430px] w-[180px]">
//       {Array.from({ length: 12 }).map((_, index) => (
//         <motion.div
//           key={index}
//           initial={{ opacity: 0, x: 20 }}
//           animate={{
//             opacity: 1,
//             x: 0,
//             rotate: -10 + index * 1.6,
//             y: index * 4,
//           }}
//           transition={{
//             duration: 0.45,
//             delay: index * 0.03,
//           }}
//           className="absolute left-0 top-0 h-[260px] w-[170px] overflow-hidden rounded-3xl border border-white/10 shadow-lg"
//           style={{ zIndex: 30 - index }}
//         >
//           <Image
//             src={encodeURI(tarotCardBack)}
//             alt="Tarot card back"
//             fill
//             sizes="170px"
//             className="object-cover"
//           />
//         </motion.div>
//       ))}

//       <div className="absolute -bottom-8 left-1/2 w-full -translate-x-1/2 text-center text-sm text-purple-100/70">
//         {disabled ? "正在抽牌..." : "牌堆"}
//       </div>
//     </div>
//   );
// }