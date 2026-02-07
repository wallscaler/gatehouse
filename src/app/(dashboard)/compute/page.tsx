"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Cpu,
  MapPin,
  DollarSign,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Server,
  Zap,
  HardDrive,
  MemoryStick,
  CircleCheck,
  CircleX,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ComputeResource {
  id: string;
  type: "gpu" | "cpu";
  name: string;
  gpuModel?: string;
  gpuVram?: string;
  gpuCount?: number;
  cpuModel: string;
  cpuCores: number;
  cpuThreads: number;
  ram: string;
  storage: string;
  storageType: string;
  region: string;
  country: string;
  pricePerHour: number;
  status: "online" | "offline";
  reliabilityScore: number;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_RESOURCES: ComputeResource[] = [
  {
    id: "gpu-rtx3090-lagos-01",
    type: "gpu",
    name: "Adeola's RTX 3090 Node",
    gpuModel: "RTX 3090",
    gpuVram: "24 GB",
    gpuCount: 1,
    cpuModel: "AMD Ryzen 9 5900X",
    cpuCores: 12,
    cpuThreads: 24,
    ram: "64 GB",
    storage: "1 TB",
    storageType: "NVMe SSD",
    region: "West Africa",
    country: "Lagos, Nigeria",
    pricePerHour: 0.45,
    status: "online",
    reliabilityScore: 98,
  },
  {
    id: "gpu-rtx4090-nairobi-01",
    type: "gpu",
    name: "Wanjiku's RTX 4090 Rig",
    gpuModel: "RTX 4090",
    gpuVram: "24 GB",
    gpuCount: 1,
    cpuModel: "Intel Core i9-13900K",
    cpuCores: 24,
    cpuThreads: 32,
    ram: "128 GB",
    storage: "2 TB",
    storageType: "NVMe SSD",
    region: "East Africa",
    country: "Nairobi, Kenya",
    pricePerHour: 0.85,
    status: "online",
    reliabilityScore: 97,
  },
  {
    id: "gpu-a100-40-capetown-01",
    type: "gpu",
    name: "Cape Town A100 Cluster",
    gpuModel: "A100 40GB",
    gpuVram: "40 GB",
    gpuCount: 1,
    cpuModel: "AMD EPYC 7763",
    cpuCores: 32,
    cpuThreads: 64,
    ram: "256 GB",
    storage: "4 TB",
    storageType: "NVMe SSD",
    region: "Southern Africa",
    country: "Cape Town, South Africa",
    pricePerHour: 2.10,
    status: "online",
    reliabilityScore: 99,
  },
  {
    id: "gpu-a100-80-amsterdam-01",
    type: "gpu",
    name: "Amsterdam A100 80GB",
    gpuModel: "A100 80GB",
    gpuVram: "80 GB",
    gpuCount: 1,
    cpuModel: "AMD EPYC 7763",
    cpuCores: 64,
    cpuThreads: 128,
    ram: "512 GB",
    storage: "8 TB",
    storageType: "NVMe SSD",
    region: "Europe",
    country: "Amsterdam, Netherlands",
    pricePerHour: 3.20,
    status: "online",
    reliabilityScore: 99,
  },
  {
    id: "gpu-h100-london-01",
    type: "gpu",
    name: "London H100 Server",
    gpuModel: "H100",
    gpuVram: "80 GB",
    gpuCount: 1,
    cpuModel: "Intel Xeon w9-3495X",
    cpuCores: 56,
    cpuThreads: 112,
    ram: "512 GB",
    storage: "8 TB",
    storageType: "NVMe SSD",
    region: "Europe",
    country: "London, UK",
    pricePerHour: 4.50,
    status: "online",
    reliabilityScore: 99,
  },
  {
    id: "gpu-rtx3060-lagos-02",
    type: "gpu",
    name: "Emeka's RTX 3060 Station",
    gpuModel: "RTX 3060",
    gpuVram: "12 GB",
    gpuCount: 1,
    cpuModel: "AMD Ryzen 7 5800X",
    cpuCores: 8,
    cpuThreads: 16,
    ram: "32 GB",
    storage: "500 GB",
    storageType: "NVMe SSD",
    region: "West Africa",
    country: "Lagos, Nigeria",
    pricePerHour: 0.15,
    status: "offline",
    reliabilityScore: 91,
  },
  {
    id: "cpu-amd-nairobi-01",
    type: "cpu",
    name: "Nairobi Compute Node A",
    cpuModel: "AMD Ryzen 9 7950X",
    cpuCores: 16,
    cpuThreads: 32,
    ram: "64 GB",
    storage: "2 TB",
    storageType: "NVMe SSD",
    region: "East Africa",
    country: "Nairobi, Kenya",
    pricePerHour: 0.25,
    status: "online",
    reliabilityScore: 96,
  },
  {
    id: "cpu-intel-lagos-01",
    type: "cpu",
    name: "Lagos Intel Workhorse",
    cpuModel: "Intel Xeon E-2388G",
    cpuCores: 8,
    cpuThreads: 16,
    ram: "32 GB",
    storage: "1 TB",
    storageType: "SATA SSD",
    region: "West Africa",
    country: "Lagos, Nigeria",
    pricePerHour: 0.18,
    status: "online",
    reliabilityScore: 94,
  },
  {
    id: "cpu-epyc-capetown-01",
    type: "cpu",
    name: "Cape Town EPYC Server",
    cpuModel: "AMD EPYC 9354",
    cpuCores: 32,
    cpuThreads: 64,
    ram: "128 GB",
    storage: "4 TB",
    storageType: "NVMe SSD",
    region: "Southern Africa",
    country: "Cape Town, South Africa",
    pricePerHour: 0.65,
    status: "online",
    reliabilityScore: 98,
  },
  {
    id: "cpu-xeon-amsterdam-01",
    type: "cpu",
    name: "Amsterdam Xeon Cluster",
    cpuModel: "Intel Xeon w9-3495X",
    cpuCores: 56,
    cpuThreads: 112,
    ram: "256 GB",
    storage: "8 TB",
    storageType: "NVMe SSD",
    region: "Europe",
    country: "Amsterdam, Netherlands",
    pricePerHour: 1.20,
    status: "online",
    reliabilityScore: 99,
  },
  {
    id: "cpu-threadripper-newyork-01",
    type: "cpu",
    name: "NYC Threadripper Pro",
    cpuModel: "AMD Threadripper PRO 5995WX",
    cpuCores: 64,
    cpuThreads: 128,
    ram: "256 GB",
    storage: "4 TB",
    storageType: "NVMe SSD",
    region: "North America",
    country: "New York, USA",
    pricePerHour: 1.50,
    status: "online",
    reliabilityScore: 97,
  },
  {
    id: "cpu-ryzen-london-01",
    type: "cpu",
    name: "London Ryzen Flex Node",
    cpuModel: "AMD Ryzen 9 7900X",
    cpuCores: 12,
    cpuThreads: 24,
    ram: "64 GB",
    storage: "1 TB",
    storageType: "NVMe SSD",
    region: "Europe",
    country: "London, UK",
    pricePerHour: 0.30,
    status: "offline",
    reliabilityScore: 93,
  },
];

const GPU_MODELS = ["All GPUs", "RTX 3060", "RTX 3090", "RTX 4090", "A100 40GB", "A100 80GB", "H100"];
const REGIONS = ["All Regions", "West Africa", "East Africa", "Southern Africa", "Europe", "North America"];
const SORT_OPTIONS = ["Price: Low to High", "Price: High to Low", "GPU Model", "Cores"];

// ---------------------------------------------------------------------------
// Dropdown helper
// ---------------------------------------------------------------------------

function Dropdown({
  value,
  options,
  onChange,
  label,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  label: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm text-foreground hover:bg-mist transition-colors"
      >
        <span className="text-muted-foreground">{label}:</span>
        <span>{value}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 z-50 mt-1 min-w-[180px] rounded-lg border border-border bg-card p-1 shadow-lg">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={cn(
                  "w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors hover:bg-mist",
                  value === opt ? "text-fern" : "text-foreground"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ComputeMarketplacePage() {
  const [typeFilter, setTypeFilter] = useState<"all" | "gpu" | "cpu">("all");
  const [gpuFilter, setGpuFilter] = useState("All GPUs");
  const [regionFilter, setRegionFilter] = useState("All Regions");
  const [sortBy, setSortBy] = useState("Price: Low to High");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    let items = [...MOCK_RESOURCES];

    // Type filter
    if (typeFilter !== "all") {
      items = items.filter((r) => r.type === typeFilter);
    }

    // GPU model filter
    if (gpuFilter !== "All GPUs") {
      items = items.filter((r) => r.gpuModel === gpuFilter);
    }

    // Region filter
    if (regionFilter !== "All Regions") {
      items = items.filter((r) => r.region === regionFilter);
    }

    // Price range
    if (minPrice) {
      items = items.filter((r) => r.pricePerHour >= parseFloat(minPrice));
    }
    if (maxPrice) {
      items = items.filter((r) => r.pricePerHour <= parseFloat(maxPrice));
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.cpuModel.toLowerCase().includes(q) ||
          (r.gpuModel && r.gpuModel.toLowerCase().includes(q)) ||
          r.country.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case "Price: Low to High":
        items.sort((a, b) => a.pricePerHour - b.pricePerHour);
        break;
      case "Price: High to Low":
        items.sort((a, b) => b.pricePerHour - a.pricePerHour);
        break;
      case "GPU Model":
        items.sort((a, b) => (a.gpuModel ?? "").localeCompare(b.gpuModel ?? ""));
        break;
      case "Cores":
        items.sort((a, b) => b.cpuCores - a.cpuCores);
        break;
    }

    return items;
  }, [typeFilter, gpuFilter, regionFilter, sortBy, minPrice, maxPrice, searchQuery]);

  const onlineCount = MOCK_RESOURCES.filter((r) => r.status === "online").length;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Compute Marketplace</h1>
          <p className="mt-1 text-muted-foreground">
            Browse available GPU and CPU resources from providers across Africa and beyond.
          </p>
        </div>
        <Badge variant="success" className="self-start text-sm px-3 py-1">
          {onlineCount} available now
        </Badge>
      </div>

      {/* Filter bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            {/* Top row: search + type toggle */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search resources, regions, GPU models..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-forest/50"
                />
              </div>
              <div className="flex rounded-lg border border-border bg-background p-0.5">
                {(["all", "gpu", "cpu"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className={cn(
                      "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                      typeFilter === t
                        ? "bg-forest text-white"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {t === "all" ? "All" : t.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom row: dropdowns + price */}
            <div className="flex flex-wrap items-center gap-3">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <Dropdown label="GPU" value={gpuFilter} options={GPU_MODELS} onChange={setGpuFilter} />
              <Dropdown label="Region" value={regionFilter} options={REGIONS} onChange={setRegionFilter} />
              <Dropdown label="Sort" value={sortBy} options={SORT_OPTIONS} onChange={setSortBy} />

              <div className="flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-16 rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-forest/50"
                  step="0.05"
                  min="0"
                />
                <span className="text-xs text-muted-foreground">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-16 rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-forest/50"
                  step="0.05"
                  min="0"
                />
                <span className="text-xs text-muted-foreground">/hr</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filtered.length} of {MOCK_RESOURCES.length} resources
      </div>

      {/* Resource grid */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Server className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm font-medium text-foreground">No resources match your filters</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search criteria or removing some filters.
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-4"
              onClick={() => {
                setTypeFilter("all");
                setGpuFilter("All GPUs");
                setRegionFilter("All Regions");
                setMinPrice("");
                setMaxPrice("");
                setSearchQuery("");
              }}
            >
              Clear all filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((resource) => (
            <Link key={resource.id} href={`/compute/${resource.id}`}>
              <Card className="group h-full transition-colors hover:border-forest/40">
                <CardContent className="p-5">
                  {/* Header row */}
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {resource.type === "gpu" ? (
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-fern/10">
                          <Zap className="h-4 w-4 text-fern" />
                        </div>
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-copper/10">
                          <Cpu className="h-4 w-4 text-copper" />
                        </div>
                      )}
                      <Badge variant={resource.type === "gpu" ? "success" : "warning"}>
                        {resource.type.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {resource.status === "online" ? (
                        <CircleCheck className="h-3.5 w-3.5 text-fern" />
                      ) : (
                        <CircleX className="h-3.5 w-3.5 text-red-400" />
                      )}
                      <span
                        className={cn(
                          "text-xs font-medium",
                          resource.status === "online" ? "text-fern" : "text-red-400"
                        )}
                      >
                        {resource.status === "online" ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>

                  {/* Name */}
                  <h3 className="mb-1 font-semibold text-foreground group-hover:text-fern transition-colors">
                    {resource.name}
                  </h3>

                  {/* Location */}
                  <div className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{resource.country}</span>
                  </div>

                  {/* Specs */}
                  <div className="mb-4 space-y-1.5">
                    {resource.gpuModel && (
                      <div className="flex items-center gap-2 text-sm">
                        <Zap className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-foreground">{resource.gpuModel}</span>
                        <span className="text-muted-foreground">{resource.gpuVram}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Cpu className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-foreground">{resource.cpuCores} cores</span>
                      <span className="text-muted-foreground">{resource.cpuThreads}T</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MemoryStick className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-foreground">{resource.ram}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <HardDrive className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-foreground">{resource.storage}</span>
                      <span className="text-muted-foreground">{resource.storageType}</span>
                    </div>
                  </div>

                  {/* Price + reliability */}
                  <div className="flex items-end justify-between border-t border-border pt-3">
                    <div>
                      <span className="text-lg font-bold text-foreground">
                        ${resource.pricePerHour.toFixed(2)}
                      </span>
                      <span className="text-sm text-muted-foreground"> /hr</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {resource.reliabilityScore}% uptime
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
