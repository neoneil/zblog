import Container from "@/components/site/container";
import CategoriesSection from "@/components/site/categories-section";

export default function CategoriesPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">

      {/* ✅ 核心：改成 fixed */}
      {/* <div className="fixed inset-0 -z-10">
        <Image
          src="/cosmic-bg.webp"
          alt="背景"
          fill
          priority
          className="object-cover"
        />
      </div> */}

      {/* 遮罩（也要 fixed） */}
      {/* <div className="fixed inset-0 -z-10 bg-[color:var(--bg)]/80" /> */}

      {/* 渐变 */}
      <div className="absolute inset-0 bg-linear-to-b from-[var(--bg-soft)] via-[var(--card-muted)] to-[var(--bg-soft)]" />

      {/* 光感 */}
      <div className="absolute inset-0 bg-[var(--bg-soft)]" />

      <div className="relative z-10 py-12 sm:py-16 lg:py-20">
        <Container>
          <div className="mb-10 max-w-3xl rounded-3xl border border-[var(--border)] bg-[var(--card-muted)] p-6 shadow-[var(--shadow-lg)] backdrop-blur-md sm:p-8 lg:p-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-soft)] sm:text-sm">
              circle
            </p>

            <h1 className="mb-5 text-3xl font-bold leading-tight tracking-tight text-[var(--text)] sm:text-4xl lg:text-5xl">
              circle
            </h1>

            <p className="max-w-2xl text-base leading-7 text-[var(--text-soft)] sm:text-lg sm:leading-8">
              Browse the four main themes of Cosmic Childhood and explore the ideas
              that shape this space.
            </p>
          </div>

          <CategoriesSection />
        </Container>
      </div>
    </main>
  );
}
