"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Server,
  Monitor,
  Cpu,
  MemoryStick,
  HardDrive,
  PencilLine,
  Power,
  Eye,
  Activity,
  CheckCircle,
  Clock,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ResourceStatus = "active" | "pending" | "rejected";
type VerifierStatus = "verified" | "pending" | "failed";
type AdminApproval = "approved" | "pending" | "rejected";

interface Resource {
  id: string;
  name: string;
  type: "gpu" | "cpu";
  gpuModel?: string;
  cpuModel?: string;
  cores?: number;
  threads?: number;
  vramGb?: number;
  ramGb: number;
  storageGb: number;
  storageType: string;
  hourlyPrice: number;
  isOnline: boolean;
  systemValidation: "passed" | "pending" | "failed";
  verifierStatus: VerifierStatus;
  adminApproval: AdminApproval;
  status: ResourceStatus;
  currentRenter: string | null;
  region: string;
}

const mockResources: Resource[] = [
  {
    id: "res-001",
    name: "GPU-Lagos-01",
    type: "gpu",
    gpuModel: "NVIDIA RTX 3090",
    cpuModel: "AMD Ryzen 9 5900X",
    cores: 12,
    vramGb: 24,
    ramGb: 64,
    storageGb: 1000,
    storageType: "NVMe",
    hourlyPrice: 1.20,
    isOnline: true,
    systemValidation: "passed",
    verifierStatus: "verified",
    adminApproval: "approved",
    status: "active",
    currentRenter: "chioma_dev",
    region: "Lagos, Nigeria",
  },
  {
    id: "res-002",
    name: "GPU-Accra-01",
    type: "gpu",
    gpuModel: "NVIDIA RTX 4090",
    cpuModel: "Intel Core i9-13900K",
    cores: 24,
    vramGb: 24,
    ramGb: 128,
    storageGb: 2000,
    storageType: "NVMe",
    hourlyPrice: 2.50,
    isOnline: true,
    systemValidation: "passed",
    verifierStatus: "verified",
    adminApproval: "approved",
    status: "active",
    currentRenter: "kwame_ml",
    region: "Accra, Ghana",
  },
  {
    id: "res-003",
    name: "GPU-Nairobi-01",
    type: "gpu",
    gpuModel: "NVIDIA RTX 3060",
    cpuModel: "AMD Ryzen 7 5800X",
    cores: 8,
    vramGb: 12,
    ramGb: 32,
    storageGb: 500,
    storageType: "SSD",
    hourlyPrice: 0.65,
    isOnline: false,
    systemValidation: "passed",
    verifierStatus: "verified",
    adminApproval: "approved",
    status: "active",
    currentRenter: null,
    region: "Nairobi, Kenya",
  },
  {
    id: "res-004",
    name: "CPU-Lagos-02",
    type: "cpu",
    cpuModel: "AMD EPYC 7543",
    cores: 32,
    threads: 64,
    ramGb: 128,
    storageGb: 2000,
    storageType: "NVMe",
    hourlyPrice: 0.85,
    isOnline: true,
    systemValidation: "passed",
    verifierStatus: "verified",
    adminApproval: "approved",
    status: "active",
    currentRenter: "fatou_data",
    region: "Lagos, Nigeria",
  },
  {
    id: "res-005",
    name: "CPU-CapeTown-01",
    type: "cpu",
    cpuModel: "Intel Xeon W-3375",
    cores: 38,
    threads: 76,
    ramGb: 256,
    storageGb: 4000,
    storageType: "NVMe",
    hourlyPrice: 1.10,
    isOnline: true,
    systemValidation: "passed",
    verifierStatus: "pending",
    adminApproval: "pending",
    status: "pending",
    currentRenter: null,
    region: "Cape Town, South Africa",
  },
  {
    id: "res-006",
    name: "CPU-Kigali-01",
    type: "cpu",
    cpuModel: "AMD Ryzen 5 5600X",
    cores: 6,
    threads: 12,
    ramGb: 16,
    storageGb: 256,
    storageType: "SSD",
    hourlyPrice: 0.30,
    isOnline: false,
    systemValidation: "failed",
    verifierStatus: "failed",
    adminApproval: "rejected",
    status: "rejected",
    currentRenter: null,
    region: "Kigali, Rwanda",
  },
];

type TabFilter = "all" | "active" | "pending" | "rejected";

const tabs: { key: TabFilter; label: string; count: number }[] = [
  { key: "all", label: "All", count: mockResources.length },
  {
    key: "active",
    label: "Active",
    count: mockResources.filter((r) => r.status === "active").length,
  },
  {
    key: "pending",
    label: "Pending",
    count: mockResources.filter((r) => r.status === "pending").length,
  },
  {
    key: "rejected",
    label: "Rejected",
    count: mockResources.filter((r) => r.status === "rejected").length,
  },
];

function StatusBadge({
  label,
  status,
}: {
  label: string;
  status: "passed" | "verified" | "approved" | "pending" | "failed" | "rejected";
}) {
  const config: Record<
    string,
    { bg: string; text: string; icon: typeof CheckCircle }
  > = {
    passed: { bg: "bg-fern/15", text: "text-fern", icon: CheckCircle },
    verified: { bg: "bg-fern/15", text: "text-fern", icon: ShieldCheck },
    approved: { bg: "bg-fern/15", text: "text-fern", icon: UserCheck },
    pending: { bg: "bg-copper/15", text: "text-copper", icon: Clock },
    failed: { bg: "bg-red-500/15", text: "text-red-400", icon: XCircle },
    rejected: { bg: "bg-red-500/15", text: "text-red-400", icon: ShieldAlert },
  };

  const c = config[status];
  const Icon = c.icon;

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-muted-foreground">{label}:</span>
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
          c.bg,
          c.text
        )}
      >
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </div>
  );
}

