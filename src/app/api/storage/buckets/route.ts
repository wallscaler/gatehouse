import { NextResponse } from "next/server";

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
    endpoint: "https://s3.lagos.polariscloud.ai/ml-datasets",
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
    endpoint: "https://s3.lagos.polariscloud.ai/model-weights",
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
    endpoint: "https://s3.nairobi.polariscloud.ai/app-backups",
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
    endpoint: "https://s3.capetown.polariscloud.ai/team-assets",
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
    endpoint: "https://s3.lagos.polariscloud.ai/logs-archive",
  },
];

// ---------------------------------------------------------------------------
// GET /api/storage/buckets
// ---------------------------------------------------------------------------

export async function GET() {
  return NextResponse.json({
    buckets: MOCK_BUCKETS,
    stats: {
      totalBuckets: MOCK_BUCKETS.length,
      totalObjects: MOCK_BUCKETS.reduce((sum, b) => sum + b.objectCount, 0),
      totalStorageUsed: "48.3 GB",
      bandwidthThisMonth: "12.7 GB",
    },
  });
}

// ---------------------------------------------------------------------------
// POST /api/storage/buckets
// ---------------------------------------------------------------------------

const VALID_REGIONS = ["lagos", "nairobi", "capetown", "accra"];
const BUCKET_NAME_REGEX = /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/;

export async function POST(request: Request) {
  const body = await request.json();
  const { name, region, accessLevel } = body as {
    name?: string;
    region?: string;
    accessLevel?: string;
  };

  // Validate name
  if (!name || !BUCKET_NAME_REGEX.test(name)) {
    return NextResponse.json(
      {
        error:
          "Invalid bucket name. Must be 3-63 characters, lowercase letters, numbers, and hyphens only. Must start and end with a letter or number.",
      },
      { status: 400 }
    );
  }

  // Check for duplicates
  if (MOCK_BUCKETS.some((b) => b.name === name)) {
    return NextResponse.json(
      { error: "A bucket with this name already exists." },
      { status: 409 }
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

  // Validate access level
  const access = accessLevel === "public-read" ? "public-read" : "private";

  const regionDisplay =
    regionSlug === "lagos"
      ? "Lagos"
      : regionSlug === "nairobi"
        ? "Nairobi"
        : regionSlug === "capetown"
          ? "Cape Town"
          : "Accra";

  const newBucket: Bucket = {
    id: `bkt-${Math.random().toString(36).slice(2, 8)}`,
    name,
    region: regionDisplay,
    regionSlug,
    accessLevel: access,
    objectCount: 0,
    storageUsed: "0 B",
    storageBytes: 0,
    createdAt: new Date().toISOString(),
    endpoint: `https://s3.${regionSlug}.polariscloud.ai/${name}`,
  };

  return NextResponse.json({ bucket: newBucket }, { status: 201 });
}
