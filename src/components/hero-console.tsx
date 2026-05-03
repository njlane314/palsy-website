"use client";

import { motion, useReducedMotion } from "motion/react";
import { CheckCircle2, Clock3, KeyRound, PackageSearch, ShieldX } from "lucide-react";

const queue = [
  {
    name: "pypi:idna@3.10",
    source: "requirements.txt",
    decision: "ALLOW",
    detail: "permit issued",
  },
  {
    name: "npm:postinstall-kit@2.4.1",
    source: "package-lock.json",
    decision: "REVIEW",
    detail: "lifecycle script",
  },
  {
    name: "pypi:credential_stealer_demo@0.1.0",
    source: "demo-lock.txt",
    decision: "DENY",
    detail: ".pth startup hook",
  },
];

const decisionStyles: Record<string, string> = {
  ALLOW: "border-primary/45 bg-[#06352f] text-[#7dffe9]",
  REVIEW: "border-[#ffd166]/55 bg-[#3a2b0c] text-[#ffd166]",
  DENY: "border-[#ff3d81]/55 bg-[#341022] text-[#ff7aa8]",
};

const decisionIcons = {
  ALLOW: CheckCircle2,
  REVIEW: Clock3,
  DENY: ShieldX,
};

const telemetry = [
  ["lockfile", "sha256:8d29...51c4"],
  ["policy", "ci-balanced"],
  ["environment", "production"],
  ["mode", "enforce"],
];

export function HeroConsole() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="relative overflow-hidden rounded-lg border border-[#2dd4ff]/24 bg-[#081020]/92 text-foreground shadow-[0_34px_100px_rgba(0,0,0,0.42),0_0_54px_rgba(45,212,255,0.1)] backdrop-blur-xl"
      initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between border-b border-border bg-[#0b1428] px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-[0_0_18px_rgba(49,255,214,0.28)]">
            <PackageSearch className="size-4" aria-hidden="true" />
          </span>
          Admission console
        </div>
        <span className="rounded-md border border-[#30466f] bg-[#081020] px-2.5 py-1 text-xs text-muted-foreground">
          live CI gate
        </span>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1fr_0.72fr]">
        <div className="border-b border-border p-4 lg:border-b-0 lg:border-r">
          <div className="mb-3 grid grid-cols-[1fr_0.58fr_0.72fr] gap-3 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
            <span>Artefact</span>
            <span>Decision</span>
            <span>Action</span>
          </div>
          <div className="grid gap-2">
            {queue.map((item, index) => {
              const Icon = decisionIcons[item.decision as keyof typeof decisionIcons];
              return (
                <motion.div
                  key={item.name}
                  className="grid grid-cols-[1fr_0.58fr_0.72fr] items-center gap-3 rounded-md border border-border bg-[#0b1428] px-3 py-3 text-xs shadow-sm"
                  animate={
                    reduceMotion
                      ? undefined
                      : {
                          borderColor:
                            item.decision === "DENY"
                              ? ["#243451", "#ff3d81", "#243451"]
                              : ["#243451", "#31ffd6", "#243451"],
                        }
                  }
                  transition={{ delay: index * 0.35, duration: 3.2, repeat: Infinity }}
                >
                  <div className="min-w-0">
                    <p className="truncate font-mono text-foreground">{item.name}</p>
                    <p className="mt-1 truncate text-muted-foreground">{item.source}</p>
                  </div>
                  <span
                    className={`inline-flex w-fit items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-black ${decisionStyles[item.decision]}`}
                  >
                    <Icon className="size-3" aria-hidden="true" />
                    {item.decision}
                  </span>
                  <span className="truncate text-muted-foreground">{item.detail}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="p-4">
          <div className="rounded-lg border border-[#ff3d81]/45 bg-[#341022] p-4 text-[#ffd9e7] shadow-[0_0_28px_rgba(255,61,129,0.12)]">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#ff9abb]">Current result</p>
            <div className="mt-3 flex items-center gap-3">
              <ShieldX className="size-8 text-[#ff3d81]" aria-hidden="true" />
              <div>
                <p className="text-3xl font-black leading-none text-[#ff7aa8]">DENY</p>
                <p className="mt-1 text-xs font-medium text-[#ffc7da]">no mirror promotion, no permit</p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-2">
            {telemetry.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-3 text-xs">
                <span className="text-muted-foreground">{label}</span>
                <span className="truncate rounded-md border border-border bg-[#0b1428] px-2 py-1 font-mono text-foreground">
                  {value}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-lg border border-border bg-[#0b1428] p-3">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <KeyRound className="size-3.5 text-primary" aria-hidden="true" />
              Permit verifier
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#15223b]">
              <motion.div
                className="h-full rounded-full bg-primary"
                animate={reduceMotion ? { width: "72%" } : { width: ["24%", "72%", "72%"] }}
                transition={{ duration: 3.4, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">verification waits until policy returns allow</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
