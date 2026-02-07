"use client";

import { useState, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Clock,
  ExternalLink,
  Globe,
  Zap,
  Server,
  Shield,
  Terminal,
} from "lucide-react";
import { getAppById, getCategoryLabel } from "@/lib/apps/registry";
import type { App, AppParameter } from "@/lib/apps/registry";
import { DeployLog } from "@/components/apps/deploy-log";

// ─── Mock data for deployment ────────────────────────────────

interface MockResource {
  id: string;
  name: string;
  spec: string;
  hourlyPrice: number;
  hasGpu: boolean;
  gpuMemory?: string;
}

interface MockSshKey {
  id: string;
  name: string;
  fingerprint: string;
}

const MOCK_RESOURCES: MockResource[] = [
  {
    id: "res-gpu-001",
    name: "Lagos RTX 3060 Node",
    spec: "RTX 3060 / 12 GB / 32 GB RAM",
    hourlyPrice: 0.35,
    hasGpu: true,
    gpuMemory: "12 GB",
  },
  {
    id: "res-gpu-002",
    name: "Nairobi RTX 3090 Rig",
    spec: "RTX 3090 / 24 GB / 64 GB RAM",
    hourlyPrice: 0.85,
    hasGpu: true,
    gpuMemory: "24 GB",
  },
  {
    id: "res-gpu-003",
    name: "Cape Town RTX 4090 x2",
    spec: "2x RTX 4090 / 48 GB / 128 GB RAM",
    hourlyPrice: 1.50,
    hasGpu: true,
    gpuMemory: "24 GB",
  },
  {
    id: "res-cpu-001",
    name: "Accra CPU Node",
    spec: "Ryzen 7 5800X / 32 GB RAM",
    hourlyPrice: 0.15,
    hasGpu: false,
  },
  {
    id: "res-cpu-002",
    name: "Amsterdam EPYC Server",
    spec: "EPYC 7763 / 256 GB RAM",
    hourlyPrice: 0.65,
    hasGpu: false,
  },
];

const MOCK_SSH_KEYS: MockSshKey[] = [
  { id: "key-001", name: "Work Laptop", fingerprint: "SHA256:nThbg6kX..." },
  { id: "key-002", name: "Personal Desktop", fingerprint: "SHA256:ROQFvPTh..." },
  { id: "key-003", name: "CI/CD Pipeline", fingerprint: "SHA256:bWo7R4Sq..." },
];

const DURATION_OPTIONS = [
  { label: "1h", hours: 1 },
  { label: "4h", hours: 4 },
  { label: "8h", hours: 8 },
  { label: "24h", hours: 24 },
];

type DeployStatus = "idle" | "pending" | "installing" | "running" | "failed";

// ─── Access type labels ──────────────────────────────────────

function getAccessLabel(type: string): string {
  switch (type) {
    case "web":
      return "Web Browser";
    case "api":
      return "REST API";
    case "vnc":
      return "VNC / Browser";
    case "terminal":
      return "Web Terminal";
    case "game":
      return "Game Client";
    default:
      return type;
  }
}

// ─── Page component ──────────────────────────────────────────

