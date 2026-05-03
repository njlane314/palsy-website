"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  Eye,
  LockKeyhole,
  ShieldAlert,
  ShieldX,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

const modes = [
  {
    key: "observe",
    label: "Observe",
    icon: Eye,
    description: "Report risk without breaking the build.",
  },
  {
    key: "review",
    label: "Review",
    icon: ClipboardCheck,
    description: "Allow known-good artefacts and queue risky ones.",
  },
  {
    key: "strict",
    label: "Strict",
    icon: LockKeyhole,
    description: "Block critical signals before installation.",
  },
] as const;

type ModeKey = (typeof modes)[number]["key"];
type ScenarioKey = "clean" | "fresh" | "stealer";
type Decision = "ALLOW" | "REPORT" | "REVIEW" | "DENY";

const scenarios: Array<{
  key: ScenarioKey;
  name: string;
  source: string;
  risk: "low" | "high" | "critical";
  signals: string[];
}> = [
  {
    key: "clean",
    name: "pypi:idna@3.10",
    source: "requirements.txt",
    risk: "low",
    signals: ["sha256 verified", "release age accepted", "no startup hooks"],
  },
  {
    key: "fresh",
    name: "npm:postinstall-kit@2.4.1",
    source: "package-lock.json",
    risk: "high",
    signals: ["install lifecycle script", "fresh upload", "not allowlisted"],
  },
  {
    key: "stealer",
    name: "pypi:credential_stealer_demo@0.1.0",
    source: "demo-lock.txt",
    risk: "critical",
    signals: [".pth startup hook", "credential environment access", "network behaviour"],
  },
];

const decisionStyles: Record<Decision, string> = {
  ALLOW: "border-[#31ffd6] bg-[#06352f] text-[#31ffd6]",
  REPORT: "border-[#30466f] bg-[#0b1428] text-[#a6c8ff]",
  REVIEW: "border-[#ffd166] bg-[#3a2b0c] text-[#ffd166]",
  DENY: "border-[#ff3d81] bg-[#341022] text-[#ff7aa8]",
};

const decisionIcons: Record<Decision, typeof CheckCircle2> = {
  ALLOW: CheckCircle2,
  REPORT: Eye,
  REVIEW: AlertTriangle,
  DENY: ShieldX,
};

function decide(mode: ModeKey, scenario: ScenarioKey, quarantineFresh: boolean): Decision {
  if (mode === "observe") {
    return scenario === "clean" ? "ALLOW" : "REPORT";
  }

  if (mode === "review") {
    return scenario === "clean" ? "ALLOW" : "REVIEW";
  }

  if (scenario === "clean") {
    return "ALLOW";
  }

  if (scenario === "fresh" && !quarantineFresh) {
    return "REVIEW";
  }

  return "DENY";
}

