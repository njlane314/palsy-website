import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  BookOpen,
  CheckCircle2,
  Mail,
  PlayCircle,
  TerminalSquare,
} from "lucide-react";

import { ContactForm } from "@/components/contact-form";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

const onboardingSteps = [
  "Run Palsy in observe mode against one real lockfile.",
  "Tune policy until review and deny decisions match your risk appetite.",
  "Switch CI to enforce mode and keep signed permits with build artefacts.",
];

const demoOutcomes = [
  "A suspicious dependency is held before installation.",
  "The build receives a clear deny decision.",
  "No trusted promotion or permit is created.",
  "The technical transcript stays in the docs.",
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="h-[calc(100vh-4rem)] snap-y snap-mandatory overflow-y-auto scroll-smooth">
        <section className="relative flex min-h-[calc(100vh-4rem)] snap-start snap-always items-center overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
            <div className="max-w-4xl">
              <Badge variant="muted" className="mb-6">
                Self-hosted package-ingress firewall
              </Badge>
              <h1 className="text-5xl font-black leading-[0.95] text-foreground sm:text-6xl lg:text-7xl">
                {site.primaryClaim}
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">
                Palsy turns dependency installation into an admission decision: quarantine,
                inspect, allow or deny, then sign the evidence.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="#demo">
                    Watch it run <PlayCircle className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/docs">
                    Read docs <BookOpen className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-[#081020]/88 p-5 shadow-[0_24px_90px_rgba(0,0,0,0.38)]">
              <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <TerminalSquare className="size-5 text-primary" aria-hidden="true" />
                  <span className="text-sm font-bold text-foreground">Admission gate</span>
                </div>
                <span className="rounded-md border border-[#ff3d81]/45 bg-[#341022] px-2.5 py-1 text-xs font-bold text-[#ff7aa8]">
                  deny
                </span>
              </div>
              <div className="grid gap-3">
                {[
                  ["Package request", "Held before install"],
                  ["Policy decision", "Denied"],
                  ["Build permit", "Not issued"],
                  ["Developer action", "Review in docs"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-md border border-border bg-[#050713] px-3 py-2">
                    <span className="text-xs text-muted-foreground">{label}</span>
                    <span className="text-sm font-black text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Link
            href="#demo"
            className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground md:flex"
          >
            Demo <ArrowDown className="size-4" aria-hidden="true" />
          </Link>
        </section>

        <section
          id="demo"
          className="flex min-h-[calc(100vh-4rem)] snap-start snap-always items-center border-y border-border bg-[#071021] px-4 py-10 sm:px-6 lg:px-8"
        >
          <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div>
              <Badge variant="danger">Actual repo demo</Badge>
              <h2 className="mt-5 max-w-3xl text-4xl font-black leading-tight text-foreground sm:text-5xl">
                Watch the gate stop a suspicious package before it enters the build.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
                The homepage shows the product moment: an unsafe dependency is held, reviewed, and
                denied before installation. The full reproduction steps and raw output now live in
                the documentation.
              </p>
              <div className="mt-6 overflow-hidden rounded-lg border border-border bg-black shadow-[0_24px_90px_rgba(0,0,0,0.38)]">
                <Image
                  src="/demo/malicious-package-denied.gif"
                  alt="Recorded Palsy CLI demo denying a malicious package"
                  width={960}
                  height={540}
                  unoptimized
                  className="h-auto w-full"
                  priority
                />
              </div>
            </div>

            <div className="rounded-lg border border-border bg-[#081020] p-4 shadow-[0_24px_90px_rgba(0,0,0,0.28)]">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  what the demo proves
                </span>
                <span className="rounded-md border border-[#31ffd6]/45 bg-[#06352f] px-2.5 py-1 text-xs font-bold text-primary">
                  live gate
                </span>
              </div>
              <div className="grid gap-3">
                {demoOutcomes.map((outcome) => (
                  <div key={outcome} className="flex items-start gap-3 rounded-md border border-[#1b2a45] bg-[#050713] p-4">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                    <p className="text-sm leading-6 text-muted-foreground">{outcome}</p>
                  </div>
                ))}
              </div>
              <Button asChild variant="outline" className="mt-5 w-full">
                <Link href="/docs#docs-demo-transcript">Read the technical transcript</Link>
              </Button>
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="flex min-h-[calc(100vh-4rem)] snap-start snap-always items-center px-4 py-10 sm:px-6 lg:px-8"
        >
          <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <Badge variant="muted">Onboarding</Badge>
              <h2 className="mt-5 max-w-3xl text-4xl font-black leading-tight text-foreground sm:text-5xl">
                Start with one lockfile. Move to enforcement when the policy is boring.
              </h2>
              <div className="mt-8 grid gap-3">
                {onboardingSteps.map((step, index) => (
                  <div key={step} className="flex gap-3 rounded-lg border border-border bg-[#081020]/86 p-4">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                    <p className="text-sm leading-6 text-muted-foreground">
                      <strong className="text-foreground">Step {index + 1}.</strong> {step}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="outline">
                  <Link href="/docs">Implementation docs</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/trust">Release evidence</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-[#081020]/90 p-5 shadow-[0_24px_90px_rgba(0,0,0,0.3)]">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <Mail className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-xl font-black">Plan a pilot</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Send the repo shape and the lockfiles you want to gate first.
                  </p>
                </div>
              </div>
              <ContactForm />
              <p className="mt-4 text-xs leading-5 text-muted-foreground">
                Prefer self-serve? The quickstart and exact commands are in the implementation docs.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
