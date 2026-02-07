import { NextResponse } from "next/server";

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

// ---------------------------------------------------------------------------
// Mock objects per bucket
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

// ---------------------------------------------------------------------------
// Bucket metadata (for GET)
// ---------------------------------------------------------------------------

const BUCKET_METADATA: Record<
  string,
  { region: string; accessLevel: string; createdAt: string; storageUsed: string; endpoint: string }
> = {
  "ml-datasets": {
    region: "Lagos",
    accessLevel: "public-read",
    createdAt: "2025-12-07T10:30:00Z",
    storageUsed: "15.2 GB",
    endpoint: "https://s3.lagos.polariscloud.ai/ml-datasets",
  },
  "model-weights": {
    region: "Lagos",
    accessLevel: "private",
    createdAt: "2026-01-07T14:00:00Z",
    storageUsed: "28.1 GB",
    endpoint: "https://s3.lagos.polariscloud.ai/model-weights",
  },
  "app-backups": {
    region: "Nairobi",
    accessLevel: "private",
    createdAt: "2025-11-07T08:15:00Z",
    storageUsed: "3.8 GB",
    endpoint: "https://s3.nairobi.polariscloud.ai/app-backups",
  },
  "team-assets": {
    region: "Cape Town",
    accessLevel: "public-read",
    createdAt: "2026-01-31T16:45:00Z",
    storageUsed: "0.9 GB",
    endpoint: "https://s3.capetown.polariscloud.ai/team-assets",
  },
  "logs-archive": {
    region: "Lagos",
    accessLevel: "private",
    createdAt: "2026-01-24T11:20:00Z",
    storageUsed: "0.3 GB",
    endpoint: "https://s3.lagos.polariscloud.ai/logs-archive",
  },
};

// ---------------------------------------------------------------------------
// GET /api/storage/buckets/[bucket]
// ---------------------------------------------------------------------------

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ bucket: string }> }
) {
  const { bucket } = await params;
  const objects = MOCK_OBJECTS[bucket];
  const metadata = BUCKET_METADATA[bucket];

  if (!objects || !metadata) {
    return NextResponse.json(
      { error: `Bucket "${bucket}" not found.` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    bucket: {
      name: bucket,
      ...metadata,
    },
    objects,
  });
}

// ---------------------------------------------------------------------------
// DELETE /api/storage/buckets/[bucket]
// ---------------------------------------------------------------------------

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ bucket: string }> }
) {
  const { bucket } = await params;
  const metadata = BUCKET_METADATA[bucket];

  if (!metadata) {
    return NextResponse.json(
      { error: `Bucket "${bucket}" not found.` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: `Bucket "${bucket}" has been deleted.`,
  });
}