export default function ProviderResourcesPage() {
  const [activeTab, setActiveTab] = useState<TabFilter>("all");

  const filtered =
    activeTab === "all"
      ? mockResources
      : mockResources.filter((r) => r.status === activeTab);

  const activeCount = mockResources.filter((r) => r.status === "active").length;
  const onlineCount = mockResources.filter((r) => r.isOnline).length;
  const rentedCount = mockResources.filter((r) => r.currentRenter).length;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Resources</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your registered compute resources.
          </p>
        </div>
        <Link href="/provider/resources/register">
          <Button className="gap-2">
            <Server className="h-4 w-4" />
            Register Resource
          </Button>
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-forest/15 p-2.5">
              <Activity className="h-5 w-5 text-forest" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {activeCount}
              </p>
              <p className="text-sm text-muted-foreground">Active Resources</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-fern/15 p-2.5">
              <Server className="h-5 w-5 text-fern" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {onlineCount}
              </p>
              <p className="text-sm text-muted-foreground">Online Now</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-copper/15 p-2.5">
              <Monitor className="h-5 w-5 text-copper" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {rentedCount}
              </p>
              <p className="text-sm text-muted-foreground">Currently Rented</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab filters */}
      <div className="flex gap-1 rounded-lg bg-card p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab.key
                ? "bg-forest text-white"
                : "text-muted-foreground hover:bg-mist hover:text-foreground"
            )}
          >
            {tab.label}
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-xs",
                activeTab === tab.key
                  ? "bg-white/20 text-white"
                  : "bg-mist text-muted-foreground"
              )}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Resource cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((resource) => (
          <Card key={resource.id} className="transition-colors hover:border-forest/30">
            <CardContent className="p-5">
              {/* Top: type badge + online/offline */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {resource.type === "gpu" ? (
                    <Badge className="bg-forest/15 text-forest">
                      <Monitor className="mr-1 h-3 w-3" />
                      GPU
                    </Badge>
                  ) : (
                    <Badge className="bg-copper/15 text-copper">
                      <Cpu className="mr-1 h-3 w-3" />
                      CPU
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {resource.id}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    {resource.isOnline && (
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fern opacity-50" />
                    )}
                    <span
                      className={cn(
                        "relative inline-flex h-2.5 w-2.5 rounded-full",
                        resource.isOnline ? "bg-fern" : "bg-red-400"
                      )}
                    />
                  </span>
                  <span
                    className={cn(
                      "text-xs font-medium",
                      resource.isOnline ? "text-fern" : "text-red-400"
                    )}
                  >
                    {resource.isOnline ? "Online" : "Offline"}
                  </span>
                </span>
              </div>

              {/* Resource name + model */}
              <div className="mt-3">
                <h3 className="text-base font-semibold text-foreground">
                  {resource.name}
                </h3>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {resource.type === "gpu"
                    ? resource.gpuModel
                    : resource.cpuModel}
                </p>
              </div>

              {/* Hardware specs */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {resource.type === "gpu" && resource.vramGb && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-mist px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    <Monitor className="h-3 w-3 shrink-0" />
                    {resource.vramGb}GB VRAM
                  </span>
                )}
                {resource.cores && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-mist px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    <Cpu className="h-3 w-3 shrink-0" />
                    {resource.cores} cores
                    {resource.threads ? ` / ${resource.threads}T` : ""}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 rounded-full bg-mist px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  <MemoryStick className="h-3 w-3 shrink-0" />
                  {resource.ramGb}GB RAM
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-mist px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  <HardDrive className="h-3 w-3 shrink-0" />
                  {resource.storageGb}GB {resource.storageType}
                </span>
              </div>

              {/* Triple status */}
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 rounded-lg bg-mist/50 px-3 py-2.5">
                <StatusBadge
                  label="System"
                  status={resource.systemValidation}
                />
                <StatusBadge
                  label="Verifier"
                  status={resource.verifierStatus}
                />
                <StatusBadge label="Admin" status={resource.adminApproval} />
              </div>

              {/* Rental + pricing */}
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <div>
                  {resource.currentRenter ? (
                    <span className="text-sm text-fern">
                      Rented by{" "}
                      <span className="font-medium">
                        {resource.currentRenter}
                      </span>
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Available for rental
                    </span>
                  )}
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {resource.region}
                  </p>
                </div>
                <span className="text-lg font-bold text-foreground">
                  ${resource.hourlyPrice.toFixed(2)}
                  <span className="text-xs font-normal text-muted-foreground">
                    /hr
                  </span>
                </span>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <PencilLine className="h-3.5 w-3.5" />
                  Edit Price
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Power className="h-3.5 w-3.5" />
                  {resource.isOnline ? "Deactivate" : "Activate"}
                </Button>
                <Button variant="ghost" size="sm" className="ml-auto gap-1.5">
                  <Eye className="h-3.5 w-3.5" />
                  Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
