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
  description: "星语童年提供亲子成长、星盘解析、塔罗 AI、视频与知识库内容体验。",
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
