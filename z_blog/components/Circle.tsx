import Link from "next/link";

const items = [
  "Astrology Parenting Discussions",
  "Teaching Practice Sharing",
  "Creative Learning Ideas",
  "Q&A with the Community",
];

export default function Circle() {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--card-soft)] p-8 shadow-[var(--shadow-md)] md:min-h-[520px] md:p-10">
      {/* cosmic background glow */}
      <div className="absolute inset-0 bg-[var(--bg-soft)]" />

      {/* soft vignette */}
      <div className="absolute inset-0 bg-[var(--bg-soft)]" />

      {/* tiny stars */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <span className="absolute left-[8%] top-[14%] h-1 w-1 rounded-full bg-[var(--card-soft)]" />
        <span className="absolute left-[18%] top-[24%] h-1.5 w-1.5 rounded-full bg-[var(--card-soft)]" />
        <span className="absolute left-[34%] top-[12%] h-1 w-1 rounded-full bg-[var(--card-muted)]0" />
        <span className="absolute right-[18%] top-[16%] h-1 w-1 rounded-full bg-[var(--card-soft)]" />
        <span className="absolute right-[9%] top-[28%] h-1.5 w-1.5 rounded-full bg-[var(--card-soft)]" />
        <span className="absolute left-[14%] bottom-[20%] h-1 w-1 rounded-full bg-[color:var(--card)]/90" />
        <span className="absolute right-[24%] bottom-[18%] h-1 w-1 rounded-full bg-[var(--card-soft)]" />
      </div>

      <div className="relative z-10 flex h-full min-h-[520px] flex-col justify-between">
        <div className="mx-auto flex w-full max-w-[560px] flex-col items-center text-center">
          <h1 className="text-[13px] font-medium tracking-[0.02em] text-[var(--primary)] md:text-[33px]">
            The Wisdom Circle for Early Childhood
          </h1>

          <div className="mt-5 w-full max-w-[520px] rounded-[28px] border border-[var(--border)] bg-[var(--bg-soft)] px-6 py-7 backdrop-blur-[2px] md:px-8">
            <p className="mx-auto max-w-[430px] text-[15px] leading-7 text-[var(--primary)] md:text-base">
              A warm and inspiring circle of educators and parents exploring
              childhood wisdom together.
            </p>

            <ul className="mt-6 space-y-3 text-left">
              {items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-[14px] leading-6 text-[var(--primary)] md:text-[15px]"
                >
                  <span className="mt-[7px] inline-block h-2 w-2 shrink-0 rounded-full bg-[var(--card-soft)] shadow-[var(--shadow-md)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex justify-center">
              <Link
                href="/circle"
                className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-soft)] px-7 py-3 text-sm font-medium text-[var(--primary)] shadow-[var(--shadow-md)] transition-all duration-300 hover:scale-[1.02] hover:brightness-105"
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