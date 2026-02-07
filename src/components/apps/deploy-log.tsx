"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { AppCategory } from "@/lib/apps/registry";

interface DeployLogProps {
  appName: string;
  appCategory: AppCategory;
  status: "pending" | "installing" | "running" | "failed";
  onComplete: () => void;
}

function getTimestamp(): string {
  const now = new Date();
  return now.toLocaleTimeString("en-US", { hour12: false });
}

function getLogMessages(appName: string, category: AppCategory): string[] {
  const base = [
    `Starting deployment for ${appName}...`,
    "Initializing container runtime...",
  ];

  const categoryLogs: Record<AppCategory, string[]> = {
    ai_ml: [
      "Pulling docker image...",
      "Downloading model weights...",
      "Loading CUDA drivers...",
      "Configuring GPU memory allocation...",
      "Starting inference server...",
      "Warming up model pipeline...",
      "Running health checks...",
    ],
    development: [
      "Pulling docker image...",
      "Setting up environment...",
      "Installing packages...",
      "Configuring development tools...",
      "Starting dev server...",
      "Mounting persistent storage...",
      "Running health checks...",
    ],
    desktop: [
      "Pulling docker image...",
      "Initializing display server...",
      "Starting Kasm workspace...",
      "Configuring resolution and DPI...",
      "Setting up audio streaming...",
      "Mounting clipboard bridge...",
      "Running health checks...",
    ],
    games: [
      "Pulling docker image...",
      "Downloading server files...",
      "Generating world...",
      "Configuring server properties...",
      "Starting game server...",
      "Opening network ports...",
      "Running health checks...",
    ],
    tools: [
      "Pulling docker image...",
      "Configuring environment...",
      "Installing dependencies...",
      "Starting service...",
      "Running health checks...",
    ],
  };

  const ending = [
    "All health checks passed.",
    "Deployment complete!",
  ];

  return [...base, ...categoryLogs[category], ...ending];
}

export function DeployLog({ appName, appCategory, status, onComplete }: DeployLogProps) {
  const [lines, setLines] = useState<{ timestamp: string; message: string }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messages = useRef(getLogMessages(appName, appCategory));
  const hasCompleted = useRef(false);

  useEffect(() => {
    if (status === "failed") {
      setLines((prev) => [
        ...prev,
        { timestamp: getTimestamp(), message: "ERROR: Deployment failed. Check logs for details." },
      ]);
      return;
    }

    if (currentIndex >= messages.current.length) {
      if (!hasCompleted.current) {
        hasCompleted.current = true;
        onComplete();
      }
      return;
    }

    // Randomize delay to feel realistic: 400-1800ms
    const delay = 400 + Math.random() * 1400;
    const timer = setTimeout(() => {
      setLines((prev) => [
        ...prev,
        { timestamp: getTimestamp(), message: messages.current[currentIndex] },
      ]);
      setCurrentIndex((i) => i + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [currentIndex, status, onComplete]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      {/* Terminal header */}
      <div className="flex items-center gap-2 border-b border-border bg-[#080c0a] px-4 py-2">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">
          deploy-log -- {appName.toLowerCase().replace(/\s+/g, "-")}
        </span>
      </div>

      {/* Terminal body */}
      <div
        ref={scrollRef}
        className="h-56 overflow-y-auto bg-[#060a08] p-4 font-mono text-xs leading-relaxed"
      >
        {lines.map((line, i) => (
          <div key={i} className="flex gap-2">
            <span className="flex-shrink-0 text-muted-foreground/50">
              [{line.timestamp}]
            </span>
            <span
              className={cn(
                line.message.startsWith("ERROR")
                  ? "text-red-400"
                  : line.message.includes("complete") || line.message.includes("passed")
                    ? "text-fern"
                    : "text-green-400/80"
              )}
            >
              {line.message}
            </span>
          </div>
        ))}
        {currentIndex < messages.current.length && status !== "failed" && (
          <div className="flex gap-2">
            <span className="flex-shrink-0 text-muted-foreground/50">
              [{getTimestamp()}]
            </span>
            <span className="animate-pulse text-green-400/50">...</span>
          </div>
        )}
      </div>
    </div>
  );
}
