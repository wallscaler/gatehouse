// ─── GPU Models ───────────────────────────────────────────────

/** Known GPU models with their hardware specifications. */
export const GPU_MODELS: Record<
  string,
  {
    name: string;
    vramGb: number;
    cudaCores: number;
    tensorCores: number;
    architecture: string;
  }
> = {
  "rtx-4090": {
    name: "NVIDIA RTX 4090",
    vramGb: 24,
    cudaCores: 16384,
    tensorCores: 512,
    architecture: "Ada Lovelace",
  },
  "rtx-4080": {
    name: "NVIDIA RTX 4080",
    vramGb: 16,
    cudaCores: 9728,
    tensorCores: 304,
    architecture: "Ada Lovelace",
  },
  "rtx-4070-ti": {
    name: "NVIDIA RTX 4070 Ti",
    vramGb: 12,
    cudaCores: 7680,
    tensorCores: 240,
    architecture: "Ada Lovelace",
  },
  "rtx-3090": {
    name: "NVIDIA RTX 3090",
    vramGb: 24,
    cudaCores: 10496,
    tensorCores: 328,
    architecture: "Ampere",
  },
  "rtx-3080": {
    name: "NVIDIA RTX 3080",
    vramGb: 10,
    cudaCores: 8704,
    tensorCores: 272,
    architecture: "Ampere",
  },
  "rtx-3070": {
    name: "NVIDIA RTX 3070",
    vramGb: 8,
    cudaCores: 5888,
    tensorCores: 184,
    architecture: "Ampere",
  },
  "a100-40gb": {
    name: "NVIDIA A100 40GB",
    vramGb: 40,
    cudaCores: 6912,
    tensorCores: 432,
    architecture: "Ampere",
  },
  "a100-80gb": {
    name: "NVIDIA A100 80GB",
    vramGb: 80,
    cudaCores: 6912,
    tensorCores: 432,
    architecture: "Ampere",
  },
  "h100": {
    name: "NVIDIA H100",
    vramGb: 80,
    cudaCores: 14592,
    tensorCores: 456,
    architecture: "Hopper",
  },
  "l40s": {
    name: "NVIDIA L40S",
    vramGb: 48,
    cudaCores: 18176,
    tensorCores: 568,
    architecture: "Ada Lovelace",
  },
  "t4": {
    name: "NVIDIA T4",
    vramGb: 16,
    cudaCores: 2560,
    tensorCores: 320,
    architecture: "Turing",
  },
  "v100": {
    name: "NVIDIA V100",
    vramGb: 16,
    cudaCores: 5120,
    tensorCores: 640,
    architecture: "Volta",
  },
};

// ─── Template Categories ─────────────────────────────────────

/** Available template categories for container deployment. */
export const TEMPLATE_CATEGORIES: string[] = [
  "machine-learning",
  "deep-learning",
  "data-science",
  "web-server",
  "database",
  "development",
  "rendering",
  "crypto",
  "custom",
];

// ─── Status Configuration ────────────────────────────────────

/** Display configuration for resource and container statuses. */
export const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bgColor: string }
> = {
  // Validation / approval statuses
  pending: { label: "Pending", color: "#FFB800", bgColor: "#1a1600" },
  verified: { label: "Verified", color: "#4CC9F0", bgColor: "#0a1520" },
  rejected: { label: "Rejected", color: "#DC2626", bgColor: "#1a0a0a" },

  // Container statuses
  running: { label: "Running", color: "#4CC9F0", bgColor: "#0a1520" },
  stopped: { label: "Stopped", color: "#6B7280", bgColor: "#111318" },
  terminated: { label: "Terminated", color: "#DC2626", bgColor: "#1a0a0a" },
  failed: { label: "Failed", color: "#DC2626", bgColor: "#1a0a0a" },

  // Health statuses
  healthy: { label: "Healthy", color: "#4CC9F0", bgColor: "#0a1520" },
  warning: { label: "Warning", color: "#FFB800", bgColor: "#1a1600" },
  critical: { label: "Critical", color: "#DC2626", bgColor: "#1a0a0a" },

  // Miner statuses
  active: { label: "Active", color: "#4CC9F0", bgColor: "#0a1520" },
  inactive: { label: "Inactive", color: "#6B7280", bgColor: "#111318" },
  suspended: { label: "Suspended", color: "#DC2626", bgColor: "#1a0a0a" },

  // Payment statuses
  paid: { label: "Paid", color: "#4CC9F0", bgColor: "#0a1520" },
  succeeded: { label: "Succeeded", color: "#4CC9F0", bgColor: "#0a1520" },
  refunded: { label: "Refunded", color: "#6B7280", bgColor: "#111318" },
};

// ─── Regions ─────────────────────────────────────────────────

/** Supported hosting regions. */
export const REGIONS: {
  value: string;
  label: string;
  country: string;
  flag: string;
}[] = [
  { value: "ng-lagos", label: "Lagos", country: "Nigeria", flag: "NG" },
  { value: "ng-abuja", label: "Abuja", country: "Nigeria", flag: "NG" },
  { value: "za-johannesburg", label: "Johannesburg", country: "South Africa", flag: "ZA" },
  { value: "ke-nairobi", label: "Nairobi", country: "Kenya", flag: "KE" },
  { value: "gh-accra", label: "Accra", country: "Ghana", flag: "GH" },
  { value: "us-east", label: "US East", country: "United States", flag: "US" },
  { value: "us-west", label: "US West", country: "United States", flag: "US" },
  { value: "eu-west", label: "EU West", country: "Netherlands", flag: "NL" },
  { value: "eu-central", label: "EU Central", country: "Germany", flag: "DE" },
  { value: "ap-southeast", label: "AP Southeast", country: "Singapore", flag: "SG" },
];

// ─── Container Status Flow ───────────────────────────────────

/** Ordered lifecycle statuses a container transitions through. */
export const CONTAINER_STATUS_FLOW: string[] = [
  "pending",
  "running",
  "stopped",
  "terminated",
];

// ─── Heartbeat Threshold ─────────────────────────────────────

/** A heartbeat older than this (5 minutes) is considered stale. */
export const HEARTBEAT_FRESH_THRESHOLD_MS: number = 5 * 60 * 1000;