export function PolicyPlayground() {
  const [mode, setMode] = useState<ModeKey>("strict");
  const [quarantineFresh, setQuarantineFresh] = useState(true);
  const [requirePermit, setRequirePermit] = useState(true);
  const reduceMotion = useReducedMotion();

  const selected = modes.find((item) => item.key === mode) ?? modes[2];

  const evaluated = useMemo(
    () =>
      scenarios.map((scenario) => ({
        ...scenario,
        decision: decide(mode, scenario.key, quarantineFresh),
      })),
    [mode, quarantineFresh],
  );

  const blockedCount = evaluated.filter((item) => item.decision === "DENY").length;
  const reviewCount = evaluated.filter((item) => item.decision === "REVIEW").length;

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-[#0b1224] shadow-sm">
      <div className="grid gap-0 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="border-b border-border bg-[#071021] p-5 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-2">
            <ShieldAlert className="size-5 text-primary" aria-hidden="true" />
            <h3 className="text-xl font-black">Policy playground</h3>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Switch the admission mode and see how the same lockfile change is treated before CI
            installs it.
          </p>

          <div className="mt-5 grid gap-2" role="group" aria-label="Admission mode">
            {modes.map((item) => {
              const Icon = item.icon;
              const active = item.key === mode;
              return (
                <button
                  key={item.key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setMode(item.key)}
                  className={`flex min-h-16 items-start gap-3 rounded-md border p-3 text-left transition-colors ${
                    active
                      ? "border-primary bg-[#06352f] text-[#a7fff1]"
                      : "border-border bg-[#0b1224] text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span>
                    <span className="block text-sm font-bold">{item.label}</span>
                    <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                      {item.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 grid gap-3">
            <label className="flex items-start gap-3 rounded-md border border-border bg-[#0b1224] p-3 text-sm">
              <input
                type="checkbox"
                checked={quarantineFresh}
                onChange={(event) => setQuarantineFresh(event.target.checked)}
                className="mt-1 size-4 accent-[#31ffd6]"
              />
              <span>
                <span className="block font-bold">Quarantine fresh risky releases</span>
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                  Fresh uploads with install hooks are held for review or denial.
                </span>
              </span>
            </label>
            <label className="flex items-start gap-3 rounded-md border border-border bg-[#0b1224] p-3 text-sm">
              <input
                type="checkbox"
                checked={requirePermit}
                onChange={(event) => setRequirePermit(event.target.checked)}
                className="mt-1 size-4 accent-[#31ffd6]"
              />
              <span>
                <span className="block font-bold">Require signed permit in CI</span>
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                  Downstream jobs must verify admission evidence for the lockfile.
                </span>
              </span>
            </label>
          </div>
        </div>

        <div className="p-5">
          <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Badge variant={mode === "strict" ? "danger" : mode === "review" ? "warning" : "muted"}>
                {selected.label} mode
              </Badge>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{selected.description}</p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <span className="rounded-md border border-border bg-[#071021] px-3 py-2">
                <strong className="block text-base text-foreground">{evaluated.length}</strong>
                artefacts
              </span>
              <span className="rounded-md border border-[#ffd166] bg-[#3a2b0c] px-3 py-2 text-[#ffd166]">
                <strong className="block text-base">{reviewCount}</strong>
                review
              </span>
              <span className="rounded-md border border-[#ff3d81] bg-[#341022] px-3 py-2 text-[#ff7aa8]">
                <strong className="block text-base">{blockedCount}</strong>
                denied
              </span>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {evaluated.map((scenario, index) => {
              const DecisionIcon = decisionIcons[scenario.decision];
              return (
                <motion.div
                  key={scenario.key}
                  layout
                  className="rounded-lg border border-border bg-[#081020] p-4"
                  animate={reduceMotion ? undefined : { y: [0, index === 2 ? -2 : 0, 0] }}
                  transition={{ duration: 0.7, delay: index * 0.08 }}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-mono text-sm font-semibold">{scenario.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{scenario.source}</p>
                    </div>
                    <span
                      className={`inline-flex w-fit items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-bold ${decisionStyles[scenario.decision]}`}
                    >
                      <DecisionIcon className="size-3.5" aria-hidden="true" />
                      {scenario.decision}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {scenario.signals.map((signal) => (
                      <span
                        key={signal}
                        className="rounded-md border border-border bg-[#0b1224] px-2.5 py-1 text-xs text-muted-foreground"
                      >
                        {signal}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-5 rounded-lg border border-[#243451] bg-[#050713] p-4 font-mono text-xs leading-6 text-[#e8f7ff]">
            <div className="text-[#31ffd6]">{">"} palsy gate requirements.txt --mode {mode}</div>
            <div>policy.quarantine_fresh_releases = {String(quarantineFresh)}</div>
            <div>ci.require_signed_permit = {String(requirePermit)}</div>
            <div className={blockedCount > 0 ? "text-[#ff7aa8]" : "text-[#31ffd6]"}>
              result = {blockedCount > 0 ? "blocked before install" : "admitted with evidence"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