export default function AppDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const app = getAppById(params.id);

  // Form state
  const [paramValues, setParamValues] = useState<Record<string, string | number | boolean>>(() => {
    if (!app) return {};
    const defaults: Record<string, string | number | boolean> = {};
    for (const p of app.parameters) {
      defaults[p.name] = p.default;
    }
    return defaults;
  });
  const [selectedResource, setSelectedResource] = useState(MOCK_RESOURCES[1].id);
  const [selectedKey, setSelectedKey] = useState(MOCK_SSH_KEYS[0].id);
  const [selectedDuration, setSelectedDuration] = useState(4);
  const [customDuration, setCustomDuration] = useState("");
  const [isCustomDuration, setIsCustomDuration] = useState(false);

  // Deploy state
  const [deployStatus, setDeployStatus] = useState<DeployStatus>("idle");

  const effectiveDuration = isCustomDuration
    ? Math.max(1, parseInt(customDuration, 10) || 1)
    : selectedDuration;

  const resource = MOCK_RESOURCES.find((r) => r.id === selectedResource);

  const estimatedCost = useMemo(
    () => (resource?.hourlyPrice ?? 0) * effectiveDuration,
    [resource, effectiveDuration]
  );

  function handleParamChange(name: string, value: string | number | boolean) {
    setParamValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleDeploy() {
    setDeployStatus("pending");
    // Simulate transition to installing after a brief pause
    setTimeout(() => setDeployStatus("installing"), 800);
  }

  const handleDeployComplete = useCallback(() => {
    setDeployStatus("running");
  }, []);

  // ── Not found ──────────────────────────────────────────────
  if (!app) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <Link href="/apps">
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Apps
          </Button>
        </Link>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Server className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm font-medium text-foreground">App not found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              The app you are looking for does not exist or has been removed.
            </p>
            <Link href="/apps">
              <Button variant="ghost" size="sm" className="mt-4">
                Browse Apps
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Deployed state ─────────────────────────────────────────
  if (deployStatus !== "idle") {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <Link href="/apps">
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Apps
          </Button>
        </Link>

        {/* Header */}
        <div className="flex items-center gap-4">
          <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl text-3xl", app.color)}>
            {app.icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{app.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant={
                  deployStatus === "running"
                    ? "success"
                    : deployStatus === "failed"
                      ? "destructive"
                      : "warning"
                }
              >
                {deployStatus === "pending"
                  ? "Pending"
                  : deployStatus === "installing"
                    ? "Installing"
                    : deployStatus === "running"
                      ? "Running"
                      : "Failed"}
              </Badge>
              <span className="text-sm text-muted-foreground">
                on {resource?.name ?? "Unknown"}
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 overflow-hidden rounded-full bg-mist">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-1000",
              deployStatus === "running"
                ? "w-full bg-fern"
                : deployStatus === "failed"
                  ? "w-1/3 bg-red-500"
                  : "bg-forest animate-pulse",
              deployStatus === "pending" && "w-1/4",
              deployStatus === "installing" && "w-3/4"
            )}
          />
        </div>

        {/* Deploy log */}
        <DeployLog
          appName={app.name}
          appCategory={app.category}
          status={deployStatus === "pending" || deployStatus === "installing" ? deployStatus : deployStatus === "running" ? "running" : "failed"}
          onComplete={handleDeployComplete}
        />

        {/* Access card -- visible once running */}
        {deployStatus === "running" && (
          <Card className="border-fern/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Globe className="h-5 w-5 text-fern" />
                Your App is Ready
              </CardTitle>
              <CardDescription>
                {app.name} has been deployed successfully and is now accessible.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-mist p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Access URL</span>
                  <code className="rounded bg-background px-2 py-0.5 font-mono text-xs text-fern">
                    https://{app.id}.{resource?.id}.gatehouse.cloud:{app.defaultPort}
                  </code>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Access Type</span>
                  <span className="text-foreground">{getAccessLabel(app.accessType)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Port</span>
                  <span className="font-mono text-foreground">{app.defaultPort}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="text-foreground">{effectiveDuration}h</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Estimated Cost</span>
                  <span className="font-semibold text-foreground">${estimatedCost.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 gap-2" onClick={() => window.open(`https://${app.id}.${resource?.id}.gatehouse.cloud`, "_blank")}>
                  <ExternalLink className="h-4 w-4" />
                  Open App
                </Button>
                <Link href="/instances" className="flex-1">
                  <Button variant="outline" className="w-full gap-2">
                    <Terminal className="h-4 w-4" />
                    View Instance
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // ── Main detail view ───────────────────────────────────────
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Back button */}
      <Link href="/apps">
        <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Apps
        </Button>
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl text-3xl", app.color)}>
          {app.icon}
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{app.name}</h1>
            <Badge variant="default">{getCategoryLabel(app.category)}</Badge>
          </div>
          <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
            {app.gpuRequired && (
              <span className="flex items-center gap-1 text-fern">
                <Zap className="h-3.5 w-3.5" />
                GPU Required
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {app.estimatedDeployTime}
            </span>
            <span className="flex items-center gap-1">
              <Globe className="h-3.5 w-3.5" />
              {getAccessLabel(app.accessType)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {app.longDescription}
              </p>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Check className="h-5 w-5 text-forest" />
                Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {app.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2.5 text-sm">
                    <Check className="h-3.5 w-3.5 flex-shrink-0 text-fern" />
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-5 w-5 text-forest" />
                Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="flex items-center justify-between rounded-lg bg-mist/50 px-3 py-2.5">
                  <span className="text-sm text-muted-foreground">GPU Required</span>
                  <Badge variant={app.gpuRequired ? "warning" : "success"}>
                    {app.gpuRequired ? "Yes" : "No"}
                  </Badge>
                </div>
                {app.minGpuMemory && (
                  <div className="flex items-center justify-between rounded-lg bg-mist/50 px-3 py-2.5">
                    <span className="text-sm text-muted-foreground">Min GPU Memory</span>
                    <span className="text-sm font-medium text-foreground">{app.minGpuMemory}</span>
                  </div>
                )}
                <div className="flex items-center justify-between rounded-lg bg-mist/50 px-3 py-2.5">
                  <span className="text-sm text-muted-foreground">Deploy Time</span>
                  <span className="text-sm font-medium text-foreground">{app.estimatedDeployTime}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-mist/50 px-3 py-2.5">
                  <span className="text-sm text-muted-foreground">Access Type</span>
                  <span className="text-sm font-medium text-foreground">{getAccessLabel(app.accessType)}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-mist/50 px-3 py-2.5">
                  <span className="text-sm text-muted-foreground">Default Port</span>
                  <span className="text-sm font-mono font-medium text-foreground">{app.defaultPort}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-mist/50 px-3 py-2.5">
                  <span className="text-sm text-muted-foreground">Docker Image</span>
                  <code className="max-w-[200px] truncate rounded bg-background px-1.5 py-0.5 text-xs font-mono text-muted-foreground">
                    {app.image}
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuration */}
          {app.parameters.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Configuration</CardTitle>
                <CardDescription>
                  Customize your deployment settings before launching.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {app.parameters.map((param) => (
                  <ParameterField
                    key={param.name}
                    param={param}
                    value={paramValues[param.name] ?? param.default}
                    onChange={(val) => handleParamChange(param.name, val)}
                  />
                ))}
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {app.tags.map((tag) => (
              <Badge key={tag} variant="default">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Right column: deploy sidebar */}
        <div className="space-y-6">
          <div className="lg:sticky lg:top-24">
            <Card className="border-forest/30">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl text-xl", app.color)}>
                    {app.icon}
                  </div>
                  <div>
                    <CardTitle className="text-base">{app.name}</CardTitle>
                    <p className="text-xs text-fern font-medium">Ready to deploy</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Resource selector */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Compute Resource
                  </label>
                  <select
                    value={selectedResource}
                    onChange={(e) => setSelectedResource(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-forest"
                  >
                    {MOCK_RESOURCES.map((r) => (
                      <option key={r.id} value={r.id} disabled={app.gpuRequired && !r.hasGpu}>
                        {r.name} -- ${r.hourlyPrice.toFixed(2)}/hr
                        {app.gpuRequired && !r.hasGpu ? " (No GPU)" : ""}
                      </option>
                    ))}
                  </select>
                  {app.gpuRequired && resource && !resource.hasGpu && (
                    <p className="mt-1 text-xs text-red-400">
                      This app requires a GPU. Please select a GPU resource.
                    </p>
                  )}
                </div>

                {/* SSH key selector */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    SSH Key
                  </label>
                  <select
                    value={selectedKey}
                    onChange={(e) => setSelectedKey(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-forest"
                  >
                    {MOCK_SSH_KEYS.map((key) => (
                      <option key={key.id} value={key.id}>
                        {key.name} ({key.fingerprint})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Duration picker */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Duration
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {DURATION_OPTIONS.map((d) => (
                      <button
                        key={d.hours}
                        onClick={() => {
                          setSelectedDuration(d.hours);
                          setIsCustomDuration(false);
                        }}
                        className={cn(
                          "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                          !isCustomDuration && selectedDuration === d.hours
                            ? "border-forest bg-forest/15 text-forest"
                            : "border-border text-muted-foreground hover:border-forest/40 hover:text-foreground"
                        )}
                      >
                        {d.label}
                      </button>
                    ))}
                    <button
                      onClick={() => setIsCustomDuration(true)}
                      className={cn(
                        "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                        isCustomDuration
                          ? "border-forest bg-forest/15 text-forest"
                          : "border-border text-muted-foreground hover:border-forest/40 hover:text-foreground"
                      )}
                    >
                      Custom
                    </button>
                  </div>
                  {isCustomDuration && (
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={720}
                        value={customDuration}
                        onChange={(e) => setCustomDuration(e.target.value)}
                        placeholder="Hours"
                        className="w-24 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:border-forest"
                      />
                      <span className="text-xs text-muted-foreground">hours</span>
                    </div>
                  )}
                </div>

                {/* Cost estimate */}
                <div className="rounded-lg border border-forest/20 bg-forest/5 p-3">
                  <p className="text-xs text-muted-foreground mb-1">Estimated cost</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-fern">
                      ${estimatedCost.toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      for {effectiveDuration}h
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    ${resource?.hourlyPrice.toFixed(2)}/hr x {effectiveDuration}h
                  </p>
                </div>

                {/* Deploy button */}
                <Button
                  className="w-full gap-2"
                  size="lg"
                  onClick={handleDeploy}
                  disabled={app.gpuRequired && resource !== undefined && !resource.hasGpu}
                >
                  Deploy App
                  <ChevronRight className="h-4 w-4" />
                </Button>

                <Link
                  href="/apps"
                  className="block text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Back to Apps
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Parameter field renderer ────────────────────────────────

function ParameterField({
  param,
  value,
  onChange,
}: {
  param: AppParameter;
  value: string | number | boolean;
  onChange: (value: string | number | boolean) => void;
}) {
  const inputClasses =
    "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-forest";

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">
        {param.label}
        {param.required && <span className="ml-1 text-red-400">*</span>}
      </label>
      <p className="mb-2 text-xs text-muted-foreground">{param.description}</p>

      {param.type === "select" && param.options ? (
        <select
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          className={inputClasses}
        >
          {param.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : param.type === "number" ? (
        <input
          type="number"
          value={Number(value)}
          onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
          className={inputClasses}
        />
      ) : param.type === "boolean" ? (
        <button
          onClick={() => onChange(!value)}
          className={cn(
            "relative h-6 w-11 rounded-full transition-colors",
            value ? "bg-forest" : "bg-mist"
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform",
              value && "translate-x-5"
            )}
          />
        </button>
      ) : (
        <input
          type="text"
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          placeholder={String(param.default) || `Enter ${param.label.toLowerCase()}`}
          className={inputClasses}
        />
      )}
    </div>
  );
}
