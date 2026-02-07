import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "destructive";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        {
          "bg-mist text-foreground": variant === "default",
          "bg-fern/10 text-fern": variant === "success",
          "bg-copper/10 text-copper": variant === "warning",
          "bg-red-900/30 text-red-400": variant === "destructive",
        },
        className
      )}
      {...props}
    />
  );
}
