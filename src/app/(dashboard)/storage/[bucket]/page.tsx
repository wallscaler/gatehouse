"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Upload,
  FolderPlus,
  Search,
  List,
  LayoutGrid,
  Folder,
  FileText,
  FileJson,
  FileImage,
  FileCode,
  File,
  Download,
  Copy,
  Check,
  Trash2,
  ChevronRight,
  Database,
  MapPin,
  Lock,
  Globe,
  Clock,
  Key,
  Link2,
  X,
  CloudUpload,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface StorageObject {
  key: string;
  type: "folder" | "file";
  size: string;
  sizeBytes: number;
  lastModified: string;
  contentType: string;
  itemCount?: number;
}

interface BucketMeta {
  name: string;
  region: string;
  accessLevel: "private" | "public-read";
  createdAt: string;
  storageUsed: string;
  endpoint: string;
}

// ---------------------------------------------------------------------------
// Mock data keyed by bucket name
// ---------------------------------------------------------------------------

const MOCK_OBJECTS: Record<string, StorageObject[]> = {
  "ml-datasets": [
    {
      key: "training/",
      type: "folder",
      size: "8.2 GB",
      sizeBytes: 8_200_000_000,
      lastModified: "2026-02-05T09:30:00Z",
      contentType: "application/x-directory",
      itemCount: 5,
    },
    {
      key: "validation/",
      type: "folder",
      size: "4.1 GB",
      sizeBytes: 4_100_000_000,
      lastModified: "2026-02-04T14:20:00Z",
      contentType: "application/x-directory",
      itemCount: 3,
    },
    {
      key: "raw/",
      type: "folder",
      size: "2.9 GB",
      sizeBytes: 2_900_000_000,
      lastModified: "2026-02-03T11:45:00Z",
      contentType: "application/x-directory",
      itemCount: 12,
    },
    {
      key: "config.json",
      type: "file",
      size: "2.4 KB",
      sizeBytes: 2_400,
      lastModified: "2026-02-06T16:00:00Z",
      contentType: "application/json",
    },
    {
      key: "README.md",
      type: "file",
      size: "1.1 KB",
      sizeBytes: 1_100,
      lastModified: "2026-02-01T10:00:00Z",
      contentType: "text/markdown",
    },
    {
      key: "labels.csv",
      type: "file",
      size: "856 KB",
      sizeBytes: 856_000,
      lastModified: "2026-02-05T08:15:00Z",
      contentType: "text/csv",
    },
    {
      key: "sample-001.png",
      type: "file",
      size: "2.3 MB",
      sizeBytes: 2_300_000,
      lastModified: "2026-02-02T13:30:00Z",
      contentType: "image/png",
    },
  ],
  "model-weights": [
    {
      key: "checkpoints/",
      type: "folder",
      size: "24.5 GB",
      sizeBytes: 24_500_000_000,
      lastModified: "2026-02-06T20:00:00Z",
      contentType: "application/x-directory",
      itemCount: 8,
    },
    {
      key: "final/",
      type: "folder",
      size: "3.2 GB",
      sizeBytes: 3_200_000_000,
      lastModified: "2026-02-05T17:30:00Z",
      contentType: "application/x-directory",
      itemCount: 2,
    },
    {
      key: "config.yaml",
      type: "file",
      size: "4.8 KB",
      sizeBytes: 4_800,
      lastModified: "2026-02-06T15:00:00Z",
      contentType: "text/yaml",
    },
    {
      key: "training-log.txt",
      type: "file",
      size: "312 KB",
      sizeBytes: 312_000,
      lastModified: "2026-02-06T20:05:00Z",
      contentType: "text/plain",
    },
  ],
  "app-backups": [
    {
      key: "daily/",
      type: "folder",
      size: "2.1 GB",
      sizeBytes: 2_100_000_000,
      lastModified: "2026-02-07T02:00:00Z",
      contentType: "application/x-directory",
      itemCount: 30,
    },
    {
      key: "weekly/",
      type: "folder",
      size: "1.5 GB",
      sizeBytes: 1_500_000_000,
      lastModified: "2026-02-03T02:00:00Z",
      contentType: "application/x-directory",
      itemCount: 8,
    },
    {
      key: "backup-manifest.json",
      type: "file",
      size: "6.2 KB",
      sizeBytes: 6_200,
      lastModified: "2026-02-07T02:05:00Z",
      contentType: "application/json",
    },
  ],
  "team-assets": [
    {
      key: "images/",
      type: "folder",
      size: "0.5 GB",
      sizeBytes: 500_000_000,
      lastModified: "2026-02-06T10:00:00Z",
      contentType: "application/x-directory",
      itemCount: 45,
    },
    {
      key: "docs/",
      type: "folder",
      size: "0.2 GB",
      sizeBytes: 200_000_000,
      lastModified: "2026-02-05T14:30:00Z",
      contentType: "application/x-directory",
      itemCount: 120,
    },
    {
      key: "brand-guidelines.pdf",
      type: "file",
      size: "18.4 MB",
      sizeBytes: 18_400_000,
      lastModified: "2026-01-31T16:50:00Z",
      contentType: "application/pdf",
    },
    {
      key: "logo.svg",
      type: "file",
      size: "12.3 KB",
      sizeBytes: 12_300,
      lastModified: "2026-01-31T16:48:00Z",
      contentType: "image/svg+xml",
    },
  ],
  "logs-archive": [
    {
      key: "2026-01/",
      type: "folder",
      size: "0.15 GB",
      sizeBytes: 150_000_000,
      lastModified: "2026-02-01T00:05:00Z",
      contentType: "application/x-directory",
      itemCount: 124,
    },
    {
      key: "2026-02/",
      type: "folder",
      size: "0.12 GB",
      sizeBytes: 120_000_000,
      lastModified: "2026-02-07T00:05:00Z",
      contentType: "application/x-directory",
      itemCount: 89,
    },
    {
      key: "retention-policy.json",
      type: "file",
      size: "1.2 KB",
      sizeBytes: 1_200,
      lastModified: "2026-01-24T11:25:00Z",
      contentType: "application/json",
    },
  ],
};

