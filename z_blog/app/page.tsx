
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import Container from "@/components/site/container";
import CategoriesSection from "@/components/site/categories-section";
import Circle from "@/components/Circle";
import Astroplate from "@/components/Astroplate";
import ParentingLabSection from "@/components/ParentingLabSection";
export default async function HomePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    role = profile?.role ?? null;
  }

  const canManagePosts = role === "admin" || role === "editor";

  const { data: posts } = await supabase
    .from("posts")
    .select("title, slug, excerpt, published_at, cover_image")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(6);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Content */}
      <div className="relative z-10 pt-4 pb-10 sm:pt-6 sm:pb-12 lg:pt-8 lg:pb-14">
        <Container>
          {/* HERO */}
          <section className="mb-14 sm:mb-16">
            <div className="relative overflow-hidden rounded-[2rem] shadow-[var(--shadow-lg)]">
              {/* Background image */}
              <div
                className="absolute inset-0"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)",
                  WebkitMaskComposite: "source-in",
                  maskImage:
                    "linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)",
                  maskComposite: "intersect",
                }}
              >
                <Image
                  src="/hero.png"
                  alt="Hero background"
                  fill
                  priority
                  className="object-cover"
                />
              </div>

              {/* Left dark gradient for text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-[rgba(32,26,20,0.72)] via-[rgba(32,26,20,0.38)] to-transparent" />

              {/* Subtle overall bottom shading */}
              <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--bg-soft)]/70 via-transparent to-transparent" />

              {/* Optional soft glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_28%,var(--primary-soft),transparent_32%)] opacity-35" />

              <div className="relative z-10 flex min-h-[440px] items-center px-5 py-8 sm:px-8 sm:py-10 lg:min-h-[560px] lg:px-12 lg:py-14">
                <div className="max-w-2xl">
                  <p className="mb-3 inline-flex items-center rounded-full border border-[color:var(--text-inverse)]/45 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--text-white)] sm:text-xs">
                    Cosmic Childhood
                  </p>

                  <h1 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-[var(--text-white)] sm:text-4xl lg:text-6xl lg:leading-tight">
                    Raising Children with
                    <span className="block text-[var(--text-white)]">
                      Wisdom, Nature and Stars
                    </span>
                  </h1>

                  <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--text-white)] sm:text-base lg:text-lg">
                    A soulful space for early childhood education, creative
                    learning and astrology parenting.
                  </p>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link
                      href="/posts"
                      className="inline-flex items-center rounded-2xl border border-[var(--border)] bg-[var(--card-soft)] px-6 py-3 text-sm font-semibold text-[var(--text-white)] shadow-[var(--shadow-sm)] shadow-black/20 transition hover:scale-[1.02] hover:bg-[var(--card-soft)]"
                    >
                      Start Reading
                    </Link>

                    <Link
                      href="/categories"
                      className="inline-flex items-center rounded-2xl border border-[var(--border)] bg-[var(--card-soft)] px-6 py-3 text-sm font-semibold text-[var(--text-white)] shadow-(--shadow-sm) transition hover:scale-[1.02] hover:bg-[var(--card-soft)]"
                    >
                      Browse Categories
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <CategoriesSection />

          <section className="w-full py-12">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Circle />
              <Astroplate imageSrc="/astroplate3.png" />
            </div>
          </section>

          {/* <section className="rounded-3xl border border-[var(--border)] bg-[color:var(--bg)]/80 p-5 shadow-[var(--shadow-lg)] backdrop-blur-md sm:p-7">
            <div className="mb-6 flex items-center justify-between sm:mb-8">
              <h2 className="text-xl font-semibold text-[var(--text)] sm:text-2xl">
                Latest Posts
              </h2>

              <Link
                href="/posts"
                className="text-sm text-[var(--text-soft)] transition hover:text-[var(--text)]"
              >
                View all →
              </Link>
            </div>

            {!posts || posts.length === 0 ? (
              <p className="text-[var(--text-soft)]">No published posts yet.</p>
            ) : (
              <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
                {posts.map((post) => (
                  <article
                    key={post.slug}
                    className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card-muted)] p-5 shadow-[var(--shadow-md)] backdrop-blur-sm transition duration-300 hover:bg-[var(--card-soft)] hover:shadow-[var(--shadow-lg)]"
                  >
                    {post.cover_image && (
                      <Link href={`/posts/${post.slug}`}>
                        <img
                          src={post.cover_image}
                          alt={post.title}
                          className="mb-4 aspect-video w-full rounded-xl object-cover"
                        />
                      </Link>
                    )}

                    <p className="mb-3 text-sm text-[var(--text-soft)]">
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString()
                        : ""}
                    </p>

                    <h3 className="mb-3 text-xl font-semibold leading-tight text-[var(--text)] sm:text-2xl">
                      <Link
                        href={`/posts/${post.slug}`}
                        className="transition hover:underline"
                      >
                        {post.title}
                      </Link>
                    </h3>

                    {post.excerpt && (
                      <p className="mb-5 text-sm leading-7 text-[var(--text-soft)] sm:text-base">
                        {post.excerpt}
                      </p>
                    )}

                    <Link
                      href={`/posts/${post.slug}`}
                      className="text-sm font-medium text-[var(--text)] hover:underline"
                    >
                      Read article →
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </section> */}
          <ParentingLabSection />
        </Container>
      </div>
    </main>
  );
}

