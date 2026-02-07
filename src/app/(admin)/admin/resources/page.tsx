"use client";

import { useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Check,
  X,
  Ban,
  Eye,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ValidationStatus = "passed" | "failed" | "pending";
type VerifierStatus = "approved" | "rejected" | "pending";
type AdminStatus = "approved" | "rejected" | "pending" | "blacklisted";
type TabFilter = "all" | "verified" | "pending" | "rejected" | "blacklisted";

interface Resource {
  id: string;
  minerName: string;
  type: "GPU" | "CPU";
  model: string;
  cores: number;
  vram: string;
  ram: string;
  validationStatus: ValidationStatus;
  verifierStatus: VerifierStatus;
  adminStatus: AdminStatus;
  online: boolean;
  hourlyPrice: number;
  ip: string;
  location: string;
  registeredAt: string;
}

const mockResources: Resource[] = [
  { id: "res-a1b2c3d4", minerName: "MinerNaija", type: "GPU", model: "RTX 4090", cores: 16384, vram: "24 GB", ram: "64 GB", validationStatus: "passed", verifierStatus: "approved", adminStatus: "approved", online: true, hourlyPrice: 2500, ip: "102.89.23.xx", location: "Lagos, NG", registeredAt: "2026-01-15" },
  { id: "res-e5f6g7h8", minerName: "AccraCompute", type: "GPU", model: "A100 80GB", cores: 6912, vram: "80 GB", ram: "128 GB", validationStatus: "passed", verifierStatus: "approved", adminStatus: "approved", online: true, hourlyPrice: 8500, ip: "154.160.1.xx", location: "Accra, GH", registeredAt: "2026-01-12" },
  { id: "res-i9j0k1l2", minerName: "NairobiGPU", type: "GPU", model: "RTX 3090", cores: 10496, vram: "24 GB", ram: "32 GB", validationStatus: "passed", verifierStatus: "approved", adminStatus: "approved", online: false, hourlyPrice: 1800, ip: "196.201.214.xx", location: "Nairobi, KE", registeredAt: "2026-01-10" },
  { id: "res-m3n4o5p6", minerName: "MinerNaija", type: "GPU", model: "RTX 4080", cores: 9728, vram: "16 GB", ram: "64 GB", validationStatus: "passed", verifierStatus: "approved", adminStatus: "approved", online: true, hourlyPrice: 2000, ip: "102.89.23.xx", location: "Lagos, NG", registeredAt: "2026-01-08" },
  { id: "res-q7r8s9t0", minerName: "CapeGPU", type: "GPU", model: "A6000", cores: 10752, vram: "48 GB", ram: "128 GB", validationStatus: "passed", verifierStatus: "approved", adminStatus: "approved", online: true, hourlyPrice: 5500, ip: "41.76.108.xx", location: "Cape Town, ZA", registeredAt: "2026-01-05" },
  { id: "res-u1v2w3x4", minerName: "DakarNodes", type: "GPU", model: "RTX 4090", cores: 16384, vram: "24 GB", ram: "64 GB", validationStatus: "passed", verifierStatus: "pending", adminStatus: "pending", online: true, hourlyPrice: 2500, ip: "41.82.100.xx", location: "Dakar, SN", registeredAt: "2026-02-01" },
  { id: "res-y5z6a7b8", minerName: "KigaliCompute", type: "GPU", model: "L40S", cores: 18176, vram: "48 GB", ram: "96 GB", validationStatus: "passed", verifierStatus: "approved", adminStatus: "pending", online: true, hourlyPrice: 6000, ip: "41.186.78.xx", location: "Kigali, RW", registeredAt: "2026-02-02" },
  { id: "res-c9d0e1f2", minerName: "AbujaMiner", type: "GPU", model: "RTX 3080", cores: 8704, vram: "12 GB", ram: "32 GB", validationStatus: "passed", verifierStatus: "approved", adminStatus: "pending", online: false, hourlyPrice: 1200, ip: "102.134.xx.xx", location: "Abuja, NG", registeredAt: "2026-02-03" },
  { id: "res-g3h4i5j6", minerName: "AccraCompute", type: "CPU", model: "EPYC 7763", cores: 64, vram: "N/A", ram: "256 GB", validationStatus: "passed", verifierStatus: "approved", adminStatus: "pending", online: true, hourlyPrice: 900, ip: "154.160.1.xx", location: "Accra, GH", registeredAt: "2026-02-04" },
  { id: "res-k7l8m9n0", minerName: "LuandaGPU", type: "GPU", model: "H100", cores: 16896, vram: "80 GB", ram: "256 GB", validationStatus: "pending", verifierStatus: "pending", adminStatus: "pending", online: false, hourlyPrice: 12000, ip: "105.168.xx.xx", location: "Luanda, AO", registeredAt: "2026-02-05" },
  { id: "res-o1p2q3r4", minerName: "MinerNaija", type: "GPU", model: "RTX 4070 Ti", cores: 7680, vram: "12 GB", ram: "32 GB", validationStatus: "failed", verifierStatus: "pending", adminStatus: "pending", online: false, hourlyPrice: 1400, ip: "102.89.23.xx", location: "Lagos, NG", registeredAt: "2026-02-06" },
  { id: "res-s5t6u7v8", minerName: "KampalaNet", type: "GPU", model: "RTX 3070", cores: 5888, vram: "8 GB", ram: "16 GB", validationStatus: "passed", verifierStatus: "rejected", adminStatus: "rejected", online: false, hourlyPrice: 800, ip: "41.210.xx.xx", location: "Kampala, UG", registeredAt: "2026-01-20" },
  { id: "res-w9x0y1z2", minerName: "DarGPU", type: "GPU", model: "RTX 3060", cores: 3584, vram: "12 GB", ram: "16 GB", validationStatus: "passed", verifierStatus: "rejected", adminStatus: "rejected", online: false, hourlyPrice: 600, ip: "41.59.xx.xx", location: "Dar es Salaam, TZ", registeredAt: "2026-01-18" },
  { id: "res-a3b4c5d6", minerName: "ShadyMiner", type: "GPU", model: "Spoofed A100", cores: 0, vram: "0 GB", ram: "8 GB", validationStatus: "failed", verifierStatus: "rejected", adminStatus: "blacklisted", online: false, hourlyPrice: 100, ip: "Unknown", location: "Unknown", registeredAt: "2026-01-02" },
  { id: "res-e7f8g9h0", minerName: "FakeNodes", type: "GPU", model: "Spoofed H100", cores: 0, vram: "0 GB", ram: "4 GB", validationStatus: "failed", verifierStatus: "rejected", adminStatus: "blacklisted", online: false, hourlyPrice: 50, ip: "Unknown", location: "Unknown", registeredAt: "2025-12-28" },
];

function getTabCount(tab: TabFilter): number {
  if (tab === "all") return mockResources.length;
  if (tab === "verified") return mockResources.filter((r) => r.adminStatus === "approved").length;
  if (tab === "pending") return mockResources.filter((r) => r.adminStatus === "pending").length;
  if (tab === "rejected") return mockResources.filter((r) => r.adminStatus === "rejected").length;
  if (tab === "blacklisted") return mockResources.filter((r) => r.adminStatus === "blacklisted").length;
  return 0;
}

function statusBadge(status: string) {
  switch (status) {
    case "passed":
    case "approved":
      return <Badge variant="success">{status}</Badge>;
    case "pending":
      return <Badge variant="warning">{status}</Badge>;
    case "failed":
    case "rejected":
      return <Badge variant="destructive">{status}</Badge>;
    case "blacklisted":
      return <Badge variant="destructive">{status}</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
}

export default function AdminResourcesPage() {
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const tabs: TabFilter[] = ["all", "verified", "pending", "rejected", "blacklisted"];

  const filtered = mockResources
    .filter((r) => {
      if (activeTab === "all") return true;
      if (activeTab === "verified") return r.adminStatus === "approved";
      if (activeTab === "pending") return r.adminStatus === "pending";
      if (activeTab === "rejected") return r.adminStatus === "rejected";
      if (activeTab === "blacklisted") return r.adminStatus === "blacklisted";
      return true;
    })
    .filter((r) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        r.minerName.toLowerCase().includes(q) ||
        r.model.toLowerCase().includes(q) ||
        r.ip.toLowerCase().includes(q)
      );
    });

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((r) => r.id)));
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-deep-moss">All Resources</h1>
        <p className="mt-1 text-muted-foreground">
          Manage and monitor all compute resources on the platform.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors",
              activeTab === tab
                ? "bg-forest text-white"
                : "bg-mist text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
            <span className="ml-1.5 rounded-full bg-background/20 px-1.5 py-0.5 text-xs">
              {getTabCount(tab)}
            </span>
          </button>
        ))}
      </div>

      {/* Search + Bulk Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by miner name, GPU model, or IP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-forest/50"
          />
        </div>
        {selected.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {selected.size} selected
            </span>
            <Button size="sm" className="gap-1">
              <Check className="h-3.5 w-3.5" />
              Approve Selected
            </Button>
            <Button size="sm" variant="outline" className="gap-1 border-red-500/30 text-red-400 hover:bg-red-900/20">
              <X className="h-3.5 w-3.5" />
              Reject Selected
            </Button>
          </div>
        )}
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selected.size === filtered.length && filtered.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-border"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Miner</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Model</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Specs</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Validation</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Verifier</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Admin</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Online</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Price/hr</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <>
                    <tr
                      key={r.id}
                      onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                      className="cursor-pointer border-b border-border transition-colors hover:bg-mist/50"
                    >
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selected.has(r.id)}
                          onChange={() => toggleSelect(r.id)}
                          className="rounded border-border"
                        />
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {r.id.slice(0, 12)}...
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">{r.minerName}</td>
                      <td className="px-4 py-3">
                        <Badge variant={r.type === "GPU" ? "success" : "default"}>{r.type}</Badge>
                      </td>
                      <td className="px-4 py-3 text-foreground">{r.model}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          <span className="rounded bg-mist px-1.5 py-0.5 text-xs text-muted-foreground">
                            {r.type === "GPU" ? `${r.vram} VRAM` : `${r.cores} cores`}
                          </span>
                          <span className="rounded bg-mist px-1.5 py-0.5 text-xs text-muted-foreground">
                            {r.ram} RAM
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{statusBadge(r.validationStatus)}</td>
                      <td className="px-4 py-3">{statusBadge(r.verifierStatus)}</td>
                      <td className="px-4 py-3">{statusBadge(r.adminStatus)}</td>
                      <td className="px-4 py-3">
                        <span className="relative flex h-2.5 w-2.5">
                          {r.online && (
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fern opacity-50" />
                          )}
                          <span
                            className={cn(
                              "relative inline-flex h-2.5 w-2.5 rounded-full",
                              r.online ? "bg-fern" : "bg-red-400"
                            )}
                          />
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-foreground">
                        {"\u20A6"}{r.hourlyPrice.toLocaleString()}
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          {r.adminStatus === "pending" && (
                            <>
                              <button className="rounded p-1 text-fern transition-colors hover:bg-fern/10" title="Approve">
                                <Check className="h-4 w-4" />
                              </button>
                              <button className="rounded p-1 text-red-400 transition-colors hover:bg-red-900/20" title="Reject">
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          {r.adminStatus !== "blacklisted" && (
                            <button className="rounded p-1 text-muted-foreground transition-colors hover:bg-mist hover:text-red-400" title="Blacklist">
                              <Ban className="h-4 w-4" />
                            </button>
                          )}
                          <button className="rounded p-1 text-muted-foreground transition-colors hover:bg-mist hover:text-foreground" title="View Details">
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedId === r.id && (
                      <tr key={`${r.id}-expanded`} className="border-b border-border">
                        <td colSpan={12} className="bg-mist/30 px-8 py-4">
                          <div className="grid gap-4 sm:grid-cols-3">
                            <div>
                              <p className="text-xs font-medium uppercase text-muted-foreground">Location</p>
                              <p className="mt-1 text-sm text-foreground">{r.location}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium uppercase text-muted-foreground">IP Address</p>
                              <p className="mt-1 font-mono text-sm text-foreground">{r.ip}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium uppercase text-muted-foreground">Registered</p>
                              <p className="mt-1 text-sm text-foreground">{r.registeredAt}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium uppercase text-muted-foreground">VRAM</p>
                              <p className="mt-1 text-sm text-foreground">{r.vram}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium uppercase text-muted-foreground">System RAM</p>
                              <p className="mt-1 text-sm text-foreground">{r.ram}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium uppercase text-muted-foreground">Cores</p>
                              <p className="mt-1 text-sm text-foreground">{r.cores.toLocaleString()}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No resources found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
