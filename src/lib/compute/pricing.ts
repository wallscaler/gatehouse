// ─── Pricing & Plan Logic ────────────────────────────────────
// Cost calculations, currency formatting, plan access control,
// and GPU pricing references for the Polaris Cloud marketplace.

// ─── GPU Pricing Reference ───────────────────────────────────

/**
 * Hourly pricing reference for GPU models (USD).
 *
 * Values represent the typical marketplace range. Providers set their
 * own prices, but these serve as guidance.
 */
export const GPU_PRICING: Record<
  string,
  { min: number; max: number; suggested: number }
> = {
  "rtx-4090":     { min: 0.40, max: 1.20, suggested: 0.74 },
  "rtx-4080":     { min: 0.30, max: 0.90, suggested: 0.55 },
  "rtx-4070-ti":  { min: 0.20, max: 0.70, suggested: 0.40 },
  "rtx-3090":     { min: 0.30, max: 0.80, suggested: 0.50 },
  "rtx-3080":     { min: 0.20, max: 0.60, suggested: 0.35 },
  "rtx-3070":     { min: 0.15, max: 0.45, suggested: 0.25 },
  "a100-40gb":    { min: 1.00, max: 3.00, suggested: 1.89 },
  "a100-80gb":    { min: 1.50, max: 4.00, suggested: 2.49 },
  "h100":         { min: 2.50, max: 6.00, suggested: 3.99 },
  "l40s":         { min: 1.00, max: 2.50, suggested: 1.59 },
  "t4":           { min: 0.10, max: 0.50, suggested: 0.25 },
  "v100":         { min: 0.20, max: 0.80, suggested: 0.45 },
};

// ─── Subscription Plan Details ───────────────────────────────

/**
 * Subscription plan display details and limits.
 *
 * Used for plan comparison tables, upgrade prompts, and access checks.
 */
export const PLAN_DETAILS: Record<
  string,
  {
    name: string;
    price: number;
    features: string[];
    limits: {
      hours: number;
      instances: number;
      gpuAccess: string;
      cpuAccess: string;
    };
  }
> = {
  free: {
    name: "Free",
    price: 0,
    features: [
      "10 compute hours/month",
      "1 concurrent instance",
      "CPU-only access",
      "Community support",
    ],
    limits: {
      hours: 10,
      instances: 1,
      gpuAccess: "none",
      cpuAccess: "basic",
    },
  },
  starter: {
    name: "Starter",
    price: 5000,
    features: [
      "50 compute hours/month",
      "2 concurrent instances",
      "Entry-level GPU access",
      "Email support",
    ],
    limits: {
      hours: 50,
      instances: 2,
      gpuAccess: "entry",
      cpuAccess: "standard",
    },
  },
  pro: {
    name: "Pro",
    price: 20000,
    features: [
      "200 compute hours/month",
      "5 concurrent instances",
      "All GPU models",
      "Priority support",
    ],
    limits: {
      hours: 200,
      instances: 5,
      gpuAccess: "all",
      cpuAccess: "all",
    },
  },
  enterprise: {
    name: "Enterprise",
    price: 100000,
    features: [
      "Unlimited compute hours",
      "Unlimited concurrent instances",
      "Dedicated GPU clusters",
      "Dedicated account manager",
    ],
    limits: {
      hours: -1, // unlimited
      instances: -1,
      gpuAccess: "all",
      cpuAccess: "all",
    },
  },
};

// ─── Cost Calculation ────────────────────────────────────────

/**
 * Calculate the total cost for a rental of a given duration.
 *
 * @param hourlyPrice - Cost per hour in the base currency unit.
 * @param durationHours - Duration of the rental in hours.
 * @returns Total cost rounded to 2 decimal places.
 */
export function calculateRentalCost(
  hourlyPrice: number,
  durationHours: number,
): number {
  if (hourlyPrice < 0 || durationHours < 0) return 0;
  return Math.round(hourlyPrice * durationHours * 100) / 100;
}

// ─── Currency Formatting ─────────────────────────────────────

/**
 * Format a numeric amount as a USD string.
 *
 * @example formatUSD(1.5) // "$1.50"
 */
