"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Copy,
  Check,
  Play,
  Settings,
  FileText,
  Trash2,
  Globe,
  Cpu,
  Activity,
  Clock,
  DollarSign,
  ArrowLeft,
  Plus,
  Moon,
  Zap,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type EndpointStatus = "running" | "scaled_to_zero" | "failed";

interface Endpoint {
  id: string;
  name: string;
  modelName: string;
  modelId: string;
  gpu: string;
  region: string;
  status: EndpointStatus;
  endpointUrl: string;
  requestsToday: number;
  avgLatency: string;
  costPerHour: number;
  costToday: number;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_ENDPOINTS: Endpoint[] = [
  {
    id: "ep_abc123",
    name: "llama-3.2-3b-prod",
    modelName: "Llama 3.2 3B",
    modelId: "llama-3.2-3b",
    gpu: "RTX 4090",
    region: "Lagos",
    status: "running",
    endpointUrl: "https://api.gatehouse.cloud/v1/endpoints/ep_abc123",
    requestsToday: 1234,
    avgLatency: "145ms",
    costPerHour: 1.5,
    costToday: 18.0,
    createdAt: "2026-02-05T10:00:00Z",
  },
  {
    id: "ep_def456",
    name: "sdxl-images",
    modelName: "Stable Diffusion XL",
    modelId: "stable-diffusion-xl",
    gpu: "A100",
    region: "Nairobi",
    status: "running",
    endpointUrl: "https://api.gatehouse.cloud/v1/endpoints/ep_def456",
    requestsToday: 567,
    avgLatency: "2.3s",
    costPerHour: 2.8,
    costToday: 33.6,
    createdAt: "2026-02-04T14:30:00Z",
  },
  {
    id: "ep_ghi789",
    name: "bge-embeddings",
    modelName: "BGE-M3",
    modelId: "bge-m3",
    gpu: "RTX 3090",
    region: "Lagos",
    status: "scaled_to_zero",
    endpointUrl: "https://api.gatehouse.cloud/v1/endpoints/ep_ghi789",
    requestsToday: 0,
    avgLatency: "-",
    costPerHour: 0.0,
    costToday: 0.0,
    createdAt: "2026-02-01T08:00:00Z",
  },
];

function statusLabel(status: EndpointStatus): string {
  switch (status) {
    case "running":
      return "Running";
    case "scaled_to_zero":
      return "Sleeping";
    case "failed":
      return "Failed";
  }
}

function statusBadgeVariant(
  status: EndpointStatus
): "success" | "default" | "destructive" {
  switch (status) {
    case "running":
      return "success";
    case "scaled_to_zero":
      return "default";
    case "failed":
      return "destructive";
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function EndpointsPage() {
  const [endpoints, setEndpoints] = useState(MOCK_ENDPOINTS);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const runningCount = endpoints.filter((e) => e.status === "running").length;
  const totalCostToday = endpoints.reduce((sum, e) => sum + e.costToday, 0);
  const totalRequests = endpoints.reduce((sum, e) => sum + e.requestsToday, 0);

  async function handleCopy(url: string, id: string) {
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function handleDelete(id: string) {
    if (deletingId === id) {
      setEndpoints((prev) => prev.filter((ep) => ep.id !== id));
      setDeletingId(null);
    } else {
      setDeletingId(id);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Back link */}
      <Link
        href="/models"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Model Hub
      </Link>

      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">
              My Endpoints
            </h1>
            <Badge variant="default" className="text-sm px-3 py-1">
              {endpoints.length}
            </Badge>
          </div>
          <p className="mt-1 text-muted-foreground">
            Manage your deployed model inference endpoints.
          </p>
        </div>
        <Link href="/models">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Deploy New
          </Button>
        </Link>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active</span>
              <Activity className="h-4 w-4 text-fern" />
            </div>
            <p className="mt-1 text-xl font-bold text-foreground">
              {runningCount}
              <span className="text-sm font-normal text-muted-foreground">
                {" "}
                / {endpoints.length}
              </span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Requests Today
              </span>
              <Zap className="h-4 w-4 text-copper" />
            </div>
            <p className="mt-1 text-xl font-bold text-foreground">
              {totalRequests.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Cost Today</span>
              <DollarSign className="h-4 w-4 text-copper" />
            </div>
            <p className="mt-1 text-xl font-bold text-foreground">
              ${totalCostToday.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Endpoints list */}
      {endpoints.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Cpu className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm font-medium text-foreground">
              No endpoints deployed
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Deploy your first model endpoint from the AI Model Hub.
            </p>
            <Link href="/models">
              <Button variant="ghost" size="sm" className="mt-4 gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                Browse Models
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {endpoints.map((endpoint) => (
            <Card
              key={endpoint.id}
              className={cn(
                "transition-colors",
                endpoint.status === "scaled_to_zero" && "opacity-75"
              )}
            >
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  {/* Left: info */}
                  <div className="min-w-0 flex-1 space-y-3">
                    {/* Name + status */}
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/models/${endpoint.modelId}`}
                        className="font-semibold text-foreground hover:text-fern transition-colors"
                      >
                        {endpoint.name}
                      </Link>
                      <Badge variant={statusBadgeVariant(endpoint.status)}>
                        {endpoint.status === "scaled_to_zero" && (
                          <Moon className="mr-1 h-3 w-3" />
                        )}
                        {statusLabel(endpoint.status)}
                      </Badge>
                    </div>

                    {/* Details row */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Cpu className="h-3 w-3" />
                        {endpoint.modelName} on {endpoint.gpu}
                      </span>
                      <span className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {endpoint.region}
                      </span>
                      <span className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        {endpoint.requestsToday.toLocaleString()} requests
                        today
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {endpoint.avgLatency} avg
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        ${endpoint.costPerHour.toFixed(2)}/hr
                      </span>
                    </div>

                    {/* Endpoint URL */}
                    <div className="flex items-center gap-2">
                      <code className="rounded-md bg-mist px-2.5 py-1 font-mono text-xs text-foreground truncate max-w-lg">
                        {endpoint.endpointUrl}
                      </code>
                      <button
                        onClick={() =>
                          handleCopy(endpoint.endpointUrl, endpoint.id)
                        }
                        className="rounded-md p-1 text-muted-foreground hover:bg-mist hover:text-foreground transition-colors"
                        title="Copy endpoint URL"
                      >
                        {copiedId === endpoint.id ? (
                          <Check className="h-3.5 w-3.5 text-fern" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Right: actions */}
                  <div className="flex flex-shrink-0 items-center gap-2">
                    {endpoint.status === "running" && (
                      <Link href="/models/playground">
                        <Button variant="outline" size="sm" className="gap-1.5">
                          <Play className="h-3.5 w-3.5" />
                          Test
                        </Button>
                      </Link>
                    )}

                    <Link href={`/models/${endpoint.modelId}`}>
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <Settings className="h-3.5 w-3.5" />
                        Scale
                      </Button>
                    </Link>

                    <Button variant="outline" size="sm" className="gap-1.5">
                      <FileText className="h-3.5 w-3.5" />
                      Logs
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(endpoint.id)}
                      className={cn(
                        "gap-1.5",
                        deletingId === endpoint.id
                          ? "border-red-400/40 text-red-400 hover:bg-red-900/20"
                          : "text-muted-foreground hover:text-red-400"
                      )}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {deletingId === endpoint.id ? "Confirm?" : "Delete"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary footer */}
      {endpoints.length > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
          <span className="text-sm text-muted-foreground">
            {runningCount} active endpoint{runningCount !== 1 ? "s" : ""}
          </span>
          <span className="text-sm text-foreground">
            Total cost today:{" "}
            <span className="font-semibold">${totalCostToday.toFixed(2)}</span>
          </span>
        </div>
      )}
    </div>
  );
}