// import Link from "next/link";  // 原版
// import Image from "next/image";
// import { createClient } from "@/lib/supabase/server";
// import Container from "@/components/site/container";
// import CategoriesSection from "@/components/site/categories-section";
// import Circle from "@/components/Circle";
// import Astroplate from "@/components/Astroplate";
// export default async function HomePage() {
//   const supabase = await createClient();

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   let role: string | null = null;

//   if (user) {
//     const { data: profile } = await supabase
//       .from("profiles")
//       .select("role")
//       .eq("id", user.id)
//       .single();

//     role = profile?.role ?? null;
//   }

//   const canManagePosts = role === "admin" || role === "editor";

//   const { data: posts } = await supabase
//     .from("posts")
//     .select("title, slug, excerpt, published_at, cover_image")
//     .eq("status", "published")
//     .order("published_at", { ascending: false })
//     .limit(6);

//   return (
//     <main className="relative min-h-screen overflow-hidden">
//       {/* Background image */}
//       {/* <div className="fixed inset-0 -z-10">
//         <Image
//           src="/cosmic-bg.webp"
//           alt="Cosmic background"
//           fill
//           priority
//           className="object-cover"
//         />
//       </div> */}

//       {/* Background darkening */}
//       {/* <div className="fixed inset-0 -z-10 bg-[color:var(--bg)]/80" /> */}

//       {/* Extra depth */}
//       <div className="absolute inset-0 bg-linear-to-b from-black/35 via-slate-950/20 to-black/65" />

//       {/* Top spotlight */}
//       <div className="absolute inset-0 bg-[var(--bg-soft)]" />

//       {/* Side glow */}
//       <div className="absolute inset-0 bg-[var(--bg-soft)]" />

//       {/* Subtle grid / texture */}
//       <div className="absolute inset-0 opacity-[0.04] bg-[var(--bg-soft)] bg-size-[48px_48px]" />

//       {/* Content */}
//       <div className="relative z-10 pt-4 pb-10 sm:pt-6 sm:pb-12 lg:pt-8 lg:pb-14">
//         <Container>
//           {/* HERO */}
//           <section className="mb-14 sm:mb-16">
//             <div className="relative overflow-hidden rounded-[2rem]">
//               <div className="relative grid items-center gap-8 px-2 py-4 sm:px-2 sm:py-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-4 lg:py-8">
//                 {/* Left text */}
//                 <div className="relative z-10 max-w-2xl">
//                   <p className="mb-3 inline-flex items-center rounded-full border border-[var(--border)] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--text-soft)] sm:text-xs">
//                     Cosmic Childhood
//                   </p>

//                   <h1 className="max-w-2xl text-xl font-semibold leading-tight tracking-tight text-[var(--text)] sm:text-2xl lg:text-4xl lg:leading-tight">
//                     Raising Children with
//                     <span className="block text-[var(--text)]">
//                       Wisdom, Nature and Stars
//                     </span>
//                   </h1>

//                   <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--text-soft)] sm:text-base">
//                     A soulful space for early childhood education, creative
//                     learning and astrology parenting.
//                   </p>

