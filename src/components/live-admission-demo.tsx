"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FileDigit,
  PackageSearch,
  ShieldX,
  SlidersHorizontal,
} from "lucide-react";

const steps = ["Resolve", "Quarantine", "Inspect", "Decide", "Permit"];

const scenarios = [
  {
    coordinate: "pypi:idna@3.10",
    source: "requirements.txt",
    decision: "ALLOW",
    severity: "low",
    action: "permit issued",
    reasons: ["sha256 verified", "no startup hooks", "release age accepted"],
  },
  {
    coordinate: "pypi:credential_stealer_demo@0.1.0",
    source: "demo-lock.txt",
    decision: "DENY",
    severity: "critical",
    action: "blocked in quarantine",
    reasons: [".pth startup hook", "import-time credential access", "network behaviour"],
  },
  {
    coordinate: "npm:postinstall-kit@2.4.1",
    source: "package-lock.json",
    decision: "REVIEW",
    severity: "high",
    action: "sent to review queue",
    reasons: ["install lifecycle script", "shell command", "not allowlisted"],
  },
  {
    coordinate: "oci:python@sha256:7c1e",
    source: "deploy/images.lock",
    decision: "ALLOW",
    severity: "medium",
    action: "metadata admitted",
    reasons: ["immutable digest", "non-root metadata", "no secret-like env"],
  },
];

const decisionPanelStyles: Record<string, string> = {
  ALLOW: "border-[#31ffd6]/55 bg-[#06352f] text-[#31ffd6]",
  REVIEW: "border-[#ffd166]/70 bg-[#3a2b0c] text-[#ffd166]",
  DENY: "border-[#ff3d81]/70 bg-[#341022] text-[#ff7aa8]",
};

const icons: Record<string, typeof CheckCircle2> = {
  ALLOW: CheckCircle2,
  REVIEW: Clock3,
  DENY: ShieldX,
};

function getScenario(tick: number) {
  return scenarios[Math.floor(tick / steps.length) % scenarios.length];
}

function getStep(tick: number) {
  return tick % steps.length;
}

function progressFor(stageIndex: number, stepIndex: number, decision: string) {
  if (stageIndex === 4 && decision !== "ALLOW" && stepIndex >= 4) {
    return decision === "REVIEW" ? 38 : 18;
  }

  if (stepIndex > stageIndex) {
    return 100;
  }

  if (stepIndex === stageIndex) {
    return 66;
  }

  return 8;
}

