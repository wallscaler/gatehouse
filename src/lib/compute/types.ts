import type {
  ComputeResource,
  Container,
  Template,
  Heartbeat,
  Miner,
  SshKey,
} from "@/lib/db/schema";

// ─── Query / Filter Types ─────────────────────────────────────

export interface ComputeResourceFilters {
  type?: "cpu" | "gpu";
  gpuModel?: string;
  region?: string;
  minRam?: number;
  maxPrice?: number;
  sortBy?: "price" | "ram" | "gpuVram" | "newest";
  page?: number;
  limit?: number;
}

export interface InstanceFilters {
  status?: "pending" | "running" | "stopped" | "terminated" | "failed";
  page?: number;
  limit?: number;
}

export interface TemplateFilters {
  category?: string;
  gpuRequired?: boolean;
}

// ─── Request Types ────────────────────────────────────────────

export interface DeployInstanceRequest {
  resourceId: string;
  templateId: string;
  sshKeyId?: string;
  duration: { hours: number; minutes?: number };
  authMethod: "key" | "password" | "both";
}

export interface AddSshKeyRequest {
  name: string;
  publicKey: string;
}

export interface UpdateSshKeyRequest {
  isDefault?: boolean;
}

export interface RegisterMinerRequest {
  name: string;
  location?: string;
  description?: string;
}

export interface HeartbeatRequest {
  resourceId: string;
  status: {
    isOnline: boolean;
    health: "healthy" | "warning" | "critical";
    hasInternet: boolean;
  };
  hardware: {
    cpuUsagePercent: number;
    memoryUsagePercent: number;
    gpuUsagePercent?: number;
    gpuTempCelsius?: number;
    uptimeHours: number;
  };
  network: {
    externalIp: string;
    watchtowerDeployed: boolean;
  };
}

export interface AdminResourceUpdate {
  action: "approve" | "reject" | "blacklist";
  notes?: string;
}

// ─── Response Types ───────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
}

export interface SingleResponse<T> {
  data: T;
}

export interface ErrorResponse {
  error: string;
}

export interface ResourceWithDetails extends ComputeResource {
  heartbeat: Heartbeat | null;
  miner: Miner | null;
}

export interface DeployInstanceResponse {
  data: Container;
  connectionDetails: {
    host: string;
    port: number;
    username: string;
    password?: string;
  };
}

export interface ContainerWithDetails extends Container {
  resource: ComputeResource | null;
  template: Template | null;
}

export interface AdminUserInfo {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  role: string;
  status: string;
  country: string | null;
  instanceCount: number;
  createdAt: Date | null;
}

export interface PlatformStats {
  totalUsers: number;
  totalMiners: number;
  totalResources: number;
  activeResources: number;
  totalContainers: number;
  runningContainers: number;
  pendingApprovals: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

// Re-export schema types for convenience
export type {
  ComputeResource,
  Container,
  Template,
  Heartbeat,
  Miner,
  SshKey,
};
