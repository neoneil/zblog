import { ButtonLink } from "@/components/ui/button";

const items = [
  "亲子议题讨论",
  "教学实践分享",
  "创意学习灵感",
  "社区问答沉淀",
];

export default function Circle() {
  return (
    <section className="relative min-h-[230px] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-md)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)] sm:p-6">
      <div className="absolute inset-0 bg-[var(--section-gradient)]" />

      <div className="relative z-10 flex h-full flex-col justify-between gap-5">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-soft)]">
            Community
          </p>

          <h2 className="text-xl font-semibold leading-snug text-[var(--text)] sm:text-2xl">
            早期教育智慧圈
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--text-soft)]">
            为家长与教育者保留一个更安静的讨论空间，用于整理经验、问题与可执行的陪伴方法。
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {items.slice(0, 4).map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[color:var(--card)]/70 px-3 py-2 text-xs font-medium text-[var(--text-soft)]"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--primary)]" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div>
          <ButtonLink href="/circle" variant="secondary" size="sm">
            进入社区
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
