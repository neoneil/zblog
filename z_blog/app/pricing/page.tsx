export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-soft)] text-[var(--text)]">
      <div className="mx-auto flex max-w-5xl flex-col items-center px-6 py-24 text-center">
        <p className="mb-3 text-sm uppercase tracking-[0.35em] text-[var(--primary)]">
          Premium Access
        </p>

        <h1 className="max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl">
          Tarot AI 需要订阅后才能使用
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--text-soft)]">
          为了提供更高质量的 AI 解读体验、稳定的生成速度与持续维护，
          Tarot AI 功能目前仅对订阅用户开放。
        </p>

        <div className="mt-12 w-full max-w-xl rounded-[32px] border border-[var(--border)] bg-[var(--card-soft)] p-8 backdrop-blur">
          <div className="mb-6">
            <h2 className="text-3xl font-semibold">高级方案</h2>

            <div className="mt-4 flex items-end justify-center gap-2">
              <span className="text-6xl font-bold">AUD $99</span>

              <span className="mb-2 text-lg text-[var(--text)]/65">
                一次费用
              </span>
            </div>
          </div>

          <div className="space-y-4 text-left text-[var(--text-soft)]">
            <div className="flex items-start gap-3">
              <span className="mt-1 text-[var(--success)]">✓</span>
              <span>无限次数 AI 塔罗解读</span>
            </div>

            <div className="flex items-start gap-3">
              <span className="mt-1 text-[var(--success)]">✓</span>
              <span>更快的生成速度</span>
            </div>

            <div className="flex items-start gap-3">
              <span className="mt-1 text-[var(--success)]">✓</span>
              <span>未来高级功能优先开放</span>
            </div>

            <div className="flex items-start gap-3">
              <span className="mt-1 text-[var(--success)]">✓</span>
              <span>持续更新新的 AI 灵性内容</span>
            </div>
          </div>

          <button
            className="mt-10 w-full rounded-2xl bg-[var(--card)] px-6 py-4 text-lg font-semibold text-[var(--text)] transition hover:scale-[1.01] hover:bg-[var(--primary-soft)]"
          >
            请联系主办方
          </button>

          <p className="mt-4 text-sm text-[var(--text-faint)]">
            订阅后即可立即解锁 Tarot AI 功能。
          </p>
        </div>
      </div>
    </main>
  );
}