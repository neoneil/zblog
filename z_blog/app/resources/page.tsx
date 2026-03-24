import Image from "next/image";
import Container from "@/components/site/container";

const videos = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  title: `Tarot Learning Resource ${index + 1}`,
  description:
    "A practical video resource for learning tarot card meanings, patterns, and intuitive reading structure.",
  embedUrl: "https://www.youtube.com/embed/TbQSHxK2Gjg",
}));

export default function ResourcesPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* ✅ 核心：fixed 背景 */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/cosmic-bg.webp"
          alt="Background"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* 遮罩 */}
      <div className="fixed inset-0 -z-10 bg-black/60" />

      {/* 渐变 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-slate-950/45 to-black/70" />

      {/* 光感 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_34%)]" />

      <div className="relative z-10 py-12 sm:py-16 lg:py-20">
        <Container>
          {/* Hero */}
          <section className="mb-12 sm:mb-14">
            <div className="max-w-4xl rounded-3xl border border-white/10 bg-white/8 p-6 shadow-2xl backdrop-blur-md sm:p-8 lg:p-10">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/60 sm:text-sm">
                Resources
              </p>

              <h1 className="mb-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                Learning resources for reflection, study, and imagination
              </h1>

              <p className="max-w-3xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
                A curated resource space for useful videos, ideas, and study
                materials.
              </p>
            </div>
          </section>

          {/* Featured */}
          <section className="mb-12 sm:mb-14">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/8 shadow-2xl backdrop-blur-md">
              <div className="p-6">
                <div className="aspect-video w-full overflow-hidden rounded-2xl border border-white/10">
                  <iframe
                    className="h-full w-full"
                    src="https://www.youtube.com/embed/TbQSHxK2Gjg"
                    title="Tarot"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Grid */}
          <section>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {videos.map((video) => (
                <article
                  key={video.id}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-xl backdrop-blur-sm transition hover:-translate-y-1 hover:bg-white/[0.14]"
                >
                  <div className="aspect-video w-full overflow-hidden border-b border-white/10">
                    <iframe
                      className="h-full w-full"
                      src={video.embedUrl}
                      title={video.title}
                      allowFullScreen
                    />
                  </div>

                  <div className="p-5">
                    <h3 className="text-white font-semibold">
                      {video.title}
                    </h3>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </Container>
      </div>
    </main>
  );
}