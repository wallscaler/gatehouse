// ─── GPU Source Obfuscation Layer ─────────────────────────────
// Masks hardware provider details, IPs, and identifiers so that
// users only see Gatehouse-branded resource information.

import type { ComputeResource } from "@/lib/db/schema";

// ─── Gatehouse Resource ID Generation ─────────────────────────

/**
 * Convert an internal resource ID to a Gatehouse-branded public ID.
 * Maps "res-gpu-001" → "gh-gpu-a7x3k9" using a deterministic hash.
 */
export function toPublicResourceId(internalId: string): string {
  const hash = simpleHash(internalId);
  const suffix = hash.toString(36).slice(0, 6);
  const type = internalId.includes("gpu") ? "gpu" : "cpu";
  return `gh-${type}-${suffix}`;
}

/**
 * Simple deterministic hash for ID generation.
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash);
}

// ─── GPU Model Branding ──────────────────────────────────────

/**
 * GPU model mapping — replaces raw NVIDIA/AMD identifiers with
 * Gatehouse-branded tier names. Users never see the actual GPU model.
 */
const GPU_BRAND_MAP: Record<string, { tier: string; label: string; class: string }> = {
  "NVIDIA RTX 3060":    { tier: "Starter",    label: "Gatehouse G1",        class: "entry" },
  "NVIDIA RTX 3090":    { tier: "Pro",        label: "Gatehouse G3 Pro",    class: "mid" },
  "NVIDIA RTX 4090":    { tier: "Ultra",      label: "Gatehouse G4 Ultra",  class: "high" },
  "NVIDIA A100 40GB":   { tier: "Enterprise", label: "Gatehouse A1",        class: "enterprise" },
  "NVIDIA A100 80GB":   { tier: "Enterprise+",label: "Gatehouse A1 Max",    class: "enterprise" },
  "NVIDIA H100":        { tier: "Apex",       label: "Gatehouse H1 Apex",   class: "apex" },
};

/**
 * Convert a raw GPU model string to a Gatehouse-branded name.
 */
export function obfuscateGpuModel(rawModel: string | null): string | null {
  if (!rawModel) return null;
  const mapped = GPU_BRAND_MAP[rawModel];
  return mapped ? mapped.label : `Gatehouse Compute ${rawModel.replace(/NVIDIA|AMD|GeForce|Radeon/gi, "").trim()}`;
}

/**
 * Get the tier classification for a GPU model.
 */
export function getGpuTier(rawModel: string | null): string {
  if (!rawModel) return "CPU Only";
  const mapped = GPU_BRAND_MAP[rawModel];
  return mapped ? mapped.tier : "Standard";
}

/**
 * Get the performance class for pricing/display.
 */
export function getGpuClass(rawModel: string | null): string {
  if (!rawModel) return "cpu";
  const mapped = GPU_BRAND_MAP[rawModel];
  return mapped ? mapped.class : "standard";
}

// ─── CPU Model Branding ──────────────────────────────────────

/**
 * Obfuscate CPU model — show core/thread count but not the exact model.
 */
export function obfuscateCpuModel(rawModel: string | null, cores?: number | null): string {
  if (!rawModel) return "Unknown";
  if (cores && cores >= 64) return `Gatehouse HPC ${cores}-Core`;
  if (cores && cores >= 32) return `Gatehouse Server ${cores}-Core`;
  if (cores && cores >= 16) return `Gatehouse Pro ${cores}-Core`;
  if (cores && cores >= 8) return `Gatehouse Standard ${cores}-Core`;
  return `Gatehouse Compute ${cores ?? "??"}-Core`;
}

// ─── IP Address Masking ──────────────────────────────────────

/**
 * Mask a public IP address. Only the first octet is preserved.
 * "102.89.23.45" → "102.xxx.xxx.xxx"
 */
export function maskIpAddress(ip: string | null): string {
  if (!ip) return "—";
  const firstOctet = ip.split(".")[0];
  return `${firstOctet}.xxx.xxx.xxx`;
}

// ─── Provider Name Masking ───────────────────────────────────

/**
 * Generate a Gatehouse datacenter name from a region + miner ID.
 * Instead of showing "Lagos GPU Farm" (the miner name), show
 * "Gatehouse DC — Lagos (West Africa)" etc.
 */
const REGION_LABELS: Record<string, string> = {
  Lagos:      "West Africa",
  Nairobi:    "East Africa",
  "Cape Town": "Southern Africa",
  Accra:      "West Africa",
  Amsterdam:  "Europe (West)",
  London:     "Europe (North)",
};

export function obfuscateProviderName(region: string | null): string {
  if (!region) return "Gatehouse Cloud";
  const zoneLabel = REGION_LABELS[region] ?? "Global";
  return `Gatehouse DC — ${region} (${zoneLabel})`;
}

// ─── Full Resource Obfuscation ───────────────────────────────

/**
 * Fields that are safe to expose to end users (obfuscated).
 */
export interface ObfuscatedResource {
  id: string;               // gh-gpu-xxx (not internal ID)
  type: "gpu" | "cpu";
  gpuTier: string;          // "Pro", "Ultra", "Enterprise", etc.
  gpuLabel: string | null;  // "Gatehouse G3 Pro"
  cpuLabel: string;         // "Gatehouse Pro 16-Core"
  ramGb: number | null;
  storageGb: number | null;
  storageType: string | null;
  region: string | null;
  country: string | null;
  datacenter: string;       // "Gatehouse DC — Lagos (West Africa)"
  hourlyPrice: number | null;
  isAvailable: boolean;
  gpuCount: number | null;
  gpuVramGb: number | null;
  performanceScore: number; // Derived from POW scores
}

/**
 * Transform a raw ComputeResource into an obfuscated version
 * safe for public API responses and user-facing UI.
 *
 * - Internal IDs replaced with Gatehouse-branded IDs
 * - GPU/CPU model names replaced with tier labels
 * - IP addresses masked
 * - Provider/miner names replaced with datacenter labels
 * - Bittensor hotkeys/coldkeys stripped entirely
 */
export function obfuscateResource(resource: ComputeResource): ObfuscatedResource {
  return {
    id: toPublicResourceId(resource.id),
    type: resource.resourceType as "gpu" | "cpu",
    gpuTier: getGpuTier(resource.gpuModel),
    gpuLabel: obfuscateGpuModel(resource.gpuModel),
    cpuLabel: obfuscateCpuModel(resource.cpuModel, resource.cpuCores),
    ramGb: resource.ramGb,
    storageGb: resource.storageGb,
    storageType: resource.storageType,
    region: resource.region,
    country: resource.country,
    datacenter: obfuscateProviderName(resource.region),
    hourlyPrice: resource.hourlyPrice,
    isAvailable: resource.isActive && !resource.rentalUserId && !resource.isBlacklisted,
    gpuCount: resource.gpuCount,
    gpuVramGb: resource.gpuVramGb,
    performanceScore: calculatePerformanceScore(resource),
  };
}

/**
 * Calculate a normalized 0-100 performance score from POW benchmarks.
 */
function calculatePerformanceScore(resource: ComputeResource): number {
  const cpuScore = resource.cpuPowScore ?? 0;
  const gpuScore = resource.gpuPowScore ?? 0;

  if (resource.resourceType === "gpu") {
    // Weight GPU score more heavily for GPU resources
    return Math.round(gpuScore * 0.7 + cpuScore * 0.3);
  }
  return Math.round(cpuScore);
}

/**
 * Obfuscate an array of resources for public listing.
 */
export function obfuscateResources(resources: ComputeResource[]): ObfuscatedResource[] {
  return resources.map(obfuscateResource);
}
