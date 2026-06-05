import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/site/navbar";
import Footer from "@/components/site/footer";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: {
    default: "My Blog",
    template: "%s | My Blog",
  },
  description: "A blog built with Next.js and Supabase.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="min-h-screen antialiased"
        style={{
          background: `
            radial-gradient(circle at 18% 20%, rgba(86, 120, 210, 0.18), transparent 32%),
            radial-gradient(circle at 82% 10%, rgba(120, 110, 220, 0.12), transparent 38%),
            radial-gradient(circle at 50% 100%, rgba(30, 50, 110, 0.16), transparent 42%),
            linear-gradient(180deg, #0B1020 0%, #0E1630 48%, #0A0F1D 100%)
          `,
          color: "var(--text)",
        }}
      >
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
          <div
            className="stars-small absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(1.2px 1.2px at 18px 22px, rgba(255,255,255,0.95), transparent 72%),
                radial-gradient(1px 1px at 48px 88px, rgba(220,235,255,0.88), transparent 72%),
                radial-gradient(1.1px 1.1px at 92px 44px, rgba(255,255,255,0.9), transparent 72%),
                radial-gradient(1px 1px at 126px 116px, rgba(255,245,220,0.8), transparent 72%),
                radial-gradient(1.1px 1.1px at 166px 62px, rgba(255,255,255,0.92), transparent 72%),
                radial-gradient(1px 1px at 210px 24px, rgba(220,235,255,0.84), transparent 72%),
                radial-gradient(1.1px 1.1px at 242px 98px, rgba(255,255,255,0.88), transparent 72%)
              `,
              backgroundSize: "250px 145px",
              backgroundRepeat: "repeat",
            }}
          />

          <div
            className="stars-medium absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(1.8px 1.8px at 32px 36px, rgba(255,255,255,0.94), transparent 74%),
                radial-gradient(1.7px 1.7px at 102px 118px, rgba(230,240,255,0.9), transparent 74%),
                radial-gradient(1.9px 1.9px at 184px 62px, rgba(255,250,235,0.9), transparent 74%),
                radial-gradient(1.6px 1.6px at 258px 142px, rgba(255,255,255,0.88), transparent 74%),
                radial-gradient(1.8px 1.8px at 328px 42px, rgba(220,235,255,0.88), transparent 74%)
              `,
              backgroundSize: "340px 210px",
              backgroundRepeat: "repeat",
            }}
          />

          <div
            className="stars-large absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(2.6px 2.6px at 70px 48px, rgba(255,255,255,0.92), transparent 76%),
                radial-gradient(2.4px 2.4px at 210px 132px, rgba(255,245,220,0.88), transparent 76%),
                radial-gradient(2.8px 2.8px at 390px 72px, rgba(220,235,255,0.9), transparent 76%),
                radial-gradient(2.5px 2.5px at 520px 168px, rgba(255,255,255,0.88), transparent 76%)
              `,
              backgroundSize: "580px 320px",
              backgroundRepeat: "repeat",
            }}
          />

          <div className="meteor meteor-1" />
          <div className="meteor meteor-2" />
        </div>

        <div className="flex min-h-screen flex-col">
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>

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