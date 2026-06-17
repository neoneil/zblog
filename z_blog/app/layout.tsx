import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/site/navbar";
import Footer from "@/components/site/footer";
import { Analytics } from "@vercel/analytics/next";
import { PreferencesProvider } from "@/components/site/preferences-provider";

export const metadata: Metadata = {
  title: {
    default: "星语童年",
    template: "%s | 星语童年",
  },
  description: "一个关于童年、学习、情绪与想象力的温柔空间。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" data-theme="light" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <PreferencesProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </PreferencesProvider>

        <Analytics />
      </body>
    </html>
  );
}

// import type { Metadata } from "next";  // 原版
// import "./globals.css";
// import Navbar from "@/components/site/navbar";
// import Footer from "@/components/site/footer";
// import { Analytics } from "@vercel/analytics/next";
// export const metadata: Metadata = {
//   title: {
//     default: "My Blog",
//     template: "%s | My Blog",
//   },
//   description: "A blog built with Next.js and Supabase.",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className="min-h-screen text-[var(--text)] antialiased" style={{
//         background: "var(--bg)",
//         color: "var(--text)"
//       }}>
//         <div className="flex min-h-screen flex-col">
//           <Navbar />
//           <div className="flex-1">{children}</div>
//           <Footer />
//         </div>
//         <Analytics />
//       </body>
//     </html>
//   );
// }
