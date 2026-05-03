"use client";

import { motion, useReducedMotion } from "motion/react";

const rows = [
  ["pypi:idna@3.10", "ALLOW", "permit issued"],
  ["npm:is-number@7.0.0", "ALLOW", "digest pinned"],
  ["pypi:shadow-hook@0.1.0", "DENY", ".pth startup hook"],
  ["npm:postinstall-kit@2.4.1", "REVIEW", "lifecycle script"],
];

export function HeroScene() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#050713]" aria-hidden="true">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(49,255,214,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(45,212,255,0.07)_1px,transparent_1px)] bg-[size:88px_88px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18px_18px,rgba(238,248,255,0.22)_1px,transparent_1.8px)] bg-[size:132px_132px]" />
      <div className="absolute inset-x-0 top-0 h-28 bg-[#050713]/72" />
      <div className="absolute -right-32 top-20 h-[540px] w-[62vw] rotate-[-7deg] rounded-[42px] border border-[#2dd4ff]/18 bg-[#081020]/52 shadow-[0_44px_140px_rgba(45,212,255,0.12)]" />
      <div className="absolute -right-16 top-36 h-[440px] w-[54vw] rotate-[-7deg] rounded-[32px] border border-primary/22 bg-[#0b1428]/72" />
      <motion.div
        className="absolute bottom-8 left-1/2 hidden w-[860px] max-w-[92vw] -translate-x-1/2 grid-cols-4 gap-px overflow-hidden rounded-lg border border-[#243451] bg-[#243451] text-foreground shadow-[0_28px_90px_rgba(0,0,0,0.34)] lg:grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.6 }}
      >
        {[
          ["resolve", "exact artefact"],
          ["quarantine", "no install yet"],
          ["scan", "policy evidence"],
          ["sign", "build permit"],
        ].map(([label, detail], index) => (
          <motion.div
            key={label}
            className="bg-[#081020]/92 p-4"
            animate={reduceMotion ? undefined : { backgroundColor: ["#081020eb", "#0c2440eb", "#081020eb"] }}
            transition={{ delay: index * 0.55, duration: 3.2, repeat: Infinity, repeatDelay: 1.2 }}
          >
            <strong className="block text-sm">{label}</strong>
            <span className="mt-1 block text-xs text-muted-foreground">{detail}</span>
          </motion.div>
        ))}
      </motion.div>
      <div className="absolute right-4 top-28 hidden w-56 rotate-[4deg] rounded-lg border border-[#2dd4ff]/22 bg-[#081020]/82 p-3 shadow-[0_24px_70px_rgba(0,0,0,0.32)] xl:block">
        <div className="mb-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
          <span>Queue</span>
          <span>live</span>
        </div>
        <div className="grid gap-2">
          {rows.slice(0, 3).map((row) => (
            <div key={row[0]} className="grid grid-cols-[1fr_auto] gap-2 rounded-md border border-border bg-[#0b1428] px-2 py-2 text-[10px]">
              <span className="truncate font-mono">{row[0]}</span>
              <span
                className={
                  row[1] === "ALLOW"
                    ? "font-black text-primary"
                    : row[1] === "DENY"
                      ? "font-black text-[#ff3d81]"
                      : "font-black text-[#ffd166]"
                }
              >
                {row[1]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
