"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Database,
  Copy,
  Check,
  Eye,
  EyeOff,
  MapPin,
  Clock,
  Activity,
  Settings,
  HardDrive,
  Cpu,
  MemoryStick,
  RefreshCw,
  Play,
  Square,
  Trash2,
  ArrowUpCircle,
  Download,
  Server,
  Shield,
  Globe,
  AlertTriangle,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Engine = "postgresql" | "redis" | "mongodb";

interface DatabaseInstance {
  id: string;
  name: string;
  engine: Engine;
  version: string;
  plan: string;
  vcpu: number;
  ram: string;
  ramGB: number;
  storageUsed: string;
  storageUsedGB: number;
  storageTotal: string;
  storageTotalGB: number;
  region: string;
  status: "running" | "stopped";
  connections: number;
  connectionString: string;
  host: string;
  port: number;
  username: string;
  password: string;
  createdAt: string;
}

interface MetricPoint {
  hour: string;
  value: number;
}

interface QueryLog {
  timestamp: string;
  query: string;
  duration: number;
  status: "ok" | "slow";
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_DATABASES: Record<string, DatabaseInstance> = {
  "db-prod-001": {
    id: "db-prod-001",
    name: "prod-db",
    engine: "postgresql",
    version: "16",
    plan: "Standard",
    vcpu: 2,
    ram: "4 GB",
    ramGB: 4,
    storageUsed: "8.2 GB",
    storageUsedGB: 8.2,
    storageTotal: "25 GB",
    storageTotalGB: 25,
    region: "Lagos",
    status: "running",
    connections: 156,
    connectionString: "postgresql://admin:s3cur3P@ss@db-prod.lagos.polariscloud.ai:5432/prod-db",
    host: "db-prod.lagos.polariscloud.ai",
    port: 5432,
    username: "admin",
    password: "s3cur3P@ss",
    createdAt: "2025-12-07T10:30:00Z",
  },
  "db-cache-002": {
    id: "db-cache-002",
    name: "cache-01",
    engine: "redis",
    version: "7.2",
    plan: "Basic",
    vcpu: 1,
    ram: "2 GB",
    ramGB: 2,
    storageUsed: "0.3 GB",
    storageUsedGB: 0.3,
    storageTotal: "10 GB",
    storageTotalGB: 10,
    region: "Lagos",
    status: "running",
    connections: 89,
    connectionString: "redis://default:r3d1sP@ss@db-cache.lagos.polariscloud.ai:6379",
    host: "db-cache.lagos.polariscloud.ai",
    port: 6379,
    username: "default",
    password: "r3d1sP@ss",
    createdAt: "2026-01-07T14:00:00Z",
  },
  "db-analytics-003": {
    id: "db-analytics-003",
    name: "analytics-db",
    engine: "postgresql",
    version: "16",
    plan: "Pro",
    vcpu: 4,
    ram: "8 GB",
    ramGB: 8,
    storageUsed: "4.3 GB",
    storageUsedGB: 4.3,
    storageTotal: "50 GB",
    storageTotalGB: 50,
    region: "Nairobi",
    status: "running",
    connections: 45,
    connectionString: "postgresql://admin:An@lyt1cs@db-analytics.nairobi.polariscloud.ai:5432/analytics-db",
    host: "db-analytics.nairobi.polariscloud.ai",
    port: 5432,
    username: "admin",
    password: "An@lyt1cs",
    createdAt: "2026-01-17T09:15:00Z",
  },
  "db-staging-004": {
    id: "db-staging-004",
    name: "staging-mongo",
    engine: "mongodb",
    version: "7.0",
    plan: "Standard",
    vcpu: 2,
    ram: "4 GB",
    ramGB: 4,
    storageUsed: "0 GB",
    storageUsedGB: 0,
    storageTotal: "25 GB",
    storageTotalGB: 25,
    region: "Cape Town",
    status: "stopped",
    connections: 0,
    connectionString: "mongodb://admin:M0ng0Stg@db-staging.capetown.polariscloud.ai:27017/staging-mongo",
    host: "db-staging.capetown.polariscloud.ai",
    port: 27017,
    username: "admin",
    password: "M0ng0Stg",
    createdAt: "2026-01-31T16:45:00Z",
  },
};

const DEFAULT_DB: DatabaseInstance = MOCK_DATABASES["db-prod-001"];

const ENGINE_META: Record<Engine, { emoji: string; label: string }> = {
  postgresql: { emoji: "\u{1F418}", label: "PostgreSQL" },
  redis: { emoji: "\u{1F534}", label: "Redis" },
  mongodb: { emoji: "\u{1F343}", label: "MongoDB" },
};

// Deterministic mock metrics
function generateMetrics(db: DatabaseInstance): {
  cpu: MetricPoint[];
  memory: MetricPoint[];
  connections: MetricPoint[];
  iops: MetricPoint[];
} {
  const seed = db.id.charCodeAt(3) + db.id.charCodeAt(4);
  const pseudoRandom = (i: number, offset: number) =>
    ((seed * (i + 1) * (offset + 1)) % 100) / 100;

  const hours = 24;
  const cpu = Array.from({ length: hours }, (_, i) => ({
    hour: `${String(i).padStart(2, "0")}:00`,
    value: db.status === "running"
      ? Math.round(10 + pseudoRandom(i, 1) * 50 + (i > 8 && i < 18 ? 20 : 0))
      : 0,
  }));
  const memory = Array.from({ length: hours }, (_, i) => ({
    hour: `${String(i).padStart(2, "0")}:00`,
    value: db.status === "running"
      ? Math.round(25 + pseudoRandom(i, 2) * 40 + (i > 10 && i < 16 ? 15 : 0))
      : 0,
  }));
  const connections = Array.from({ length: hours }, (_, i) => ({
    hour: `${String(i).padStart(2, "0")}:00`,
    value: db.status === "running"
      ? Math.round(db.connections * (0.2 + pseudoRandom(i, 3) * 0.8) * (i > 8 && i < 20 ? 1.3 : 0.4))
      : 0,
  }));
  const iops = Array.from({ length: hours }, (_, i) => ({
    hour: `${String(i).padStart(2, "0")}:00`,
    value: db.status === "running"
      ? Math.round(30 + pseudoRandom(i, 4) * 250 + (i > 9 && i < 17 ? 150 : 0))
      : 0,
  }));

  return { cpu, memory, connections, iops };
}

function generateLogs(db: DatabaseInstance): QueryLog[] {
  if (db.engine === "redis") {
    return [
      { timestamp: "2026-02-07T10:32:15Z", query: "GET session:usr_8a2f3c", duration: 0.4, status: "ok" },
      { timestamp: "2026-02-07T10:32:14Z", query: "SET cache:api:products [...]", duration: 1.2, status: "ok" },
      { timestamp: "2026-02-07T10:32:12Z", query: "HGETALL user:preferences:1042", duration: 0.8, status: "ok" },
      { timestamp: "2026-02-07T10:32:10Z", query: "EXPIRE session:usr_7b1e4d 3600", duration: 0.3, status: "ok" },
      { timestamp: "2026-02-07T10:32:08Z", query: "LPUSH queue:notifications [...]", duration: 1.5, status: "ok" },
      { timestamp: "2026-02-07T10:32:05Z", query: "SCAN 0 MATCH cache:* COUNT 100", duration: 12.4, status: "ok" },
      { timestamp: "2026-02-07T10:32:02Z", query: "DEL cache:api:stale_endpoint", duration: 0.2, status: "ok" },
      { timestamp: "2026-02-07T10:31:58Z", query: "ZADD leaderboard 9500 user:42", duration: 0.9, status: "ok" },
      { timestamp: "2026-02-07T10:31:55Z", query: "MGET cache:config:a cache:config:b cache:config:c", duration: 1.1, status: "ok" },
      { timestamp: "2026-02-07T10:31:50Z", query: "SUBSCRIBE events:deployment", duration: 0.5, status: "ok" },
    ];
  }
  if (db.engine === "mongodb") {
    return [
      { timestamp: "2026-02-07T10:32:15Z", query: "db.users.find({ active: true }).limit(50)", duration: 12.3, status: "ok" },
      { timestamp: "2026-02-07T10:32:12Z", query: "db.orders.aggregate([{ $match: ... }])", duration: 145.2, status: "slow" },
      { timestamp: "2026-02-07T10:32:08Z", query: "db.products.insertOne({ name: ... })", duration: 3.4, status: "ok" },
      { timestamp: "2026-02-07T10:32:05Z", query: "db.sessions.deleteMany({ expired: true })", duration: 28.7, status: "ok" },
      { timestamp: "2026-02-07T10:32:02Z", query: "db.analytics.find({}).sort({ ts: -1 })", duration: 189.5, status: "slow" },
      { timestamp: "2026-02-07T10:31:58Z", query: "db.users.updateOne({ _id: ... }, { $set: ... })", duration: 4.1, status: "ok" },
      { timestamp: "2026-02-07T10:31:55Z", query: "db.logs.createIndex({ timestamp: 1 })", duration: 340.2, status: "slow" },
      { timestamp: "2026-02-07T10:31:50Z", query: "db.products.countDocuments({ category: ... })", duration: 8.9, status: "ok" },
      { timestamp: "2026-02-07T10:31:45Z", query: "db.users.find({ email: /test/ })", duration: 67.3, status: "ok" },
      { timestamp: "2026-02-07T10:31:40Z", query: "db.orders.distinct('status')", duration: 15.6, status: "ok" },
    ];
  }
  return [
    { timestamp: "2026-02-07T10:32:15Z", query: "SELECT * FROM users WHERE active = true LIMIT 50", duration: 2.3, status: "ok" },
    { timestamp: "2026-02-07T10:32:12Z", query: "INSERT INTO orders (user_id, total) VALUES ($1, $2)", duration: 4.1, status: "ok" },
    { timestamp: "2026-02-07T10:32:08Z", query: "UPDATE products SET stock = stock - 1 WHERE id = $1", duration: 1.8, status: "ok" },
    { timestamp: "2026-02-07T10:32:05Z", query: "SELECT COUNT(*) FROM analytics WHERE date > NOW() - INTERVAL '7 days'", duration: 156.4, status: "slow" },
    { timestamp: "2026-02-07T10:32:02Z", query: "DELETE FROM sessions WHERE expires_at < NOW()", duration: 12.7, status: "ok" },
    { timestamp: "2026-02-07T10:31:58Z", query: "SELECT o.*, u.name FROM orders o JOIN users u ON ...", duration: 234.1, status: "slow" },
    { timestamp: "2026-02-07T10:31:55Z", query: "CREATE INDEX CONCURRENTLY idx_orders_date ON orders(created_at)", duration: 1420.0, status: "slow" },
    { timestamp: "2026-02-07T10:31:50Z", query: "SELECT pg_size_pretty(pg_database_size(current_database()))", duration: 0.9, status: "ok" },
    { timestamp: "2026-02-07T10:31:45Z", query: "VACUUM ANALYZE users", duration: 89.3, status: "ok" },
    { timestamp: "2026-02-07T10:31:40Z", query: "SELECT relname, n_tup_ins FROM pg_stat_user_tables", duration: 1.2, status: "ok" },
  ];
}

function getParameters(db: DatabaseInstance): Record<string, string | number | boolean> {
  if (db.engine === "postgresql") {
    return {
      max_connections: 100,
      shared_buffers: "1 GB",
      effective_cache_size: "3 GB",
      work_mem: "16 MB",
      maintenance_work_mem: "256 MB",
      wal_buffers: "16 MB",
      checkpoint_completion_target: 0.9,
      random_page_cost: 1.1,
    };
  }
  if (db.engine === "redis") {
    return {
      maxmemory: `${db.ramGB * 0.75} GB`,
      maxmemory_policy: "allkeys-lru",
      timeout: 0,
      tcp_keepalive: 300,
      databases: 16,
    };
  }
  return {
    storage_engine: "wiredTiger",
    cache_size_gb: db.ramGB * 0.5,
    journal_enabled: true,
    profiling_level: 1,
    profiling_threshold_ms: 100,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateStr));
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days >= 30) {
    const months = Math.floor(days / 30);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  }
  if (days >= 7) {
    const weeks = Math.floor(days / 7);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  }
  if (days >= 1) return `${days} day${days > 1 ? "s" : ""} ago`;
  return "today";
}

