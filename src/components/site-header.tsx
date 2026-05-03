import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#243451]/90 bg-[#050713]/86 text-foreground shadow-[0_1px_0_rgba(49,255,214,0.08)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 font-bold">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-[0_0_24px_rgba(49,255,214,0.28)]">
            <ShieldCheck className="size-4" aria-hidden="true" />
          </span>
          <span className="leading-tight">
            <span className="block">{site.name}</span>
            <span className="hidden text-[11px] font-medium text-muted-foreground sm:block">
              package-ingress firewall
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-muted-foreground lg:flex" aria-label="Primary">
          {site.nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/docs"
            className="rounded-md border border-border bg-[#081020] px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground lg:hidden"
          >
            Docs
          </Link>
          <Link
            href="/#contact"
            className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-[#7dffe9] sm:hidden"
          >
            Demo
          </Link>
        </div>
        <div className="hidden items-center gap-3 xl:flex">
          <span className="rounded-md border border-border bg-[#081020] px-2.5 py-1 text-xs text-muted-foreground">
            Apache-2.0 engine
          </span>
          <Button asChild size="sm">
            <Link href="/#contact">Request demo</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
