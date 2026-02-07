// ─── SSH Branding Injection Service ──────────────────────────
// Before exposing containers to users, inject Polaris Cloud branding
// (ASCII art, MOTD, welcome message) so users always see the
// Polaris Cloud identity when they connect.

// ─── ASCII Art ───────────────────────────────────────────────

export const POLARIS_ASCII = `
  ██████╗  ██████╗ ██╗      █████╗ ██████╗ ██╗███████╗
  ██╔══██╗██╔═══██╗██║     ██╔══██╗██╔══██╗██║██╔════╝
  ██████╔╝██║   ██║██║     ███████║██████╔╝██║███████╗
  ██╔═══╝ ██║   ██║██║     ██╔══██║██╔══██╗██║╚════██║
  ██║     ╚██████╔╝███████╗██║  ██║██║  ██║██║███████║
  ╚═╝      ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚══════╝
                            C L O U D
`;

export const POLARIS_MOTD = `
╔══════════════════════════════════════════════════════════════╗
║                    Welcome to Polaris Cloud                 ║
║                                                              ║
║   GPU/CPU Cloud Computing for Africa & Beyond               ║
║                                                              ║
║   Docs:    https://docs.polariscloud.ai                     ║
║   Support: support@polariscloud.ai                           ║
║   Status:  https://status.polariscloud.ai                    ║
║                                                              ║
║   Instance: {{INSTANCE_ID}}                                  ║
║   Region:   {{REGION}}                                       ║
║   Plan:     {{PLAN}}                                         ║
║   Expires:  {{EXPIRES}}                                      ║
╚══════════════════════════════════════════════════════════════╝
`;

// ─── Branding Scripts ────────────────────────────────────────

interface BrandingContext {
  instanceId: string;
  region: string;
  plan: string;
  expiresAt: string;
  username: string;
}

/**
 * Generate the MOTD content with context-specific values interpolated.
 */
export function generateMotd(ctx: BrandingContext): string {
  return POLARIS_MOTD
    .replace("{{INSTANCE_ID}}", ctx.instanceId)
    .replace("{{REGION}}", ctx.region)
    .replace("{{PLAN}}", ctx.plan)
    .replace("{{EXPIRES}}", ctx.expiresAt);
}

/**
 * Generate the shell commands to inject Polaris Cloud branding into a container.
 *
 * This is executed via SSH before the container is handed to the user.
 * It sets up:
 * - /etc/motd with Polaris Cloud ASCII art and instance info
 * - ~/.bashrc with Polaris Cloud welcome on login
 * - /etc/polaris/info.json with machine-readable instance metadata
 */
export function generateBrandingScript(ctx: BrandingContext): string {
  const motd = generateMotd(ctx);
  const asciiEscaped = POLARIS_ASCII.replace(/\\/g, "\\\\").replace(/'/g, "'\\''");
  const motdEscaped = motd.replace(/\\/g, "\\\\").replace(/'/g, "'\\''");

  return `#!/bin/bash
set -e

# ─── Polaris Cloud Branding Setup ──────────────────────────
# This script is run automatically before container handoff.

# Create Polaris info directory
mkdir -p /etc/polaris

# Write machine-readable instance info
cat > /etc/polaris/info.json << 'GHEOF'
{
  "provider": "Polaris Cloud",
  "instance_id": "${ctx.instanceId}",
  "region": "${ctx.region}",
  "plan": "${ctx.plan}",
  "expires_at": "${ctx.expiresAt}",
  "support": "support@polariscloud.ai",
  "docs": "https://docs.polariscloud.ai"
}
GHEOF

# Set the MOTD (displayed on SSH login)
cat > /etc/motd << 'MOTDEOF'
${asciiEscaped}
${motdEscaped}
MOTDEOF

# Add Polaris Cloud welcome to bashrc for the user
BASHRC_PATH="/home/${ctx.username}/.bashrc"
if [ ! -f "$BASHRC_PATH" ]; then
  BASHRC_PATH="/root/.bashrc"
fi

# Only add if not already present
if ! grep -q "POLARIS_BRANDED" "$BASHRC_PATH" 2>/dev/null; then
  cat >> "$BASHRC_PATH" << 'RCEOF'

# POLARIS_BRANDED
export PS1='\\[\\033[0;32m\\]polaris\\[\\033[0m\\]:\\[\\033[0;34m\\]\\w\\[\\033[0m\\]\\$ '
alias polaris-info='cat /etc/polaris/info.json | python3 -m json.tool 2>/dev/null || cat /etc/polaris/info.json'
alias polaris-help='echo "Polaris Cloud Commands:" && echo "  polaris-info   - Show instance details" && echo "  polaris-help   - Show this help" && echo "" && echo "Support: support@polariscloud.ai" && echo "Docs:    https://docs.polariscloud.ai"'
RCEOF
fi

# Set hostname to polaris-branded name
hostname "pl-${ctx.instanceId}" 2>/dev/null || true

echo "Polaris Cloud branding applied successfully."
`;
}

/**
 * Generate a compact one-liner version for quick injection via SSH exec.
 * Used when we only have a single SSH command execution window.
 */
export function generateBrandingOneliner(ctx: BrandingContext): string {
  const motd = generateMotd(ctx);
  const lines = [
    `mkdir -p /etc/polaris`,
    `echo '{"provider":"Polaris Cloud","instance_id":"${ctx.instanceId}","region":"${ctx.region}","plan":"${ctx.plan}"}' > /etc/polaris/info.json`,
    `printf '%s\\n' '${POLARIS_ASCII.replace(/'/g, "'\\''")}' > /etc/motd`,
    `echo 'export PS1="\\033[0;32mpolaris\\033[0m:\\033[0;34m\\w\\033[0m\\$ "' >> /home/${ctx.username}/.bashrc 2>/dev/null || echo 'export PS1="\\033[0;32mpolaris\\033[0m:\\033[0;34m\\w\\033[0m\\$ "' >> /root/.bashrc`,
  ];
  return lines.join(" && ");
}

/**
 * Commands to remove branding from a container (cleanup on termination).
 */
export function generateCleanupScript(): string {
  return `#!/bin/bash
rm -rf /etc/polaris
sed -i '/POLARIS_BRANDED/,+5d' /root/.bashrc 2>/dev/null || true
sed -i '/POLARIS_BRANDED/,+5d' /home/*/.bashrc 2>/dev/null || true
echo "" > /etc/motd 2>/dev/null || true
`;
}
