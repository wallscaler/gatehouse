import { Cpu, Monitor, MemoryStick, HardDrive } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpecsBadgeProps {
  type: "gpu" | "cpu" | "ram" | "storage" | "vram";
  value: string;
  className?: string;
}

const iconMap = {
  gpu: Monitor,
  cpu: Cpu,
  ram: MemoryStick,
  storage: HardDrive,
  vram: Monitor,
} as const;

export function SpecsBadge({ type, value, className }: SpecsBadgeProps) {
  const Icon = iconMap[type];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-mist px-2.5 py-1 text-xs font-medium text-muted-foreground",
        className
      )}
    >
      <Icon className="h-3 w-3 shrink-0" />
      {value}
    </span>
  );
}
