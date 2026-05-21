export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(110,80,180,0.32),transparent_28%),linear-gradient(180deg,#0a0813_0%,#120d22_55%,#0b0815_100%)] text-white">
      <div className="mx-auto flex max-w-5xl flex-col items-center px-6 py-24 text-center">
        <p className="mb-3 text-sm uppercase tracking-[0.35em] text-purple-200/70">
          Premium Access
        </p>

        <h1 className="max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl">
          Tarot AI 需要订阅后才能使用
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-purple-100/75">
          为了提供更高质量的 AI 解读体验、稳定的生成速度与持续维护，
          Tarot AI 功能目前仅对订阅用户开放。
        </p>

        <div className="mt-12 w-full max-w-xl rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur">
          <div className="mb-6">
            <h2 className="text-3xl font-semibold">Premium Plan</h2>

            <div className="mt-4 flex items-end justify-center gap-2">
              <span className="text-6xl font-bold">AUD $99</span>

              <span className="mb-2 text-lg text-purple-100/65">
                一次费用
              </span>
            </div>
          </div>

          <div className="space-y-4 text-left text-purple-100/80">
            <div className="flex items-start gap-3">
              <span className="mt-1 text-green-300">✓</span>
              <span>无限次数 AI 塔罗解读</span>
            </div>

            <div className="flex items-start gap-3">
              <span className="mt-1 text-green-300">✓</span>
              <span>更快的生成速度</span>
            </div>

            <div className="flex items-start gap-3">
              <span className="mt-1 text-green-300">✓</span>
              <span>未来高级功能优先开放</span>
            </div>

            <div className="flex items-start gap-3">
              <span className="mt-1 text-green-300">✓</span>
              <span>持续更新新的 AI 灵性内容</span>
            </div>
          </div>

          <button
            className="mt-10 w-full rounded-2xl bg-white px-6 py-4 text-lg font-semibold text-black transition hover:scale-[1.01] hover:bg-purple-100"
          >
            请联系主办方
          </button>

          <p className="mt-4 text-sm text-purple-100/45">
            订阅后即可立即解锁 Tarot AI 功能。
          </p>
        </div>
      </div>
    </main>
  );
}