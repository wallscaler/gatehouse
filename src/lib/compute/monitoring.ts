// ─── Heartbeat & Monitoring ──────────────────────────────────
// Health monitoring utilities for compute resources: heartbeat
// freshness, health determination, uptime tracking, and alerts.

import { HEARTBEAT_FRESH_THRESHOLD_MS } from "./constants";

// ─── Heartbeat Freshness ─────────────────────────────────────

/**
 * Check whether a heartbeat is fresh (received within the last 5 minutes).
 *
 * Returns `false` if `lastUpdatedAt` is `null` (no heartbeat ever received).
 */
export function isHeartbeatFresh(lastUpdatedAt: Date | null): boolean {
  if (lastUpdatedAt == null) return false;
  const age = Date.now() - lastUpdatedAt.getTime();
  return age <= HEARTBEAT_FRESH_THRESHOLD_MS;
}

// ─── Health Determination ────────────────────────────────────

/**
 * Determine resource health from heartbeat telemetry.
 *
 * Thresholds:
 * - **critical**: offline, CPU > 95%, memory > 95%, or GPU temp > 90 C
 * - **warning**:  CPU > 80%, memory > 85%, or GPU temp > 80 C
 * - **healthy**:  everything within normal range
 */
export function determineHealth(heartbeat: {
  cpuUsagePercent?: number;
  memoryUsagePercent?: number;
  gpuTempCelsius?: number;
  isOnline: boolean;
}): "healthy" | "warning" | "critical" {
  if (!heartbeat.isOnline) return "critical";

  const cpu = heartbeat.cpuUsagePercent ?? 0;
  const mem = heartbeat.memoryUsagePercent ?? 0;
  const gpuTemp = heartbeat.gpuTempCelsius ?? 0;

  // Critical thresholds
  if (cpu > 95 || mem > 95 || gpuTemp > 90) {
    return "critical";
  }

  // Warning thresholds
  if (cpu > 80 || mem > 85 || gpuTemp > 80) {
    return "warning";
  }

  return "healthy";
}

// ─── Uptime Calculation ──────────────────────────────────────

/**
 * Calculate uptime percentage from a series of heartbeat records.
 *
 * Each heartbeat is a point-in-time sample. Uptime is the ratio of
 * `isOnline === true` heartbeats to total heartbeats, expressed as
 * a percentage (0-100). Returns 0 if no heartbeats are provided.
 */
export function calculateUptimePercentage(
  heartbeats: { isOnline: boolean; createdAt: Date }[],
): number {
  if (heartbeats.length === 0) return 0;

  const onlineCount = heartbeats.filter((h) => h.isOnline).length;
  return (onlineCount / heartbeats.length) * 100;
}

// ─── Uptime Formatting ───────────────────────────────────────

/**
 * Format a duration in hours into a human-readable string.
 *
 * @example
 * formatUptime(0.5)   // "30m"
 * formatUptime(2)     // "2h"
 * formatUptime(25.5)  // "1d 1h"
 * formatUptime(750)   // "31d 6h"
 */
export function formatUptime(hours: number): string {
  if (hours < 0) return "0m";

  const totalMinutes = Math.round(hours * 60);

  if (totalMinutes < 60) {
    return `${totalMinutes}m`;
  }

  const totalHours = Math.floor(totalMinutes / 60);

  if (totalHours < 24) {
    const remainingMinutes = totalMinutes % 60;
    if (remainingMinutes === 0) return `${totalHours}h`;
    return `${totalHours}h ${remainingMinutes}m`;
  }

  const days = Math.floor(totalHours / 24);
  const remainingHours = totalHours % 24;

  if (remainingHours === 0) return `${days}d`;
  return `${days}d ${remainingHours}h`;
}

// ─── Attention Check ─────────────────────────────────────────

/**
 * Determine whether a resource needs operator attention.
 *
 * Checks for stale heartbeats, high resource usage, elevated GPU
 * temperature, and non-healthy status. Returns a list of reasons
 * if attention is needed.
 */
export function needsAttention(heartbeat: {
  lastUpdatedAt: Date | null;
  cpuUsagePercent?: number;
  memoryUsagePercent?: number;
  gpuTempCelsius?: number;
  health: string;
}): { needsAttention: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // Stale heartbeat
  if (!isHeartbeatFresh(heartbeat.lastUpdatedAt)) {
    reasons.push("Heartbeat is stale (no update in over 5 minutes)");
  }

  // High CPU
  if (heartbeat.cpuUsagePercent != null && heartbeat.cpuUsagePercent > 90) {
    reasons.push(`CPU usage is critically high (${heartbeat.cpuUsagePercent.toFixed(1)}%)`);
  }

  // High memory
  if (heartbeat.memoryUsagePercent != null && heartbeat.memoryUsagePercent > 90) {
    reasons.push(`Memory usage is critically high (${heartbeat.memoryUsagePercent.toFixed(1)}%)`);
  }

  // GPU temperature
  if (heartbeat.gpuTempCelsius != null && heartbeat.gpuTempCelsius > 85) {
    reasons.push(`GPU temperature is elevated (${heartbeat.gpuTempCelsius.toFixed(0)} C)`);
  }

  // Non-healthy status
  if (heartbeat.health === "critical") {
    reasons.push("Resource health is critical");
  }

  return { needsAttention: reasons.length > 0, reasons };
}
