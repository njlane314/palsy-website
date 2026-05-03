"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  Archive,
  CheckCircle2,
  FileDigit,
  GitPullRequestArrow,
  PackageSearch,
  ScanSearch,
  ShieldCheck,
} from "lucide-react";

const stages = [
  {
    title: "CI request",
    body: "Lockfile change asks for package ingress.",
    icon: GitPullRequestArrow,
    accent: "border-[#30466f] bg-[#0b1428] text-[#a6c8ff]",
  },
  {
    title: "Resolver",
    body: "Exact artefacts and expected digests.",
    icon: PackageSearch,
    accent: "border-[#31ffd6] bg-[#06352f] text-[#31ffd6]",
  },
  {
    title: "Quarantine",
    body: "No install path until policy finishes.",
    icon: Archive,
    accent: "border-[#30466f] bg-[#0b1428] text-[#a6c8ff]",
  },
  {
    title: "Scanner",
    body: "Static package and lifecycle signals.",
    icon: ScanSearch,
    accent: "border-[#30466f] bg-[#0b1428] text-[#a6c8ff]",
  },
  {
    title: "Policy",
    body: "Allow, review, or deny by environment.",
    icon: ShieldCheck,
    accent: "border-[#31ffd6] bg-[#06352f] text-[#31ffd6]",
  },
  {
    title: "Mirror / permit",
    body: "Promote approved artefacts and sign evidence.",
    icon: FileDigit,
    accent: "border-[#31ffd6] bg-[#06352f] text-[#31ffd6]",
  },
];

export function ProductDiagram() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-[#0b1224] shadow-sm">
      <div className="border-b border-border bg-[#081020] px-4 py-3">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-bold">Request to permit</p>
          <p className="text-xs text-muted-foreground">
            CI request {"->"} resolver {"->"} quarantine {"->"} scanner {"->"} policy {"->"} mirror/permit
          </p>
        </div>
      </div>
      <div className="relative p-4">
        {!reduceMotion ? (
          <motion.div
            className="pointer-events-none absolute left-8 right-8 top-[78px] hidden h-px bg-primary/35 lg:block"
            initial={{ scaleX: 0, transformOrigin: "left" }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        ) : null}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-6">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            return (
              <motion.div
                key={stage.title}
                className="relative rounded-lg border border-border bg-[#081020] p-4"
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06, duration: 0.42 }}
                whileHover={{ y: -2 }}
              >
                <span className={`flex size-9 items-center justify-center rounded-md border ${stage.accent}`}>
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-sm font-black">{stage.title}</h3>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{stage.body}</p>
                {index === stages.length - 1 ? (
                  <span className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-[#31ffd6] bg-[#06352f] px-2 py-1 text-[11px] font-bold text-[#31ffd6]">
                    <CheckCircle2 className="size-3" aria-hidden="true" />
                    signed
                  </span>
                ) : null}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
