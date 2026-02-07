"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Server,
  Copy,
  Check,
  ExternalLink,
  Square,
  Cpu,
  Zap,
  Clock,
  Terminal,
  Container,
  ChevronRight,
  Plus,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type InstanceStatus = "running" | "pending" | "stopped" | "terminated";

interface Instance {
  id: string;
  name: string;
  template: string;
  resourceType: "gpu" | "cpu";
  resourceSpec: string;
  region: string;
  status: InstanceStatus;
  sshCommand: string;
  jupyterUrl?: string;
  uptime: string;
  createdAt: string;
  hourlyRate: number;
  costSoFar: number;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_INSTANCES: Instance[] = [
  {
    id: "inst-a1b2c3d4",
    name: "PyTorch Training",
    template: "PyTorch 2.3",
    resourceType: "gpu",
    resourceSpec: "RTX 4090 / 24 GB VRAM / 128 GB RAM",
    region: "Nairobi, Kenya",
    status: "running",
    sshCommand: "ssh root@nairobi-01.polariscloud.ai -p 22022",
    jupyterUrl: "https://nairobi-01.polariscloud.ai:8888",
    uptime: "4h 23m",
    createdAt: "2026-02-07T06:10:00Z",
    hourlyRate: 0.85,
    costSoFar: 3.72,
  },
  {
    id: "inst-e5f6g7h8",
    name: "Ubuntu Dev Box",
    template: "Ubuntu 22.04",
    resourceType: "cpu",
    resourceSpec: "AMD Ryzen 9 7950X / 16C 32T / 64 GB RAM",
    region: "Lagos, Nigeria",
    status: "running",
    sshCommand: "ssh root@lagos-02.polariscloud.ai -p 22022",
    uptime: "12h 07m",
    createdAt: "2026-02-06T22:26:00Z",
    hourlyRate: 0.25,
    costSoFar: 3.02,
  },
  {
    id: "inst-i9j0k1l2",
    name: "ComfyUI Workspace",
    template: "ComfyUI",
    resourceType: "gpu",
    resourceSpec: "RTX 3090 / 24 GB VRAM / 64 GB RAM",
    region: "Lagos, Nigeria",
    status: "pending",
    sshCommand: "ssh root@lagos-01.polariscloud.ai -p 22022",
    uptime: "0m",
    createdAt: "2026-02-07T10:30:00Z",
    hourlyRate: 0.45,
    costSoFar: 0,
  },
  {
    id: "inst-m3n4o5p6",
    name: "Jupyter Notebook",
    template: "Jupyter Lab",
    resourceType: "gpu",
    resourceSpec: "A100 40GB / 256 GB RAM",
    region: "Cape Town, South Africa",
    status: "stopped",
    sshCommand: "ssh root@capetown-01.polariscloud.ai -p 22022",
    jupyterUrl: "https://capetown-01.polariscloud.ai:8888",
    uptime: "8h 45m",
    createdAt: "2026-02-05T14:00:00Z",
    hourlyRate: 2.10,
    costSoFar: 18.37,
  },
  {
    id: "inst-q7r8s9t0",
    name: "TensorFlow Batch Job",
    template: "TensorFlow 2.16",
    resourceType: "gpu",
    resourceSpec: "H100 / 80 GB VRAM / 512 GB RAM",
    region: "London, UK",
    status: "terminated",
    sshCommand: "ssh root@london-01.polariscloud.ai -p 22022",
    uptime: "23h 58m",
    createdAt: "2026-02-03T10:00:00Z",
    hourlyRate: 4.50,
    costSoFar: 107.82,
  },
  {
    id: "inst-u1v2w3x4",
    name: "VS Code Remote Dev",
    template: "VS Code Server",
    resourceType: "cpu",
    resourceSpec: "Intel Xeon w9-3495X / 56C 112T / 256 GB RAM",
    region: "Amsterdam, Netherlands",
    status: "terminated",
    sshCommand: "ssh root@amsterdam-01.polariscloud.ai -p 22022",
    uptime: "5h 12m",
    createdAt: "2026-02-01T08:00:00Z",
    hourlyRate: 1.20,
    costSoFar: 6.24,
  },
];

const STATUS_TABS: { label: string; value: "all" | InstanceStatus }[] = [
  { label: "All", value: "all" },
  { label: "Running", value: "running" },
  { label: "Pending", value: "pending" },
  { label: "Stopped", value: "stopped" },
  { label: "Terminated", value: "terminated" },
];

function statusBadgeVariant(status: InstanceStatus): "success" | "warning" | "destructive" | "default" {
  switch (status) {
    case "running":
      return "success";
    case "pending":
      return "warning";
    case "stopped":
      return "default";
    case "terminated":
      return "destructive";
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function InstancesPage() {
  const [tab, setTab] = useState<"all" | InstanceStatus>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [terminatingId, setTerminatingId] = useState<string | null>(null);
  const [instances, setInstances] = useState(MOCK_INSTANCES);

  const filtered = tab === "all" ? instances : instances.filter((i) => i.status === tab);
  const runningCount = instances.filter((i) => i.status === "running").length;

  async function handleCopy(text: string, id: string) {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function handleTerminate(id: string) {
    if (terminatingId === id) {
      setInstances((prev) =>
        prev.map((inst) => (inst.id === id ? { ...inst, status: "terminated" as InstanceStatus } : inst))
      );
      setTerminatingId(null);
    } else {
      setTerminatingId(id);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">My Instances</h1>
            <Badge variant="default" className="text-sm px-3 py-1">
              {instances.length}
            </Badge>
          </div>
          <p className="mt-1 text-muted-foreground">
            Manage your running and recent container instances.
          </p>
        </div>
        <Link href="/compute">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Instance
          </Button>
        </Link>
      </div>

      {/* Tab filters */}
      <div className="flex gap-1 rounded-lg border border-border bg-background p-1">
        {STATUS_TABS.map((t) => {
          const count =
            t.value === "all"
              ? instances.length
              : instances.filter((i) => i.status === t.value).length;
          return (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                tab === t.value
                  ? "bg-forest text-white"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.label}
              <span
                className={cn(
                  "rounded-full px-1.5 text-xs",
                  tab === t.value ? "bg-white/20 text-white" : "bg-mist text-muted-foreground"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Instance list */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Container className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm font-medium text-foreground">No instances found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {tab === "all"
                ? "Deploy your first instance from the Compute Marketplace."
                : `No ${tab} instances right now.`}
            </p>
            {tab === "all" && (
              <Link href="/compute">
                <Button variant="ghost" size="sm" className="mt-4 gap-1.5">
                  <Plus className="h-3.5 w-3.5" />
                  Browse Marketplace
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((instance) => (
            <Card
              key={instance.id}
              className={cn(
                "transition-colors",
                instance.status === "terminated" && "opacity-60"
              )}
            >
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  {/* Left: info */}
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/instances/${instance.id}`}
                        className="font-semibold text-foreground hover:text-fern transition-colors"
                      >
                        {instance.name}
                      </Link>
                      <Badge variant={statusBadgeVariant(instance.status)}>
                        {instance.status}
                      </Badge>
                      <Badge variant={instance.resourceType === "gpu" ? "success" : "warning"}>
                        {instance.resourceType.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Container className="h-3 w-3" />
                        {instance.template}
                      </span>
                      <span className="flex items-center gap-1">
                        {instance.resourceType === "gpu" ? (
                          <Zap className="h-3 w-3" />
                        ) : (
                          <Cpu className="h-3 w-3" />
                        )}
                        {instance.resourceSpec}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Uptime: {instance.uptime}
                      </span>
                    </div>

                    {/* SSH command */}
                    {(instance.status === "running" || instance.status === "pending") && (
                      <div className="flex items-center gap-2">
                        <code className="rounded-md bg-mist px-2.5 py-1 font-mono text-xs text-foreground">
                          {instance.sshCommand}
                        </code>
                        <button
                          onClick={() => handleCopy(instance.sshCommand, instance.id + "-ssh")}
                          className="rounded-md p-1 text-muted-foreground hover:bg-mist hover:text-foreground transition-colors"
                          title="Copy SSH command"
                        >
                          {copiedId === instance.id + "-ssh" ? (
                            <Check className="h-3.5 w-3.5 text-fern" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Right: actions */}
                  <div className="flex flex-shrink-0 items-center gap-2">
                    {instance.jupyterUrl && instance.status === "running" && (
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <ExternalLink className="h-3.5 w-3.5" />
                        Jupyter
                      </Button>
                    )}

                    {(instance.status === "running" || instance.status === "pending") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTerminate(instance.id)}
                        className={cn(
                          "gap-1.5",
                          terminatingId === instance.id
                            ? "border-red-400/40 text-red-400 hover:bg-red-900/20"
                            : "text-muted-foreground hover:text-red-400"
                        )}
                      >
                        <Square className="h-3.5 w-3.5" />
                        {terminatingId === instance.id ? "Confirm?" : "Terminate"}
                      </Button>
                    )}

                    <Link href={`/instances/${instance.id}`}>
                      <Button variant="ghost" size="sm" className="gap-1">
                        Details
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary footer */}
      {instances.length > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
          <span className="text-sm text-muted-foreground">
            {runningCount} running instance{runningCount !== 1 ? "s" : ""}
          </span>
          <span className="text-sm text-foreground">
            Total spend: <span className="font-semibold">${instances.reduce((sum, i) => sum + i.costSoFar, 0).toFixed(2)}</span>
          </span>
        </div>
      )}
    </div>
  );
}
