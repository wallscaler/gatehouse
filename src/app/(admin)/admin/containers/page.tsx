"use client";

import { useState } from "react";
import {
  Container,
  Search,
  Trash2,
  Clock,
  FileText,
  Filter,
  Play,
  Square,
  Loader2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ContainerStatus = "running" | "pending" | "stopped" | "terminated" | "failed";
type PaymentStatus = "paid" | "pending" | "overdue" | "refunded";
type StatusFilter = "all" | ContainerStatus;

interface MockContainer {
  id: string;
  userName: string;
  resourceId: string;
  resourceName: string;
  template: string;
  status: ContainerStatus;
  paymentStatus: PaymentStatus;
  startedAt: string;
  expiresAt: string;
  hourlyRate: number;
  totalCost: number;
}

const mockContainers: MockContainer[] = [
  { id: "cnt-a1b2c3", userName: "Chioma Nwosu", resourceId: "res-e5f6g7h8", resourceName: "A100 80GB (AccraCompute)", template: "PyTorch 2.2", status: "running", paymentStatus: "paid", startedAt: "2026-02-05T10:00:00Z", expiresAt: "2026-02-12T10:00:00Z", hourlyRate: 8500, totalCost: 1428000 },
  { id: "cnt-d4e5f6", userName: "Adebayo Ogunleye", resourceId: "res-a1b2c3d4", resourceName: "RTX 4090 (MinerNaija)", template: "Stable Diffusion", status: "running", paymentStatus: "paid", startedAt: "2026-02-06T14:00:00Z", expiresAt: "2026-02-08T14:00:00Z", hourlyRate: 2500, totalCost: 120000 },
  { id: "cnt-g7h8i9", userName: "Nia Mensah", resourceId: "res-q7r8s9t0", resourceName: "A6000 (CapeGPU)", template: "Jupyter Lab", status: "running", paymentStatus: "paid", startedAt: "2026-02-04T08:00:00Z", expiresAt: "2026-02-11T08:00:00Z", hourlyRate: 5500, totalCost: 924000 },
  { id: "cnt-j0k1l2", userName: "Ifeoma Eze", resourceId: "res-m3n4o5p6", resourceName: "RTX 4080 (MinerNaija)", template: "TensorFlow 2.15", status: "running", paymentStatus: "paid", startedAt: "2026-02-07T06:00:00Z", expiresAt: "2026-02-10T06:00:00Z", hourlyRate: 2000, totalCost: 144000 },
  { id: "cnt-m3n4o5", userName: "Daniel Osei", resourceId: "res-e5f6g7h8", resourceName: "A100 80GB (AccraCompute)", template: "CUDA Development", status: "pending", paymentStatus: "pending", startedAt: "", expiresAt: "2026-02-14T00:00:00Z", hourlyRate: 8500, totalCost: 0 },
  { id: "cnt-p6q7r8", userName: "Emeka Obi", resourceId: "res-a1b2c3d4", resourceName: "RTX 4090 (MinerNaija)", template: "ComfyUI", status: "running", paymentStatus: "paid", startedAt: "2026-02-06T20:00:00Z", expiresAt: "2026-02-07T20:00:00Z", hourlyRate: 2500, totalCost: 60000 },
  { id: "cnt-s9t0u1", userName: "Grace Okafor", resourceId: "res-q7r8s9t0", resourceName: "A6000 (CapeGPU)", template: "VS Code Server", status: "running", paymentStatus: "overdue", startedAt: "2026-02-01T12:00:00Z", expiresAt: "2026-02-07T12:00:00Z", hourlyRate: 5500, totalCost: 792000 },
  { id: "cnt-v2w3x4", userName: "Chioma Nwosu", resourceId: "res-m3n4o5p6", resourceName: "RTX 4080 (MinerNaija)", template: "PyTorch 2.2", status: "stopped", paymentStatus: "paid", startedAt: "2026-01-28T10:00:00Z", expiresAt: "2026-02-04T10:00:00Z", hourlyRate: 2000, totalCost: 336000 },
  { id: "cnt-y5z6a7", userName: "Blessing Afolabi", resourceId: "res-a1b2c3d4", resourceName: "RTX 4090 (MinerNaija)", template: "Stable Diffusion", status: "stopped", paymentStatus: "paid", startedAt: "2026-01-25T16:00:00Z", expiresAt: "2026-01-27T16:00:00Z", hourlyRate: 2500, totalCost: 120000 },
  { id: "cnt-b8c9d0", userName: "Samuel Kariuki", resourceId: "res-i9j0k1l2", resourceName: "RTX 3090 (NairobiGPU)", template: "Ubuntu 22.04", status: "terminated", paymentStatus: "refunded", startedAt: "2026-01-20T08:00:00Z", expiresAt: "2026-01-22T08:00:00Z", hourlyRate: 1800, totalCost: 0 },
  { id: "cnt-e1f2g3", userName: "Tendai Moyo", resourceId: "res-i9j0k1l2", resourceName: "RTX 3090 (NairobiGPU)", template: "Jupyter Lab", status: "failed", paymentStatus: "refunded", startedAt: "2026-02-03T14:00:00Z", expiresAt: "2026-02-05T14:00:00Z", hourlyRate: 1800, totalCost: 0 },
  { id: "cnt-h4i5j6", userName: "Ifeoma Eze", resourceId: "res-q7r8s9t0", resourceName: "A6000 (CapeGPU)", template: "TensorFlow 2.15", status: "running", paymentStatus: "paid", startedAt: "2026-02-06T18:00:00Z", expiresAt: "2026-02-13T18:00:00Z", hourlyRate: 5500, totalCost: 924000 },
];

const statusConfig: Record<ContainerStatus, { variant: "success" | "warning" | "default" | "destructive"; icon: typeof Play }> = {
  running: { variant: "success", icon: Play },
  pending: { variant: "warning", icon: Loader2 },
  stopped: { variant: "default", icon: Square },
  terminated: { variant: "destructive", icon: XCircle },
  failed: { variant: "destructive", icon: AlertTriangle },
};

const paymentBadgeVariant: Record<PaymentStatus, "success" | "warning" | "destructive" | "default"> = {
  paid: "success",
  pending: "warning",
  overdue: "destructive",
  refunded: "default",
};

function formatDateTime(iso: string): string {
  if (!iso) return "N/A";
  return new Date(iso).toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminContainersPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filters: StatusFilter[] = ["all", "running", "pending", "stopped", "terminated", "failed"];

  const filtered = mockContainers
    .filter((c) => statusFilter === "all" || c.status === statusFilter)
    .filter((c) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        c.id.toLowerCase().includes(q) ||
        c.userName.toLowerCase().includes(q) ||
        c.template.toLowerCase().includes(q)
      );
    });

  const runningCount = mockContainers.filter((c) => c.status === "running").length;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-deep-moss">Container Management</h1>
        <p className="mt-1 text-muted-foreground">
          {mockContainers.length} total containers, {runningCount} currently running.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors",
                statusFilter === f
                  ? "bg-forest text-white"
                  : "bg-mist text-muted-foreground hover:text-foreground"
              )}
            >
              {f}
              <span className="ml-1.5 rounded-full bg-background/20 px-1.5 py-0.5 text-xs">
                {f === "all"
                  ? mockContainers.length
                  : mockContainers.filter((c) => c.status === f).length}
              </span>
            </button>
          ))}
        </div>
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-64 rounded-lg border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-forest/50"
          />
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Resource</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Template</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Payment</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Started</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Expires</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const StatusIcon = statusConfig[c.status].icon;
                  return (
                    <tr key={c.id} className="border-b border-border transition-colors hover:bg-mist/50">
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{c.id}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{c.userName}</td>
                      <td className="px-4 py-3">
                        <div className="max-w-[200px]">
                          <p className="truncate text-foreground">{c.resourceName}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-foreground">{c.template}</td>
                      <td className="px-4 py-3">
                        <Badge variant={statusConfig[c.status].variant}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {c.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={paymentBadgeVariant[c.paymentStatus]}>
                          {c.paymentStatus}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {formatDateTime(c.startedAt)}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {formatDateTime(c.expiresAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {(c.status === "running" || c.status === "pending") && (
                            <button
                              className="rounded p-1 text-muted-foreground transition-colors hover:bg-red-900/20 hover:text-red-400"
                              title="Force Terminate"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                          {c.status === "running" && (
                            <button
                              className="rounded p-1 text-muted-foreground transition-colors hover:bg-fern/10 hover:text-fern"
                              title="Extend"
                            >
                              <Clock className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            className="rounded p-1 text-muted-foreground transition-colors hover:bg-mist hover:text-foreground"
                            title="View Logs"
                          >
                            <FileText className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No containers found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