export function LiveAdmissionDemo() {
  const [tick, setTick] = useState(0);
  const reduceMotion = useReducedMotion();
  const scenario = getScenario(tick);
  const stepIndex = getStep(tick);
  const DecisionIcon = icons[scenario.decision];
  const progressRows = [
    ["resolve", 0],
    ["scan", 2],
    ["policy", 3],
    ["permit", 4],
  ] as const;

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const timer = window.setInterval(() => {
      setTick((current) => current + 1);
    }, 1350);

    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  const events = useMemo(
    () =>
      Array.from({ length: 6 }, (_, offset) => {
        const eventTick = Math.max(0, tick - offset);
        const eventScenario = getScenario(eventTick);
        const eventStep = steps[getStep(eventTick)].toLowerCase();
        return {
          id: `${eventTick}-${offset}-${eventScenario.coordinate}`,
          text:
            eventStep === "permit"
              ? `${eventScenario.decision.toLowerCase()}: ${eventScenario.action}`
              : `${eventStep}: ${eventScenario.coordinate}`,
          decision: eventScenario.decision,
        };
      }),
    [tick],
  );

  return (
    <div className="overflow-hidden rounded-lg border border-[#243451] bg-[#050713] text-[#e8f7ff] shadow-xl lg:h-[620px]">
      <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#31ffd6] opacity-60" />
            <span className="relative inline-flex size-2.5 rounded-full bg-[#31ffd6]" />
          </span>
          Live admission stream
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs text-white/58 sm:flex">
          <span>queue 04</span>
          <span>review 01</span>
          <span>blocked 01</span>
        </div>
      </div>

      <div className="grid gap-2 border-b border-white/10 bg-white/[0.035] px-4 py-3 text-xs text-white/68 sm:grid-cols-3">
        {[
          ["Policy", "ci-balanced"],
          ["Environment", "production"],
          ["Mode", "enforce"],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-3 rounded-md border border-white/8 bg-[#070d19]/60 px-3 py-2">
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="size-3.5 text-[#31ffd6]" aria-hidden="true" />
              {label}
            </span>
            <span className="font-mono text-white/88">{value}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-0 lg:h-[513px] lg:grid-cols-[0.92fr_1.08fr]">
        <div className="border-b border-white/10 p-4 lg:border-b-0 lg:border-r">
          <div className="mb-3 flex items-center justify-between text-xs text-white/48">
            <span>Incoming lockfile changes</span>
            <span>{scenario.source}</span>
          </div>
          <div className="grid gap-2">
            {scenarios.map((item, index) => {
              const active = item.coordinate === scenario.coordinate;
              return (
                <motion.div
                  key={item.coordinate}
                  className={`h-10 rounded-md border px-3 py-2.5 font-mono text-xs ${
                    active
                      ? "border-[#31ffd6]/42 bg-white/[0.075] text-white"
                      : "border-white/8 bg-white/[0.035] text-white/58"
                  }`}
                  animate={active && !reduceMotion ? { x: [0, 4, 0] } : { x: 0 }}
                  transition={{ duration: 0.55 }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate">{item.coordinate}</span>
                    <span className={active ? "text-[#31ffd6]" : "text-white/36"}>
                      {active ? "active" : `0${index + 1}`}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="flex min-h-0 flex-col p-4">
          <div className="mb-4 grid min-h-[92px] gap-3 md:grid-cols-[1fr_0.72fr]">
            <div className="min-w-0">
              <p className="text-xs text-white/48">Current artefact</p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={scenario.coordinate}
                  className="mt-1 truncate font-mono text-sm text-white"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  {scenario.coordinate}
                </motion.p>
              </AnimatePresence>
              <p className="mt-1 text-xs text-white/42">{scenario.action}</p>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={scenario.decision}
                className={`h-[90px] rounded-lg border p-3 ${decisionPanelStyles[scenario.decision]}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.22 }}
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] opacity-72">
                  Current decision
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <DecisionIcon className="size-6" aria-hidden="true" />
                  <span className="text-2xl font-black leading-none">{scenario.decision}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative mb-5 h-[114px] rounded-lg border border-white/10 bg-white/[0.035] p-3">
            <div className="absolute left-0 right-0 top-[15px] h-px bg-white/12" />
            <motion.div
              className="absolute left-0 top-[15px] h-px bg-[#31ffd6]"
              animate={{ width: `${(stepIndex / (steps.length - 1)) * 100}%` }}
              transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
            />
            <motion.div
              className="absolute top-[10px] size-2.5 rounded-full bg-[#31ffd6] shadow-[0_0_20px_rgba(49,255,214,0.75)]"
              animate={{ left: `calc(${(stepIndex / (steps.length - 1)) * 100}% - 5px)` }}
              transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
            />
            <div className="relative grid grid-cols-5 gap-2">
              {steps.map((step, index) => {
                const active = index <= stepIndex;
                return (
                  <div key={step} className="pt-8 text-center">
                    <span
                      className={`mx-auto flex size-8 items-center justify-center rounded-md border text-xs font-bold ${
                        active
                          ? "border-[#31ffd6]/45 bg-[#31ffd6]/16 text-[#a7fff1]"
                          : "border-white/10 bg-white/[0.035] text-white/40"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="mt-2 block text-[11px] text-white/58">{step}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-5 grid gap-2 md:grid-cols-4">
            {progressRows.map(([label, stageIndex]) => {
              const progress = progressFor(stageIndex, stepIndex, scenario.decision);
              const colour =
                scenario.decision === "DENY" && stageIndex >= 3
                  ? "bg-[#ff7aa8]"
                  : scenario.decision === "REVIEW" && stageIndex >= 3
                    ? "bg-[#ffd787]"
                    : "bg-[#31ffd6]";

              return (
                <div key={label} className="h-[48px] rounded-md border border-white/10 bg-white/[0.035] p-2">
                  <div className="mb-2 flex items-center justify-between text-[11px] text-white/54">
                    <span>{label}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className={`h-full rounded-full ${colour}`}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid min-h-0 flex-1 gap-3 md:grid-cols-[0.82fr_1fr]">
            <div className="h-[174px] overflow-hidden rounded-md border border-white/10 bg-white/[0.035] p-3">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-white/72">
                <PackageSearch className="size-3.5" aria-hidden="true" />
                Evidence
              </div>
              <ul className="grid gap-1.5 text-xs text-white/58">
                {scenario.reasons.map((reason) => (
                  <li key={reason} className="flex min-w-0 items-center gap-2">
                    <span className="size-1.5 shrink-0 rounded-full bg-[#31ffd6]" />
                    <span className="truncate">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="h-[174px] overflow-hidden rounded-md border border-white/10 bg-white/[0.035] p-3">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-white/72">
                {scenario.decision === "DENY" ? (
                  <AlertTriangle className="size-3.5 text-[#ff7aa8]" aria-hidden="true" />
                ) : (
                  <FileDigit className="size-3.5 text-[#31ffd6]" aria-hidden="true" />
                )}
                Event log
              </div>
              <div className="grid h-[112px] grid-rows-6 gap-1.5 overflow-hidden font-mono text-[11px] text-white/54">
                {events.map((event) => (
                  <motion.div
                    key={event.id}
                    className="min-h-0 truncate"
                    initial={false}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span
                      className={
                        event.decision === "DENY"
                          ? "text-[#ff7aa8]"
                          : event.decision === "REVIEW"
                            ? "text-[#ffd787]"
                            : "text-[#31ffd6]"
                      }
                    >
                      {">"}
                    </span>{" "}
                    {event.text}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
