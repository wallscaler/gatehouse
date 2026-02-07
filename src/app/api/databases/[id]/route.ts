import { NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DatabaseInstance {
  id: string;
  name: string;
  engine: "postgresql" | "redis" | "mongodb";
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
  regionSlug: string;
  status: "running" | "stopped" | "provisioning";
  connections: number;
  connectionString: string;
  host: string;
  port: number;
  username: string;
  password: string;
  createdAt: string;
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
    regionSlug: "lagos",
    status: "running",
    connections: 156,
    connectionString:
      "postgresql://admin:s3cur3P@ss@db-prod.lagos.gatehouse.cloud:5432/prod-db",
    host: "db-prod.lagos.gatehouse.cloud",
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
    regionSlug: "lagos",
    status: "running",
    connections: 89,
    connectionString:
      "redis://default:r3d1sP@ss@db-cache.lagos.gatehouse.cloud:6379",
    host: "db-cache.lagos.gatehouse.cloud",
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
    regionSlug: "nairobi",
    status: "running",
    connections: 45,
    connectionString:
      "postgresql://admin:An@lyt1cs@db-analytics.nairobi.gatehouse.cloud:5432/analytics-db",
    host: "db-analytics.nairobi.gatehouse.cloud",
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
    regionSlug: "capetown",
    status: "stopped",
    connections: 0,
    connectionString:
      "mongodb://admin:M0ng0Stg@db-staging.capetown.gatehouse.cloud:27017/staging-mongo",
    host: "db-staging.capetown.gatehouse.cloud",
    port: 27017,
    username: "admin",
    password: "M0ng0Stg",
    createdAt: "2026-01-31T16:45:00Z",
  },
};

// ---------------------------------------------------------------------------
// Mock metrics generator
// ---------------------------------------------------------------------------

function generateMockMetrics(db: DatabaseInstance) {
  const hours = 24;
  const cpuUsage = Array.from({ length: hours }, (_, i) => ({
    hour: `${String(i).padStart(2, "0")}:00`,
    value: db.status === "running"
      ? Math.round(15 + Math.random() * 45 + (i > 8 && i < 18 ? 20 : 0))
      : 0,
  }));
  const memoryUsage = Array.from({ length: hours }, (_, i) => ({
    hour: `${String(i).padStart(2, "0")}:00`,
    value: db.status === "running"
      ? Math.round(30 + Math.random() * 35 + (i > 10 && i < 16 ? 15 : 0))
      : 0,
  }));
  const connectionsOverTime = Array.from({ length: hours }, (_, i) => ({
    hour: `${String(i).padStart(2, "0")}:00`,
    value: db.status === "running"
      ? Math.round(db.connections * (0.3 + Math.random() * 0.7) * (i > 8 && i < 20 ? 1.3 : 0.5))
      : 0,
  }));
  const iops = Array.from({ length: hours }, (_, i) => ({
    hour: `${String(i).padStart(2, "0")}:00`,
    value: db.status === "running"
      ? Math.round(50 + Math.random() * 200 + (i > 9 && i < 17 ? 150 : 0))
      : 0,
  }));

  return { cpuUsage, memoryUsage, connectionsOverTime, iops };
}

// ---------------------------------------------------------------------------
// Mock query logs
// ---------------------------------------------------------------------------