export function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/**
 * Format a numeric amount as a Nigerian Naira string.
 *
 * @param amount - Amount in Naira (not kobo).
 * @example formatNGN(5000) // "NGN 5,000.00" (locale-dependent)
 */
export function formatNGN(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
}

/**
 * Convert a USD amount to NGN using an exchange rate.
 *
 * @param usd - Amount in US dollars.
 * @param rate - Exchange rate (NGN per 1 USD). Defaults to 1600.
 */
export function usdToNgn(usd: number, rate: number = 1600): number {
  return Math.round(usd * rate * 100) / 100;
}

// ─── Suggested Pricing ───────────────────────────────────────

/**
 * Look up the suggested hourly price range for a GPU model.
 *
 * Falls back to a conservative default if the model is not recognized.
 *
 * @param gpuModel - GPU model key (e.g. "rtx-4090", "a100-80gb").
 */
export function getSuggestedPrice(gpuModel: string): {
  min: number;
  max: number;
  suggested: number;
} {
  const normalized = gpuModel.toLowerCase().replace(/\s+/g, "-");
  return GPU_PRICING[normalized] ?? { min: 0.10, max: 1.00, suggested: 0.50 };
}

// ─── Plan Access Control ─────────────────────────────────────

/** GPU access tiers ordered from least to most permissive. */
const GPU_ACCESS_TIERS: Record<string, number> = {
  "0": 0,
  none: 0,
  entry: 1,
  basic: 1,
  standard: 2,
  all: 3,
};

/** CPU access tiers ordered from least to most permissive. */
const CPU_ACCESS_TIERS: Record<string, number> = {
  "0": 0,
  none: 0,
  basic: 1,
  standard: 2,
  all: 3,
};

/**
 * Check whether a user's subscription plan allows access to a resource.
 *
 * Evaluates resource type access (GPU/CPU tier), core count, GPU count,
 * RAM, and storage against plan limits.
 */
export function planAllowsResource(
  plan: {
    allowedGpuAccess: string;
    allowedCpuAccess: string;
    maxCpuCores: number;
    maxGpuCount: number;
    maxRamGb: number;
    maxStorageGb: number;
  },
  resource: {
    resourceType: string;
    cpuCores?: number;
    gpuCount?: number;
    ramGb?: number;
    storageGb?: number;
  },
): { allowed: boolean; reason?: string; suggestedPlan?: string } {
  // GPU access check
  if (resource.resourceType === "gpu") {
    const planGpuTier = GPU_ACCESS_TIERS[plan.allowedGpuAccess] ?? 0;
    if (planGpuTier === 0) {
      return {
        allowed: false,
        reason: "Your plan does not include GPU access",
        suggestedPlan: "starter",
      };
    }
  }

  // CPU access check
  if (resource.resourceType === "cpu") {
    const planCpuTier = CPU_ACCESS_TIERS[plan.allowedCpuAccess] ?? 0;
    if (planCpuTier === 0) {
      return {
        allowed: false,
        reason: "Your plan does not include CPU access",
        suggestedPlan: "starter",
      };
    }
  }

  // CPU cores limit
  if (resource.cpuCores != null && resource.cpuCores > plan.maxCpuCores) {
    return {
      allowed: false,
      reason: `Resource requires ${resource.cpuCores} CPU cores but your plan allows up to ${plan.maxCpuCores}`,
      suggestedPlan: "pro",
    };
  }

  // GPU count limit
  if (resource.gpuCount != null && resource.gpuCount > plan.maxGpuCount) {
    return {
      allowed: false,
      reason: `Resource has ${resource.gpuCount} GPUs but your plan allows up to ${plan.maxGpuCount}`,
      suggestedPlan: "pro",
    };
  }

  // RAM limit
  if (resource.ramGb != null && resource.ramGb > plan.maxRamGb) {
    return {
      allowed: false,
      reason: `Resource has ${resource.ramGb} GB RAM but your plan allows up to ${plan.maxRamGb} GB`,
      suggestedPlan: "pro",
    };
  }

  // Storage limit
  if (resource.storageGb != null && resource.storageGb > plan.maxStorageGb) {
    return {
      allowed: false,
      reason: `Resource has ${resource.storageGb} GB storage but your plan allows up to ${plan.maxStorageGb} GB`,
      suggestedPlan: "pro",
    };
  }

  return { allowed: true };
}
