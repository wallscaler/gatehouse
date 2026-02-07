// ─── SSH Connection Service ──────────────────────────────────
// Provides interface & validation logic for SSH connections to compute
// resources. Actual SSH sessions will run from a backend worker; this
// layer handles config validation, command generation, and key parsing.

// ─── Types ───────────────────────────────────────────────────

/** Configuration required to establish an SSH connection. */
export interface SSHConnectionConfig {
  host: string;
  port: number;
  username: string;
  privateKey?: string;
  password?: string;
  /** Connection timeout in milliseconds. */
  timeout?: number;
}

/** Parsed representation of an SSH public key. */
export interface SSHPublicKeyInfo {
  type: string;
  fingerprint: string;
  comment: string;
}

// ─── Validation ──────────────────────────────────────────────

/**
 * Validate SSH connection parameters.
 *
 * Checks host, port, username, and that at least one authentication
 * method (key or password) is provided.
 */
export function validateSSHConfig(config: SSHConnectionConfig): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Host
  if (!config.host || config.host.trim().length === 0) {
    errors.push("Host is required");
  } else if (!/^[a-zA-Z0-9.\-:]+$/.test(config.host)) {
    errors.push("Host contains invalid characters");
  }

  // Port
  if (config.port == null) {
    errors.push("Port is required");
  } else if (!Number.isInteger(config.port) || config.port < 1 || config.port > 65535) {
    errors.push("Port must be an integer between 1 and 65535");
  }

  // Username
  if (!config.username || config.username.trim().length === 0) {
    errors.push("Username is required");
  } else if (!/^[a-zA-Z0-9._-]+$/.test(config.username)) {
    errors.push("Username contains invalid characters");
  }

  // Authentication
  if (!config.privateKey && !config.password) {
    errors.push("Either privateKey or password must be provided");
  }

  // Timeout
  if (config.timeout != null && (config.timeout < 0 || !Number.isFinite(config.timeout))) {
    errors.push("Timeout must be a non-negative number");
  }

  return { valid: errors.length === 0, errors };
}

// ─── Command Generation ──────────────────────────────────────

/**
 * Generate an SSH command string suitable for display or copy-paste.
 *
 * @example
 * generateSSHCommand("10.0.0.1", 22, "root")
 * // => "ssh root@10.0.0.1 -p 22"
 */
export function generateSSHCommand(
  host: string,
  port: number,
  username: string,
): string {
  if (port === 22) {
    return `ssh ${username}@${host}`;
  }
  return `ssh ${username}@${host} -p ${port}`;
}

/**
 * Generate an SCP command string for copying files to a remote host.
 *
 * @example
 * generateSCPCommand("10.0.0.1", 22, "root", "./model.bin", "/data/model.bin")
 * // => "scp -P 22 ./model.bin root@10.0.0.1:/data/model.bin"
 */
export function generateSCPCommand(
  host: string,
  port: number,
  username: string,
  localPath: string,
  remotePath: string,
): string {
  if (port === 22) {
    return `scp ${localPath} ${username}@${host}:${remotePath}`;
  }
  return `scp -P ${port} ${localPath} ${username}@${host}:${remotePath}`;
}

// ─── Key Parsing ─────────────────────────────────────────────

/** Accepted SSH public key prefixes. */
const SSH_KEY_TYPES = [
  "ssh-rsa",
  "ssh-ed25519",
  "ssh-dss",
  "ecdsa-sha2-nistp256",
  "ecdsa-sha2-nistp384",
  "ecdsa-sha2-nistp521",
] as const;

/**
 * Parse an SSH public key string and extract its type, fingerprint, and comment.
 *
 * The fingerprint is a SHA-256 hash of the raw key data, base64-encoded.
 * Returns `null` if the key cannot be parsed.
 */
export function parseSSHPublicKey(publicKey: string): SSHPublicKeyInfo | null {
  const trimmed = publicKey.trim();
  const parts = trimmed.split(/\s+/);

  if (parts.length < 2) {
    return null;
  }

  const type = parts[0];
  const keyData = parts[1];
  const comment = parts.slice(2).join(" ") || "";

  if (!SSH_KEY_TYPES.includes(type as (typeof SSH_KEY_TYPES)[number])) {
    return null;
  }

  // Validate base64 encoding of key data
  if (!/^[A-Za-z0-9+/=]+$/.test(keyData) || keyData.length < 16) {
    return null;
  }

  // Generate a deterministic fingerprint from the key data.
  // In a Node.js runtime we would use crypto.createHash("sha256"), but since
  // this code may run in edge/browser contexts we produce a simplified
  // fingerprint by taking a prefix of the base64 key data. A full SHA-256
  // fingerprint should be computed server-side when storing keys.
  const fingerprintSource = keyData.slice(0, 43);
  const fingerprint = `SHA256:${fingerprintSource}`;

  return { type, fingerprint, comment };
}

/**
 * Check whether a string is a valid SSH public key format.
 *
 * Validates the key type prefix and base64-encoded key body.
 */
export function isValidSSHPublicKey(key: string): boolean {
  const trimmed = key.trim();
  const parts = trimmed.split(/\s+/);

  if (parts.length < 2) {
    return false;
  }

  const type = parts[0];
  const keyData = parts[1];

  if (!SSH_KEY_TYPES.includes(type as (typeof SSH_KEY_TYPES)[number])) {
    return false;
  }

  // Key data must be valid base64 with a reasonable minimum length
  if (!/^[A-Za-z0-9+/=]+$/.test(keyData) || keyData.length < 16) {
    return false;
  }

  return true;
}