// ---------------------------------------------------------------------------
// Copiable field
// ---------------------------------------------------------------------------

function CopiableField({ label, value, masked }: { label: string; value: string; masked?: boolean }) {
  const [show, setShow] = useState(!masked);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center justify-between rounded-lg bg-mist/50 px-3 py-2.5">
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <p className="truncate font-mono text-sm text-foreground">
          {masked && !show ? "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" : value}
        </p>
      </div>
      <div className="flex items-center gap-1 ml-2 shrink-0">
        {masked && (
          <button
            onClick={() => setShow(!show)}
            className="rounded p-1 text-muted-foreground hover:bg-mist hover:text-foreground transition-colors"
          >
            {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>
        )}
        <button
          onClick={handleCopy}
          className="rounded p-1 text-muted-foreground hover:bg-mist hover:text-foreground transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-fern" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Bar chart (pure CSS)
// ---------------------------------------------------------------------------

function BarChart({ data, label, unit, color = "bg-forest" }: {
  data: MetricPoint[];
  label: string;
  unit: string;
  color?: string;
}) {
  const maxVal = Math.max(...data.map((d) => d.value), 1);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-[2px] h-24">
          {data.map((point, i) => {
            const height = (point.value / maxVal) * 100;
            return (
              <div
                key={i}
                className="group relative flex-1 min-w-0"
                title={`${point.hour}: ${point.value}${unit}`}
              >
                <div className="w-full bg-mist rounded-t-sm overflow-hidden" style={{ height: "96px" }}>
                  <div
                    className={cn("w-full rounded-t-sm transition-all", color)}
                    style={{ height: `${height}%`, marginTop: `${100 - height}%` }}
                  />
                </div>
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-10">
                  <div className="rounded bg-card border border-border px-2 py-1 text-[10px] text-foreground whitespace-nowrap shadow-lg">
                    {point.hour}: {point.value}{unit}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
          <span>00:00</span>
          <span>12:00</span>
          <span>23:00</span>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Storage progress
// ---------------------------------------------------------------------------

function StorageBar({ used, total, usedLabel, totalLabel }: {
  used: number;
  total: number;
  usedLabel: string;
  totalLabel: string;
}) {
  const pct = total > 0 ? Math.min((used / total) * 100, 100) : 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Storage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{usedLabel} used</span>
            <span className="text-foreground font-medium">{totalLabel} total</span>
          </div>
          <div className="h-3 w-full rounded-full bg-mist overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                pct > 80 ? "bg-copper" : "bg-forest"
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">{pct.toFixed(1)}% used</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Delete confirmation
// ---------------------------------------------------------------------------

function DeleteDialog({ dbName, onCancel, onConfirm }: {
  dbName: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const [confirmText, setConfirmText] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-md border-red-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-red-400">
            <AlertTriangle className="h-5 w-5" />
            Delete Database
          </CardTitle>
          <CardDescription>
            This will permanently delete <span className="font-mono font-semibold text-foreground">{dbName}</span> and
            all its data. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-muted-foreground">
              Type <span className="font-mono font-semibold text-foreground">{dbName}</span> to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full rounded-lg border border-red-500/30 bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-red-500/50"
              placeholder={dbName}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              disabled={confirmText !== dbName}
              onClick={onConfirm}
              className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            >
              <Trash2 className="mr-1.5 h-4 w-4" />
              Delete Forever
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DatabaseDetailPage() {
  const params = useParams<{ id: string }>();
  const db = MOCK_DATABASES[params.id] ?? DEFAULT_DB;
  const meta = ENGINE_META[db.engine];

  const [activeTab, setActiveTab] = useState<"overview" | "metrics" | "logs" | "settings">("overview");
  const [showDelete, setShowDelete] = useState(false);

  const metrics = generateMetrics(db);
  const logs = generateLogs(db);
  const parameters = getParameters(db);

  const tabs = [
    { key: "overview" as const, label: "Overview" },
    { key: "metrics" as const, label: "Metrics" },
    { key: "logs" as const, label: "Logs" },
    { key: "settings" as const, label: "Settings" },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Delete dialog */}
      {showDelete && (
        <DeleteDialog
          dbName={db.name}
          onCancel={() => setShowDelete(false)}
          onConfirm={() => setShowDelete(false)}
        />
      )}

      {/* Back button */}
      <Link href="/databases">
        <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Databases
        </Button>
      </Link>

      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <span className="text-2xl">{meta.emoji}</span>
            <h1 className="font-mono text-2xl font-bold text-foreground">{db.name}</h1>
            <Badge variant={db.status === "running" ? "success" : "default"}>
              {db.status === "running" ? (
                <span className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fern/60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-fern" />
                  </span>
                  Running
                </span>
              ) : (
                "Stopped"
              )}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Database className="h-3.5 w-3.5" />
              {meta.label} {db.version}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {db.region}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Created {timeAgo(db.createdAt)}
            </span>
            <Badge variant="default">{db.plan}</Badge>
          </div>
        </div>
        {/* Actions */}
        <div className="flex items-center gap-2 self-start">
          <Button variant="outline" size="sm" className="gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" />
            Restart
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "gap-1.5",
              db.status === "running" ? "text-copper border-copper/30" : "text-fern border-fern/30"
            )}
          >
            {db.status === "running" ? (
              <>
                <Square className="h-3.5 w-3.5" />
                Stop
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" />
                Start
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-red-400 border-red-500/30"
            onClick={() => setShowDelete(true)}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </Button>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px",
              activeTab === tab.key
                ? "border-forest text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===================== OVERVIEW TAB ===================== */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Connection info */}
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Server className="h-5 w-5 text-forest" />
                  Connection Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <CopiableField label="Full URI" value={db.connectionString} masked />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <CopiableField label="Host" value={db.host} />
                  <CopiableField label="Port" value={String(db.port)} />
                  <CopiableField label="Username" value={db.username} />
                  <CopiableField label="Password" value={db.password} masked />
                </div>
              </CardContent>
            </Card>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Cpu className="mx-auto mb-1 h-5 w-5 text-forest" />
                  <p className="text-lg font-bold text-foreground">{db.vcpu}</p>
                  <p className="text-xs text-muted-foreground">vCPU</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <MemoryStick className="mx-auto mb-1 h-5 w-5 text-fern" />
                  <p className="text-lg font-bold text-foreground">{db.ram}</p>
                  <p className="text-xs text-muted-foreground">RAM</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <HardDrive className="mx-auto mb-1 h-5 w-5 text-copper" />
                  <p className="text-lg font-bold text-foreground">{db.storageUsed}</p>
                  <p className="text-xs text-muted-foreground">Storage Used</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Activity className="mx-auto mb-1 h-5 w-5 text-forest" />
                  <p className="text-lg font-bold text-foreground">{db.connections}</p>
                  <p className="text-xs text-muted-foreground">Connections</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Info card */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Database ID</span>
                  <code className="rounded bg-mist px-1.5 py-0.5 font-mono text-xs text-foreground">
                    {db.id}
                  </code>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Engine</span>
                  <span className="text-foreground">{meta.label} {db.version}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Plan</span>
                  <Badge variant="default">{db.plan}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Region</span>
                  <span className="text-foreground">{db.region}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span className="text-foreground text-xs">{formatDate(db.createdAt)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick actions */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <ArrowUpCircle className="h-4 w-4 text-forest" />
                  Scale (Change Plan)
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <Server className="h-4 w-4 text-fern" />
                  Create Read Replica
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <Download className="h-4 w-4 text-copper" />
                  Export Backup
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ===================== METRICS TAB ===================== */}
      {activeTab === "metrics" && (
        <div className="space-y-6">
          {db.status === "stopped" && (
            <Card className="border-copper/30">
              <CardContent className="flex items-center gap-3 p-4">
                <AlertTriangle className="h-5 w-5 text-copper" />
                <p className="text-sm text-muted-foreground">
                  This database is stopped. Metrics are not being collected. Start the database to see live metrics.
                </p>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <BarChart data={metrics.cpu} label="CPU Usage" unit="%" color="bg-forest" />
            <BarChart data={metrics.memory} label="Memory Usage" unit="%" color="bg-fern" />
            <BarChart data={metrics.connections} label="Active Connections" unit="" color="bg-copper" />
            <StorageBar
              used={db.storageUsedGB}
              total={db.storageTotalGB}
              usedLabel={db.storageUsed}
              totalLabel={db.storageTotal}
            />
          </div>

          <BarChart data={metrics.iops} label="IOPS (Read + Write)" unit=" ops" color="bg-evergreen" />
        </div>
      )}

      {/* ===================== LOGS TAB ===================== */}
      {activeTab === "logs" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="h-5 w-5 text-forest" />
                Recent Query Log
              </CardTitle>
              <CardDescription>
                Last 10 queries. Slow queries ({">"}100ms) are highlighted.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {db.status === "stopped" ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <Database className="mb-3 h-8 w-8 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">Database is stopped. No recent logs.</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {/* Header */}
                  <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border">
                    <div className="col-span-2">Timestamp</div>
                    <div className="col-span-7">Query</div>
                    <div className="col-span-2 text-right">Duration</div>
                    <div className="col-span-1 text-right">Status</div>
                  </div>
                  {logs.map((log, i) => {
                    const time = new Date(log.timestamp);
                    const timeStr = `${String(time.getHours()).padStart(2, "0")}:${String(time.getMinutes()).padStart(2, "0")}:${String(time.getSeconds()).padStart(2, "0")}`;
                    const isSlow = log.duration > 100;

                    return (
                      <div
                        key={i}
                        className={cn(
                          "grid grid-cols-12 gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-mist/50",
                          isSlow && "bg-copper/5"
                        )}
                      >
                        <div className="col-span-2 font-mono text-xs text-muted-foreground">
                          {timeStr}
                        </div>
                        <div className="col-span-7 truncate font-mono text-xs text-foreground">
                          {log.query}
                        </div>
                        <div
                          className={cn(
                            "col-span-2 text-right font-mono text-xs",
                            isSlow ? "text-copper font-semibold" : "text-muted-foreground"
                          )}
                        >
                          {log.duration < 1
                            ? `${(log.duration * 1000).toFixed(0)}\u00B5s`
                            : log.duration >= 1000
                              ? `${(log.duration / 1000).toFixed(2)}s`
                              : `${log.duration.toFixed(1)}ms`}
                        </div>
                        <div className="col-span-1 text-right">
                          {isSlow ? (
                            <Badge variant="warning" className="text-[10px]">slow</Badge>
                          ) : (
                            <Badge variant="success" className="text-[10px]">ok</Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ===================== SETTINGS TAB ===================== */}
      {activeTab === "settings" && (
        <div className="space-y-6">
          {/* Database parameters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Settings className="h-5 w-5 text-forest" />
                Database Parameters
              </CardTitle>
              <CardDescription>
                {db.engine === "postgresql" && "PostgreSQL configuration parameters"}
                {db.engine === "redis" && "Redis configuration parameters"}
                {db.engine === "mongodb" && "MongoDB configuration parameters"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {Object.entries(parameters).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-lg bg-mist/50 px-3 py-2.5"
                  >
                    <span className="font-mono text-xs text-muted-foreground">{key}</span>
                    <span className="font-mono text-sm font-medium text-foreground">
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Backup schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Download className="h-5 w-5 text-forest" />
                Backup Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-mist/50 px-3 py-2.5">
                <span className="text-sm text-muted-foreground">Schedule</span>
                <Badge variant="success">Daily, automatic</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-mist/50 px-3 py-2.5">
                <span className="text-sm text-muted-foreground">Retention Period</span>
                <span className="text-sm font-medium text-foreground">7 days</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-mist/50 px-3 py-2.5">
                <span className="text-sm text-muted-foreground">Last Backup</span>
                <span className="text-sm font-medium text-foreground">
                  {formatDate("2026-02-07T03:00:00Z")}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-mist/50 px-3 py-2.5">
                <span className="text-sm text-muted-foreground">Next Backup</span>
                <span className="text-sm font-medium text-foreground">
                  {formatDate("2026-02-08T03:00:00Z")}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Networking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Globe className="h-5 w-5 text-forest" />
                Networking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Allowed IPs */}
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Allowed IPs</label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-lg bg-mist/50 px-3 py-2.5">
                    <span className="font-mono text-sm text-foreground">0.0.0.0/0</span>
                    <Badge variant="warning" className="text-[10px]">All IPs</Badge>
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="Add IP address (e.g. 192.168.1.0/24)"
                    className="flex-1 rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-forest/50"
                  />
                  <Button variant="outline" size="sm">
                    Add
                  </Button>
                </div>
              </div>

              {/* SSL toggle */}
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-fern" />
                  <div>
                    <p className="text-sm font-medium text-foreground">SSL Required</p>
                    <p className="text-xs text-muted-foreground">Enforce encrypted connections</p>
                  </div>
                </div>
                <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full bg-forest border-2 border-transparent transition-colors">
                  <span className="pointer-events-none inline-block h-5 w-5 translate-x-5 rounded-full bg-foreground shadow transition-transform" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
