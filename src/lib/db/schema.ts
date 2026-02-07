import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// ─── Existing Tables ───────────────────────────────────────────

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  clerkId: text("clerk_id").notNull().unique(),
  paystackCustomerCode: text("paystack_customer_code"),
  email: text("email").notNull(),
  name: text("name"),
  role: text("role", { enum: ["user", "admin", "provider", "verifier"] }).notNull().default("user"),
  status: text("status", { enum: ["active", "suspended", "banned"] }).notNull().default("active"),
  country: text("country"),
  location: text("location"),
  lastLoginAt: integer("last_login_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const subscriptions = sqliteTable("subscriptions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id),
  planId: text("plan_id").references(() => subscriptionPlans.id),
  paystackSubscriptionCode: text("paystack_subscription_code").notNull(),
  planCode: text("plan_code").notNull(),
  status: text("status", { enum: ["active", "cancelled", "past_due", "trialing"] }).notNull().default("active"),
  currentPeriodEnd: integer("current_period_end", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const apiKeys = sqliteTable("api_keys", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  keyHash: text("key_hash").notNull(),
  keyPrefix: text("key_prefix").notNull(),
  lastFour: text("last_four").notNull(),
  lastUsedAt: integer("last_used_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Subscription Plans ────────────────────────────────────────

export const subscriptionPlans = sqliteTable("subscription_plans", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  price: real("price").notNull().default(0),
  support: text("support", { enum: ["community", "email", "priority", "dedicated"] }).notNull().default("community"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  hoursPerMonth: integer("hours_per_month").notNull().default(10),
  instances: integer("instances").notNull().default(2),
  maxConcurrentInstances: integer("max_concurrent_instances").notNull().default(1),
  allowedCpuAccess: text("allowed_cpu_access").notNull().default("0"),
  allowedGpuAccess: text("allowed_gpu_access").notNull().default("0"),
  maxCpuCores: integer("max_cpu_cores").notNull().default(4),
  maxGpuCount: integer("max_gpu_count").notNull().default(0),
  maxStorageGb: integer("max_storage_gb").notNull().default(10),
  maxRamGb: integer("max_ram_gb").notNull().default(4),
  minCpuPowScore: real("min_cpu_pow_score").notNull().default(0),
  minGpuPowScore: real("min_gpu_pow_score").notNull().default(0),
  gpuVramGb: integer("gpu_vram_gb").notNull().default(0),
  gpuCudaCores: integer("gpu_cuda_cores").notNull().default(0),
  gpuTensorCores: integer("gpu_tensor_cores").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Miners (Compute Providers) ────────────────────────────────

export const miners = sqliteTable("miners", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  location: text("location"),
  description: text("description"),
  status: text("status", { enum: ["active", "inactive", "suspended"] }).notNull().default("active"),
  hotkey: text("hotkey"),
  coldkey: text("coldkey"),
  minerUid: text("miner_uid"),
  subnetUid: text("subnet_uid"),
  totalEarnings: real("total_earnings").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Compute Resources ─────────────────────────────────────────

export const computeResources = sqliteTable("compute_resources", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  minerId: text("miner_id").notNull().references(() => miners.id),
  resourceType: text("resource_type", { enum: ["cpu", "gpu"] }).notNull(),

  // Verification status (triple approval)
  validationStatus: text("validation_status", { enum: ["pending", "verified", "rejected"] }).notNull().default("pending"),
  verifierStatus: text("verifier_status", { enum: ["pending", "verified", "rejected"] }).notNull().default("pending"),
  adminApprovalStatus: text("admin_approval_status", { enum: ["pending", "verified", "rejected"] }).notNull().default("pending"),
  isBlacklisted: integer("is_blacklisted", { mode: "boolean" }).notNull().default(false),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),

  // CPU specs
  cpuModel: text("cpu_model"),
  cpuCores: integer("cpu_cores"),
  cpuThreads: integer("cpu_threads"),
  cpuArchitecture: text("cpu_architecture"),

  // GPU specs
  gpuModel: text("gpu_model"),
  gpuCount: integer("gpu_count"),
  gpuVramGb: integer("gpu_vram_gb"),
  gpuCudaCores: integer("gpu_cuda_cores"),
  gpuTensorCores: integer("gpu_tensor_cores"),

  // Memory & storage
  ramGb: integer("ram_gb"),
  storageGb: integer("storage_gb"),
  storageType: text("storage_type"),

  // Network
  publicIp: text("public_ip"),
  sshPort: integer("ssh_port"),
  sshUsername: text("ssh_username"),
  rentalPort: integer("rental_port"),

  // Performance
  cpuPowScore: real("cpu_pow_score"),
  gpuPowScore: real("gpu_pow_score"),
  dockerReady: integer("docker_ready", { mode: "boolean" }).notNull().default(false),
  connectionRtt: integer("connection_rtt"),

  // Pricing
  hourlyPrice: real("hourly_price"),
  allowMining: integer("allow_mining", { mode: "boolean" }).notNull().default(true),

  // Rental state
  rentalUserId: text("rental_user_id").references(() => users.id),
  rentalStartDate: integer("rental_start_date", { mode: "timestamp" }),
  rentalEndDate: integer("rental_end_date", { mode: "timestamp" }),
  containerId: text("container_id"),

  // Location
  region: text("region"),
  country: text("country"),

  // Verification notes
  verificationNotes: text("verification_notes"),
  adminNotes: text("admin_notes"),

  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Containers (Deployed Instances) ───────────────────────────

export const containers = sqliteTable("containers", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id),
  minerId: text("miner_id").references(() => miners.id),
  resourceId: text("resource_id").references(() => computeResources.id),
  subscriptionId: text("subscription_id").references(() => subscriptions.id),
  templateId: text("template_id").references(() => templates.id),

  // Status
  status: text("status", { enum: ["pending", "running", "stopped", "terminated", "failed"] }).notNull().default("pending"),
  paymentStatus: text("payment_status", { enum: ["pending", "paid", "failed", "refunded"] }).notNull().default("pending"),

  // Connection
  host: text("host"),
  port: integer("port"),
  sshUsername: text("ssh_username"),
  sshPassword: text("ssh_password"),
  sshKeyFingerprint: text("ssh_key_fingerprint"),
  authMethod: text("auth_method", { enum: ["key", "password", "both"] }).notNull().default("key"),

  // Container info
  image: text("image"),
  containerName: text("container_name"),
  jupyterUrl: text("jupyter_url"),
  jupyterToken: text("jupyter_token"),
  accessUrls: text("access_urls"), // JSON

  // Lifecycle
  duration: text("duration"), // JSON: { hours, minutes }
  errorMessage: text("error_message"),
  startedAt: integer("started_at", { mode: "timestamp" }),
  stoppedAt: integer("stopped_at", { mode: "timestamp" }),
  expiresAt: integer("expires_at", { mode: "timestamp" }),
  scheduledTermination: integer("scheduled_termination", { mode: "timestamp" }),

  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Templates ─────────────────────────────────────────────────

export const templates = sqliteTable("templates", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  image: text("image").notNull(),
  logoUrl: text("logo_url"),
  ports: text("ports"), // JSON array
  services: text("services"), // JSON object
  gpuRequired: integer("gpu_required", { mode: "boolean" }).notNull().default(false),
  minGpuMemory: text("min_gpu_memory"),
  deploymentType: text("deployment_type", { enum: ["docker_based", "script_based"] }).notNull().default("docker_based"),
  scriptPath: text("script_path"),
  scriptConfig: text("script_config"), // JSON
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Heartbeats ────────────────────────────────────────────────

export const heartbeats = sqliteTable("heartbeats", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  resourceId: text("resource_id").notNull().references(() => computeResources.id),
  isOnline: integer("is_online", { mode: "boolean" }).notNull().default(false),
  health: text("health", { enum: ["healthy", "warning", "critical"] }).notNull().default("healthy"),
  hasInternet: integer("has_internet", { mode: "boolean" }).notNull().default(true),
  uptimeHours: real("uptime_hours"),
  cpuUsagePercent: real("cpu_usage_percent"),
  memoryUsagePercent: real("memory_usage_percent"),
  gpuUsagePercent: real("gpu_usage_percent"),
  gpuTempCelsius: real("gpu_temp_celsius"),
  externalIp: text("external_ip"),
  watchtowerDeployed: integer("watchtower_deployed", { mode: "boolean" }).notNull().default(false),
  lastUpdatedAt: integer("last_updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── SSH Keys ──────────────────────────────────────────────────

export const sshKeys = sqliteTable("ssh_keys", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  publicKey: text("public_key").notNull(),
  fingerprint: text("fingerprint"),
  isDefault: integer("is_default", { mode: "boolean" }).notNull().default(false),
  lastUsedAt: integer("last_used_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Usage Sessions ────────────────────────────────────────────

export const usageSessions = sqliteTable("usage_sessions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id),
  containerId: text("container_id").references(() => containers.id),
  resourceId: text("resource_id").references(() => computeResources.id),
  status: text("status", { enum: ["pending", "active", "completed", "terminated", "failed"] }).notNull().default("pending"),
  durationHours: real("duration_hours"),
  cost: real("cost"),
  startedAt: integer("started_at", { mode: "timestamp" }),
  endedAt: integer("ended_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Payments ──────────────────────────────────────────────────

export const payments = sqliteTable("payments", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id),
  subscriptionId: text("subscription_id").references(() => subscriptions.id),
  paystackReference: text("paystack_reference"),
  amount: integer("amount").notNull(), // in kobo (smallest unit)
  currency: text("currency").notNull().default("NGN"),
  status: text("status", { enum: ["pending", "succeeded", "failed", "refunded"] }).notNull().default("pending"),
  paymentMethod: text("payment_method"),
  description: text("description"),
  metadata: text("metadata"), // JSON
  refundedAmount: integer("refunded_amount"),
  refundReason: text("refund_reason"),
  processedAt: integer("processed_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Activity Log ──────────────────────────────────────────────

export const activityLog = sqliteTable("activity_log", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").references(() => users.id),
  event: text("event").notNull(),
  description: text("description"),
  subjectType: text("subject_type"), // e.g., "compute_resource", "container"
  subjectId: text("subject_id"),
  metadata: text("metadata"), // JSON
  ipAddress: text("ip_address"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ─── Type Exports ──────────────────────────────────────────────

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
export type ApiKey = typeof apiKeys.$inferSelect;
export type NewApiKey = typeof apiKeys.$inferInsert;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type NewSubscriptionPlan = typeof subscriptionPlans.$inferInsert;
export type Miner = typeof miners.$inferSelect;
export type NewMiner = typeof miners.$inferInsert;
export type ComputeResource = typeof computeResources.$inferSelect;
export type NewComputeResource = typeof computeResources.$inferInsert;
export type Container = typeof containers.$inferSelect;
export type NewContainer = typeof containers.$inferInsert;
export type Template = typeof templates.$inferSelect;
export type NewTemplate = typeof templates.$inferInsert;
export type Heartbeat = typeof heartbeats.$inferSelect;
export type NewHeartbeat = typeof heartbeats.$inferInsert;
export type SshKey = typeof sshKeys.$inferSelect;
export type NewSshKey = typeof sshKeys.$inferInsert;
export type UsageSession = typeof usageSessions.$inferSelect;
export type NewUsageSession = typeof usageSessions.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
export type ActivityLogEntry = typeof activityLog.$inferSelect;
export type NewActivityLogEntry = typeof activityLog.$inferInsert;
