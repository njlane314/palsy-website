import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow-[0_0_18px_rgba(49,255,214,0.22)]",
        muted: "border-[#2b3e63] bg-[#0b1428]/84 text-[#9fb3cf]",
        warning: "border-[#ffd166]/45 bg-[#3a2b0c] text-[#ffd166]",
        danger: "border-[#ff3d81]/45 bg-[#341022] text-[#ff7aa8]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}
