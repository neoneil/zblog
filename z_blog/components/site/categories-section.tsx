import Link from "next/link";
import Image from "next/image";
import { categories } from "@/lib/categories";

export default function CategoriesSection() {
  return (
    <section className="mb-14 sm:mb-16">
      <div className="mb-6 sm:mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/60 sm:text-sm">
          Main Categories
        </p>

        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Explore the core themes
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
          Discover the four main directions of the site through ideas on
          children, learning, family education, and teacher reflection.
        </p>
      </div>

      <div className="grid gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
        {categories.map((category) => (
          <div
            key={category.slug}
            className="group relative overflow-hidden rounded-[24px] border border-[rgba(120,88,62,0.28)] shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.22)]"
          >
            {/* Background image */}
            <div className="absolute inset-0">
              <Image
                src={category.backgroundImage}
                alt={`${category.title} background`}
                fill
                className="object-cover object-left-top opacity-90"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>

            {/* Warm paper overlay */}
            {/* <div className="absolute inset-0 bg-[rgba(255,244,230,0.78)]" /> */}

            {/* Soft inner glow */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.22),rgba(255,248,240,0.08))]" />


            <div className="relative z-10 flex h-full flex-col p-5 sm:p-6">
              {/* Icon + heading */}
              <div className="mb-4 flex items-start gap-3">

                <h3 className="mb-4 text-center text-[1.55rem] font-bold leading-tight tracking-tight text-[#2f211b] drop-shadow-[0_1px_1px_rgba(255,255,255,0.18)]">
                  {category.title}
                </h3>
              </div>

              <p className="mb-6 text-center text-[16px] leading-8 text-[#23140f]">
                {category.description}
              </p>

              <div className="mt-auto flex justify-center">
                <Link
                  href={`/categories/${category.slug}`}
                  className={`topic-btn topic-btn-${category.buttonVariant}`}
                >
                  Explore Topics
                  <span className="topic-btn-arrow">›</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}