import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/site/container";

type PostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function getPostBySlug(rawSlug: string) {
  const slug = decodeURIComponent(rawSlug).trim();
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select(
      "id, title, slug, excerpt, content, cover_image, published_at, created_at, status"
    )
    .eq("status", "published")
    .eq("slug", slug)
    .single();

  return post;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

export async function generateMetadata(
  { params }: PostPageProps
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested post could not be found.",
    };
  }

  const description =
    post.excerpt ||
    post.content.slice(0, 160) ||
    "Read this article on My Blog.";

  const url = `${siteUrl}/posts/${post.slug}`;

  return {
    title: post.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
    },
  };
}

export default async function PostDetailPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* ✅ 背景 */}
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
      <div className="absolute inset-0 bg-linear-to-b from-black/55 via-slate-950/45 to-black/80" />

      {/* 光感 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_35%)]" />

      <div className="relative z-10 py-12 sm:py-16 lg:py-20">
        <Container>
          <article className="mx-auto max-w-3xl">
            
            {/* 标题区 */}
            <div className="mb-8 rounded-3xl border border-white/10 bg-white/8 p-6 shadow-2xl backdrop-blur-md sm:p-8">
              <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
                {post.title}
              </h1>

              <p className="text-sm text-white/60">
                {post.published_at
                  ? new Date(post.published_at).toLocaleDateString()
                  : new Date(post.created_at).toLocaleDateString()}
              </p>
            </div>

            {/* 封面 */}
            {post.cover_image && (
              <div className="mb-8 overflow-hidden rounded-2xl border border-white/10">
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="w-full object-cover"
                />
              </div>
            )}

            {/* 摘要 */}
            {post.excerpt && (
              <div className="mb-8 rounded-2xl border border-white/10 bg-white/8 p-5 backdrop-blur-md">
                <p className="text-white/80">{post.excerpt}</p>
              </div>
            )}

            {/* 正文（关键：反色） */}
            <div className="prose prose-invert prose-lg max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </article>
        </Container>
      </div>
    </main>
  );
}
// import type { Metadata } from "next";
// import { notFound } from "next/navigation";
// import { createClient } from "@/lib/supabase/server";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import rehypeRaw from "rehype-raw";
// import Link from "next/link";
// type PostPageProps = {
//   params: Promise<{
//     slug: string;
//   }>;
// };

// async function getPostBySlug(rawSlug: string) {
//   const slug = decodeURIComponent(rawSlug).trim();
//   const supabase = await createClient();

//   const { data: post, error } = await supabase
//     .from("posts")
//     .select("id, title, slug, excerpt, content, cover_image, published_at, created_at, status")
//     .eq("status", "published")
//     .eq("slug", slug)
//     .single();

//   return post;
// }

// const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!

// export async function generateMetadata(
//   { params }: PostPageProps
// ): Promise<Metadata> {

//   const { slug } = await params
//   const post = await getPostBySlug(slug)

//   if (!post) {
//     return {
//       title: "Post Not Found",
//       description: "The requested post could not be found."
//     }
//   }

//   const description =
//     post.excerpt ||
//     post.content.slice(0, 160) ||
//     "Read this article on My Blog."

//   const url = `${siteUrl}/posts/${post.slug}`

//   return {
//     title: post.title,
//     description,

//     alternates: {
//       canonical: url
//     },

//     openGraph: {
//       title: post.title,
//       description,
//       type: "article",
//       url
//     },

//     twitter: {
//       card: "summary_large_image",
//       title: post.title,
//       description
//     }
//   }
// }


// export default async function PostDetailPage({ params }: PostPageProps) {
//   const { slug } = await params;
//   const post = await getPostBySlug(slug);

//   if (!post) {
//     notFound();
//   }

//   return (
//     <main className="mx-auto max-w-3xl px-6 py-12">
//       <article>
//         <h1 className="mb-4 text-4xl font-bold">{post.title}</h1>

//         <p className="mb-8 text-sm text-gray-500">
//           {post.published_at
//             ? new Date(post.published_at).toLocaleDateString()
//             : new Date(post.created_at).toLocaleDateString()}
//         </p>
//             {post.cover_image && (
//                     <Link href={`/posts/${post.slug}`}>
//                       <img
//                         src={post.cover_image}
//                         alt={post.title}
//                         className="aspect-video w-full object-cover rounded-sm mb-6"
//                       />
//                     </Link>
//                   )}
//         {post.excerpt && (
//           <p className="mb-6 text-lg text-gray-700">{post.excerpt}</p>
//         )}


//         <div className="prose prose-lg max-w-none">
//           <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
//             {post.content}
//           </ReactMarkdown>
//         </div>

//         {/* <div className="prose max-w-none whitespace-pre-wrap">
//           {post.content}
//         </div> */}
//       </article>
//     </main>
//   );
// }












































// import { notFound } from "next/navigation";
// import { createClient } from "@/lib/supabase/server";

// type PostPageProps = {
//   params: Promise<{
//     slug: string;
//   }>;
// };

// export default async function PostDetailPage({ params }: PostPageProps) {
//   const { slug } = await params;
//   const supabase = await createClient();

//   const { data: post, error } = await supabase
//     .from("posts")
//     .select("id, title, slug, excerpt, content, published_at, created_at")
//     .eq("slug", slug)
//     .eq("status", "published")
//     .single();

//   if (error || !post) {
//     notFound();
//   }

//   return (
//     <main className="mx-auto max-w-3xl px-6 py-12">
//       <article>
//         <h1 className="mb-4 text-4xl font-bold">{post.title}</h1>

//         <p className="mb-8 text-sm text-gray-500">
//           {post.published_at
//             ? new Date(post.published_at).toLocaleDateString()
//             : new Date(post.created_at).toLocaleDateString()}
//         </p>

//         {post.excerpt && (
//           <p className="mb-6 text-lg text-gray-700">{post.excerpt}</p>
//         )}

//         <div className="prose max-w-none whitespace-pre-wrap">
//           {post.content}
//         </div>
//       </article>
//     </main>
//   );
// }