const BUCKET_META: Record<string, BucketMeta> = {
  "ml-datasets": {
    name: "ml-datasets",
    region: "Lagos",
    accessLevel: "public-read",
    createdAt: "2025-12-07T10:30:00Z",
    storageUsed: "15.2 GB",
    endpoint: "https://s3.lagos.polariscloud.ai/ml-datasets",
  },
  "model-weights": {
    name: "model-weights",
    region: "Lagos",
    accessLevel: "private",
    createdAt: "2026-01-07T14:00:00Z",
    storageUsed: "28.1 GB",
    endpoint: "https://s3.lagos.polariscloud.ai/model-weights",
  },
  "app-backups": {
    name: "app-backups",
    region: "Nairobi",
    accessLevel: "private",
    createdAt: "2025-11-07T08:15:00Z",
    storageUsed: "3.8 GB",
    endpoint: "https://s3.nairobi.polariscloud.ai/app-backups",
  },
  "team-assets": {
    name: "team-assets",
    region: "Cape Town",
    accessLevel: "public-read",
    createdAt: "2026-01-31T16:45:00Z",
    storageUsed: "0.9 GB",
    endpoint: "https://s3.capetown.polariscloud.ai/team-assets",
  },
  "logs-archive": {
    name: "logs-archive",
    region: "Lagos",
    accessLevel: "private",
    createdAt: "2026-01-24T11:20:00Z",
    storageUsed: "0.3 GB",
    endpoint: "https://s3.lagos.polariscloud.ai/logs-archive",
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getFileIcon(obj: StorageObject) {
  if (obj.type === "folder") return <Folder className="h-4 w-4 text-copper" />;

  const ct = obj.contentType;
  if (ct.startsWith("image/")) return <FileImage className="h-4 w-4 text-fern" />;
  if (ct === "application/json" || ct === "text/yaml")
    return <FileJson className="h-4 w-4 text-forest" />;
  if (ct === "text/markdown" || ct === "text/csv" || ct === "text/plain")
    return <FileText className="h-4 w-4 text-muted-foreground" />;
  if (ct === "application/pdf") return <FileText className="h-4 w-4 text-red-400" />;
  if (ct === "image/svg+xml") return <FileCode className="h-4 w-4 text-fern" />;
  return <File className="h-4 w-4 text-muted-foreground" />;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ---------------------------------------------------------------------------
// Upload Zone
// ---------------------------------------------------------------------------

function UploadZone({ onClose }: { onClose: () => void }) {
  const [files, setFiles] = useState<{ name: string; size: string; progress: number }[]>([
    { name: "dataset-v2.tar.gz", size: "1.2 GB", progress: 73 },
    { name: "annotations.json", size: "4.5 MB", progress: 100 },
    { name: "image-batch-042.zip", size: "340 MB", progress: 12 },
  ]);

  return (
    <Card className="border-forest/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <CloudUpload className="h-5 w-5 text-forest" />
            Upload Files
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
        {/* Drop zone */}
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-mist/30 px-6 py-10 text-center transition-colors hover:border-forest/40">
          <Upload className="mb-3 h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">
            Drag and drop files here
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            or click to browse from your computer
          </p>
        </div>

        {/* Mock file list with progress */}
        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.name}
                className="rounded-lg border border-border bg-mist/30 p-3"
              >
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="font-mono text-sm text-foreground">{file.name}</span>
                  <span className="text-xs text-muted-foreground">{file.size}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-background">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      file.progress === 100 ? "bg-fern" : "bg-forest"
                    )}
                    style={{ width: `${file.progress}%` }}
                  />
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {file.progress === 100 ? "Complete" : "Uploading..."}
                  </span>
                  <span>{file.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-end gap-3">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm">
            <Upload className="mr-1.5 h-4 w-4" />
            Upload
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function BucketBrowserPage() {
  const params = useParams<{ bucket: string }>();
  const bucketName = params.bucket;

  const meta = BUCKET_META[bucketName];
  const objects = MOCK_OBJECTS[bucketName] ?? [];

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [showUpload, setShowUpload] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Filter objects by search
  const filtered = searchQuery.trim()
    ? objects.filter((obj) =>
        obj.key.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : objects;

  // Sort: folders first, then files
  const sorted = [...filtered].sort((a, b) => {
    if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
    return a.key.localeCompare(b.key);
  });

  function toggleSelect(key: string) {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedItems.size === sorted.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(sorted.map((o) => o.key)));
    }
  }

  async function handleCopy(text: string, field: string) {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  }

  // Not-found state
  if (!meta) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <Link href="/storage">
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Storage
          </Button>
        </Link>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Database className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm font-medium text-foreground">Bucket not found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              The bucket <span className="font-mono">{bucketName}</span> does not exist or has been deleted.
            </p>
            <Link href="/storage" className="mt-4">
              <Button variant="ghost" size="sm">
                Go to Storage
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Back button */}
      <Link href="/storage">
        <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Storage
        </Button>
      </Link>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm">
        <Link href="/storage" className="text-muted-foreground hover:text-foreground transition-colors">
          Storage
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-mono font-medium text-foreground">{bucketName}</span>
      </nav>

      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-mono text-2xl font-bold text-foreground">{bucketName}</h1>
            <Badge variant={meta.accessLevel === "public-read" ? "warning" : "default"}>
              {meta.accessLevel === "public-read" ? (
                <span className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  Public Read
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Private
                </span>
              )}
            </Badge>
          </div>
          <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {meta.region}
            </span>
            <span>{meta.storageUsed}</span>
            <span>{objects.length} items</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSidebar(!showSidebar)}
            className="gap-1.5"
          >
            {showSidebar ? (
              <PanelRightClose className="h-4 w-4" />
            ) : (
              <PanelRightOpen className="h-4 w-4" />
            )}
            Info
          </Button>
        </div>
      </div>

      {/* Upload zone */}
      {showUpload && <UploadZone onClose={() => setShowUpload(false)} />}

      {/* Main content area */}
      <div className={cn("grid gap-6", showSidebar ? "grid-cols-1 lg:grid-cols-[1fr_280px]" : "grid-cols-1")}>
        {/* File browser */}
        <div className="space-y-4">
          {/* Toolbar */}
          <Card>
            <CardContent className="p-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={() => setShowUpload(!showUpload)} className="gap-1.5">
                    <Upload className="h-3.5 w-3.5" />
                    Upload
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <FolderPlus className="h-3.5 w-3.5" />
                    Create Folder
                  </Button>
                </div>

                <div className="flex flex-1 items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search files and folders..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-forest/50"
                    />
                  </div>
                  <div className="flex rounded-lg border border-border bg-background p-0.5">
                    {(["list", "grid"] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setViewMode(mode)}
                        className={cn(
                          "rounded-md p-1.5 transition-colors",
                          viewMode === mode
                            ? "bg-forest text-white"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {mode === "list" ? (
                          <List className="h-4 w-4" />
                        ) : (
                          <LayoutGrid className="h-4 w-4" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File list / grid */}
          {sorted.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Folder className="mb-3 h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm font-medium text-foreground">
                  {searchQuery ? "No matching files" : "This bucket is empty"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {searchQuery
                    ? "Try a different search term."
                    : "Upload files or create folders to get started."}
                </p>
              </CardContent>
            </Card>
          ) : viewMode === "list" ? (
            /* List view */
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left text-xs text-muted-foreground">
                      <th className="w-10 px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.size === sorted.length && sorted.length > 0}
                          onChange={toggleSelectAll}
                          className="h-4 w-4 rounded border-border bg-background accent-forest"
                        />
                      </th>
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Size</th>
                      <th className="px-4 py-3 font-medium">Last Modified</th>
                      <th className="w-32 px-4 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((obj) => (
                      <tr
                        key={obj.key}
                        className={cn(
                          "border-b border-border/50 transition-colors hover:bg-mist/30",
                          selectedItems.has(obj.key) && "bg-forest/5"
                        )}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedItems.has(obj.key)}
                            onChange={() => toggleSelect(obj.key)}
                            className="h-4 w-4 rounded border-border bg-background accent-forest"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            {getFileIcon(obj)}
                            {obj.type === "folder" ? (
                              <button className="font-mono text-sm font-medium text-foreground hover:text-fern transition-colors">
                                {obj.key}
                              </button>
                            ) : (
                              <span className="font-mono text-sm text-foreground">
                                {obj.key}
                              </span>
                            )}
                            {obj.itemCount !== undefined && (
                              <span className="text-xs text-muted-foreground">
                                {obj.itemCount} items
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {obj.size}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {formatDate(obj.lastModified)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {obj.type === "file" && (
                              <>
                                <button
                                  className="rounded-md p-1.5 text-muted-foreground hover:bg-mist hover:text-foreground transition-colors"
                                  title="Download"
                                >
                                  <Download className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleCopy(
                                      `${meta.endpoint}/${obj.key}`,
                                      `url-${obj.key}`
                                    )
                                  }
                                  className="rounded-md p-1.5 text-muted-foreground hover:bg-mist hover:text-foreground transition-colors"
                                  title="Copy URL"
                                >
                                  {copiedField === `url-${obj.key}` ? (
                                    <Check className="h-3.5 w-3.5 text-fern" />
                                  ) : (
                                    <Copy className="h-3.5 w-3.5" />
                                  )}
                                </button>
                              </>
                            )}
                            <button
                              className="rounded-md p-1.5 text-muted-foreground hover:bg-red-900/20 hover:text-red-400 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
            /* Grid view */
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {sorted.map((obj) => (
                <Card
                  key={obj.key}
                  className={cn(
                    "group cursor-pointer transition-colors hover:border-forest/40",
                    selectedItems.has(obj.key) && "border-forest/60 bg-forest/5"
                  )}
                  onClick={() => toggleSelect(obj.key)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="mb-2 flex justify-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-mist/50">
                        {getFileIcon(obj)}
                      </div>
                    </div>
                    <p className="truncate font-mono text-xs font-medium text-foreground group-hover:text-fern transition-colors">
                      {obj.key}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{obj.size}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Results summary */}
          <div className="text-xs text-muted-foreground">
            {sorted.filter((o) => o.type === "folder").length} folders,{" "}
            {sorted.filter((o) => o.type === "file").length} files
            {selectedItems.size > 0 && (
              <span className="ml-2 text-fern">
                ({selectedItems.size} selected)
              </span>
            )}
          </div>
        </div>

        {/* Info sidebar */}
        {showSidebar && (
          <div className="space-y-4">
            {/* Bucket info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Database className="h-4 w-4 text-forest" />
                  Bucket Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Region</span>
                  <span className="flex items-center gap-1.5 text-foreground">
                    <MapPin className="h-3 w-3" />
                    {meta.region}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Access</span>
                  <Badge
                    variant={meta.accessLevel === "public-read" ? "warning" : "default"}
                  >
                    {meta.accessLevel === "public-read" ? "Public" : "Private"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Size</span>
                  <span className="text-foreground">{meta.storageUsed}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span className="text-foreground">
                    {new Date(meta.createdAt).toLocaleDateString("en-US", {
                      dateStyle: "medium",
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* S3 Endpoint */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Link2 className="h-4 w-4 text-forest" />
                  S3 Endpoint
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-mist/50 p-3">
                  <div className="flex items-start gap-2">
                    <code className="flex-1 break-all font-mono text-xs text-foreground">
                      {meta.endpoint}
                    </code>
                    <button
                      onClick={() => handleCopy(meta.endpoint, "endpoint")}
                      className="flex-shrink-0 rounded-md p-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {copiedField === "endpoint" ? (
                        <Check className="h-3.5 w-3.5 text-fern" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Access Keys */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Key className="h-4 w-4 text-forest" />
                  Access Keys
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg bg-mist/50 p-3">
                  <label className="mb-1 block text-xs text-muted-foreground">
                    Access Key ID
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 font-mono text-xs text-foreground">
                      GKAB3D7F...X9R2
                    </code>
                    <button
                      onClick={() => handleCopy("GKAB3D7F4E8C1A9X9R2", "access-key")}
                      className="rounded-md p-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {copiedField === "access-key" ? (
                        <Check className="h-3 w-3 text-fern" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="rounded-lg bg-mist/50 p-3">
                  <label className="mb-1 block text-xs text-muted-foreground">
                    Secret Access Key
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 font-mono text-xs text-foreground">
                      {"\u2022".repeat(20)}
                    </code>
                    <button
                      onClick={() => handleCopy("wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY", "secret-key")}
                      className="rounded-md p-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {copiedField === "secret-key" ? (
                        <Check className="h-3 w-3 text-fern" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Use these keys with any S3-compatible client or SDK.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
