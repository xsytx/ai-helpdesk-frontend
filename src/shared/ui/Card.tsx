import { cn } from "@/shared/lib/cn";
import type { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/60 bg-white p-5 shadow-sm md:p-6",
        className,
      )}
      {...props}
    />
  );
}
