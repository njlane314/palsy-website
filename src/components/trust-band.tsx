"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Container, GitPullRequestArrow, KeyRound, Scale, Server } from "lucide-react";

const items: Array<{
  label: string;
  metric?: number;
  suffix?: string;
  value?: string;
  icon: typeof Server;
}> = [
  { label: "Self-hosted", metric: 100, suffix: "%", icon: Server },
  { label: "Ed25519 permits", value: "Ed25519", icon: KeyRound },
  { label: "Docker/Kubernetes", metric: 2, suffix: " paths", icon: Container },
  { label: "GitHub Actions", metric: 1, suffix: " PR", icon: GitPullRequestArrow },
  { label: "Apache-2.0 engine", value: "Apache-2.0", icon: Scale },
];

function useCounter(target: number) {
  const [value, setValue] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      const frameId = window.requestAnimationFrame(() => setValue(target));
      return () => window.cancelAnimationFrame(frameId);
    }

    let frame = 0;
    const totalFrames = 32;
    const timer = window.setInterval(() => {
      frame += 1;
      setValue(Math.round((target * frame) / totalFrames));
      if (frame >= totalFrames) {
        window.clearInterval(timer);
      }
    }, 34);

    return () => window.clearInterval(timer);
  }, [reduceMotion, target]);

  return value;
}

export function TrustBand() {
  return (
    <section className="border-y border-[#243451] bg-[#081020] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-5">
        {items.map((item, index) => (
          <TrustBandItem key={item.label} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}

function TrustBandItem({ item, index }: { item: (typeof items)[number]; index: number }) {
  const value = useCounter(item.metric ?? 0);
  const Icon = item.icon;
  const displayValue = item.value ?? `${value}${item.suffix ?? ""}`;

  return (
    <motion.div
      className="rounded-lg border border-[#30466f] bg-[#0b1428]/86 p-4 shadow-[0_18px_48px_rgba(0,0,0,0.22)]"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.38, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-black leading-none text-foreground">
            {displayValue}
          </p>
          <p className="mt-2 text-xs font-semibold text-muted-foreground">{item.label}</p>
        </div>
        <span className="flex size-8 items-center justify-center rounded-md bg-primary/14 text-primary shadow-[0_0_18px_rgba(49,255,214,0.16)]">
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </div>
    </motion.div>
  );
}