function generateMockLogs(db: DatabaseInstance) {
  if (db.engine === "redis") {
    return [
      { timestamp: "2026-02-07T10:32:15Z", query: "GET session:usr_8a2f3c", duration: 0.4, status: "ok" as const },
      { timestamp: "2026-02-07T10:32:14Z", query: "SET cache:api:products [...]", duration: 1.2, status: "ok" as const },
      { timestamp: "2026-02-07T10:32:12Z", query: "HGETALL user:preferences:1042", duration: 0.8, status: "ok" as const },
      { timestamp: "2026-02-07T10:32:10Z", query: "EXPIRE session:usr_7b1e4d 3600", duration: 0.3, status: "ok" as const },
      { timestamp: "2026-02-07T10:32:08Z", query: "LPUSH queue:notifications [...]", duration: 1.5, status: "ok" as const },
      { timestamp: "2026-02-07T10:32:05Z", query: "SCAN 0 MATCH cache:* COUNT 100", duration: 12.4, status: "ok" as const },
      { timestamp: "2026-02-07T10:32:02Z", query: "DEL cache:api:stale_endpoint", duration: 0.2, status: "ok" as const },
      { timestamp: "2026-02-07T10:31:58Z", query: "ZADD leaderboard 9500 user:42", duration: 0.9, status: "ok" as const },
      { timestamp: "2026-02-07T10:31:55Z", query: "MGET cache:config:a cache:config:b cache:config:c", duration: 1.1, status: "ok" as const },
      { timestamp: "2026-02-07T10:31:50Z", query: "SUBSCRIBE events:deployment", duration: 0.5, status: "ok" as const },
    ];
  }

  if (db.engine === "mongodb") {
    return [
      { timestamp: "2026-02-07T10:32:15Z", query: "db.users.find({ active: true }).limit(50)", duration: 12.3, status: "ok" as const },
      { timestamp: "2026-02-07T10:32:12Z", query: "db.orders.aggregate([{ $match: ... }])", duration: 145.2, status: "slow" as const },
      { timestamp: "2026-02-07T10:32:08Z", query: "db.products.insertOne({ name: ... })", duration: 3.4, status: "ok" as const },
      { timestamp: "2026-02-07T10:32:05Z", query: "db.sessions.deleteMany({ expired: true })", duration: 28.7, status: "ok" as const },
      { timestamp: "2026-02-07T10:32:02Z", query: "db.analytics.find({}).sort({ ts: -1 })", duration: 189.5, status: "slow" as const },
      { timestamp: "2026-02-07T10:31:58Z", query: "db.users.updateOne({ _id: ... }, { $set: ... })", duration: 4.1, status: "ok" as const },
      { timestamp: "2026-02-07T10:31:55Z", query: "db.logs.createIndex({ timestamp: 1 })", duration: 340.2, status: "slow" as const },
      { timestamp: "2026-02-07T10:31:50Z", query: "db.products.countDocuments({ category: ... })", duration: 8.9, status: "ok" as const },
      { timestamp: "2026-02-07T10:31:45Z", query: "db.users.find({ email: /test/ })", duration: 67.3, status: "ok" as const },
      { timestamp: "2026-02-07T10:31:40Z", query: "db.orders.distinct('status')", duration: 15.6, status: "ok" as const },
    ];
  }

  // PostgreSQL
  return [
    { timestamp: "2026-02-07T10:32:15Z", query: "SELECT * FROM users WHERE active = true LIMIT 50", duration: 2.3, status: "ok" as const },
    { timestamp: "2026-02-07T10:32:12Z", query: "INSERT INTO orders (user_id, total) VALUES ($1, $2)", duration: 4.1, status: "ok" as const },
    { timestamp: "2026-02-07T10:32:08Z", query: "UPDATE products SET stock = stock - 1 WHERE id = $1", duration: 1.8, status: "ok" as const },
    { timestamp: "2026-02-07T10:32:05Z", query: "SELECT COUNT(*) FROM analytics WHERE date > NOW() - INTERVAL '7 days'", duration: 156.4, status: "slow" as const },
    { timestamp: "2026-02-07T10:32:02Z", query: "DELETE FROM sessions WHERE expires_at < NOW()", duration: 12.7, status: "ok" as const },
    { timestamp: "2026-02-07T10:31:58Z", query: "SELECT o.*, u.name FROM orders o JOIN users u ON o.user_id = u.id", duration: 234.1, status: "slow" as const },
    { timestamp: "2026-02-07T10:31:55Z", query: "CREATE INDEX CONCURRENTLY idx_orders_date ON orders(created_at)", duration: 1420.0, status: "slow" as const },
    { timestamp: "2026-02-07T10:31:50Z", query: "SELECT pg_size_pretty(pg_database_size(current_database()))", duration: 0.9, status: "ok" as const },
    { timestamp: "2026-02-07T10:31:45Z", query: "VACUUM ANALYZE users", duration: 89.3, status: "ok" as const },
    { timestamp: "2026-02-07T10:31:40Z", query: "SELECT relname, n_tup_ins FROM pg_stat_user_tables", duration: 1.2, status: "ok" as const },
  ];
}

// ---------------------------------------------------------------------------
// Mock settings
// ---------------------------------------------------------------------------

