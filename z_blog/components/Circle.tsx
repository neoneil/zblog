import Link from "next/link";

export default function Circle() {
  return (
    <div className="relative flex h-full min-h-[520px] flex-col justify-between overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-sm md:p-10">
      <div className="space-y-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
          Circle
        </p>

        <div className="space-y-4">
          <h2 className="text-3xl font-semibold leading-tight text-white/85 md:text-4xl">
            Your cosmic circle
          </h2>

          <p className="max-w-xl text-base leading-8 text-white/45">
            This area is reserved for your future content. For now, keep the
            text light, airy, and transparent so the whole section feels soft
            and dreamy.
          </p>

          <p className="max-w-xl text-sm leading-7 text-white/35">
            You can later replace this with your own astrology introduction,
            service explanation, or any emotional brand message you want.
          </p>
        </div>
      </div>

            <div className="relative flex h-full items-end justify-center p-8 md:p-0">
                <Link
                    href="#"
                    className="topic-btn-green inline-flex min-w-[360px] items-center justify-center rounded-full px-8 py-3 text-sm font-medium text-white transition-all duration-300"
                >
                    Explore the circle
                </Link>
            </div>
    </div>
  );
}