import { NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Endpoint {
  id: string;
  name: string;
  modelName: string;
  modelId: string;
  gpu: string;
  region: string;
  status: "running" | "scaled_to_zero" | "failed";
  endpointUrl: string;
  requestsToday: number;
  avgLatencyMs: number;
  costPerHour: number;
  minReplicas: number;
  maxReplicas: number;
  scaleToZero: boolean;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_ENDPOINTS: Endpoint[] = [
  {
    id: "ep_abc123",
    name: "llama-3.2-3b-prod",
    modelName: "Llama 3.2 3B",
    modelId: "llama-3.2-3b",
    gpu: "RTX 4090",
    region: "Lagos",
    status: "running",
    endpointUrl: "https://api.polariscloud.ai/v1/endpoints/ep_abc123",
    requestsToday: 1234,
    avgLatencyMs: 145,
    costPerHour: 1.5,
    minReplicas: 1,
    maxReplicas: 1,
    scaleToZero: false,
    createdAt: "2026-02-05T10:00:00Z",
  },
  {
    id: "ep_def456",
    name: "sdxl-images",
    modelName: "Stable Diffusion XL",
    modelId: "stable-diffusion-xl",
    gpu: "A100",
    region: "Nairobi",
    status: "running",
    endpointUrl: "https://api.polariscloud.ai/v1/endpoints/ep_def456",
    requestsToday: 567,
    avgLatencyMs: 2300,
    costPerHour: 2.8,
    minReplicas: 1,
    maxReplicas: 2,
    scaleToZero: false,
    createdAt: "2026-02-04T14:30:00Z",
  },
  {
    id: "ep_ghi789",
    name: "bge-embeddings",
    modelName: "BGE-M3",
    modelId: "bge-m3",
    gpu: "RTX 3090",
    region: "Lagos",
    status: "scaled_to_zero",
    endpointUrl: "https://api.polariscloud.ai/v1/endpoints/ep_ghi789",
    requestsToday: 0,
    avgLatencyMs: 0,
    costPerHour: 0.85,
    minReplicas: 0,
    maxReplicas: 1,
    scaleToZero: true,
    createdAt: "2026-02-01T08:00:00Z",
  },
];

// ---------------------------------------------------------------------------
// GET /api/models/endpoints — List user's endpoints
// ---------------------------------------------------------------------------

export async function GET() {
  try {
    return NextResponse.json({
      data: MOCK_ENDPOINTS,
      total: MOCK_ENDPOINTS.length,
    });
  } catch (error) {
    console.error("Failed to fetch endpoints:", error);
    return NextResponse.json(
      { error: "Failed to fetch endpoints" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// POST /api/models/endpoints — Deploy a new endpoint
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { modelId, gpu, region, minReplicas, maxReplicas, scaleToZero } =
      body as {
        modelId?: string;
        gpu?: string;
        region?: string;
        minReplicas?: number;
        maxReplicas?: number;
        scaleToZero?: boolean;
      };

    // Validation
    if (!modelId) {
      return NextResponse.json(
        { error: "modelId is required" },
        { status: 400 }
      );
    }

    if (!gpu) {
      return NextResponse.json(
        { error: "gpu is required" },
        { status: 400 }
      );
    }

    if (!region) {
      return NextResponse.json(
        { error: "region is required" },
        { status: 400 }
      );
    }

    const validGpus = ["RTX 3090", "RTX 4090", "A100", "H100"];
    if (!validGpus.includes(gpu)) {
      return NextResponse.json(
        { error: `Invalid GPU. Must be one of: ${validGpus.join(", ")}` },
        { status: 400 }
      );
    }

    const validRegions = ["Lagos", "Nairobi", "Cape Town"];
    if (!validRegions.includes(region)) {
      return NextResponse.json(
        {
          error: `Invalid region. Must be one of: ${validRegions.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const gpuPricing: Record<string, number> = {
      "RTX 3090": 0.85,
      "RTX 4090": 1.5,
      A100: 2.8,
      H100: 4.5,
    };

    const endpointId = "ep_" + Math.random().toString(36).slice(2, 8);

    const newEndpoint: Endpoint = {
      id: endpointId,
      name: `${modelId}-${endpointId.slice(3)}`,
      modelName: modelId,
      modelId,
      gpu,
      region,
      status: "running",
      endpointUrl: `https://api.polariscloud.ai/v1/endpoints/${endpointId}`,
      requestsToday: 0,
      avgLatencyMs: 0,
      costPerHour: gpuPricing[gpu] ?? 0,
      minReplicas: minReplicas ?? (scaleToZero ? 0 : 1),
      maxReplicas: maxReplicas ?? 1,
      scaleToZero: scaleToZero ?? false,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        data: newEndpoint,
        message: "Endpoint deployment initiated",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to deploy endpoint:", error);
    return NextResponse.json(
      { error: "Failed to deploy endpoint" },
      { status: 500 }
    );
  }
}
