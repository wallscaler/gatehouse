"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Copy,
  Check,
  Eye,
  EyeOff,
  ExternalLink,
  Square,
  Clock,
  Cpu,
  Zap,
  Terminal,
  Container,
  DollarSign,
  MapPin,
  Server,
  Timer,
  AlertTriangle,
  CircleCheck,
  CircleDot,
  CircleX,
  Loader2,
  Link2,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type InstanceStatus = "running" | "pending" | "stopped" | "terminated" | "failed";

interface TimelineEvent {
  status: string;
  time: string;
  description: string;
}

interface InstanceDetail {
  id: string;
  name: string;
  template: string;
  resourceType: "gpu" | "cpu";
  resourceSpec: string;
  gpuModel?: string;
  cpuModel: string;
  ram: string;
  region: string;
  status: InstanceStatus;
  host: string;
  port: number;
  username: string;
  password: string;
  sshCommand: string;
  jupyterUrl?: string;
  jupyterToken?: string;
  accessUrls: { label: string; url: string }[];
  uptime: string;
  duration: string;
  costSoFar: number;
  hourlyRate: number;
  createdAt: string;
  timeline: TimelineEvent[];
  errorMessage?: string;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_INSTANCES: Record<string, InstanceDetail> = {
  "inst-a1b2c3d4": {
    id: "inst-a1b2c3d4",
    name: "PyTorch Training",
    template: "PyTorch 2.3",
    resourceType: "gpu",
    resourceSpec: "RTX 4090 / 24 GB VRAM / 128 GB RAM",
    gpuModel: "NVIDIA GeForce RTX 4090",
    cpuModel: "Intel Core i9-13900K",
    ram: "128 GB DDR5-5600",
    region: "Nairobi, Kenya",
    status: "running",
    host: "nairobi-01.polariscloud.ai",
    port: 22022,
    username: "root",
    password: "gH$9xK2mP!vR4wQ",
    sshCommand: "ssh root@nairobi-01.polariscloud.ai -p 22022",
    jupyterUrl: "https://nairobi-01.polariscloud.ai:8888",
    jupyterToken: "a3f8b2c1d4e5f6a7b8c9d0e1f2a3b4c5",
    accessUrls: [
      { label: "Jupyter Lab", url: "https://nairobi-01.polariscloud.ai:8888" },
      { label: "TensorBoard", url: "https://nairobi-01.polariscloud.ai:6006" },
    ],
    uptime: "4h 23m",
    duration: "12 Hours",
    costSoFar: 3.72,
    hourlyRate: 0.85,
    createdAt: "2026-02-07T06:10:00Z",
    timeline: [
      { status: "created", time: "2026-02-07T06:10:00Z", description: "Instance created" },
      { status: "pulling", time: "2026-02-07T06:10:15Z", description: "Pulling PyTorch 2.3 image" },
      { status: "started", time: "2026-02-07T06:12:30Z", description: "Container started" },
      { status: "running", time: "2026-02-07T06:12:45Z", description: "Instance is running" },
    ],
  },
  "inst-e5f6g7h8": {
    id: "inst-e5f6g7h8",
    name: "Ubuntu Dev Box",
    template: "Ubuntu 22.04",
    resourceType: "cpu",
    resourceSpec: "AMD Ryzen 9 7950X / 16C 32T / 64 GB RAM",
    cpuModel: "AMD Ryzen 9 7950X",
    ram: "64 GB DDR5-5600",
    region: "Lagos, Nigeria",
    status: "running",
    host: "lagos-02.polariscloud.ai",
    port: 22022,
    username: "root",
    password: "kL$7nM3jR!wT9xB",
    sshCommand: "ssh root@lagos-02.polariscloud.ai -p 22022",
    accessUrls: [],
    uptime: "12h 07m",
    duration: "1 Day",
    costSoFar: 3.02,
    hourlyRate: 0.25,
    createdAt: "2026-02-06T22:26:00Z",
    timeline: [
      { status: "created", time: "2026-02-06T22:26:00Z", description: "Instance created" },
      { status: "started", time: "2026-02-06T22:27:10Z", description: "Container started" },
      { status: "running", time: "2026-02-06T22:27:15Z", description: "Instance is running" },
    ],
  },
  "inst-q7r8s9t0": {
    id: "inst-q7r8s9t0",
    name: "TensorFlow Batch Job",
    template: "TensorFlow 2.16",
    resourceType: "gpu",
    resourceSpec: "H100 / 80 GB VRAM / 512 GB RAM",
    gpuModel: "NVIDIA H100 SXM5",
    cpuModel: "Intel Xeon w9-3495X",
    ram: "512 GB DDR5-4800",
    region: "London, UK",
    status: "terminated",
    host: "london-01.polariscloud.ai",
    port: 22022,
    username: "root",
    password: "tR$2pQ8vN!xM5kJ",
    sshCommand: "ssh root@london-01.polariscloud.ai -p 22022",
    accessUrls: [],
    uptime: "23h 58m",
    duration: "1 Day",
    costSoFar: 107.82,
    hourlyRate: 4.50,
    createdAt: "2026-02-03T10:00:00Z",
    timeline: [
      { status: "created", time: "2026-02-03T10:00:00Z", description: "Instance created" },
      { status: "started", time: "2026-02-03T10:02:00Z", description: "Container started" },
      { status: "running", time: "2026-02-03T10:02:10Z", description: "Instance is running" },
      { status: "terminated", time: "2026-02-04T09:58:00Z", description: "Duration expired, instance terminated" },
    ],
  },
};

// Fallback instance
const DEFAULT_INSTANCE: InstanceDetail = {
  id: "inst-unknown",
  name: "Unknown Instance",
  template: "Ubuntu 22.04",
  resourceType: "cpu",
  resourceSpec: "8C / 16 GB RAM",
  cpuModel: "Unknown",
  ram: "16 GB",
  region: "Lagos, Nigeria",
  status: "failed",
  host: "unknown.polariscloud.ai",
  port: 22022,
  username: "root",
  password: "n/a",
  sshCommand: "n/a",
  accessUrls: [],
  uptime: "0m",
  duration: "N/A",
  costSoFar: 0,
  hourlyRate: 0,
  createdAt: "2026-02-07T00:00:00Z",
  timeline: [
    { status: "created", time: "2026-02-07T00:00:00Z", description: "Instance created" },
    { status: "failed", time: "2026-02-07T00:00:30Z", description: "Failed to start" },
  ],
  errorMessage: "Instance not found or has been removed from the system.",
};

function statusBadgeVariant(status: InstanceStatus): "success" | "warning" | "destructive" | "default" {
  switch (status) {
    case "running":
      return "success";
    case "pending":
      return "warning";
    case "stopped":
      return "default";
    case "terminated":
    case "failed":
      return "destructive";
  }
}

function TimelineIcon({ status }: { status: string }) {
  switch (status) {
    case "created":
      return <CircleDot className="h-4 w-4 text-muted-foreground" />;
    case "pulling":
      return <Loader2 className="h-4 w-4 text-copper" />;
    case "started":
      return <CircleCheck className="h-4 w-4 text-fern" />;
    case "running":
      return <CircleCheck className="h-4 w-4 text-fern" />;
    case "terminated":
      return <CircleX className="h-4 w-4 text-red-400" />;
    case "failed":
      return <AlertTriangle className="h-4 w-4 text-red-400" />;
    default:
      return <CircleDot className="h-4 w-4 text-muted-foreground" />;
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function InstanceDetailPage() {
  const params = useParams<{ id: string }>();
  const instance = MOCK_INSTANCES[params.id] ?? { ...DEFAULT_INSTANCE, id: params.id };

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [terminating, setTerminating] = useState(false);

  async function handleCopy(text: string, field: string) {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  }

  function handleTerminate() {
    setTerminating(true);
    // Mock action
    setTimeout(() => setTerminating(false), 2000);
  }

  const createdDate = new Date(instance.createdAt);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Back button */}
      <Link href="/instances">
        <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Instances
        </Button>
      </Link>

      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{instance.name}</h1>
            <Badge variant={statusBadgeVariant(instance.status)}>
              {instance.status}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Container className="h-3.5 w-3.5" />
              {instance.template}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {instance.region}
            </span>
            <span className="font-mono text-xs">
              {instance.id}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {(instance.status === "running" || instance.status === "pending") && (
            <>
              <Button variant="outline" size="sm">
                Extend Duration
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleTerminate}
                disabled={terminating}
                className="gap-1.5 text-red-400 hover:bg-red-900/20 hover:text-red-300 border-red-400/30"
              >
                <Square className="h-3.5 w-3.5" />
                {terminating ? "Terminating..." : "Terminate"}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Error message */}
      {instance.errorMessage && (
        <Card className="border-red-400/30 bg-red-900/10">
          <CardContent className="flex items-start gap-3 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" />
            <div>
              <p className="text-sm font-medium text-red-400">Error</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{instance.errorMessage}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Connection details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Terminal className="h-5 w-5 text-forest" />
                Connection Details
              </CardTitle>
              <CardDescription>
                Use these credentials to access your instance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* SSH command */}
              <div className="rounded-lg bg-mist/50 p-3">
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  SSH Command
                </label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 font-mono text-sm text-foreground break-all">
                    {instance.sshCommand}
                  </code>
                  <button
                    onClick={() => handleCopy(instance.sshCommand, "ssh")}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-background hover:text-foreground transition-colors flex-shrink-0"
                  >
                    {copiedField === "ssh" ? (
                      <Check className="h-4 w-4 text-fern" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Host, port, username grid */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-lg bg-mist/50 p-3">
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    Host
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-foreground">{instance.host}</span>
                    <button
                      onClick={() => handleCopy(instance.host, "host")}
                      className="rounded-md p-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {copiedField === "host" ? (
                        <Check className="h-3.5 w-3.5 text-fern" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="rounded-lg bg-mist/50 p-3">
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    Port
                  </label>
                  <span className="font-mono text-sm text-foreground">{instance.port}</span>
                </div>

                <div className="rounded-lg bg-mist/50 p-3">
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    Username
                  </label>
                  <span className="font-mono text-sm text-foreground">{instance.username}</span>
                </div>
              </div>

              {/* Password */}
              <div className="rounded-lg bg-mist/50 p-3">
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Password
                </label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 font-mono text-sm text-foreground">
                    {showPassword ? instance.password : "\u2022".repeat(16)}
                  </code>
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="rounded-md p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => handleCopy(instance.password, "password")}
                    className="rounded-md p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                    title="Copy password"
                  >
                    {copiedField === "password" ? (
                      <Check className="h-4 w-4 text-fern" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Jupyter URL + Token */}
              {instance.jupyterUrl && (
                <div className="rounded-lg bg-mist/50 p-3">
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Jupyter Lab
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 font-mono text-sm text-fern break-all">
                      {instance.jupyterUrl}
                    </code>
                    <button
                      onClick={() => handleCopy(instance.jupyterUrl!, "jupyter")}
                      className="rounded-md p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {copiedField === "jupyter" ? (
                        <Check className="h-4 w-4 text-fern" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {instance.jupyterToken && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Token:</span>
                      <code className="font-mono text-xs text-foreground">
                        {instance.jupyterToken}
                      </code>
                      <button
                        onClick={() => handleCopy(instance.jupyterToken!, "token")}
                        className="rounded-md p-1 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {copiedField === "token" ? (
                          <Check className="h-3.5 w-3.5 text-fern" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resource specs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Server className="h-5 w-5 text-forest" />
                Resource Specs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="flex items-center justify-between rounded-lg bg-mist/50 px-3 py-2.5">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Cpu className="h-4 w-4" />
                    CPU
                  </span>
                  <span className="text-sm font-medium text-foreground">{instance.cpuModel}</span>
                </div>
                {instance.gpuModel && (
                  <div className="flex items-center justify-between rounded-lg bg-mist/50 px-3 py-2.5">
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Zap className="h-4 w-4" />
                      GPU
                    </span>
                    <span className="text-sm font-medium text-foreground">{instance.gpuModel}</span>
                  </div>
                )}
                <div className="flex items-center justify-between rounded-lg bg-mist/50 px-3 py-2.5">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Server className="h-4 w-4" />
                    RAM
                  </span>
                  <span className="text-sm font-medium text-foreground">{instance.ram}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-mist/50 px-3 py-2.5">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    Region
                  </span>
                  <span className="text-sm font-medium text-foreground">{instance.region}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-5 w-5 text-forest" />
                Status Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {instance.timeline.map((event, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <TimelineIcon status={event.status} />
                      {i < instance.timeline.length - 1 && (
                        <div className="my-1 h-6 w-px bg-border" />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium text-foreground">{event.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.time).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Usage session info */}
          <Card className="border-forest/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <DollarSign className="h-5 w-5 text-forest" />
                Usage &amp; Cost
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Hourly Rate</span>
                  <span className="text-foreground">${instance.hourlyRate.toFixed(2)} /hr</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Uptime</span>
                  <span className="text-foreground">{instance.uptime}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="text-foreground">{instance.duration}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span className="text-foreground">
                    {createdDate.toLocaleDateString("en-US", { dateStyle: "medium" })}
                  </span>
                </div>
              </div>

              <div className="rounded-lg border border-forest/20 bg-forest/5 p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Cost so far</p>
                <span className="text-2xl font-bold text-fern">
                  ${instance.costSoFar.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Access URLs */}
          {instance.accessUrls.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Link2 className="h-5 w-5 text-forest" />
                  Access URLs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {instance.accessUrls.map((url, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg bg-mist/50 px-3 py-2.5"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{url.label}</p>
                      <p className="font-mono text-xs text-muted-foreground">{url.url}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopy(url.url, `url-${i}`)}
                        className="rounded-md p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {copiedField === `url-${i}` ? (
                          <Check className="h-3.5 w-3.5 text-fern" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <a
                        href={url.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Quick actions */}
          <Card>
            <CardContent className="p-4 space-y-2">
              {(instance.status === "running" || instance.status === "pending") && (
                <>
                  <Button variant="outline" className="w-full gap-2 justify-start" size="sm">
                    <Timer className="h-4 w-4" />
                    Extend Duration
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full gap-2 justify-start text-red-400 hover:bg-red-900/20 hover:text-red-300 border-red-400/30"
                    size="sm"
                    onClick={handleTerminate}
                    disabled={terminating}
                  >
                    <Square className="h-4 w-4" />
                    {terminating ? "Terminating..." : "Terminate Instance"}
                  </Button>
                </>
              )}
              <Link href="/compute" className="block">
                <Button variant="ghost" className="w-full gap-2 justify-start" size="sm">
                  <Server className="h-4 w-4" />
                  Browse Marketplace
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
