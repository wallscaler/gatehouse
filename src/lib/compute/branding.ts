// ─── SSH Branding Injection Service ──────────────────────────
// Before exposing containers to users, inject Gatehouse branding
// (ASCII art, MOTD, welcome message) so users always see the
// Gatehouse identity when they connect.

// ─── ASCII Art ───────────────────────────────────────────────

export const GATEHOUSE_ASCII = `
   ██████╗  █████╗ ████████╗███████╗██╗  ██╗ ██████╗ ██╗   ██╗███████╗███████╗
  ██╔════╝ ██╔══██╗╚══██╔══╝██╔════╝██║  ██║██╔═══██╗██║   ██║██╔════╝██╔════╝
  ██║  ███╗███████║   ██║   █████╗  ███████║██║   ██║██║   ██║███████╗█████╗
  ██║   ██║██╔══██║   ██║   ██╔══╝  ██╔══██║██║   ██║██║   ██║╚════██║██╔══╝
  ╚██████╔╝██║  ██║   ██║   ███████╗██║  ██║╚██████╔╝╚██████╔╝███████║███████╗
   ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚══════╝╚══════╝
                            C L O U D
`;

export const GATEHOUSE_MOTD = `
╔══════════════════════════════════════════════════════════════╗
║                    Welcome to Gatehouse Cloud                ║
║                                                              ║
║   GPU/CPU Cloud Computing for Africa & Beyond               ║
║                                                              ║
║   Docs:    https://docs.gatehouse.cloud                     ║
║   Support: support@gatehouse.cloud                           ║
║   Status:  https://status.gatehouse.cloud                    ║
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
  return GATEHOUSE_MOTD
    .replace("{{INSTANCE_ID}}", ctx.instanceId)
    .replace("{{REGION}}", ctx.region)
    .replace("{{PLAN}}", ctx.plan)
    .replace("{{EXPIRES}}", ctx.expiresAt);
}

/**
 * Generate the shell commands to inject Gatehouse branding into a container.
 *
 * This is executed via SSH before the container is handed to the user.
 * It sets up:
 * - /etc/motd with Gatehouse ASCII art and instance info
 * - ~/.bashrc with Gatehouse welcome on login
 * - /etc/gatehouse/info.json with machine-readable instance metadata
 */
export function generateBrandingScript(ctx: BrandingContext): string {
  const motd = generateMotd(ctx);
  const asciiEscaped = GATEHOUSE_ASCII.replace(/\\/g, "\\\\").replace(/'/g, "'\\''");
  const motdEscaped = motd.replace(/\\/g, "\\\\").replace(/'/g, "'\\''");

  return `#!/bin/bash
set -e

# ─── Gatehouse Cloud Branding Setup ──────────────────────────
# This script is run automatically before container handoff.

# Create Gatehouse info directory
mkdir -p /etc/gatehouse

# Write machine-readable instance info
cat > /etc/gatehouse/info.json << 'GHEOF'
{
  "provider": "Gatehouse Cloud",
  "instance_id": "${ctx.instanceId}",
  "region": "${ctx.region}",
  "plan": "${ctx.plan}",
  "expires_at": "${ctx.expiresAt}",
  "support": "support@gatehouse.cloud",
  "docs": "https://docs.gatehouse.cloud"
}
GHEOF

# Set the MOTD (displayed on SSH login)
cat > /etc/motd << 'MOTDEOF'
${asciiEscaped}
${motdEscaped}
MOTDEOF

# Add Gatehouse welcome to bashrc for the user
BASHRC_PATH="/home/${ctx.username}/.bashrc"
if [ ! -f "$BASHRC_PATH" ]; then
  BASHRC_PATH="/root/.bashrc"
fi

# Only add if not already present
if ! grep -q "GATEHOUSE_BRANDED" "$BASHRC_PATH" 2>/dev/null; then
  cat >> "$BASHRC_PATH" << 'RCEOF'

# GATEHOUSE_BRANDED
export PS1='\\[\\033[0;32m\\]gatehouse\\[\\033[0m\\]:\\[\\033[0;34m\\]\\w\\[\\033[0m\\]\\$ '
alias gatehouse-info='cat /etc/gatehouse/info.json | python3 -m json.tool 2>/dev/null || cat /etc/gatehouse/info.json'
alias gatehouse-help='echo "Gatehouse Cloud Commands:" && echo "  gatehouse-info   - Show instance details" && echo "  gatehouse-help   - Show this help" && echo "" && echo "Support: support@gatehouse.cloud" && echo "Docs:    https://docs.gatehouse.cloud"'
RCEOF
fi

# Set hostname to gatehouse-branded name
hostname "gh-${ctx.instanceId}" 2>/dev/null || true

echo "Gatehouse branding applied successfully."
`;
}

/**
 * Generate a compact one-liner version for quick injection via SSH exec.
 * Used when we only have a single SSH command execution window.
 */
export function generateBrandingOneliner(ctx: BrandingContext): string {
  const motd = generateMotd(ctx);
  const lines = [
    `mkdir -p /etc/gatehouse`,
    `echo '{"provider":"Gatehouse Cloud","instance_id":"${ctx.instanceId}","region":"${ctx.region}","plan":"${ctx.plan}"}' > /etc/gatehouse/info.json`,
    `printf '%s\\n' '${GATEHOUSE_ASCII.replace(/'/g, "'\\''")}' > /etc/motd`,
    `echo 'export PS1="\\033[0;32mgatehouse\\033[0m:\\033[0;34m\\w\\033[0m\\$ "' >> /home/${ctx.username}/.bashrc 2>/dev/null || echo 'export PS1="\\033[0;32mgatehouse\\033[0m:\\033[0;34m\\w\\033[0m\\$ "' >> /root/.bashrc`,
  ];
  return lines.join(" && ");
}

/**
 * Commands to remove branding from a container (cleanup on termination).
 */
export function generateCleanupScript(): string {
  return `#!/bin/bash
rm -rf /etc/gatehouse
sed -i '/GATEHOUSE_BRANDED/,+5d' /root/.bashrc 2>/dev/null || true
sed -i '/GATEHOUSE_BRANDED/,+5d' /home/*/.bashrc 2>/dev/null || true
echo "" > /etc/motd 2>/dev/null || true
`;
}
