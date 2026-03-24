import Image from "next/image";
import Container from "@/components/site/container";
import CategoriesSection from "@/components/site/categories-section";

export default function CategoriesPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">

      {/* ✅ 核心：改成 fixed */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/cosmic-bg.webp"
          alt="Background"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* 遮罩（也要 fixed） */}
      <div className="fixed inset-0 -z-10 bg-black/60" />

      {/* 渐变 */}
      <div className="absolute inset-0 bg-linear-to-b from-black/55 via-slate-950/45 to-black/70" />

      {/* 光感 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_34%)]" />

      <div className="relative z-10 py-12 sm:py-16 lg:py-20">
        <Container>
          <div className="mb-10 max-w-3xl rounded-3xl border border-white/10 bg-white/8 p-6 shadow-2xl backdrop-blur-md sm:p-8 lg:p-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/60 sm:text-sm">
              Categories
            </p>

            <h1 className="mb-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              Main Categories
            </h1>

            <p className="max-w-2xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
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