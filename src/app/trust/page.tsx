import Link from "next/link";
import {
  BadgeCheck,
  Boxes,
  CheckCircle2,
  FileArchive,
  Fingerprint,
  KeyRound,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";

import { CodeBlock } from "@/components/code-block";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { site } from "@/lib/site";

const verifyRelease = `gh release view v0.3.0 --repo njlane314/palsy
gh release download v0.3.0 --repo njlane314/palsy --dir /tmp/palsy-release
cd /tmp/palsy-release
shasum -a 256 -c SHA256SUMS
python -m pip install palsy==0.3.0
docker pull ghcr.io/njlane314/palsy:v0.3.0`;

const evidence = [
  {
    icon: BadgeCheck,
    title: "Signed release tags",
    body: "The release workflow verifies the pushed v* tag before publishing buyer-facing artefacts.",
  },
  {
    icon: PackageCheck,
    title: "PyPI package",
    body: "Source distribution and wheel are built from the verified tag and published through Trusted Publishing.",
  },
  {
    icon: Boxes,
    title: "Docker image",
    body: "The GHCR image is built by the same release workflow and receives a registry attestation.",
  },
  {
    icon: FileArchive,
    title: "SBOM",
    body: "An SPDX JSON SBOM is generated for the source tree and attached to the GitHub Release.",
  },
  {
    icon: Fingerprint,
    title: "Checksums",
    body: "SHA256SUMS covers distributions and support files so buyers can verify downloaded assets.",
  },
  {
    icon: KeyRound,
    title: "Provenance",
    body: "GitHub attestations bind Python distributions, release support files, and the container image.",
  },
];

const statusRows = [
  ["Root licence", "Ready", "Apache-2.0 is present as an explicit repository licence file."],
  ["Version consistency", "Ready", "pyproject.toml, palsy.__version__, and the FastAPI app are aligned at 0.3.0."],
  ["Release workflow", "Ready", "Signed tag verification, PyPI build, GHCR image, SBOM, checksums, and attestations are wired."],
  ["First public release", "Operator step", "Create and push the signed v0.3.0 tag after the final preflight."],
  ["Stripe Payment Links", "Operator step", "Paste live Team and Business links into the website environment."],
];

const preflight = [
  "Run the full test suite and package build.",
  "Confirm no private policy bundles, tokens, or customer state are committed.",
  "Create a signed tag whose version matches the Python package version.",
  "Check GitHub Release assets, SHA256SUMS, SBOM, PyPI, GHCR, and attestations after the workflow finishes.",
];

export default function TrustPage() {
  return (
    <main>
      <SiteHeader />

      <section className="bg-[#050713] px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Badge className="border-white/16 bg-white/10 text-white">Trust centre</Badge>
          <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.98] sm:text-6xl">
            Verify the product before it verifies your builds.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/76">
            {site.name} is sold as a supply-chain control, so its own release path is designed to
            produce inspectable evidence: licence, signed tags, packages, containers, SBOM,
            checksums, and provenance.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-[#0b1224] text-[#31ffd6] hover:bg-[#13213a]">
              <Link href="/docs">Read deployment docs</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/8 text-white hover:bg-white/14"
            >
              <Link href="/#contact">Request release evidence</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-[#0b1224] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <Badge variant="muted">Release evidence</Badge>
            <h2 className="mt-5 text-4xl font-black leading-none sm:text-5xl">
              What every production release should publish.
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              These are the artefacts procurement and security teams should expect before routing
              package ingress through a new control point.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {evidence.map((item) => (
              <Card key={item.title}>
                <CardHeader>
                  <item.icon className="size-6 text-primary" aria-hidden="true" />
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.body}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-[#071021] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <Badge variant="muted">Current readiness</Badge>
            <h2 className="mt-5 text-4xl font-black leading-none sm:text-5xl">
              Separate automated evidence from operator steps.
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              The workflow is wired, but a release still needs the human step of creating a signed
              tag and confirming the public assets after publication.
            </p>
          </div>
          <div className="overflow-hidden rounded-lg border border-border bg-[#0b1224] shadow-sm">
            {statusRows.map(([name, status, detail]) => (
              <div
                key={name}
                className="grid gap-3 border-b border-border px-4 py-4 last:border-b-0 md:grid-cols-[0.55fr_0.38fr_1fr]"
              >
                <strong>{name}</strong>
                <span
                  className={`inline-flex w-fit items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-bold ${
                    status === "Ready"
                      ? "border-[#31ffd6] bg-[#06352f] text-[#31ffd6]"
                      : "border-[#ffd166] bg-[#3a2b0c] text-[#ffd166]"
                  }`}
                >
                  <CheckCircle2 className="size-3.5" aria-hidden="true" />
                  {status}
                </span>
                <span className="text-sm leading-6 text-muted-foreground">{detail}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0b1224] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Badge variant="muted">Verification</Badge>
            <h2 className="mt-5 text-4xl font-black leading-none sm:text-5xl">
              Buyer-side checks should be copy-pasteable.
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              After a signed release has run, use these commands to inspect the release, verify
              checksums, install the PyPI package, and pull the matching container image.
            </p>
          </div>
          <CodeBlock code={verifyRelease} className="mt-0" />
        </div>
      </section>

      <section className="border-t border-border bg-[#071021] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <Badge variant="muted">Preflight</Badge>
            <h2 className="mt-5 text-4xl font-black leading-none sm:text-5xl">
              The release gate before public buyers see it.
            </h2>
          </div>
          <div className="grid gap-3">
            {preflight.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-lg border border-border bg-[#0b1224] p-4">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                <p className="text-sm leading-6 text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
