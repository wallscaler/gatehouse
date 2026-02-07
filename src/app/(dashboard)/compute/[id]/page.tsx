"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Cpu,
  Zap,
  MemoryStick,
  HardDrive,
  MapPin,
  Globe,
  Clock,
  Activity,
  Shield,
  Terminal,
  Container,
  ChevronRight,
  Check,
  DollarSign,
  Server,
  Wifi,
  Hash,
  Layers,
  CircleCheck,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ResourceDetail {
  id: string;
  type: "gpu" | "cpu";
  name: string;
  gpuModel?: string;
  gpuVram?: string;
  gpuCount?: number;
  gpuCudaCores?: number;
  gpuTensorCores?: number;
  cpuModel: string;
  cpuCores: number;
  cpuThreads: number;
  cpuArchitecture: string;
  ram: string;
  storage: string;
  storageType: string;
  region: string;
  country: string;
  connectionRtt: string;
  sshPort: number;
  cpuPowScore: number;
  gpuPowScore?: number;
  dockerReady: boolean;
  pricePerHour: number;
  status: "online" | "offline";
  reliabilityScore: number;
  lastHeartbeat: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  tag: string;
}

interface SshKey {
  id: string;
  name: string;
  fingerprint: string;
  isDefault: boolean;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_RESOURCES: Record<string, ResourceDetail> = {
  "gpu-rtx3090-lagos-01": {
    id: "gpu-rtx3090-lagos-01",
    type: "gpu",
    name: "Adeola's RTX 3090 Node",
    gpuModel: "NVIDIA GeForce RTX 3090",
    gpuVram: "24 GB GDDR6X",
    gpuCount: 1,
    gpuCudaCores: 10496,
    gpuTensorCores: 328,
    cpuModel: "AMD Ryzen 9 5900X",
    cpuCores: 12,
    cpuThreads: 24,
    cpuArchitecture: "x86_64 (Zen 3)",
    ram: "64 GB DDR4-3600",
    storage: "1 TB",
    storageType: "NVMe SSD",
    region: "West Africa",
    country: "Lagos, Nigeria",
    connectionRtt: "45ms",
    sshPort: 22022,
    cpuPowScore: 8750,
    gpuPowScore: 14200,
    dockerReady: true,
    pricePerHour: 0.45,
    status: "online",
    reliabilityScore: 98,
    lastHeartbeat: "2026-02-07T10:32:00Z",
  },
  "gpu-rtx4090-nairobi-01": {
    id: "gpu-rtx4090-nairobi-01",
    type: "gpu",
    name: "Wanjiku's RTX 4090 Rig",
    gpuModel: "NVIDIA GeForce RTX 4090",
    gpuVram: "24 GB GDDR6X",
    gpuCount: 1,
    gpuCudaCores: 16384,
    gpuTensorCores: 512,
    cpuModel: "Intel Core i9-13900K",
    cpuCores: 24,
    cpuThreads: 32,
    cpuArchitecture: "x86_64 (Raptor Lake)",
    ram: "128 GB DDR5-5600",
    storage: "2 TB",
    storageType: "NVMe SSD",
    region: "East Africa",
    country: "Nairobi, Kenya",
    connectionRtt: "62ms",
    sshPort: 22022,
    cpuPowScore: 12400,
    gpuPowScore: 21600,
    dockerReady: true,
    pricePerHour: 0.85,
    status: "online",
    reliabilityScore: 97,
    lastHeartbeat: "2026-02-07T10:31:45Z",
  },
  "gpu-h100-london-01": {
    id: "gpu-h100-london-01",
    type: "gpu",
    name: "London H100 Server",
    gpuModel: "NVIDIA H100 SXM5",
    gpuVram: "80 GB HBM3",
    gpuCount: 1,
    gpuCudaCores: 16896,
    gpuTensorCores: 528,
    cpuModel: "Intel Xeon w9-3495X",
    cpuCores: 56,
    cpuThreads: 112,
    cpuArchitecture: "x86_64 (Sapphire Rapids)",
    ram: "512 GB DDR5-4800",
    storage: "8 TB",
    storageType: "NVMe SSD",
    region: "Europe",
    country: "London, UK",
    connectionRtt: "12ms",
    sshPort: 22022,
    cpuPowScore: 18900,
    gpuPowScore: 42000,
    dockerReady: true,
    pricePerHour: 4.50,
    status: "online",
    reliabilityScore: 99,
    lastHeartbeat: "2026-02-07T10:32:10Z",
  },
};

// Fallback detail for any ID not in the map
const DEFAULT_DETAIL: ResourceDetail = {
  id: "gpu-rtx4090-nairobi-01",
  type: "gpu",
  name: "Wanjiku's RTX 4090 Rig",
  gpuModel: "NVIDIA GeForce RTX 4090",
  gpuVram: "24 GB GDDR6X",
  gpuCount: 1,
  gpuCudaCores: 16384,
  gpuTensorCores: 512,
  cpuModel: "Intel Core i9-13900K",
  cpuCores: 24,
  cpuThreads: 32,
  cpuArchitecture: "x86_64 (Raptor Lake)",
  ram: "128 GB DDR5-5600",
  storage: "2 TB",
  storageType: "NVMe SSD",
  region: "East Africa",
  country: "Nairobi, Kenya",
  connectionRtt: "62ms",
  sshPort: 22022,
  cpuPowScore: 12400,
  gpuPowScore: 21600,
  dockerReady: true,
  pricePerHour: 0.85,
  status: "online",
  reliabilityScore: 97,
  lastHeartbeat: "2026-02-07T10:31:45Z",
};

const MOCK_TEMPLATES: Template[] = [
  { id: "pytorch", name: "PyTorch", description: "PyTorch 2.3 + CUDA 12.4", icon: "flame", tag: "ML" },
  { id: "tensorflow", name: "TensorFlow", description: "TensorFlow 2.16 + CUDA 12.4", icon: "brain", tag: "ML" },
  { id: "ubuntu", name: "Ubuntu 22.04", description: "Bare Ubuntu with SSH", icon: "terminal", tag: "OS" },
  { id: "jupyter", name: "Jupyter Lab", description: "JupyterLab 4.0 + Python 3.11", icon: "notebook", tag: "IDE" },
  { id: "vscode", name: "VS Code Server", description: "code-server 4.x remote IDE", icon: "code", tag: "IDE" },
  { id: "comfyui", name: "ComfyUI", description: "ComfyUI + custom nodes", icon: "image", tag: "AI Art" },
];

const MOCK_SSH_KEYS: SshKey[] = [
  { id: "key-1", name: "MacBook Pro", fingerprint: "SHA256:xK9m3...", isDefault: true },
  { id: "key-2", name: "Work Desktop", fingerprint: "SHA256:Rp4v2...", isDefault: false },
];

const DURATION_OPTIONS = [
  { label: "1 Hour", hours: 1 },
  { label: "4 Hours", hours: 4 },
  { label: "12 Hours", hours: 12 },
  { label: "1 Day", hours: 24 },
  { label: "3 Days", hours: 72 },
  { label: "1 Week", hours: 168 },
];

// ---------------------------------------------------------------------------
// Template icon helper
// ---------------------------------------------------------------------------

function TemplateIcon({ type }: { type: string }) {
  switch (type) {
    case "flame":
      return <Zap className="h-5 w-5 text-copper" />;
    case "brain":
      return <Activity className="h-5 w-5 text-fern" />;
    case "terminal":
      return <Terminal className="h-5 w-5 text-foreground" />;
    case "notebook":
      return <Layers className="h-5 w-5 text-copper" />;
    case "code":
      return <Hash className="h-5 w-5 text-fern" />;
    case "image":
      return <Container className="h-5 w-5 text-copper" />;
    default:
      return <Server className="h-5 w-5 text-muted-foreground" />;
  }
}

// ---------------------------------------------------------------------------
// Spec row helper
// ---------------------------------------------------------------------------

function SpecRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-mist/50 px-3 py-2.5">
      <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ResourceDetailPage() {
  const params = useParams<{ id: string }>();
  const resource = MOCK_RESOURCES[params.id] ?? { ...DEFAULT_DETAIL, id: params.id };

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState(MOCK_SSH_KEYS.find((k) => k.isDefault)?.id ?? null);
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [deploying, setDeploying] = useState(false);

  const estimatedCost = useMemo(() => {
    return resource.pricePerHour * selectedDuration;
  }, [resource.pricePerHour, selectedDuration]);

  function handleDeploy() {
    setDeploying(true);
    setTimeout(() => setDeploying(false), 2000);
  }

  const heartbeatDate = new Date(resource.lastHeartbeat);
  const heartbeatAgo = Math.round((Date.now() - heartbeatDate.getTime()) / 60000);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Back button */}
      <Link href="/compute">
        <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Marketplace
        </Button>
      </Link>

      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{resource.name}</h1>
            <Badge variant={resource.type === "gpu" ? "success" : "warning"}>
              {resource.type.toUpperCase()}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {resource.country}
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" />
              {resource.region}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <CircleCheck className="h-4 w-4 text-fern" />
            <span className="text-sm font-medium text-fern">
              {resource.status === "online" ? "Online" : "Offline"}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            Last heartbeat {heartbeatAgo < 1 ? "just now" : `${heartbeatAgo}m ago`}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column: specs */}
        <div className="space-y-6 lg:col-span-2">
          {/* Hardware specs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Server className="h-5 w-5 text-forest" />
                Hardware Specifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <SpecRow
                  icon={<Cpu className="h-4 w-4" />}
                  label="CPU Model"
                  value={resource.cpuModel}
                />
                <SpecRow
                  icon={<Hash className="h-4 w-4" />}
                  label="Cores / Threads"
                  value={`${resource.cpuCores}C / ${resource.cpuThreads}T`}
                />
                <SpecRow
                  icon={<Terminal className="h-4 w-4" />}
                  label="Architecture"
                  value={resource.cpuArchitecture}
                />
                <SpecRow
                  icon={<MemoryStick className="h-4 w-4" />}
                  label="RAM"
                  value={resource.ram}
                />
                <SpecRow
                  icon={<HardDrive className="h-4 w-4" />}
                  label="Storage"
                  value={`${resource.storage} ${resource.storageType}`}
                />
                {resource.gpuModel && (
                  <>
                    <SpecRow
                      icon={<Zap className="h-4 w-4" />}
                      label="GPU Model"
                      value={resource.gpuModel}
                    />
                    <SpecRow
                      icon={<Layers className="h-4 w-4" />}
                      label="VRAM"
                      value={resource.gpuVram ?? "N/A"}
                    />
                    <SpecRow
                      icon={<Hash className="h-4 w-4" />}
                      label="GPU Count"
                      value={`${resource.gpuCount ?? 1}x`}
                    />
                    {resource.gpuCudaCores && (
                      <SpecRow
                        icon={<Activity className="h-4 w-4" />}
                        label="CUDA Cores"
                        value={resource.gpuCudaCores.toLocaleString()}
                      />
                    )}
                    {resource.gpuTensorCores && (
                      <SpecRow
                        icon={<Activity className="h-4 w-4" />}
                        label="Tensor Cores"
                        value={resource.gpuTensorCores.toLocaleString()}
                      />
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Network + Performance */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Wifi className="h-5 w-5 text-forest" />
                  Network Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <SpecRow icon={<Globe className="h-4 w-4" />} label="Region" value={resource.region} />
                <SpecRow icon={<MapPin className="h-4 w-4" />} label="Location" value={resource.country} />
                <SpecRow icon={<Clock className="h-4 w-4" />} label="RTT" value={resource.connectionRtt} />
                <SpecRow icon={<Terminal className="h-4 w-4" />} label="SSH Port" value={String(resource.sshPort)} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Activity className="h-5 w-5 text-forest" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <SpecRow icon={<Cpu className="h-4 w-4" />} label="CPU POW Score" value={resource.cpuPowScore.toLocaleString()} />
                {resource.gpuPowScore && (
                  <SpecRow icon={<Zap className="h-4 w-4" />} label="GPU POW Score" value={resource.gpuPowScore.toLocaleString()} />
                )}
                <SpecRow
                  icon={<Container className="h-4 w-4" />}
                  label="Docker Ready"
                  value={resource.dockerReady ? "Yes" : "No"}
                />
                <SpecRow icon={<Shield className="h-4 w-4" />} label="Uptime" value={`${resource.reliabilityScore}%`} />
              </CardContent>
            </Card>
          </div>

          {/* Deploy section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Deploy Instance</CardTitle>
              <CardDescription>
                Select a template, SSH key, and duration to launch your instance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Template selector */}
              <div>
                <label className="mb-3 block text-sm font-medium text-foreground">
                  Template
                </label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {MOCK_TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTemplate(t.id)}
                      className={cn(
                        "flex flex-col items-start gap-2 rounded-lg border p-3 text-left transition-colors",
                        selectedTemplate === t.id
                          ? "border-forest bg-forest/10"
                          : "border-border hover:border-forest/30 hover:bg-mist/50"
                      )}
                    >
                      <div className="flex w-full items-center justify-between">
                        <TemplateIcon type={t.icon} />
                        <Badge variant="default" className="text-[10px]">
                          {t.tag}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.description}</p>
                      </div>
                      {selectedTemplate === t.id && (
                        <Check className="absolute right-2 top-2 h-4 w-4 text-fern" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* SSH key selector */}
              <div>
                <label className="mb-3 block text-sm font-medium text-foreground">
                  SSH Key
                </label>
                <div className="space-y-2">
                  {MOCK_SSH_KEYS.map((key) => (
                    <button
                      key={key.id}
                      onClick={() => setSelectedKey(key.id)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors",
                        selectedKey === key.id
                          ? "border-forest bg-forest/10"
                          : "border-border hover:border-forest/30"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Terminal className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {key.name}
                            {key.isDefault && (
                              <Badge variant="default" className="ml-2 text-[10px]">
                                Default
                              </Badge>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono">{key.fingerprint}</p>
                        </div>
                      </div>
                      {selectedKey === key.id && <Check className="h-4 w-4 text-fern" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration picker */}
              <div>
                <label className="mb-3 block text-sm font-medium text-foreground">
                  Duration
                </label>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {DURATION_OPTIONS.map((d) => (
                    <button
                      key={d.hours}
                      onClick={() => setSelectedDuration(d.hours)}
                      className={cn(
                        "rounded-lg border px-3 py-2 text-center text-sm transition-colors",
                        selectedDuration === d.hours
                          ? "border-forest bg-forest/10 text-foreground font-medium"
                          : "border-border text-muted-foreground hover:border-forest/30"
                      )}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column: pricing + deploy */}
        <div className="space-y-6">
          {/* Pricing card */}
          <Card className="border-forest/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <DollarSign className="h-5 w-5 text-forest" />
                Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <span className="text-3xl font-bold text-foreground">
                  ${resource.pricePerHour.toFixed(2)}
                </span>
                <span className="text-muted-foreground"> /hr</span>
              </div>

              <div className="space-y-2 rounded-lg bg-mist/50 p-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Hourly</span>
                  <span className="text-foreground">${resource.pricePerHour.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Daily (est.)</span>
                  <span className="text-foreground">${(resource.pricePerHour * 24).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Weekly (est.)</span>
                  <span className="text-foreground">${(resource.pricePerHour * 168).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-border pt-2">
                  <span className="text-muted-foreground">Monthly (est.)</span>
                  <span className="font-medium text-foreground">${(resource.pricePerHour * 720).toFixed(2)}</span>
                </div>
              </div>

              {/* Cost estimate */}
              <div className="rounded-lg border border-forest/20 bg-forest/5 p-3">
                <p className="text-xs text-muted-foreground mb-1">Selected duration cost</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-fern">
                    ${estimatedCost.toFixed(2)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    for {selectedDuration}h
                  </span>
                </div>
              </div>

              <Button
                className="w-full gap-2"
                size="lg"
                onClick={handleDeploy}
                disabled={!selectedTemplate || !selectedKey || deploying}
              >
                {deploying ? (
                  "Deploying..."
                ) : (
                  <>
                    Deploy Instance
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>

              {(!selectedTemplate || !selectedKey) && (
                <p className="text-center text-xs text-muted-foreground">
                  Select a template and SSH key to deploy
                </p>
              )}
            </CardContent>
          </Card>

          {/* Quick info */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Resource ID</span>
                <code className="rounded bg-mist px-1.5 py-0.5 font-mono text-xs text-foreground">
                  {resource.id}
                </code>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="success">
                  {resource.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Reliability</span>
                <span className="font-medium text-foreground">{resource.reliabilityScore}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Docker</span>
                <Badge variant={resource.dockerReady ? "success" : "warning"}>
                  {resource.dockerReady ? "Ready" : "Not Available"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
