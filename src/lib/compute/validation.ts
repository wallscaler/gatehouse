// ─── Resource Validation ─────────────────────────────────────
// Validation logic for compute resources: spec checks, IP/port
// validation, availability rules, and triple-approval status.

// ─── Spec Validation ─────────────────────────────────────────

/**
 * Validate that resource hardware specs meet minimum requirements.
 *
 * Returns errors for values that are invalid and warnings for specs
 * that are unusually low or high.
 */
export function validateResourceSpecs(resource: {
  cpuCores?: number;
  ramGb?: number;
  storageGb?: number;
  gpuVramGb?: number;
  gpuModel?: string;
}): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  // CPU cores
  if (resource.cpuCores != null) {
    if (!Number.isInteger(resource.cpuCores) || resource.cpuCores < 1) {
      errors.push("CPU cores must be a positive integer");
    } else if (resource.cpuCores < 2) {
      warnings.push("Less than 2 CPU cores may limit workload compatibility");
    } else if (resource.cpuCores > 256) {
      warnings.push("CPU core count exceeds 256 — please verify this is correct");
    }
  }

  // RAM
  if (resource.ramGb != null) {
    if (resource.ramGb < 1) {
      errors.push("RAM must be at least 1 GB");
    } else if (resource.ramGb < 4) {
      warnings.push("Less than 4 GB RAM may limit workload compatibility");
    } else if (resource.ramGb > 2048) {
      warnings.push("RAM exceeds 2 TB — please verify this is correct");
    }
  }

  // Storage
  if (resource.storageGb != null) {
    if (resource.storageGb < 1) {
      errors.push("Storage must be at least 1 GB");
    } else if (resource.storageGb < 20) {
      warnings.push("Less than 20 GB storage may be insufficient for containers");
    }
  }

  // GPU VRAM
  if (resource.gpuVramGb != null) {
    if (resource.gpuVramGb < 1) {
      errors.push("GPU VRAM must be at least 1 GB");
    } else if (resource.gpuVramGb > 80 && !resource.gpuModel?.toLowerCase().includes("h100")) {
      warnings.push("GPU VRAM exceeds 80 GB — please verify the GPU model");
    }
  }

  // GPU model should be a non-empty string if provided
  if (resource.gpuModel != null && resource.gpuModel.trim().length === 0) {
    errors.push("GPU model cannot be an empty string");
  }

  return { valid: errors.length === 0, errors, warnings };
}

// ─── Plan Requirements ───────────────────────────────────────

/**
 * Check whether a resource's specs meet (do not exceed) a subscription
 * plan's resource limits.
 *
 * This answers: "Is this resource within what the plan allows?"
 */
export function resourceMeetsPlanRequirements(
  resource: {
    cpuCores?: number;
    gpuCount?: number;
    ramGb?: number;
    storageGb?: number;
    gpuVramGb?: number;
    cpuPowScore?: number;
    gpuPowScore?: number;
  },
  plan: {
    maxCpuCores: number;
    maxGpuCount: number;
    maxRamGb: number;
    maxStorageGb: number;
    minCpuPowScore: number;
    minGpuPowScore: number;
  },
): boolean {
  // Resource specs must not exceed plan maximums
  if ((resource.cpuCores ?? 0) > plan.maxCpuCores) return false;
  if ((resource.gpuCount ?? 0) > plan.maxGpuCount) return false;
  if ((resource.ramGb ?? 0) > plan.maxRamGb) return false;
  if ((resource.storageGb ?? 0) > plan.maxStorageGb) return false;

  // Resource PoW scores must meet plan minimums
  if ((resource.cpuPowScore ?? 0) < plan.minCpuPowScore) return false;
  if ((resource.gpuPowScore ?? 0) < plan.minGpuPowScore) return false;

  return true;
}

// ─── Network Validation ──────────────────────────────────────

/**
 * Validate an IPv4 or IPv6 address format.
 *
 * Supports standard dotted-quad IPv4 and abbreviated/full IPv6.
 */
export function isValidIP(ip: string): boolean {
  // IPv4
  const ipv4Regex =
    /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
  if (ipv4Regex.test(ip)) return true;

  // IPv6 — simplified check for valid hex groups separated by colons
  const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
  if (ipv6Regex.test(ip)) return true;

  return false;
}

/**
 * Validate that a port number is within the valid TCP/UDP range (1-65535).
 */
export function isValidPort(port: number): boolean {
  return Number.isInteger(port) && port >= 1 && port <= 65535;
}

// ─── Availability ────────────────────────────────────────────

/**
 * Determine whether a compute resource is available for rental.
 *
 * A resource is available when:
 * - All three approval statuses are "verified"
 * - It is not blacklisted
 * - It is active
 * - It is not currently rented
 */
export function isResourceAvailable(resource: {
  validationStatus: string;
  verifierStatus: string;
  adminApprovalStatus: string;
  isBlacklisted: boolean;
  isActive: boolean;
  rentalUserId: string | null;
}): boolean {
  if (resource.isBlacklisted) return false;
  if (!resource.isActive) return false;
  if (resource.rentalUserId != null) return false;

  return (
    resource.validationStatus === "verified" &&
    resource.verifierStatus === "verified" &&
    resource.adminApprovalStatus === "verified"
  );
}

// ─── Triple Approval Status ─────────────────────────────────

/**
 * Compute an overall status from the three independent approval checks.
 *
 * - "verified"  — all three are verified
 * - "rejected"  — any one is rejected
 * - "pending"   — otherwise (at least one pending, none rejected)
 */
export function getOverallStatus(resource: {
  validationStatus: string;
  verifierStatus: string;
  adminApprovalStatus: string;
}): "verified" | "pending" | "rejected" {
  const statuses = [
    resource.validationStatus,
    resource.verifierStatus,
    resource.adminApprovalStatus,
  ];

  if (statuses.some((s) => s === "rejected")) {
    return "rejected";
  }

  if (statuses.every((s) => s === "verified")) {
    return "verified";
  }

  return "pending";
}
