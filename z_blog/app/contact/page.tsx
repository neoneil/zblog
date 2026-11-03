import type { Metadata } from "next";
import { PageShell } from "@/components/site/page-shell";
import { ContactSection } from "@/features/contact/components/about-contact";

export const metadata: Metadata = { title: "SEND A MESSAGE | 星语传讯" };

export default function ContactPage() {
  return <PageShell><ContactSection /></PageShell>;
}
