import type { Metadata } from "next";

import { DocsShell } from "@/components/docs-shell";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Docs",
  description:
    "IngressShield documentation for package admission, CI gates, signed permits, and self-hosted deployment.",
  openGraph: {
    title: "Docs | IngressShield",
    description:
      "IngressShield documentation for package admission, CI gates, signed permits, and self-hosted deployment.",
    type: "website",
  },
};

export default function DocsPage() {
  return (
    <main>
      <SiteHeader />
      <DocsShell />
      <SiteFooter />
    </main>
  );
}
