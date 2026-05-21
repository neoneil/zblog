import Image from "next/image";
import Container from "@/components/site/container";
import DownloadPdfButton from "@/components/download-pdf-button";

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
      {/* <div className="fixed inset-0 -z-10">
        <Image
          src="/cosmic-bg.webp"
          alt="Background"
          fill
          priority
          className="object-cover"
        />
      </div> */}

      {/* 遮罩 */}
      {/* <div className="fixed inset-0 -z-10 bg-black/60" /> */}

      {/* 渐变 */}
      <div className="absolute inset-0 bg-linear-to-b from-black/55 via-slate-950/45 to-black/70" />

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
            <section className="mx-auto mt-20 max-w-6xl px-6">
  <div className="mb-8">
    <p className="mb-3 text-sm uppercase tracking-[0.35em] text-blue-200/60">
      Premium Astrology Guide
    </p>

    <h2 className="text-4xl font-semibold text-white sm:text-5xl">
      Download the Astrology Book
    </h2>

    <p className="mt-4 max-w-2xl text-lg leading-8 text-white/65">
      Explore planetary houses, birth charts, zodiac energies and deeper
      spiritual interpretations in our premium astrology guide.
    </p>
  </div>

  <DownloadPdfButton>
    <div
      className="
        group relative overflow-hidden
        rounded-[36px]
        border border-white/10
        bg-white/5
        backdrop-blur-xl
        cursor-pointer
      "
    >
      {/* 背景光 */}
      <div
        className="
          absolute inset-0
          bg-[radial-gradient(circle_at_top,rgba(80,140,255,0.28),transparent_55%)]
          opacity-70
          transition duration-700
          group-hover:scale-110
          group-hover:opacity-100
        "
      />

      {/* hover overlay */}
      <div
        className="
          absolute inset-0 z-20
          flex flex-col items-center justify-center
          bg-black/55
          opacity-0
          transition-all duration-500
          group-hover:opacity-100
        "
      >
        <div
          className="
            mb-4 flex h-20 w-20 items-center justify-center
            rounded-full border border-white/20
            bg-white/10 backdrop-blur-md
            transition-all duration-500
            group-hover:scale-110
            group-hover:rotate-6
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v12m0 0 4-4m-4 4-4-4m-5 8h18"
            />
          </svg>
        </div>

        <h3 className="text-3xl font-semibold text-white">
          Download This Book
        </h3>

        <p className="mt-3 text-base text-white/70">
          12,842 downloads
        </p>
      </div>

      {/* 图片 */}
      <div className="relative mx-auto aspect-[3/4] max-w-[340px] overflow-hidden">
        <img
          src="/tarotCover.png"
          alt="Astrology Book Cover"
          className="
            h-full w-full object-cover
            transition-all duration-700
            group-hover:scale-105
            group-hover:brightness-50
          "
        />
      </div>
    </div>
  </DownloadPdfButton>
</section>
          </section>

          {/* Featured */}
          <section className="mb-12 sm:mb-14">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/8 shadow-2xl backdrop-blur-md">
              <div className="p-6">
                <div className="aspect-video w-full overflow-hidden rounded-2xl border border-white/10">
                  {/* <iframe
                    className="h-full w-full"
                    src="https://www.youtube.com/embed/TbQSHxK2Gjg"
                    title="Tarot"
                    allowFullScreen
                  /> */}
                  <iframe
                    width="356"
                    height="634"
                    src="https://www.youtube.com/embed/0_y6wD461BI"
                    title="77"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
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