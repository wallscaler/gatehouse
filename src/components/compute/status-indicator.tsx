import { cn } from "@/lib/utils";

type Status = "online" | "offline" | "pending" | "healthy" | "warning" | "critical";

interface StatusIndicatorProps {
  status: Status;
  showLabel?: boolean;
  className?: string;
}

const dotColorMap: Record<Status, string> = {
  online: "bg-fern",
  healthy: "bg-fern",
  warning: "bg-copper",
  pending: "bg-lichen",
  offline: "bg-red-400",
  critical: "bg-red-400",
};

const labelMap: Record<Status, string> = {
  online: "Online",
  offline: "Offline",
  pending: "Pending",
  healthy: "Healthy",
  warning: "Warning",
  critical: "Critical",
};

const labelColorMap: Record<Status, string> = {
  online: "text-fern",
  healthy: "text-fern",
  warning: "text-copper",
  pending: "text-lichen",
  offline: "text-red-400",
  critical: "text-red-400",
};

export function StatusIndicator({
  status,
  showLabel = false,
  className,
}: StatusIndicatorProps) {
  const shouldPulse = status === "online";

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        {shouldPulse && (
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-50",
              dotColorMap[status]
            )}
          />
        )}
        <span
          className={cn(
            "relative inline-flex h-2.5 w-2.5 rounded-full",
            dotColorMap[status]
          )}
        />
      </span>
      {showLabel && (
        <span className={cn("text-xs font-medium", labelColorMap[status])}>
          {labelMap[status]}
        </span>
      )}
    </span>
  );
}
