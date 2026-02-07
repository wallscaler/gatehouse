"use client";

import { useState } from "react";
import { ChevronDown, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface WebhookEvent {
  id: string;
  eventType: string;
  source: "Clerk" | "Paystack";
  status: "success" | "failed";
  timestamp: string;
  payload: Record<string, unknown>;
}

function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}

export function WebhookRow({
  event,
  onRetry,
}: {
  event: WebhookEvent;
  onRetry?: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b border-border last:border-b-0">
      {/* Collapsed row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-mist/50"
      >
        <div className="flex-1 min-w-0">
          <span className="font-mono text-sm text-foreground">{event.eventType}</span>
        </div>
        <Badge
          variant="default"
          className={cn(
            "shrink-0",
            event.source === "Clerk"
              ? "bg-forest/15 text-forest"
              : "bg-copper/15 text-copper"
          )}
        >
          {event.source}
        </Badge>
        <Badge
          variant={event.status === "success" ? "success" : "destructive"}
          className="shrink-0"
        >
          {event.status}
        </Badge>
        <span className="shrink-0 text-xs text-muted-foreground w-16 text-right">
          {formatRelativeTime(event.timestamp)}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            expanded && "rotate-180"
          )}
        />
      </button>

      {/* Expanded payload */}
      <div
        className={cn(
          "grid transition-all duration-200 ease-in-out",
          expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 pt-1">
            <div className="rounded-lg bg-mist p-4">
              <pre className="overflow-x-auto font-mono text-xs text-foreground leading-relaxed">
                {JSON.stringify(event.payload, null, 2)}
              </pre>
            </div>
            {event.status === "failed" && onRetry && (
              <div className="mt-3 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRetry(event.id);
                  }}
                  className="gap-2"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Retry
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
