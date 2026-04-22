
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
            <div className="relative overflow-hidden rounded-[2rem] shadow-2xl">
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
              {/* <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/58 to-transparent" /> */}

              {/* Subtle overall bottom shading */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

              {/* Optional soft glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_28%,rgba(255,255,255,0.06),transparent_26%)]" />

              <div className="relative z-10 flex min-h-[440px] items-center px-5 py-8 sm:px-8 sm:py-10 lg:min-h-[560px] lg:px-12 lg:py-14">
                <div className="max-w-2xl">
                  <p className="mb-3 inline-flex items-center rounded-full border border-white/15 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/75 sm:text-xs">
                    Cosmic Childhood
                  </p>

                  <h1 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-6xl lg:leading-tight">
                    Raising Children with
                    <span className="block text-white/95">
                      Wisdom, Nature and Stars
                    </span>
                  </h1>

                  <p className="mt-4 max-w-xl text-sm leading-7 text-white/80 sm:text-base lg:text-lg">
                    A soulful space for early childhood education, creative
                    learning and astrology parenting.
                  </p>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link
                      href="/posts"
                      className="inline-flex items-center rounded-2xl border border-[#d9a68b]/40 bg-[#c97d67]/85 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:scale-[1.02] hover:bg-[#c26f59]"
                    >
                      Start Reading
                    </Link>

                    <Link
                      href="/categories"
                      className="inline-flex items-center rounded-2xl border border-white/20 bg-[#f2dfca]/90 px-6 py-3 text-sm font-semibold text-[#5a4236] shadow-lg shadow-black/10 transition hover:scale-[1.02] hover:bg-[#f5e7d6]"
                    >
                      Browse Categories
                    </Link>

                    {canManagePosts && (
                      <Link
                        href="/admin/posts/new"
                        className="inline-flex items-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                      >
                        New Post
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <CategoriesSection />

          <section className="w-full py-12">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Circle />
              <Astroplate imageSrc="/astroplate.png" />
            </div>
          </section>

          {/* <section className="rounded-3xl border border-white/10 bg-black/25 p-5 shadow-2xl backdrop-blur-md sm:p-7">
            <div className="mb-6 flex items-center justify-between sm:mb-8">
              <h2 className="text-xl font-semibold text-white sm:text-2xl">
                Latest Posts
              </h2>

              <Link
                href="/posts"
                className="text-sm text-white/70 transition hover:text-white"
              >
                View all →
              </Link>
            </div>

            {!posts || posts.length === 0 ? (
              <p className="text-white/70">No published posts yet.</p>
            ) : (
              <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
                {posts.map((post) => (
                  <article
                    key={post.slug}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-5 shadow-xl backdrop-blur-sm transition duration-300 hover:bg-white/[0.14] hover:shadow-2xl"
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

                    <p className="mb-3 text-sm text-white/60">
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString()
                        : ""}
                    </p>

                    <h3 className="mb-3 text-xl font-semibold leading-tight text-white sm:text-2xl">
                      <Link
                        href={`/posts/${post.slug}`}
                        className="transition hover:underline"
                      >
                        {post.title}
                      </Link>
                    </h3>

                    {post.excerpt && (
                      <p className="mb-5 text-sm leading-7 text-white/75 sm:text-base">
                        {post.excerpt}
                      </p>
                    )}

                    <Link
                      href={`/posts/${post.slug}`}
                      className="text-sm font-medium text-white hover:underline"
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
//       {/* <div className="fixed inset-0 -z-10 bg-black/55" /> */}

//       {/* Extra depth */}
//       <div className="absolute inset-0 bg-linear-to-b from-black/35 via-slate-950/20 to-black/65" />

//       {/* Top spotlight */}
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_36%)]" />

//       {/* Side glow */}
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.10),transparent_26%),radial-gradient(circle_at_80%_30%,rgba(56,189,248,0.08),transparent_24%)]" />

//       {/* Subtle grid / texture */}
//       <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-size-[48px_48px]" />

//       {/* Content */}
//       <div className="relative z-10 pt-4 pb-10 sm:pt-6 sm:pb-12 lg:pt-8 lg:pb-14">
//         <Container>
//           {/* HERO */}
//           <section className="mb-14 sm:mb-16">
//             <div className="relative overflow-hidden rounded-[2rem]">
//               <div className="relative grid items-center gap-8 px-2 py-4 sm:px-2 sm:py-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-4 lg:py-8">
//                 {/* Left text */}
//                 <div className="relative z-10 max-w-2xl">
//                   <p className="mb-3 inline-flex items-center rounded-full border border-white/15 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/75 sm:text-xs">
//                     Cosmic Childhood
//                   </p>

//                   <h1 className="max-w-2xl text-xl font-semibold leading-tight tracking-tight text-white sm:text-2xl lg:text-4xl lg:leading-tight">
//                     Raising Children with
//                     <span className="block text-white/95">
//                       Wisdom, Nature and Stars
//                     </span>
//                   </h1>

//                   <p className="mt-4 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
//                     A soulful space for early childhood education, creative
//                     learning and astrology parenting.
//                   </p>

//                   <div className="mt-7 flex flex-wrap gap-3">
//                     <Link
//                       href="/posts"
//                       className="inline-flex items-center rounded-2xl border border-[#d9a68b]/40 bg-[#c97d67]/85 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:scale-[1.02] hover:bg-[#c26f59]"
//                     >
//                       Start Reading
//                     </Link>

//                     <Link
//                       href="/categories"
//                       className="inline-flex items-center rounded-2xl border border-white/20 bg-[#f2dfca]/90 px-6 py-3 text-sm font-semibold text-[#5a4236] shadow-lg shadow-black/10 transition hover:scale-[1.02] hover:bg-[#f5e7d6]"
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
//                       className="hero-fade-image h-auto w-full object-contain drop-shadow-2xl"
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

//           <section className="rounded-3xl border border-white/10 bg-black/25 p-5 shadow-2xl backdrop-blur-md sm:p-7">
//             <div className="mb-6 flex items-center justify-between sm:mb-8">
//               <h2 className="text-xl font-semibold text-white sm:text-2xl">
//                 Latest Posts
//               </h2>

//               <Link
//                 href="/posts"
//                 className="text-sm text-white/70 transition hover:text-white"
//               >
//                 View all →
//               </Link>
//             </div>

//             {!posts || posts.length === 0 ? (
//               <p className="text-white/70">No published posts yet.</p>
//             ) : (
//               <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
//                 {posts.map((post) => (
//                   <article
//                     key={post.slug}
//                     className="overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-5 shadow-xl backdrop-blur-sm transition duration-300 hover:bg-white/[0.14] hover:shadow-2xl"
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

//                     <p className="mb-3 text-sm text-white/60">
//                       {post.published_at
//                         ? new Date(post.published_at).toLocaleDateString()
//                         : ""}
//                     </p>

//                     <h3 className="mb-3 text-xl font-semibold leading-tight text-white sm:text-2xl">
//                       <Link
//                         href={`/posts/${post.slug}`}
//                         className="transition hover:underline"
//                       >
//                         {post.title}
//                       </Link>
//                     </h3>

//                     {post.excerpt && (
//                       <p className="mb-5 text-sm leading-7 text-white/75 sm:text-base">
//                         {post.excerpt}
//                       </p>
//                     )}

//                     <Link
//                       href={`/posts/${post.slug}`}
//                       className="text-sm font-medium text-white hover:underline"
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
//                         className="inline-flex items-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
//                       >
//                         Write Post
//                       </Link>
//                     )} */}