function getSettings(db: DatabaseInstance) {
  const base = {
    backup: {
      schedule: "daily",
      retentionDays: 7,
      lastBackup: "2026-02-07T03:00:00Z",
      nextBackup: "2026-02-08T03:00:00Z",
    },
    networking: {
      allowedIPs: ["0.0.0.0/0"],
      sslRequired: true,
    },
  };

  if (db.engine === "postgresql") {
    return {
      ...base,
      parameters: {
        max_connections: 100,
        shared_buffers: "1 GB",
        effective_cache_size: "3 GB",
        work_mem: "16 MB",
        maintenance_work_mem: "256 MB",
        wal_buffers: "16 MB",
        checkpoint_completion_target: 0.9,
        random_page_cost: 1.1,
      },
    };
  }

  if (db.engine === "redis") {
    return {
      ...base,
      parameters: {
        maxmemory: `${db.ramGB * 0.75} GB`,
        maxmemory_policy: "allkeys-lru",
        timeout: 0,
        tcp_keepalive: 300,
        databases: 16,
        save: "900 1 300 10 60 10000",
      },
    };
  }

  // MongoDB
  return {
    ...base,
    parameters: {
      storage_engine: "wiredTiger",
      cache_size_gb: db.ramGB * 0.5,
      journal_enabled: true,
      profiling_level: 1,
      profiling_threshold_ms: 100,
      replica_set: false,
    },
  };
}

// ---------------------------------------------------------------------------
// GET /api/databases/[id]
// ---------------------------------------------------------------------------

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = MOCK_DATABASES[id];

  if (!db) {
    return NextResponse.json({ error: "Database not found" }, { status: 404 });
  }

  const metrics = generateMockMetrics(db);
  const logs = generateMockLogs(db);
  const settings = getSettings(db);

  return NextResponse.json({ database: db, metrics, logs, settings });
}

// ---------------------------------------------------------------------------
// DELETE /api/databases/[id]
// ---------------------------------------------------------------------------

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = MOCK_DATABASES[id];

  if (!db) {
    return NextResponse.json({ error: "Database not found" }, { status: 404 });
  }

  return NextResponse.json({
    message: `Database '${db.name}' has been scheduled for deletion.`,
    database: { ...db, status: "stopped" },
  });
}

// ---------------------------------------------------------------------------
// PATCH /api/databases/[id]
// ---------------------------------------------------------------------------

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = MOCK_DATABASES[id];

  if (!db) {
    return NextResponse.json({ error: "Database not found" }, { status: 404 });
  }

  const body = await request.json();
  const { action, plan, parameters, allowedIPs, sslRequired } = body as {
    action?: "start" | "stop" | "restart";
    plan?: string;
    parameters?: Record<string, unknown>;
    allowedIPs?: string[];
    sslRequired?: boolean;
  };

  // Handle start/stop/restart
  if (action) {
    if (action === "start" && db.status === "running") {
      return NextResponse.json(
        { error: "Database is already running" },
        { status: 400 }
      );
    }
    if (action === "stop" && db.status === "stopped") {
      return NextResponse.json(
        { error: "Database is already stopped" },
        { status: 400 }
      );
    }

    const newStatus = action === "stop" ? "stopped" : "running";
    return NextResponse.json({
      message: `Database '${db.name}' ${action === "restart" ? "is restarting" : action === "start" ? "is starting" : "has been stopped"}.`,
      database: { ...db, status: newStatus },
    });
  }

  // Handle plan change
  if (plan) {
    const validPlans = ["basic", "standard", "pro", "enterprise"];
    if (!validPlans.includes(plan.toLowerCase())) {
      return NextResponse.json(
        { error: `Invalid plan. Choose from: ${validPlans.join(", ")}` },
        { status: 400 }
      );
    }
    return NextResponse.json({
      message: `Database '${db.name}' plan is being changed to ${plan}.`,
      database: { ...db, plan: plan.charAt(0).toUpperCase() + plan.slice(1) },
    });
  }

  // Handle settings update
  if (parameters || allowedIPs || sslRequired !== undefined) {
    return NextResponse.json({
      message: `Database '${db.name}' settings have been updated.`,
      database: db,
      updatedSettings: {
        ...(parameters && { parameters }),
        ...(allowedIPs && { allowedIPs }),
        ...(sslRequired !== undefined && { sslRequired }),
      },
    });
  }

  return NextResponse.json(
    { error: "No valid action or settings provided" },
    { status: 400 }
  );
}
