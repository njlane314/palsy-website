"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";

type CodeBlockProps = {
  code: string;
  className?: string;
};

export function CodeBlock({ code, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className={cn("group relative mt-4", className)}>
      <pre className="overflow-x-auto rounded-lg border border-[#243451] bg-[#050713] p-4 pr-14 font-mono text-xs leading-6 text-[#e8f7ff]">
        <code>{code}</code>
      </pre>
      <button
        type="button"
        onClick={onCopy}
        className="absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-md border border-white/10 bg-white/8 text-white/72 transition-colors hover:bg-white/14 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2"
        aria-label="Copy code"
      >
        {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
      </button>
    </div>
  );
}
