// ─── Docker Deployment Service ───────────────────────────────
// Generates Docker run commands, docker-compose configs, and
// container naming conventions for compute resource deployments.
// Includes Polaris Cloud branding injection as part of the deploy pipeline.

import { TEMPLATE_CATEGORIES } from "./constants";
import { generateBrandingOneliner } from "./branding";

// ─── Types ───────────────────────────────────────────────────

/** Configuration for deploying a Docker-based container. */
export interface DeploymentConfig {
  /** Docker image to deploy (e.g. "pytorch/pytorch:2.1.0-cuda12.1-cudnn8-runtime"). */
  templateImage: string;
  /** Ports to expose from the container. */
  ports: number[];
  /** Number of GPUs to attach (0 = none). */
  gpuCount?: number;
  /** Environment variables injected into the container. */
  environment?: Record<string, string>;
  /** Volume mounts in "host:container" format. */
  volumes?: string[];
  /** Override command to run inside the container. */
  command?: string;
}

// ─── Command Generation ──────────────────────────────────────

/**
 * Generate a `docker run` command string for a deployment.
 *
 * Includes GPU passthrough, port mappings, environment variables,
 * volume mounts, and an optional command override.
 *
 * @example
 * generateDockerRunCommand({
 *   templateImage: "pytorch/pytorch:latest",
 *   ports: [8888, 22],
 *   gpuCount: 1,
 * }, "ml-workspace-abc123")
 */
export function generateDockerRunCommand(
  config: DeploymentConfig,
  containerName: string,
): string {
  const parts: string[] = ["docker run -d"];

  // Container name
  parts.push(`--name ${containerName}`);

  // GPU access
  if (config.gpuCount && config.gpuCount > 0) {
    if (config.gpuCount === 1) {
      parts.push("--gpus 1");
    } else {
      parts.push(`--gpus ${config.gpuCount}`);
    }
  }

  // Port mappings
  for (const port of config.ports) {
    parts.push(`-p ${port}:${port}`);
  }

  // Environment variables
  if (config.environment) {
    for (const [key, value] of Object.entries(config.environment)) {
      parts.push(`-e ${key}="${value}"`);
    }
  }

  // Volume mounts
  if (config.volumes) {
    for (const vol of config.volumes) {
      parts.push(`-v ${vol}`);
    }
  }

  // Image
  parts.push(config.templateImage);

  // Optional command override
  if (config.command) {
    parts.push(config.command);
  }

  return parts.join(" \\\n  ");
}

// ─── Docker Compose ──────────────────────────────────────────

/**
 * Generate a docker-compose YAML config string for a deployment.
 *
 * Produces a Compose v3.8 file with GPU reservation, port bindings,
 * environment variables, and volume definitions.
 */
export function generateDockerCompose(
  config: DeploymentConfig,
  containerName: string,
): string {
  const lines: string[] = [];

  lines.push("version: '3.8'");
  lines.push("services:");
  lines.push(`  ${containerName}:`);
  lines.push(`    image: ${config.templateImage}`);
  lines.push(`    container_name: ${containerName}`);
  lines.push("    restart: unless-stopped");

  // Ports
  if (config.ports.length > 0) {
    lines.push("    ports:");
    for (const port of config.ports) {
      lines.push(`      - "${port}:${port}"`);
    }
  }

  // Environment
  if (config.environment && Object.keys(config.environment).length > 0) {
    lines.push("    environment:");
    for (const [key, value] of Object.entries(config.environment)) {
      lines.push(`      - ${key}=${value}`);
    }
  }

  // Volumes
  if (config.volumes && config.volumes.length > 0) {
    lines.push("    volumes:");
    for (const vol of config.volumes) {
      lines.push(`      - ${vol}`);
    }
  }

  // GPU reservation
  if (config.gpuCount && config.gpuCount > 0) {
    lines.push("    deploy:");
    lines.push("      resources:");
    lines.push("        reservations:");
    lines.push("          devices:");
    lines.push("            - driver: nvidia");
    lines.push(`              count: ${config.gpuCount}`);
    lines.push("              capabilities: [gpu]");
  }

  // Command
  if (config.command) {
    lines.push(`    command: ${config.command}`);
  }

  return lines.join("\n");
}

// ─── Default Ports ───────────────────────────────────────────

/** Well-known default port mappings per template category. */
const CATEGORY_PORTS: Record<string, number[]> = {
  "machine-learning": [8888, 6006, 22],   // Jupyter, TensorBoard, SSH
  "deep-learning": [8888, 6006, 22],
  "data-science": [8888, 22],             // Jupyter, SSH
  "web-server": [80, 443, 22],
  database: [5432, 3306, 27017, 22],       // PG, MySQL, Mongo, SSH
  development: [3000, 8080, 22],           // Dev server, alt HTTP, SSH
  rendering: [8080, 22],
  crypto: [30303, 8545, 22],               // P2P, RPC, SSH
  custom: [22],
};

/**
 * Return the default ports for a given template category.
 *
 * Falls back to port 22 (SSH only) for unknown categories.
 */
export function getDefaultPorts(category: string): number[] {
  return CATEGORY_PORTS[category] ?? [22];
}

// ─── Container Naming ────────────────────────────────────────

/**
 * Validate a Docker container name.
 *
 * Docker names must match `[a-zA-Z0-9][a-zA-Z0-9_.-]+` and be
 * between 2 and 128 characters long.
 */
export function isValidContainerName(name: string): boolean {
  if (name.length < 2 || name.length > 128) {
    return false;
  }
  return /^[a-zA-Z0-9][a-zA-Z0-9_.-]+$/.test(name);
}

/**
 * Generate a deterministic container name from a template name and user ID.
 *
 * Produces names like `pytorch-abc12345` that are safe for Docker.
 */
export function generateContainerName(
  templateName: string,
  userId: string,
): string {
  // Sanitize the template name: lowercase, replace non-alphanumeric with dashes
  const sanitized = templateName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);

  // Take the first 8 characters of the user ID for uniqueness
  const userSuffix = userId.replace(/-/g, "").slice(0, 8);

  return `${sanitized}-${userSuffix}`;
}

// ─── Branding Integration ────────────────────────────────────

/**
 * Generate a full deployment pipeline that includes:
 * 1. Docker container start
 * 2. Wait for container to be healthy
 * 3. Inject Polaris Cloud branding via docker exec
 *
 * This ensures users always see Polaris Cloud branding when they SSH in.
 */
export function generateBrandedDeployScript(
  config: DeploymentConfig,
  containerName: string,
  instanceId: string,
  region: string,
  plan: string,
  expiresAt: string,
  username: string,
): string {
  const dockerRun = generateDockerRunCommand(config, containerName);
  const brandingCmd = generateBrandingOneliner({
    instanceId,
    region,
    plan,
    expiresAt,
    username,
  });

  return `#!/bin/bash
set -e

echo "[Polaris] Starting container deployment..."

# Step 1: Deploy the container
${dockerRun}

echo "[Polaris] Container started. Waiting for initialization..."

# Step 2: Wait for the container to be running
for i in $(seq 1 30); do
  STATUS=$(docker inspect -f '{{.State.Running}}' ${containerName} 2>/dev/null || echo "false")
  if [ "$STATUS" = "true" ]; then
    break
  fi
  sleep 2
done

echo "[Polaris] Container is running. Applying branding..."

# Step 3: Inject Polaris Cloud branding
docker exec ${containerName} bash -c '${brandingCmd.replace(/'/g, "'\\''")}'

echo "[Polaris] Deployment complete. Instance ${instanceId} is ready."
`;
}
