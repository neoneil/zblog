
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
type PostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function getPostBySlug(slug: string) {
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, content, published_at, created_at")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  return post;
}


const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!

export async function generateMetadata(
  { params }: PostPageProps
): Promise<Metadata> {

  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested post could not be found."
    }
  }

  const description =
    post.excerpt ||
    post.content.slice(0, 160) ||
    "Read this article on My Blog."

  const url = `${siteUrl}/posts/${post.slug}`

  return {
    title: post.title,
    description,

    alternates: {
      canonical: url
    },

    openGraph: {
      title: post.title,
      description,
      type: "article",
      url
    },

    twitter: {
      card: "summary_large_image",
      title: post.title,
      description
    }
  }
}

// export async function generateMetadata(
//   { params }: PostPageProps
// ): Promise<Metadata> {
//   const { slug } = await params;
//   const post = await getPostBySlug(slug);

//   if (!post) {
//     return {
//       title: "Post Not Found",
//       description: "The requested post could not be found.",
//     };
//   }

//   const description =
//     post.excerpt ||
//     post.content.slice(0, 160) ||
//     "Read this article on My Blog.";

//   return {
//     title: post.title,
//     description,
//     openGraph: {
//       title: post.title,
//       description,
//       type: "article",
//       url: `/posts/${post.slug}`,
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: post.title,
//       description,
//     },
//   };
// }

export default async function PostDetailPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <article>
        <h1 className="mb-4 text-4xl font-bold">{post.title}</h1>

        <p className="mb-8 text-sm text-gray-500">
          {post.published_at
            ? new Date(post.published_at).toLocaleDateString()
            : new Date(post.created_at).toLocaleDateString()}
        </p>

        {post.excerpt && (
          <p className="mb-6 text-lg text-gray-700">{post.excerpt}</p>
        )}


        <div className="prose prose-lg max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>

        {/* <div className="prose max-w-none whitespace-pre-wrap">
          {post.content}
        </div> */}
      </article>
    </main>
  );
}



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