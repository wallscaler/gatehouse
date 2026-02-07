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

const MOCK_DATABASES: DatabaseInstance[] = [
  {
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
  {
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
  {
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
  {
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
];

// ---------------------------------------------------------------------------
// GET /api/databases
// ---------------------------------------------------------------------------

export async function GET() {
  const stats = {
    totalDatabases: MOCK_DATABASES.length,
    activeDatabases: MOCK_DATABASES.filter((d) => d.status === "running")
      .length,
    storageUsed: `${MOCK_DATABASES.reduce((sum, d) => sum + d.storageUsedGB, 0).toFixed(1)} GB`,
    connectionsThisHour: MOCK_DATABASES.reduce(
      (sum, d) => sum + d.connections,
      0
    ),
  };

  return NextResponse.json({ databases: MOCK_DATABASES, stats });
}

// ---------------------------------------------------------------------------
// POST /api/databases
// ---------------------------------------------------------------------------

const VALID_ENGINES = ["postgresql", "redis", "mongodb"] as const;
const VALID_REGIONS = ["lagos", "nairobi", "capetown", "accra"];
const DB_NAME_REGEX = /^[a-z][a-z0-9_-]{1,61}[a-z0-9]$/;

const PLANS: Record<string, { vcpu: number; ramGB: number; storageTotalGB: number; price: number }> = {
  basic: { vcpu: 1, ramGB: 2, storageTotalGB: 10, price: 5 },
  standard: { vcpu: 2, ramGB: 4, storageTotalGB: 25, price: 15 },
  pro: { vcpu: 4, ramGB: 8, storageTotalGB: 50, price: 35 },
  enterprise: { vcpu: 8, ramGB: 16, storageTotalGB: 100, price: 75 },
};

export async function POST(request: Request) {
  const body = await request.json();
  const { name, engine, version, plan, region, initialDbName, maxMemoryPolicy, replicaSet } = body as {
    name?: string;
    engine?: string;
    version?: string;
    plan?: string;
    region?: string;
    initialDbName?: string;
    maxMemoryPolicy?: string;
    replicaSet?: boolean;
  };

  // Validate name
  if (!name || !DB_NAME_REGEX.test(name)) {
    return NextResponse.json(
      {
        error:
          "Invalid database name. Must be 3-63 characters, lowercase letters, numbers, hyphens, and underscores. Must start with a letter and end with a letter or number.",
      },
      { status: 400 }
    );
  }

  // Check duplicates
  if (MOCK_DATABASES.some((d) => d.name === name)) {
    return NextResponse.json(
      { error: "A database with this name already exists." },
      { status: 409 }
    );
  }

  // Validate engine
  if (!engine || !VALID_ENGINES.includes(engine as typeof VALID_ENGINES[number])) {
    return NextResponse.json(
      { error: `Invalid engine. Choose from: ${VALID_ENGINES.join(", ")}` },
      { status: 400 }
    );
  }

  // Validate plan
  const planSlug = (plan ?? "").toLowerCase();
  const planConfig = PLANS[planSlug];
  if (!planConfig) {
    return NextResponse.json(
      { error: `Invalid plan. Choose from: ${Object.keys(PLANS).join(", ")}` },
      { status: 400 }
    );
  }

  // Validate region
  const regionSlug = (region ?? "").toLowerCase().replace(/\s+/g, "");
  if (!VALID_REGIONS.includes(regionSlug)) {
    return NextResponse.json(
      { error: `Invalid region. Choose from: ${VALID_REGIONS.join(", ")}` },
      { status: 400 }
    );
  }

  const regionDisplay =
    regionSlug === "lagos"
      ? "Lagos"
      : regionSlug === "nairobi"
        ? "Nairobi"
        : regionSlug === "capetown"
          ? "Cape Town"
          : "Accra";

  const portMap = { postgresql: 5432, redis: 6379, mongodb: 27017 } as const;
  const typedEngine = engine as typeof VALID_ENGINES[number];
  const host = `db-${name}.${regionSlug}.gatehouse.cloud`;
  const port = portMap[typedEngine];
  const password = `gh_${Math.random().toString(36).slice(2, 14)}`;

  let connectionString: string;
  if (typedEngine === "postgresql") {
    const dbName = initialDbName || name;
    connectionString = `postgresql://admin:${password}@${host}:${port}/${dbName}`;
  } else if (typedEngine === "redis") {
    connectionString = `redis://default:${password}@${host}:${port}`;
  } else {
    connectionString = `mongodb://admin:${password}@${host}:${port}/${name}`;
  }

  const newDb: DatabaseInstance = {
    id: `db-${Math.random().toString(36).slice(2, 8)}`,
    name,
    engine: typedEngine,
    version: version ?? (typedEngine === "postgresql" ? "16" : typedEngine === "redis" ? "7.2" : "7.0"),
    plan: planSlug.charAt(0).toUpperCase() + planSlug.slice(1),
    vcpu: planConfig.vcpu,
    ram: `${planConfig.ramGB} GB`,
    ramGB: planConfig.ramGB,
    storageUsed: "0 GB",
    storageUsedGB: 0,
    storageTotal: `${planConfig.storageTotalGB} GB`,
    storageTotalGB: planConfig.storageTotalGB,
    region: regionDisplay,
    regionSlug,
    status: "provisioning",
    connections: 0,
    connectionString,
    host,
    port,
    username: typedEngine === "redis" ? "default" : "admin",
    password,
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json(
    {
      database: newDb,
      monthlyEstimate: `$${planConfig.price}/mo`,
      engineOptions: {
        ...(typedEngine === "postgresql" && { initialDbName: initialDbName || name }),
        ...(typedEngine === "redis" && { maxMemoryPolicy: maxMemoryPolicy || "allkeys-lru" }),
        ...(typedEngine === "mongodb" && { replicaSet: replicaSet ?? false }),
      },
    },
    { status: 201 }
  );
}
