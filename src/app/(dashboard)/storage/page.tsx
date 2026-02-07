"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Database,
  HardDrive,
  Package,
  ArrowUpDown,
  Plus,
  FolderOpen,
  Settings,
  Trash2,
  MapPin,
  Lock,
  Globe,
  Clock,
  ChevronDown,
  X,
  AlertTriangle,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Bucket {
  id: string;
  name: string;
  region: string;
  regionSlug: string;
  accessLevel: "private" | "public-read";
  objectCount: number;
  storageUsed: string;
  storageBytes: number;
  createdAt: string;
  endpoint: string;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_BUCKETS: Bucket[] = [
  {
    id: "bkt-1a2b3c",
    name: "ml-datasets",
    region: "Lagos",
    regionSlug: "lagos",
    accessLevel: "public-read",
    objectCount: 342,
    storageUsed: "15.2 GB",
    storageBytes: 15_200_000_000,
    createdAt: "2025-12-07T10:30:00Z",
    endpoint: "https://s3.lagos.gatehouse.cloud/ml-datasets",
  },
  {
    id: "bkt-4d5e6f",
    name: "model-weights",
    region: "Lagos",
    regionSlug: "lagos",
    accessLevel: "private",
    objectCount: 89,
    storageUsed: "28.1 GB",
    storageBytes: 28_100_000_000,
    createdAt: "2026-01-07T14:00:00Z",
    endpoint: "https://s3.lagos.gatehouse.cloud/model-weights",
  },
  {
    id: "bkt-7g8h9i",
    name: "app-backups",
    region: "Nairobi",
    regionSlug: "nairobi",
    accessLevel: "private",
    objectCount: 156,
    storageUsed: "3.8 GB",
    storageBytes: 3_800_000_000,
    createdAt: "2025-11-07T08:15:00Z",
    endpoint: "https://s3.nairobi.gatehouse.cloud/app-backups",
  },
  {
    id: "bkt-0j1k2l",
    name: "team-assets",
    region: "Cape Town",
    regionSlug: "capetown",
    accessLevel: "public-read",
    objectCount: 423,
    storageUsed: "0.9 GB",
    storageBytes: 900_000_000,
    createdAt: "2026-01-31T16:45:00Z",
    endpoint: "https://s3.capetown.gatehouse.cloud/team-assets",
  },
  {
    id: "bkt-3m4n5o",
    name: "logs-archive",
    region: "Lagos",
    regionSlug: "lagos",
    accessLevel: "private",
    objectCount: 237,
    storageUsed: "0.3 GB",
    storageBytes: 300_000_000,
    createdAt: "2026-01-24T11:20:00Z",
    endpoint: "https://s3.lagos.gatehouse.cloud/logs-archive",
  },
];

const STATS = {
  totalBuckets: 5,
  totalObjects: 1247,
  storageUsed: "48.3 GB",
  bandwidthThisMonth: "12.7 GB",
};

const REGIONS = ["Lagos", "Nairobi", "Cape Town", "Accra"] as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return "1 week ago";
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 60) return "1 month ago";
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

// ---------------------------------------------------------------------------
// Create Bucket Form
// ---------------------------------------------------------------------------

function CreateBucketForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [region, setRegion] = useState<string>("Lagos");
  const [accessLevel, setAccessLevel] = useState<"private" | "public-read">("private");
  const [error, setError] = useState<string | null>(null);
  const [regionOpen, setRegionOpen] = useState(false);

  const nameRegex = /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/;
  const nameValid = name.length === 0 || nameRegex.test(name);
  const canSubmit = name.length >= 3 && nameValid;

  function handleSubmit() {
    if (!canSubmit) return;

    if (MOCK_BUCKETS.some((b) => b.name === name)) {
      setError("A bucket with this name already exists.");
      return;
    }

    // Mock success - in production this would call the API
    setError(null);
    onClose();
  }

  return (
    <Card className="border-forest/30">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Plus className="h-5 w-5 text-forest" />
            Create New Bucket
          </CardTitle>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Bucket name */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Bucket Name
          </label>
          <input
            type="text"
            placeholder="my-bucket-name"
            value={name}
            onChange={(e) => {
              setName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
              setError(null);
            }}
            className={cn(
              "w-full rounded-lg border bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-forest/50",
              !nameValid ? "border-red-400/50" : "border-border"
            )}
          />
          {!nameValid && name.length > 0 && (
            <p className="mt-1 text-xs text-red-400">
              Must be 3-63 characters: lowercase letters, numbers, and hyphens only. Must start and end with a letter or number.
            </p>
          )}
          {error && (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-red-400">
              <AlertTriangle className="h-3 w-3" />
              {error}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Region */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Region
            </label>
            <div className="relative">
              <button
                onClick={() => setRegionOpen(!regionOpen)}
                className="flex h-10 w-full items-center justify-between rounded-lg border border-border bg-background px-3 text-sm text-foreground hover:bg-mist transition-colors"
              >
                <span className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  {region}
                </span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 text-muted-foreground transition-transform",
                    regionOpen && "rotate-180"
                  )}
                />
              </button>
              {regionOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setRegionOpen(false)} />
                  <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-lg border border-border bg-card p-1 shadow-lg">
                    {REGIONS.map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          setRegion(r);
                          setRegionOpen(false);
                        }}
                        className={cn(
                          "w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors hover:bg-mist",
                          region === r ? "text-fern" : "text-foreground"
                        )}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Access level */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Access Level
            </label>
            <div className="flex rounded-lg border border-border bg-background p-0.5">
              {(["private", "public-read"] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setAccessLevel(level)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    accessLevel === level
                      ? "bg-forest text-white"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {level === "private" ? (
                    <Lock className="h-3.5 w-3.5" />
                  ) : (
                    <Globe className="h-3.5 w-3.5" />
                  )}
                  {level === "private" ? "Private" : "Public Read"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" disabled={!canSubmit} onClick={handleSubmit}>
            <Plus className="mr-1.5 h-4 w-4" />
            Create Bucket
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Bucket Card
// ---------------------------------------------------------------------------

function BucketCard({ bucket }: { bucket: Bucket }) {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <Card className="group transition-colors hover:border-forest/40">
      <CardContent className="p-5">
        {/* Top: Name + access badge */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest/10">
              <Database className="h-4.5 w-4.5 text-forest" />
            </div>
            <div>
              <h3 className="font-mono text-sm font-semibold text-foreground group-hover:text-fern transition-colors">
                {bucket.name}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {bucket.region}
              </div>
            </div>
          </div>
          <Badge variant={bucket.accessLevel === "public-read" ? "warning" : "default"}>
            {bucket.accessLevel === "public-read" ? (
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                Public
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Lock className="h-3 w-3" />
                Private
              </span>
            )}
          </Badge>
        </div>

        {/* Stats row */}
        <div className="mb-4 grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-mist/50 px-3 py-2 text-center">
            <p className="text-xs text-muted-foreground">Objects</p>
            <p className="text-sm font-semibold text-foreground">
              {bucket.objectCount.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg bg-mist/50 px-3 py-2 text-center">
            <p className="text-xs text-muted-foreground">Size</p>
            <p className="text-sm font-semibold text-foreground">{bucket.storageUsed}</p>
          </div>
          <div className="rounded-lg bg-mist/50 px-3 py-2 text-center">
            <p className="text-xs text-muted-foreground">Created</p>
            <p className="text-sm font-semibold text-foreground">
              {timeAgo(bucket.createdAt)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 border-t border-border pt-3">
          <Link href={`/storage/${bucket.name}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full gap-1.5">
              <FolderOpen className="h-3.5 w-3.5" />
              Browse
            </Button>
          </Link>
          <Button variant="ghost" size="sm" className="gap-1.5 px-3">
            <Settings className="h-3.5 w-3.5" />
          </Button>
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 px-3 text-red-400 hover:bg-red-900/20 hover:text-red-300"
              onClick={() => setShowDelete(!showDelete)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
            {showDelete && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowDelete(false)} />
                <div className="absolute bottom-full right-0 z-50 mb-2 w-56 rounded-lg border border-border bg-card p-3 shadow-lg">
                  <p className="mb-2 text-sm text-foreground">
                    Delete <span className="font-mono font-semibold">{bucket.name}</span>?
                  </p>
                  <p className="mb-3 text-xs text-muted-foreground">
                    This will permanently delete all objects in this bucket.
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      onClick={() => setShowDelete(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-red-600 text-white hover:bg-red-700"
                      onClick={() => setShowDelete(false)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function StorageOverviewPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Object Storage</h1>
          <p className="mt-1 text-muted-foreground">
            S3-compatible storage for datasets, models, and backups.
          </p>
        </div>
        <Button size="sm" onClick={() => setShowCreateForm(true)} className="gap-1.5 self-start">
          <Plus className="h-4 w-4" />
          Create Bucket
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest/10">
              <Database className="h-5 w-5 text-forest" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Buckets</p>
              <p className="text-xl font-bold text-foreground">{STATS.totalBuckets}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-fern/10">
              <Package className="h-5 w-5 text-fern" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Objects</p>
              <p className="text-xl font-bold text-foreground">
                {STATS.totalObjects.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-copper/10">
              <HardDrive className="h-5 w-5 text-copper" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Storage Used</p>
              <p className="text-xl font-bold text-foreground">{STATS.storageUsed}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-mist">
              <ArrowUpDown className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Bandwidth This Month</p>
              <p className="text-xl font-bold text-foreground">{STATS.bandwidthThisMonth}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create bucket form */}
      {showCreateForm && <CreateBucketForm onClose={() => setShowCreateForm(false)} />}

      {/* Bucket list */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            Buckets ({MOCK_BUCKETS.length})
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            Last synced just now
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {MOCK_BUCKETS.map((bucket) => (
            <BucketCard key={bucket.id} bucket={bucket} />
          ))}
        </div>
      </div>
    </div>
  );
}
