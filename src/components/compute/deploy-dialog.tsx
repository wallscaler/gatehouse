"use client";

import { useState, useMemo } from "react";
import { X, Monitor, Cpu, Key, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Resource {
  id: string;
  gpuModel?: string;
  cpuModel?: string;
  ramGb: number;
  storageGb: number;
  hourlyPrice: number;
}

interface Template {
  id: string;
  name: string;
  category: string;
  gpuRequired: boolean;
  image: string;
}

interface SshKey {
  id: string;
  name: string;
  fingerprint: string;
}

interface DeployConfig {
  templateId: string;
  sshKeyId: string;
  duration: number;
  authMethod: "key" | "password" | "both";
}

interface DeployDialogProps {
  resource: Resource;
  templates: Template[];
  sshKeys: SshKey[];
  onDeploy: (config: DeployConfig) => void;
  onClose: () => void;
}

const DURATION_OPTIONS = [
  { label: "1 hour", value: 1 },
  { label: "4 hours", value: 4 },
  { label: "8 hours", value: 8 },
  { label: "24 hours", value: 24 },
] as const;

const AUTH_METHODS = [
  { label: "SSH Key", value: "key" as const },
  { label: "Password", value: "password" as const },
  { label: "Both", value: "both" as const },
] as const;

export function DeployDialog({
  resource,
  templates,
  sshKeys,
  onDeploy,
  onClose,
}: DeployDialogProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [selectedSshKeyId, setSelectedSshKeyId] = useState(sshKeys[0]?.id ?? "");
  const [duration, setDuration] = useState(1);
  const [customDuration, setCustomDuration] = useState("");
  const [isCustomDuration, setIsCustomDuration] = useState(false);
  const [authMethod, setAuthMethod] = useState<"key" | "password" | "both">("key");

  const effectiveDuration = isCustomDuration
    ? Math.max(1, parseInt(customDuration, 10) || 1)
    : duration;

  const estimatedCost = useMemo(
    () => resource.hourlyPrice * effectiveDuration,
    [resource.hourlyPrice, effectiveDuration]
  );

  const canDeploy = selectedTemplateId && (authMethod !== "key" || selectedSshKeyId);

  function handleDeploy() {
    if (!canDeploy) return;
    onDeploy({
      templateId: selectedTemplateId,
      sshKeyId: selectedSshKeyId,
      duration: effectiveDuration,
      authMethod,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <Card className="relative z-10 mx-4 w-full max-w-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Deploy Container</CardTitle>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-mist hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Resource summary */}
          <div className="rounded-lg bg-mist p-3">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Resource
            </p>
            <div className="mt-1.5 flex items-center gap-2">
              {resource.gpuModel ? (
                <>
                  <Monitor className="h-4 w-4 text-forest" />
                  <span className="text-sm font-medium text-foreground">
                    {resource.gpuModel}
                  </span>
                </>
              ) : (
                <>
                  <Cpu className="h-4 w-4 text-copper" />
                  <span className="text-sm font-medium text-foreground">
                    {resource.cpuModel || "CPU"}
                  </span>
                </>
              )}
            </div>
            <div className="mt-1 flex gap-3 text-xs text-muted-foreground">
              <span>{resource.ramGb}GB RAM</span>
              <span>{resource.storageGb}GB Storage</span>
              <span className="font-medium text-foreground">
                ${resource.hourlyPrice.toFixed(2)}/hr
              </span>
            </div>
          </div>

          {/* Template selector */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Template
            </label>
            <select
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-forest"
            >
              <option value="">Select a template...</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.category})
                  {t.gpuRequired ? " - GPU required" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* SSH Key selector */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              <Key className="mr-1 inline h-3.5 w-3.5" />
              SSH Key
            </label>
            {sshKeys.length > 0 ? (
              <select
                value={selectedSshKeyId}
                onChange={(e) => setSelectedSshKeyId(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-forest"
              >
                {sshKeys.map((key) => (
                  <option key={key.id} value={key.id}>
                    {key.name} ({key.fingerprint})
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-xs text-muted-foreground">
                No SSH keys available. Add one in Settings.
              </p>
            )}
          </div>

          {/* Duration picker */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              <Clock className="mr-1 inline h-3.5 w-3.5" />
              Duration
            </label>
            <div className="flex flex-wrap gap-1.5">
              {DURATION_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setDuration(opt.value);
                    setIsCustomDuration(false);
                  }}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                    !isCustomDuration && duration === opt.value
                      ? "border-forest bg-forest/15 text-forest"
                      : "border-border text-muted-foreground hover:border-forest/40 hover:text-foreground"
                  )}
                >
                  {opt.label}
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

          {/* Auth method */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Auth Method
            </label>
            <div className="flex gap-1.5">
              {AUTH_METHODS.map((method) => (
                <button
                  key={method.value}
                  onClick={() => setAuthMethod(method.value)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                    authMethod === method.value
                      ? "border-forest bg-forest/15 text-forest"
                      : "border-border text-muted-foreground hover:border-forest/40 hover:text-foreground"
                  )}
                >
                  {method.label}
                </button>
              ))}
            </div>
          </div>

          {/* Estimated cost */}
          <div className="rounded-lg border border-border bg-background p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Estimated cost</span>
              <div className="text-right">
                <span className="text-lg font-bold text-foreground">
                  ${estimatedCost.toFixed(2)}
                </span>
                <p className="text-xs text-muted-foreground">
                  ${resource.hourlyPrice.toFixed(2)} x {effectiveDuration}h
                </p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="gap-3">
          <Button variant="ghost" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            className="flex-1"
            disabled={!canDeploy}
            onClick={handleDeploy}
          >
            Deploy
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
