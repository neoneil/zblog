import Link from "next/link";

const items = [
  "Astrology Parenting Discussions",
  "Teaching Practice Sharing",
  "Creative Learning Ideas",
  "Q&A with the Community",
];

export default function Circle() {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-[#e7c98a]/18 bg-[#120f1f] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.45)] md:min-h-[520px] md:p-10">
      {/* cosmic background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,213,143,0.10),transparent_24%),radial-gradient(circle_at_20%_30%,rgba(196,153,255,0.10),transparent_22%),radial-gradient(circle_at_80%_20%,rgba(255,184,107,0.10),transparent_18%),linear-gradient(180deg,#1a1528_0%,#130f20_42%,#0f0b18_100%)]" />

      {/* soft vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.22)_100%)]" />

      {/* tiny stars */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <span className="absolute left-[8%] top-[14%] h-1 w-1 rounded-full bg-[#fff1c9]" />
        <span className="absolute left-[18%] top-[24%] h-1.5 w-1.5 rounded-full bg-[#f5d28a]" />
        <span className="absolute left-[34%] top-[12%] h-1 w-1 rounded-full bg-white/80" />
        <span className="absolute right-[18%] top-[16%] h-1 w-1 rounded-full bg-[#fff1c9]" />
        <span className="absolute right-[9%] top-[28%] h-1.5 w-1.5 rounded-full bg-[#f5d28a]" />
        <span className="absolute left-[14%] bottom-[20%] h-1 w-1 rounded-full bg-white/70" />
        <span className="absolute right-[24%] bottom-[18%] h-1 w-1 rounded-full bg-[#fff1c9]" />
      </div>

      <div className="relative z-10 flex h-full min-h-[520px] flex-col justify-between">
        <div className="mx-auto flex w-full max-w-[560px] flex-col items-center text-center">
          <h1 className="text-[13px] font-medium tracking-[0.02em] text-[#f3dfb3]/92 md:text-[33px]">
            The Wisdom Circle for Early Childhood
          </h1>

          <div className="mt-5 w-full max-w-[520px] rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] px-6 py-7 backdrop-blur-[2px] md:px-8">
            <p className="mx-auto max-w-[430px] text-[15px] leading-7 text-[#f7edd6]/82 md:text-base">
              A warm and inspiring circle of educators and parents exploring
              childhood wisdom together.
            </p>

            <ul className="mt-6 space-y-3 text-left">
              {items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-[14px] leading-6 text-[#f6e8c7]/85 md:text-[15px]"
                >
                  <span className="mt-[7px] inline-block h-2 w-2 shrink-0 rounded-full bg-[#e8c37a] shadow-[0_0_10px_rgba(232,195,122,0.45)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex justify-center">
              <Link
                href="/circle"
                className="inline-flex items-center justify-center rounded-full border border-[#e9c37a]/35 bg-[linear-gradient(180deg,#d6ab68_0%,#c69658_100%)] px-7 py-3 text-sm font-medium text-[#2b1a0c] shadow-[0_10px_24px_rgba(214,171,104,0.28),inset_0_1px_0_rgba(255,243,214,0.55)] transition-all duration-300 hover:scale-[1.02] hover:brightness-105"
              >
                Join the Circle
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}