//                   <div className="mt-7 flex flex-wrap gap-3">
//                     <Link
//                       href="/posts"
//                       className="inline-flex items-center rounded-2xl border border-[var(--border)] bg-[var(--card-soft)] px-6 py-3 text-sm font-semibold text-[var(--text)] shadow-[var(--shadow-sm)] shadow-black/20 transition hover:scale-[1.02] hover:bg-[var(--card-soft)]"
//                     >
//                       Start Reading
//                     </Link>

//                     <Link
//                       href="/categories"
//                       className="inline-flex items-center rounded-2xl border border-[var(--border)] bg-[var(--card-soft)] px-6 py-3 text-sm font-semibold text-[var(--primary)] shadow-[var(--shadow-sm)] shadow-[var(--shadow-sm)] transition hover:scale-[1.02] hover:bg-[var(--card-soft)]"
//                     >
//                       Browse Categories
//                     </Link>
//                   </div>
//                 </div>

//                 {/* Right image */}
//                 <div className="relative z-10 -ml-8 lg:-ml-40">
//                   <div className="relative mx-auto aspect-[3/2] w-full max-w-[500px] overflow-hidden">
//                     <Image
//                       src="/heromom.png"
//                       alt="family"
//                       width={620}
//                       height={900}
//                       className="hero-fade-image h-auto w-full object-contain drop-shadow-[var(--shadow-lg)]"
//                     />
//                     {/* <Image
//                       src="/heromom.png"
//                       alt="Mother and two children learning together"
//                       fill
//                       priority
//                       className="object-contain object-bottom"
//                     /> */}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>

//           <CategoriesSection />
//           <section className="w-full py-12">
//             <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//               <Circle />
//               <Astroplate imageSrc="/astroplate.png" />
//             </div>
//           </section>

//           <section className="rounded-3xl border border-[var(--border)] bg-[color:var(--bg)]/80 p-5 shadow-[var(--shadow-lg)] backdrop-blur-md sm:p-7">
//             <div className="mb-6 flex items-center justify-between sm:mb-8">
//               <h2 className="text-xl font-semibold text-[var(--text)] sm:text-2xl">
//                 Latest Posts
//               </h2>

//               <Link
//                 href="/posts"
//                 className="text-sm text-[var(--text-soft)] transition hover:text-[var(--text)]"
//               >
//                 View all →
//               </Link>
//             </div>

//             {!posts || posts.length === 0 ? (
//               <p className="text-[var(--text-soft)]">No published posts yet.</p>
//             ) : (
//               <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
//                 {posts.map((post) => (
//                   <article
//                     key={post.slug}
//                     className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card-muted)] p-5 shadow-[var(--shadow-md)] backdrop-blur-sm transition duration-300 hover:bg-[var(--card-soft)] hover:shadow-[var(--shadow-lg)]"
//                   >
//                     {post.cover_image && (
//                       <Link href={`/posts/${post.slug}`}>
//                         <img
//                           src={post.cover_image}
//                           alt={post.title}
//                           className="mb-4 aspect-video w-full rounded-xl object-cover"
//                         />
//                       </Link>
//                     )}

//                     <p className="mb-3 text-sm text-[var(--text-soft)]">
//                       {post.published_at
//                         ? new Date(post.published_at).toLocaleDateString()
//                         : ""}
//                     </p>

//                     <h3 className="mb-3 text-xl font-semibold leading-tight text-[var(--text)] sm:text-2xl">
//                       <Link
//                         href={`/posts/${post.slug}`}
//                         className="transition hover:underline"
//                       >
//                         {post.title}
//                       </Link>
//                     </h3>

//                     {post.excerpt && (
//                       <p className="mb-5 text-sm leading-7 text-[var(--text-soft)] sm:text-base">
//                         {post.excerpt}
//                       </p>
//                     )}

//                     <Link
//                       href={`/posts/${post.slug}`}
//                       className="text-sm font-medium text-[var(--text)] hover:underline"
//                     >
//                       Read article →
//                     </Link>
//                   </article>
//                 ))}
//               </div>
//             )}
//           </section>
//         </Container>
//       </div>
//     </main>
//   );
// }



// {/* {canManagePosts && (
//                       <Link
//                         href="/admin/posts/new"
//                         className="inline-flex items-center rounded-2xl border border-[var(--border)] bg-[var(--card-muted)] px-6 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--card-muted)]"
//                       >
//                         Write Post
//                       </Link>
//                     )} */}
