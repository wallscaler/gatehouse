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
  pending: { label: "Pending", color: "#B87333", bgColor: "#FFF7ED" },
  verified: { label: "Verified", color: "#2D5A47", bgColor: "#F7FAF8" },
  rejected: { label: "Rejected", color: "#DC2626", bgColor: "#FEF2F2" },

  // Container statuses
  running: { label: "Running", color: "#2D5A47", bgColor: "#F7FAF8" },
  stopped: { label: "Stopped", color: "#6B7280", bgColor: "#F9FAFB" },
  terminated: { label: "Terminated", color: "#DC2626", bgColor: "#FEF2F2" },
  failed: { label: "Failed", color: "#DC2626", bgColor: "#FEF2F2" },

  // Health statuses
  healthy: { label: "Healthy", color: "#2D5A47", bgColor: "#F7FAF8" },
  warning: { label: "Warning", color: "#B87333", bgColor: "#FFF7ED" },
  critical: { label: "Critical", color: "#DC2626", bgColor: "#FEF2F2" },

  // Miner statuses
  active: { label: "Active", color: "#2D5A47", bgColor: "#F7FAF8" },
  inactive: { label: "Inactive", color: "#6B7280", bgColor: "#F9FAFB" },
  suspended: { label: "Suspended", color: "#DC2626", bgColor: "#FEF2F2" },

  // Payment statuses
  paid: { label: "Paid", color: "#2D5A47", bgColor: "#F7FAF8" },
  succeeded: { label: "Succeeded", color: "#2D5A47", bgColor: "#F7FAF8" },
  refunded: { label: "Refunded", color: "#6B7280", bgColor: "#F9FAFB" },
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
