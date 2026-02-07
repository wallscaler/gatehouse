"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  ExternalLink,
  Clock,
  AlertTriangle,
  Monitor,
  Cpu,
  Square,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type InstanceStatus = "pending" | "running" | "stopped" | "terminated" | "failed";

interface InstanceCardProps {
  id: string;
  status: InstanceStatus;
  image: string;
  host: string;
  port: number;
  sshUsername: string;
  templateName?: string;
  gpuModel?: string;
  cpuModel?: string;
  startedAt: Date;
  expiresAt?: Date | null;
  jupyterUrl?: string;
  onTerminate?: (id: string) => void;
}

const statusConfig: Record<
  InstanceStatus,
  { label: string; variant: "success" | "warning" | "default" | "destructive" }
> = {
  running: { label: "Running", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  stopped: { label: "Stopped", variant: "default" },
  terminated: { label: "Terminated", variant: "destructive" },
  failed: { label: "Failed", variant: "destructive" },
};

function formatUptime(startedAt: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - startedAt.getTime();
  const totalMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

function formatCountdown(expiresAt: Date): string {
  const now = new Date();
  const diffMs = expiresAt.getTime() - now.getTime();

  if (diffMs <= 0) return "Expired";

  const totalMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  }
  return `${minutes}m remaining`;
}

export function InstanceCard({
  id,
  status,
  image,
  host,
  port,
  sshUsername,
  templateName,
  gpuModel,
  cpuModel,
  startedAt,
  expiresAt,
  jupyterUrl,
  onTerminate,
}: InstanceCardProps) {
  const [copied, setCopied] = useState(false);

  const sshString = `${sshUsername}@${host}:${port}`;
  const { label: statusLabel, variant: statusVariant } = statusConfig[status];

  function handleCopy() {
    navigator.clipboard.writeText(`ssh ${sshUsername}@${host} -p ${port}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const isExpiringSoon =
    expiresAt && expiresAt.getTime() - Date.now() < 3600000 && expiresAt.getTime() > Date.now();

  return (
    <Card>
      <CardContent className="p-5">
        {/* Top row: template/image + status */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold text-foreground">
              {templateName || image}
            </h3>
            {templateName && (
              <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">
                {image}
              </p>
            )}
          </div>
          <Badge variant={statusVariant} className="shrink-0">
            {statusLabel}
          </Badge>
        </div>

        {/* Hardware */}
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          {gpuModel && (
            <span className="inline-flex items-center gap-1">
              <Monitor className="h-3 w-3" />
              {gpuModel}
            </span>
          )}
          {cpuModel && (
            <span className="inline-flex items-center gap-1">
              <Cpu className="h-3 w-3" />
              {cpuModel}
            </span>
          )}
        </div>

        {/* SSH connection */}
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-mist px-3 py-2">
          <code className="min-w-0 flex-1 truncate text-xs text-foreground">
            {sshString}
          </code>
          <button
            onClick={handleCopy}
            className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
            title="Copy SSH command"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-fern" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {/* Timing info */}
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Up {formatUptime(startedAt)}
          </span>
          {expiresAt && (
            <span
              className={cn(
                "inline-flex items-center gap-1",
                isExpiringSoon && "text-copper"
              )}
            >
              {isExpiringSoon && <AlertTriangle className="h-3 w-3" />}
              {formatCountdown(expiresAt)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
          {jupyterUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(jupyterUrl, "_blank")}
            >
              <ExternalLink className="mr-1.5 h-3 w-3" />
              Jupyter
            </Button>
          )}
          {(status === "running" || status === "pending") && onTerminate && (
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto text-red-400 hover:bg-red-900/20 hover:text-red-400"
              onClick={() => onTerminate(id)}
            >
              <Square className="mr-1.5 h-3 w-3" />
              Terminate
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
