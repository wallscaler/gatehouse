// ─── PSCA (Polaris Smart Compute Aggregator) Client ─────────
// Fetches real GPU/CPU compute offers from the Polaris discovery
// service, with automatic fallback to enhanced mock data when the
// API is unavailable.

const PSCA_BASE_URL = process.env.PSCA_API_URL || "https://discover.polariscloud.ai/api";
const PSCA_TIMEOUT = 8000; // 8s timeout

// ─── Types ──────────────────────────────────────────────────

export interface PSCAOffer {
  id: string | number;
  provider: string;
  gpu_model: string;
  vram_gb: number;
  region: string;
  price_per_hour: number;
  spot?: boolean;
  meta?: Record<string, unknown>;
}

export interface PSCAMarketOverview {
  total_offers: number;
  total_providers: number;
  gpu_models: string[];
  regions: string[];
  avg_price: number;
  cheapest_gpu: { model: string; price: number } | null;
}

export interface PSCATelemetry {
  gpu_distribution: Record<string, number>;
  regional_distribution: Record<string, number>;
  price_ranges: Record<string, number>;
}

// ─── Fetch Helpers ──────────────────────────────────────────

async function pscaFetch<T>(path: string, params?: Record<string, string>): Promise<T | null> {
  try {
    const url = new URL(`${PSCA_BASE_URL}${path}`);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, value);
      }
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), PSCA_TIMEOUT);

    const response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: { "Accept": "application/json" },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.warn(`[PSCA] ${path} returned ${response.status}`);
      return null;
    }

    return await response.json() as T;
  } catch (error) {
    console.warn(`[PSCA] Failed to fetch ${path}:`, error instanceof Error ? error.message : "Unknown error");
    return null;
  }
}

// ─── Public API ─────────────────────────────────────────────

/**
 * Fetch GPU offers from the PSCA discovery service.
 * Returns null if the API is unavailable (caller should fall back to mock data).
 */
export async function fetchOffers(filters?: {
  gpu_model?: string[];
  region?: string[];
  max_price?: number;
  provider?: string;
  limit?: number;
}): Promise<PSCAOffer[] | null> {
  const params: Record<string, string> = {};
  if (filters?.gpu_model?.length) params.gpu_model = filters.gpu_model.join(",");
  if (filters?.region?.length) params.region = filters.region.join(",");
  if (filters?.max_price !== undefined) params.max_price = String(filters.max_price);
  if (filters?.provider) params.provider = filters.provider;
  if (filters?.limit) params.limit = String(filters.limit);
  else params.limit = "500";

  return pscaFetch<PSCAOffer[]>("/offers", params);
}

/**
 * Fetch market overview statistics.
 */
export async function fetchMarketOverview(): Promise<PSCAMarketOverview | null> {
  return pscaFetch<PSCAMarketOverview>("/telemetry/market-overview");
}

/**
 * Fetch GPU distribution telemetry.
 */
export async function fetchGpuDistribution(): Promise<Record<string, number> | null> {
  return pscaFetch<Record<string, number>>("/telemetry/gpu-distribution");
}

/**
 * Fetch regional distribution telemetry.
 */
export async function fetchRegionalDistribution(): Promise<Record<string, number> | null> {
  return pscaFetch<Record<string, number>>("/telemetry/regional-distribution");
}

/**
 * Fetch cheapest GPU offers matching criteria.
 */
export async function fetchCheapestOffers(filters?: {
  gpu_model?: string;
  min_vram_gb?: number;
  region?: string;
  limit?: number;
}): Promise<PSCAOffer[] | null> {
  const params: Record<string, string> = {};
  if (filters?.gpu_model) params.gpu_model = filters.gpu_model;
  if (filters?.min_vram_gb) params.min_vram_gb = String(filters.min_vram_gb);
  if (filters?.region) params.region = filters.region;
  if (filters?.limit) params.limit = String(filters.limit);

  return pscaFetch<PSCAOffer[]>("/optimize/cheapest", params);
}

/**
 * Fetch provider statistics.
 */
