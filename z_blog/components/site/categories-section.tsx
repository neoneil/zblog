import Link from "next/link";
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
          Discover the four main directions of the site through ideas on children,
          learning, emotion, and imagination.
        </p>
      </div>

      <div className="grid gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}`}
            className="group rounded-3xl border border-white/10 bg-white/8 p-6 shadow-xl backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/12 hover:shadow-2xl"
          >
            <div className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white/60">
              Category
            </div>

            <h3 className="mb-3 text-xl font-semibold leading-tight text-white transition group-hover:text-white/95">
              {category.title}
            </h3>

            <p className="mb-5 text-sm leading-7 text-white/70">
              {category.description}
            </p>

            <span className="text-sm font-medium text-white/85 transition group-hover:text-white">
              Explore →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}