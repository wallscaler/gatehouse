"use client";

import { useState } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  Shield,
  Server,
  Cpu,
  MemoryStick,
  Monitor,
  MapPin,
  User,
  Terminal,
  Gauge,
  Container,
  AlertTriangle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PendingResource {
  id: string;
  minerName: string;
  minerEmail: string;
  model: string;
  type: "GPU" | "CPU";
  vram: string;
  ram: string;
  cores: number;
  storage: string;
  location: string;
  ip: string;
  sshPort: number;
  powScore: number;
  dockerReady: boolean;
  verifierNotes: string;
  submittedAt: string;
  systemVerifiedAt: string;
  verifierApprovedAt: string | null;
  hoursWaiting: number;
}

const pendingResources: PendingResource[] = [
  {
    id: "res-u1v2w3x4",
    minerName: "DakarNodes",
    minerEmail: "ops@dakarnodes.sn",
    model: "RTX 4090",
    type: "GPU",
    vram: "24 GB",
    ram: "64 GB",
    cores: 16384,
    storage: "1 TB NVMe",
    location: "Dakar, Senegal",
    ip: "41.82.100.***",
    sshPort: 22,
    powScore: 94,
    dockerReady: true,
    verifierNotes: "Clean system, good network latency (~18ms). Benchmarks match expected performance for RTX 4090.",
    submittedAt: "2026-02-01T10:00:00Z",
    systemVerifiedAt: "2026-02-01T10:05:00Z",
    verifierApprovedAt: "2026-02-01T14:30:00Z",
    hoursWaiting: 148,
  },
  {
    id: "res-y5z6a7b8",
    minerName: "KigaliCompute",
    minerEmail: "admin@kigalicompute.rw",
    model: "L40S",
    type: "GPU",
    vram: "48 GB",
    ram: "96 GB",
    cores: 18176,
    storage: "2 TB NVMe",
    location: "Kigali, Rwanda",
    ip: "41.186.78.***",
    sshPort: 2222,
    powScore: 97,
    dockerReady: true,
    verifierNotes: "Enterprise-grade setup. Excellent cooling and network. L40S benchmark scores above expected. Highly recommended.",
    submittedAt: "2026-02-02T08:00:00Z",
    systemVerifiedAt: "2026-02-02T08:03:00Z",
    verifierApprovedAt: "2026-02-02T16:00:00Z",
    hoursWaiting: 124,
  },
  {
    id: "res-c9d0e1f2",
    minerName: "AbujaMiner",
    minerEmail: "tech@abujaminer.ng",
    model: "RTX 3080",
    type: "GPU",
    vram: "12 GB",
    ram: "32 GB",
    cores: 8704,
    storage: "512 GB SSD",
    location: "Abuja, Nigeria",
    ip: "102.134.xx.***",
    sshPort: 22,
    powScore: 72,
    dockerReady: true,
    verifierNotes: "Benchmark scores slightly below expected. Network connectivity is stable but latency is higher (~45ms). Acceptable for non-critical workloads.",
    submittedAt: "2026-02-03T12:00:00Z",
    systemVerifiedAt: "2026-02-03T12:08:00Z",
    verifierApprovedAt: "2026-02-04T09:00:00Z",
    hoursWaiting: 96,
  },
  {
    id: "res-g3h4i5j6",
    minerName: "AccraCompute",
    minerEmail: "infra@accracompute.gh",
    model: "EPYC 7763",
    type: "CPU",
    vram: "N/A",
    ram: "256 GB",
    cores: 64,
    storage: "4 TB NVMe RAID",
    location: "Accra, Ghana",
    ip: "154.160.1.***",
    sshPort: 22,
    powScore: 88,
    dockerReady: true,
    verifierNotes: "CPU-only node, excellent for batch processing. 64 physical cores, 128 threads confirmed. Docker and networking in good order.",
    submittedAt: "2026-02-04T06:00:00Z",
    systemVerifiedAt: "2026-02-04T06:04:00Z",
    verifierApprovedAt: "2026-02-04T18:00:00Z",
    hoursWaiting: 72,
  },
  {
    id: "res-k7l8m9n0",
    minerName: "LuandaGPU",
    minerEmail: "gpu@luandatech.ao",
    model: "H100",
    type: "GPU",
    vram: "80 GB",
    ram: "256 GB",
    cores: 16896,
    storage: "2 TB NVMe",
    location: "Luanda, Angola",
    ip: "105.168.xx.***",
    sshPort: 2222,
    powScore: 65,
    dockerReady: false,
    verifierNotes: "H100 detected but Docker daemon is not running. POW score lower than expected -- possible thermal throttling. Needs Docker fix before approval.",
    submittedAt: "2026-02-05T14:00:00Z",
    systemVerifiedAt: "2026-02-05T14:12:00Z",
    verifierApprovedAt: null,
    hoursWaiting: 42,
  },
];