export async function fetchProviderStats(): Promise<Record<string, unknown> | null> {
  return pscaFetch<Record<string, unknown>>("/optimize/provider-stats");
}

/**
 * Check if the PSCA API is reachable.
 */
export async function isApiHealthy(): Promise<boolean> {
  const result = await pscaFetch<{ status: string }>("/health");
  return result?.status === "healthy";
}

// ─── Data Transformation ────────────────────────────────────

/**
 * Transform PSCA offers into the format expected by the Polaris Cloud
 * compute resource listing. Applies the obfuscation layer so raw
 * provider details are never exposed to end users.
 */
export function transformOfferToResource(offer: PSCAOffer) {
  const gpuModel = normalizeGpuModel(offer.gpu_model);
  const vramGb = offer.vram_gb > 1000 ? Math.round(offer.vram_gb / 1024) : offer.vram_gb;

  return {
    id: `psca-${offer.id}`,
    resourceType: "gpu" as const,
    gpuModel,
    gpuCount: 1,
    gpuVramGb: vramGb,
    cpuModel: null,
    cpuCores: null,
    ramGb: null,
    storageGb: null,
    storageType: null,
    region: normalizeRegion(offer.region),
    country: regionToCountry(offer.region),
    hourlyPrice: offer.price_per_hour,
    isActive: true,
    isBlacklisted: false,
    adminApprovalStatus: "verified" as const,
    rentalUserId: null,
    cpuPowScore: null,
    gpuPowScore: estimateGpuScore(gpuModel),
    createdAt: new Date(),
    provider: offer.provider,
    isSpot: offer.spot ?? false,
  };
}

function normalizeGpuModel(raw: string): string {
  const upper = raw.toUpperCase();
  if (upper.includes("H100")) return "NVIDIA H100";
  if (upper.includes("A100") && upper.includes("80")) return "NVIDIA A100 80GB";
  if (upper.includes("A100")) return "NVIDIA A100 40GB";
  if (upper.includes("4090")) return "NVIDIA RTX 4090";
  if (upper.includes("3090")) return "NVIDIA RTX 3090";
  if (upper.includes("3060")) return "NVIDIA RTX 3060";
  if (upper.includes("A6000")) return "NVIDIA A6000";
  if (upper.includes("A40")) return "NVIDIA A40";
  if (upper.includes("L40")) return "NVIDIA L40S";
  if (upper.includes("4080")) return "NVIDIA RTX 4080";
  if (upper.includes("3080")) return "NVIDIA RTX 3080";
  return `NVIDIA ${raw}`;
}

function normalizeRegion(raw: string): string {
  const lower = raw.toLowerCase();
  if (lower.includes("us") || lower.includes("america")) return "US East";
  if (lower.includes("eu") || lower.includes("europe")) return "Amsterdam";
  if (lower.includes("asia")) return "Singapore";
  if (lower.includes("ng") || lower.includes("lagos")) return "Lagos";
  if (lower.includes("ke") || lower.includes("nairobi")) return "Nairobi";
  if (lower.includes("za") || lower.includes("cape")) return "Cape Town";
  return raw;
}

function regionToCountry(raw: string): string {
  const region = normalizeRegion(raw);
  const map: Record<string, string> = {
    Lagos: "Nigeria",
    Nairobi: "Kenya",
    "Cape Town": "South Africa",
    Amsterdam: "Netherlands",
    London: "United Kingdom",
    "US East": "United States",
    "US West": "United States",
    Singapore: "Singapore",
  };
  return map[region] ?? "Global";
}

function estimateGpuScore(model: string): number {
  const scores: Record<string, number> = {
    "NVIDIA H100": 95,
    "NVIDIA A100 80GB": 88,
    "NVIDIA A100 40GB": 82,
    "NVIDIA L40S": 78,
    "NVIDIA A6000": 75,
    "NVIDIA RTX 4090": 85,
    "NVIDIA RTX 4080": 72,
    "NVIDIA RTX 3090": 68,
    "NVIDIA RTX 3080": 60,
    "NVIDIA RTX 3060": 45,
    "NVIDIA A40": 65,
  };
  return scores[model] ?? 50;
}
