
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { DrawnTarotCard } from "@/types/tarot";
import { tarotCardBack } from "@/lib/tarot/full-deck";

type TarotCardProps = {
  card: DrawnTarotCard;
  index: number;
  revealed: boolean;
  layoutId?: string;
};

const positionLabel = {
  past: "过去",
  present: "现在",
  future: "未来",
};

export default function TarotCard({
  card,
  index,
  revealed,
  layoutId,
}: TarotCardProps) {
  return (
    <motion.div
      layoutId={layoutId}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: index * 0.08,
        ease: "easeOut",
      }}
      className="relative w-[170px] sm:w-[180px]"
    >
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--card-soft)] p-4 shadow-[var(--shadow-md)]">
        <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.25em] text-[var(--primary)]">
          <span>{positionLabel[card.position]}</span>
          <span>{revealed ? (card.reversed ? "逆位" : "正位") : "待翻开"}</span>
        </div>

        <motion.div
          animate={{ rotateY: revealed ? 180 : 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative aspect-[2/3] w-full"
        >
          {/* card back */}
          <div
            className="absolute inset-0 overflow-hidden rounded-[18px] border border-[var(--border)] bg-[var(--card-muted)]"
            style={{ backfaceVisibility: "hidden" }}
          >
            <Image
              src={encodeURI(tarotCardBack)}
              alt="Tarot card back"
              fill
              sizes="(max-width: 640px) 170px, 180px"
              className="object-cover"
            />
          </div>

          {/* card face */}
          <div
            className="absolute inset-0 overflow-hidden rounded-[18px] border border-[var(--border)] bg-[var(--card-muted)]"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div
              className={`relative h-full w-full ${
                card.reversed ? "rotate-180" : ""
              }`}
            >
              <Image
                src={encodeURI(card.imageSrc)}
                alt={card.nameCn}
                fill
                sizes="(max-width: 640px) 170px, 180px"
                className="object-cover"
              />
            </div>
          </div>
        </motion.div>

        <div className="mt-3 text-center">
          <div className="text-base font-semibold text-[var(--text)]">
            {revealed ? card.nameCn : "已选卡牌"}
          </div>
          <div className="mt-1 text-xs text-[var(--text-soft)]">
            {revealed ? card.name : "等待翻开"}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
// "use client";

// import Image from "next/image";
// import { motion } from "framer-motion";
// import type { DrawnTarotCard } from "@/types/tarot";

// type TarotCardProps = {
//   card: DrawnTarotCard;
//   index: number;
// };

// const positionLabel = {
//   past: "过去",
//   present: "现在",
//   future: "未来",
// };

// export default function TarotCard({ card, index }: TarotCardProps) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 50, rotate: -4 }}
//       animate={{ opacity: 1, y: 0, rotate: 0 }}
//       transition={{
//         duration: 0.55,
//         delay: index * 0.18,
//         ease: "easeOut",
//       }}
//       className="relative w-[170px] sm:w-[190px]"
//     >
//       <div className="rounded-3xl border border-[var(--border)] bg-[var(--card-soft)] p-4 shadow-[var(--shadow-md)]">
//         <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.25em] text-[var(--primary)]">
//           <span>{positionLabel[card.position]}</span>
//           <span>{card.reversed ? "逆位" : "正位"}</span>
//         </div>

//         <div className="relative aspect-[2/3] overflow-hidden rounded-[18px] border border-[var(--border)] bg-[var(--card-muted)]">
//           <div
//             className={`relative h-full w-full transition-transform duration-500 ${
//               card.reversed ? "rotate-180" : ""
//             }`}
//           >
//             <Image
//               src={encodeURI(card.imageSrc)}
//               alt={card.nameCn}
//               fill
//               sizes="(max-width: 640px) 170px, 190px"
//               className="object-cover"
//             />
//           </div>
//         </div>

//         <div className="mt-3 text-center">
//           <div className="text-base font-semibold text-[var(--text)]">
//             {card.nameCn}
//           </div>
//           <div className="mt-1 text-xs text-[var(--text-soft)]">{card.name}</div>
//         </div>
//       </div>
//     </motion.div>
//   );
// }