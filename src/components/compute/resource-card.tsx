"use client";

import { Cpu, Monitor, MemoryStick, HardDrive, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { StatusIndicator } from "./status-indicator";
import { SpecsBadge } from "./specs-badge";

interface ResourceCardProps {
  id: string;
  resourceType: "cpu" | "gpu";
  gpuModel?: string;
  cpuModel?: string;
  gpuCount?: number;
  gpuVramGb?: number;
  cpuCores?: number;
  ramGb: number;
  storageGb: number;
  hourlyPrice: number;
  region: string;
  country: string;
  isOnline: boolean;
  health: "healthy" | "warning" | "critical";
  onClick?: (id: string) => void;
}

export function ResourceCard({
  id,
  resourceType,
  gpuModel,
  cpuModel,
  gpuCount,
  gpuVramGb,
  cpuCores,
  ramGb,
  storageGb,
  hourlyPrice,
  region,
  country,
  isOnline,
  health,
  onClick,
}: ResourceCardProps) {
  const modelName = resourceType === "gpu" ? gpuModel : cpuModel;

  return (
    <Card
      className={cn(
        "transition-colors",
        onClick && "cursor-pointer hover:border-forest/40 hover:bg-card/80"
      )}
      onClick={() => onClick?.(id)}
    >
      <CardContent className="p-5">
        {/* Top row: type badge + status + health */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {resourceType === "gpu" ? (
              <Badge className="bg-forest/15 text-forest">
                <Monitor className="mr-1 h-3 w-3" />
                GPU
              </Badge>
            ) : (
              <Badge className="bg-copper/15 text-copper">
                <Cpu className="mr-1 h-3 w-3" />
                CPU
              </Badge>
            )}
            <StatusIndicator status={health} showLabel />
          </div>
          <StatusIndicator status={isOnline ? "online" : "offline"} showLabel />
        </div>

        {/* Model name */}
        <div className="mt-3">
          <h3 className="text-base font-semibold text-foreground">
            {modelName || "Unknown"}
          </h3>
          {resourceType === "gpu" && gpuCount && gpuCount > 1 && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {gpuCount}x GPU
            </p>
          )}
        </div>

        {/* Specs grid */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {resourceType === "gpu" && gpuVramGb && (
            <SpecsBadge type="vram" value={`${gpuVramGb}GB VRAM`} />
          )}
          {cpuCores && (
            <SpecsBadge type="cpu" value={`${cpuCores} cores`} />
          )}
          <SpecsBadge type="ram" value={`${ramGb}GB RAM`} />
          <SpecsBadge type="storage" value={`${storageGb}GB`} />
        </div>

        {/* Bottom row: price + region */}
        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
          <span className="text-lg font-bold text-foreground">
            ${hourlyPrice.toFixed(2)}
            <span className="text-xs font-normal text-muted-foreground">/hr</span>
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {region}, {country}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
