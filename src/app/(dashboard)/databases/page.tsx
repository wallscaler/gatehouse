"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Database,
  Plus,
  Server,
  HardDrive,
  Activity,
  MapPin,
  Eye,
  EyeOff,
  Copy,
  Settings,
  BarChart3,
  Terminal,
  Trash2,
  Play,
  Square,
  Check,
  ChevronDown,
  ChevronUp,
  Cpu,
  MemoryStick,
  X,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Engine = "postgresql" | "redis" | "mongodb";
type EngineFilter = "all" | Engine;

interface DatabaseInstance {
  id: string;
  name: string;
  engine: Engine;
  version: string;
  plan: string;
  vcpu: number;
  ram: string;
  storageUsed: string;
  storageUsedGB: number;
  region: string;
  status: "running" | "stopped" | "provisioning";
  connections: number;
  connectionString: string;
  createdAt: string;
}

interface Plan {
  id: string;
  name: string;
  vcpu: number;
  ram: string;
  storage: string;
  price: number;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_DATABASES: DatabaseInstance[] = [
  {
    id: "db-prod-001",
    name: "prod-db",
    engine: "postgresql",
    version: "16",
    plan: "Standard",
    vcpu: 2,
    ram: "4 GB",
    storageUsed: "8.2 GB",
    storageUsedGB: 8.2,
    region: "Lagos",
    status: "running",
    connections: 156,
    connectionString: "postgresql://admin:****@db-prod.lagos.gatehouse.cloud:5432/prod-db",
    createdAt: "2025-12-07T10:30:00Z",
  },
  {
    id: "db-cache-002",
    name: "cache-01",
    engine: "redis",
    version: "7.2",
    plan: "Basic",
    vcpu: 1,
    ram: "2 GB",
    storageUsed: "0.3 GB",
    storageUsedGB: 0.3,
    region: "Lagos",
    status: "running",
    connections: 89,
    connectionString: "redis://default:****@db-cache.lagos.gatehouse.cloud:6379",
    createdAt: "2026-01-07T14:00:00Z",
  },
  {
    id: "db-analytics-003",
    name: "analytics-db",
    engine: "postgresql",
    version: "16",
    plan: "Pro",
    vcpu: 4,
    ram: "8 GB",
    storageUsed: "4.3 GB",
    storageUsedGB: 4.3,
    region: "Nairobi",
    status: "running",
    connections: 45,
    connectionString: "postgresql://admin:****@db-analytics.nairobi.gatehouse.cloud:5432/analytics-db",
    createdAt: "2026-01-17T09:15:00Z",
  },
  {
    id: "db-staging-004",
    name: "staging-mongo",
    engine: "mongodb",
    version: "7.0",
    plan: "Standard",
    vcpu: 2,
    ram: "4 GB",
    storageUsed: "0 GB",
    storageUsedGB: 0,
    region: "Cape Town",
    status: "stopped",
    connections: 0,
    connectionString: "mongodb://admin:****@db-staging.capetown.gatehouse.cloud:27017/staging-mongo",
    createdAt: "2026-01-31T16:45:00Z",
  },
];

const PLANS: Plan[] = [
  { id: "basic", name: "Basic", vcpu: 1, ram: "2 GB", storage: "10 GB", price: 5 },
  { id: "standard", name: "Standard", vcpu: 2, ram: "4 GB", storage: "25 GB", price: 15 },
  { id: "pro", name: "Pro", vcpu: 4, ram: "8 GB", storage: "50 GB", price: 35 },
  { id: "enterprise", name: "Enterprise", vcpu: 8, ram: "16 GB", storage: "100 GB", price: 75 },
];

const REGIONS = ["Lagos", "Nairobi", "Cape Town", "Accra"];

const ENGINE_META: Record<Engine, { emoji: string; label: string; description: string }> = {
  postgresql: { emoji: "\u{1F418}", label: "PostgreSQL", description: "Powerful relational database" },
  redis: { emoji: "\u{1F534}", label: "Redis", description: "In-memory data store" },
  mongodb: { emoji: "\u{1F343}", label: "MongoDB", description: "Flexible document database" },
};

const POSTGRESQL_VERSIONS = ["15", "16"];
const REDIS_VERSIONS = ["7.0", "7.2"];
const MONGODB_VERSIONS = ["6.0", "7.0"];
const REDIS_MEMORY_POLICIES = ["allkeys-lru", "volatile-lru", "allkeys-random", "volatile-random", "volatile-ttl", "noeviction"];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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
// Stat card
// ---------------------------------------------------------------------------

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest/10">
          {icon}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-xl font-bold text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Database card component
// ---------------------------------------------------------------------------

function DatabaseCard({ db }: { db: DatabaseInstance }) {
  const [showConn, setShowConn] = useState(false);
  const [copied, setCopied] = useState(false);
  const meta = ENGINE_META[db.engine];

  function handleCopy() {
    navigator.clipboard.writeText(db.connectionString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card className="group transition-colors hover:border-forest/40">
      <CardContent className="p-5">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl" role="img" aria-label={meta.label}>
              {meta.emoji}
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="default">{meta.label}</Badge>
              <Badge variant="default" className="text-[10px]">v{db.version}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {db.status === "running" ? (
              <>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fern/60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-fern" />
                </span>
                <span className="text-xs font-medium text-fern">Running</span>
              </>
            ) : (
              <>
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
                <span className="text-xs font-medium text-muted-foreground">Stopped</span>
              </>
            )}
          </div>
        </div>

        {/* Name */}
        <h3 className="mb-1 font-mono font-semibold text-foreground group-hover:text-fern transition-colors">
          {db.name}
        </h3>

        {/* Specs row */}
        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Cpu className="h-3 w-3" />
            {db.vcpu} vCPU
          </span>
          <span className="flex items-center gap-1">
            <MemoryStick className="h-3 w-3" />
            {db.ram}
          </span>
          <span className="flex items-center gap-1">
            <HardDrive className="h-3 w-3" />
            {db.storageUsed}
          </span>
        </div>

        {/* Region + connections */}
        <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {db.region}
          </span>
          <span className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            {db.connections} conn{db.connections !== 1 ? "s" : ""}
            {db.status === "running" && (
              <span className="ml-0.5 inline-flex h-1.5 w-1.5 rounded-full bg-fern animate-pulse" />
            )}
          </span>
        </div>

        {/* Connection string */}
        <div className="mb-4 rounded-lg bg-mist/50 p-2.5">
          <div className="flex items-center justify-between gap-2">
            <code className="flex-1 truncate text-[11px] font-mono text-muted-foreground">
              {showConn
                ? db.connectionString
                : db.connectionString.replace(/:[^:@]+@/, ":****@")}
            </code>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowConn(!showConn)}
                className="rounded p-1 text-muted-foreground hover:bg-mist hover:text-foreground transition-colors"
                title={showConn ? "Hide password" : "Show password"}
              >
                {showConn ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
              <button
                onClick={handleCopy}
                className="rounded p-1 text-muted-foreground hover:bg-mist hover:text-foreground transition-colors"
                title="Copy connection string"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-fern" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Created date */}
        <p className="mb-4 text-[11px] text-muted-foreground">
          Created {timeAgo(db.createdAt)}
        </p>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
          <Link href={`/databases/${db.id}`}>
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
              <Terminal className="h-3 w-3" />
              Connect
            </Button>
          </Link>
          <Link href={`/databases/${db.id}`}>
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
              <BarChart3 className="h-3 w-3" />
              Metrics
            </Button>
          </Link>
          <Link href={`/databases/${db.id}`}>
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
              <Settings className="h-3 w-3" />
              Settings
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "gap-1.5 text-xs ml-auto",
              db.status === "running" ? "text-copper hover:text-copper" : "text-fern hover:text-fern"
            )}
          >
            {db.status === "running" ? (
              <>
                <Square className="h-3 w-3" />
                Stop
              </>
            ) : (
              <>
                <Play className="h-3 w-3" />
                Start
              </>
            )}
          </Button>
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-red-400 hover:text-red-400">
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Create database form
// ---------------------------------------------------------------------------

function CreateDatabaseForm({ onClose }: { onClose: () => void }) {
  const [engine, setEngine] = useState<Engine | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const [dbName, setDbName] = useState("");
  const [region, setRegion] = useState("");
  const [version, setVersion] = useState("");
  const [initialDbName, setInitialDbName] = useState("");
  const [maxMemoryPolicy, setMaxMemoryPolicy] = useState("allkeys-lru");
  const [replicaSet, setReplicaSet] = useState(false);

  const nameValid = /^[a-z][a-z0-9_-]{1,61}[a-z0-9]$/.test(dbName);
  const selectedPlan = PLANS.find((p) => p.id === plan);
  const canCreate = engine && plan && nameValid && region;

  const versions =
    engine === "postgresql"
      ? POSTGRESQL_VERSIONS
      : engine === "redis"
        ? REDIS_VERSIONS
        : engine === "mongodb"
          ? MONGODB_VERSIONS
          : [];

  // Reset version when engine changes
  const handleEngineChange = (e: Engine) => {
    setEngine(e);
    setVersion("");
  };

  return (
    <Card className="border-forest/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Plus className="h-5 w-5 text-forest" />
              Create New Database
            </CardTitle>
            <CardDescription>Choose an engine, plan, and region to get started.</CardDescription>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-mist hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Engine selector */}
        <div>
          <label className="mb-3 block text-sm font-medium text-foreground">Database Engine</label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {(Object.entries(ENGINE_META) as [Engine, typeof ENGINE_META[Engine]][]).map(
              ([key, meta]) => (
                <button
                  key={key}
                  onClick={() => handleEngineChange(key)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors",
                    engine === key
                      ? "border-forest bg-forest/10"
                      : "border-border hover:border-forest/30 hover:bg-mist/50"
                  )}
                >
                  <span className="text-3xl">{meta.emoji}</span>
                  <p className="text-sm font-medium text-foreground">{meta.label}</p>
                  <p className="text-xs text-muted-foreground">{meta.description}</p>
                  {engine === key && <Check className="h-4 w-4 text-fern" />}
                </button>
              )
            )}
          </div>
        </div>

        {/* Plan selector */}
        <div>
          <label className="mb-3 block text-sm font-medium text-foreground">Plan</label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {PLANS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPlan(p.id)}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-lg border p-3 text-center transition-colors",
                  plan === p.id
                    ? "border-forest bg-forest/10"
                    : "border-border hover:border-forest/30 hover:bg-mist/50"
                )}
              >
                <p className="text-sm font-medium text-foreground">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.vcpu} vCPU, {p.ram}</p>
                <p className="text-xs text-muted-foreground">{p.storage} storage</p>
                <p className="mt-1 text-base font-bold text-fern">${p.price}<span className="text-xs font-normal text-muted-foreground">/mo</span></p>
                {plan === p.id && <Check className="h-4 w-4 text-fern" />}
              </button>
            ))}
          </div>
        </div>

        {/* Database name */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Database Name</label>
          <input
            type="text"
            placeholder="my-database"
            value={dbName}
            onChange={(e) => setDbName(e.target.value.toLowerCase())}
            className={cn(
              "w-full rounded-lg border bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-forest/50",
              dbName && !nameValid ? "border-red-500/50" : "border-border"
            )}
          />
          {dbName && !nameValid && (
            <p className="mt-1 text-xs text-red-400">
              Must be 3-63 chars, start with a letter, use lowercase letters, numbers, hyphens, and underscores.
            </p>
          )}
        </div>

        {/* Region selector */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Region</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={cn(
                  "flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-colors",
                  region === r
                    ? "border-forest bg-forest/10 text-foreground font-medium"
                    : "border-border text-muted-foreground hover:border-forest/30"
                )}
              >
                <MapPin className="h-3 w-3" />
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Engine-specific options */}
        {engine && (
          <div className="space-y-4">
            {/* Version */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Version</label>
              <div className="flex gap-2">
                {versions.map((v) => (
                  <button
                    key={v}
                    onClick={() => setVersion(v)}
                    className={cn(
                      "rounded-lg border px-4 py-2 text-sm transition-colors",
                      version === v
                        ? "border-forest bg-forest/10 text-foreground font-medium"
                        : "border-border text-muted-foreground hover:border-forest/30"
                    )}
                  >
                    v{v}
                  </button>
                ))}
              </div>
            </div>

            {/* PostgreSQL specific */}
            {engine === "postgresql" && (
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Initial Database Name</label>
                <input
                  type="text"
                  placeholder={dbName || "my_database"}
                  value={initialDbName}
                  onChange={(e) => setInitialDbName(e.target.value.toLowerCase())}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-forest/50"
                />
                <p className="mt-1 text-xs text-muted-foreground">Leave empty to use the database name</p>
              </div>
            )}

            {/* Redis specific */}
            {engine === "redis" && (
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Max Memory Policy</label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {REDIS_MEMORY_POLICIES.map((p) => (
                    <button
                      key={p}
                      onClick={() => setMaxMemoryPolicy(p)}
                      className={cn(
                        "rounded-lg border px-3 py-2 text-xs font-mono transition-colors",
                        maxMemoryPolicy === p
                          ? "border-forest bg-forest/10 text-foreground"
                          : "border-border text-muted-foreground hover:border-forest/30"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* MongoDB specific */}
            {engine === "mongodb" && (
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Replica Set</p>
                  <p className="text-xs text-muted-foreground">Enable replica set for high availability</p>
                </div>
                <button
                  onClick={() => setReplicaSet(!replicaSet)}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
                    replicaSet ? "bg-forest" : "bg-mist"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-5 w-5 rounded-full bg-foreground shadow transition-transform",
                      replicaSet ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Cost estimate + create */}
        <div className="flex items-center justify-between border-t border-border pt-4">
          <div>
            {selectedPlan && (
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-fern">${selectedPlan.price}</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
            )}
          </div>
          <Button disabled={!canCreate} className="gap-2">
            <Database className="h-4 w-4" />
            Create Database
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DatabasesPage() {
  const [engineFilter, setEngineFilter] = useState<EngineFilter>("all");
  const [showCreate, setShowCreate] = useState(false);

  const filtered = useMemo(() => {
    if (engineFilter === "all") return MOCK_DATABASES;
    return MOCK_DATABASES.filter((db) => db.engine === engineFilter);
  }, [engineFilter]);

  const stats = {
    total: MOCK_DATABASES.length,
    active: MOCK_DATABASES.filter((d) => d.status === "running").length,
    storage: `${MOCK_DATABASES.reduce((sum, d) => sum + d.storageUsedGB, 0).toFixed(1)} GB`,
    connections: MOCK_DATABASES.reduce((sum, d) => sum + d.connections, 0),
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Managed Databases</h1>
          <p className="mt-1 text-muted-foreground">
            Spin up PostgreSQL, Redis, or MongoDB in seconds
          </p>
        </div>
        <Button className="gap-2 self-start" onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? (
            <>
              <ChevronUp className="h-4 w-4" />
              Hide Form
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Create Database
            </>
          )}
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          icon={<Database className="h-5 w-5 text-forest" />}
          label="Total Databases"
          value={stats.total}
        />
        <StatCard
          icon={<Activity className="h-5 w-5 text-fern" />}
          label="Active"
          value={stats.active}
        />
        <StatCard
          icon={<HardDrive className="h-5 w-5 text-copper" />}
          label="Storage Used"
          value={stats.storage}
        />
        <StatCard
          icon={<Server className="h-5 w-5 text-forest" />}
          label="Connections / hr"
          value={stats.connections}
        />
      </div>

      {/* Create form (expandable) */}
      {showCreate && <CreateDatabaseForm onClose={() => setShowCreate(false)} />}

      {/* Engine filter */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground mr-1">Engine:</span>
        {(
          [
            { key: "all" as EngineFilter, label: "All" },
            { key: "postgresql" as EngineFilter, label: "\u{1F418} PostgreSQL" },
            { key: "redis" as EngineFilter, label: "\u{1F534} Redis" },
            { key: "mongodb" as EngineFilter, label: "\u{1F343} MongoDB" },
          ] as const
        ).map((opt) => (
          <button
            key={opt.key}
            onClick={() => setEngineFilter(opt.key)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-sm transition-colors",
              engineFilter === opt.key
                ? "border-forest bg-forest/10 text-foreground font-medium"
                : "border-border text-muted-foreground hover:border-forest/30 hover:text-foreground"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="text-sm text-muted-foreground">
        Showing {filtered.length} of {MOCK_DATABASES.length} databases
      </div>

      {/* Database grid */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Database className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm font-medium text-foreground">No databases match this filter</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try selecting a different engine or create a new database.
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-4"
              onClick={() => setEngineFilter("all")}
            >
              Show all databases
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((db) => (
            <DatabaseCard key={db.id} db={db} />
          ))}
        </div>
      )}
    </div>
  );
}
