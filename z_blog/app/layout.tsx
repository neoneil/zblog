import type { Metadata } from "next";
import "./globals.css";
import "./tables.css";
import Navbar from "@/components/site/navbar";
import Footer from "@/components/site/footer";
import { Analytics } from "@vercel/analytics/next";
import { PreferencesProvider } from "@/components/site/preferences-provider";

export const metadata: Metadata = {
  title: {
    default: "星辰之巢",
    template: "%s | 星辰之巢",
  },
  description: "身处混沌，始终自有中心",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" data-theme="dark" suppressHydrationWarning>
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
