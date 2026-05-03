import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { site } from "@/lib/site";

const columns = [
  {
    title: "Product",
    links: [
      ["Platform", "/#platform"],
      ["Live demo", "/#demo"],
      ["Pricing", "/#pricing"],
    ],
  },
  {
    title: "Resources",
    links: [
      ["Documentation", "/docs"],
      ["Deploy in 1 PR", "/#deploy"],
      ["Trust centre", "/trust"],
    ],
  },
  {
    title: "Evidence",
    links: [
      ["Signed permits", "/docs#docs-permits"],
      ["Release evidence", "/trust"],
      ["Contact", "/#contact"],
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-[#050713] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.2fr_2fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-foreground">
            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-[0_0_24px_rgba(49,255,214,0.24)]">
              <ShieldCheck className="size-4" aria-hidden="true" />
            </span>
            {site.name}
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
            Commercial product surface for the Apache-2.0 Palsy package-ingress engine.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            Self-hosted dependency admission for teams that need enforceable approval evidence.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                {column.title}
              </h2>
              <div className="mt-3 grid gap-2 text-sm">
                {column.links.map(([label, href]) => (
                  <Link key={href} href={href} className="text-muted-foreground hover:text-foreground">
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