function getPriorityColor(hours: number) {
  if (hours > 120) return "text-red-400";
  if (hours > 72) return "text-copper";
  return "text-muted-foreground";
}

function getPriorityLabel(hours: number) {
  if (hours > 120) return "High";
  if (hours > 72) return "Medium";
  return "Normal";
}

function getPriorityBadgeVariant(hours: number): "destructive" | "warning" | "default" {
  if (hours > 120) return "destructive";
  if (hours > 72) return "warning";
  return "default";
}

export default function PendingReviewPage() {
  const [notes, setNotes] = useState<Record<string, string>>({});

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-deep-moss">Pending Verification Queue</h1>
        <p className="mt-1 text-muted-foreground">
          {pendingResources.length} resources awaiting admin approval.
        </p>
      </div>

      <div className="space-y-6">
        {pendingResources.map((resource) => (
          <Card key={resource.id} className="overflow-hidden">
            {/* Priority Banner */}
            <div
              className={cn(
                "flex items-center justify-between border-b border-border px-6 py-2",
                resource.hoursWaiting > 120
                  ? "bg-red-900/10"
                  : resource.hoursWaiting > 72
                    ? "bg-copper/5"
                    : "bg-mist/50"
              )}
            >
              <div className="flex items-center gap-2">
                <Clock className={cn("h-3.5 w-3.5", getPriorityColor(resource.hoursWaiting))} />
                <span className={cn("text-xs font-medium", getPriorityColor(resource.hoursWaiting))}>
                  Waiting {resource.hoursWaiting}h
                </span>
                <Badge variant={getPriorityBadgeVariant(resource.hoursWaiting)}>
                  {getPriorityLabel(resource.hoursWaiting)} Priority
                </Badge>
              </div>
              <span className="font-mono text-xs text-muted-foreground">{resource.id}</span>
            </div>

            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {resource.model}
                    <Badge variant={resource.type === "GPU" ? "success" : "default"}>
                      {resource.type}
                    </Badge>
                  </CardTitle>
                  <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      {resource.minerName}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {resource.location}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {resource.dockerReady ? (
                    <Badge variant="success">
                      <Container className="mr-1 h-3 w-3" />
                      Docker Ready
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <Container className="mr-1 h-3 w-3" />
                      Docker Not Ready
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Hardware Specs Grid */}
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Hardware Specs
                </p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {resource.type === "GPU" && (
                    <div className="flex items-center gap-3 rounded-lg border border-border bg-mist/50 p-3">
                      <Monitor className="h-5 w-5 text-forest" />
                      <div>
                        <p className="text-xs text-muted-foreground">VRAM</p>
                        <p className="text-sm font-medium text-foreground">{resource.vram}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3 rounded-lg border border-border bg-mist/50 p-3">
                    <Cpu className="h-5 w-5 text-forest" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {resource.type === "GPU" ? "CUDA Cores" : "CPU Cores"}
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {resource.cores.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-border bg-mist/50 p-3">
                    <MemoryStick className="h-5 w-5 text-forest" />
                    <div>
                      <p className="text-xs text-muted-foreground">System RAM</p>
                      <p className="text-sm font-medium text-foreground">{resource.ram}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-border bg-mist/50 p-3">
                    <Server className="h-5 w-5 text-forest" />
                    <div>
                      <p className="text-xs text-muted-foreground">Storage</p>
                      <p className="text-sm font-medium text-foreground">{resource.storage}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connection + POW */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    SSH Connection
                  </p>
                  <div className="rounded-lg border border-border bg-mist/50 p-3">
                    <div className="flex items-center gap-2">
                      <Terminal className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono text-sm text-foreground">
                        {resource.ip}:{resource.sshPort}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    POW Score
                  </p>
                  <div className="rounded-lg border border-border bg-mist/50 p-3">
                    <div className="flex items-center gap-3">
                      <Gauge className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">
                            {resource.powScore}/100
                          </span>
                          <span
                            className={cn(
                              "text-xs font-medium",
                              resource.powScore >= 90
                                ? "text-fern"
                                : resource.powScore >= 70
                                  ? "text-copper"
                                  : "text-red-400"
                            )}
                          >
                            {resource.powScore >= 90
                              ? "Excellent"
                              : resource.powScore >= 70
                                ? "Acceptable"
                                : "Below Threshold"}
                          </span>
                        </div>
                        <div className="mt-1.5 h-1.5 rounded-full bg-background">
                          <div
                            className={cn(
                              "h-1.5 rounded-full transition-all",
                              resource.powScore >= 90
                                ? "bg-fern"
                                : resource.powScore >= 70
                                  ? "bg-copper"
                                  : "bg-red-400"
                            )}
                            style={{ width: `${resource.powScore}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verifier Notes */}
              {resource.verifierNotes && (
                <div>
                  <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Verifier Notes
                  </p>
                  <div className="rounded-lg border border-forest/20 bg-forest/5 p-4">
                    <p className="text-sm leading-relaxed text-foreground">
                      {resource.verifierNotes}
                    </p>
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Verification Timeline
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="flex items-center gap-1 rounded-full bg-fern/10 px-3 py-1 text-fern">
                    <CheckCircle className="h-3 w-3" />
                    Submitted
                  </span>
                  <span className="text-muted-foreground">&rarr;</span>
                  <span className="flex items-center gap-1 rounded-full bg-fern/10 px-3 py-1 text-fern">
                    <CheckCircle className="h-3 w-3" />
                    System Verified
                  </span>
                  <span className="text-muted-foreground">&rarr;</span>
                  {resource.verifierApprovedAt ? (
                    <span className="flex items-center gap-1 rounded-full bg-fern/10 px-3 py-1 text-fern">
                      <CheckCircle className="h-3 w-3" />
                      Verifier Approved
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full bg-copper/10 px-3 py-1 text-copper">
                      <Clock className="h-3 w-3" />
                      Awaiting Verifier
                    </span>
                  )}
                  <span className="text-muted-foreground">&rarr;</span>
                  <span className="flex items-center gap-1 rounded-full bg-copper/10 px-3 py-1 text-copper">
                    <Clock className="h-3 w-3" />
                    Awaiting Admin
                  </span>
                </div>
              </div>

              {/* Admin Notes + Actions */}
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Admin Notes
                </p>
                <textarea
                  value={notes[resource.id] || ""}
                  onChange={(e) =>
                    setNotes((prev) => ({ ...prev, [resource.id]: e.target.value }))
                  }
                  placeholder="Add notes about your decision..."
                  className="h-20 w-full rounded-lg border border-border bg-card p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-forest/50"
                />
              </div>
            </CardContent>

            <CardFooter className="gap-3 border-t border-border bg-mist/30 p-4">
              {!resource.dockerReady && (
                <div className="mr-auto flex items-center gap-2 text-xs text-copper">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Docker is not ready on this node
                </div>
              )}
              <div className="ml-auto flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 border-red-500/30 text-red-400 hover:bg-red-900/20"
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
                <Button size="sm" className="gap-1.5">
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
