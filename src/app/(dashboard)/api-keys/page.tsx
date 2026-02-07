"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KeyRound, Plus, Copy, Check, Trash2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  lastFour: string;
  createdAt: Date;
  lastUsedAt: Date | null;
  status: "active" | "expired";
}

const PLACEHOLDER_KEYS: ApiKey[] = [
  {
    id: "1",
    name: "Production Server",
    keyPrefix: "gh_live_",
    lastFour: "x9k2",
    createdAt: new Date("2025-12-01"),
    lastUsedAt: new Date("2026-02-06"),
    status: "active",
  },
  {
    id: "2",
    name: "Development",
    keyPrefix: "gh_test_",
    lastFour: "m4p7",
    createdAt: new Date("2026-01-15"),
    lastUsedAt: new Date("2026-02-05"),
    status: "active",
  },
  {
    id: "3",
    name: "CI/CD Pipeline",
    keyPrefix: "gh_live_",
    lastFour: "j3w1",
    createdAt: new Date("2025-08-20"),
    lastUsedAt: null,
    status: "expired",
  },
];

function generateKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "gh_live_";
  for (let i = 0; i < 40; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function formatDate(date: Date | null): string {
  if (!date) return "Never";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(date);
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>(PLACEHOLDER_KEYS);
  const [isCreating, setIsCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  function handleCreateKey() {
    if (!newKeyName.trim()) return;

    const fullKey = generateKey();
    const newKey: ApiKey = {
      id: crypto.randomUUID(),
      name: newKeyName.trim(),
      keyPrefix: fullKey.slice(0, 8),
      lastFour: fullKey.slice(-4),
      createdAt: new Date(),
      lastUsedAt: null,
      status: "active",
    };

    setKeys((prev) => [newKey, ...prev]);
    setRevealedKey(fullKey);
    setNewKeyName("");
    setIsCreating(false);
  }

  async function handleCopy(text: string, keyId: string) {
    await navigator.clipboard.writeText(text);
    setCopiedKeyId(keyId);
    setTimeout(() => setCopiedKeyId(null), 2000);
  }

  function handleDelete(id: string) {
    setKeys((prev) => prev.filter((k) => k.id !== id));
    setDeleteConfirmId(null);
    if (revealedKey) setRevealedKey(null);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-moss">API Keys</h1>
          <p className="mt-1 text-muted-foreground">
            Create and manage API keys for programmatic access.
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create API Key
        </Button>
      </div>

      {/* Create key dialog */}
      {isCreating && (
        <Card className="border-forest/30">
          <CardHeader>
            <CardTitle className="text-base">Create New API Key</CardTitle>
            <CardDescription>
              Give your key a descriptive name so you can identify it later.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label
                htmlFor="key-name"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Key Name
              </label>
              <input
                id="key-name"
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateKey()}
                placeholder="e.g. Production Server, CI/CD Pipeline"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-forest/50"
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateKey} disabled={!newKeyName.trim()}>
                Generate Key
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsCreating(false);
                  setNewKeyName("");
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Revealed key banner */}
      {revealedKey && (
        <Card className="border-copper/40 bg-copper/5">
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-2 text-copper">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-semibold">
                Copy your API key now. It won&apos;t be shown again.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm text-foreground">
                {revealedKey}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(revealedKey, "revealed")}
                className="gap-1.5"
              >
                {copiedKeyId === "revealed" ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-fern" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRevealedKey(null)}
              >
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Keys list */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <KeyRound className="h-5 w-5 text-forest" />
            Your API Keys
          </CardTitle>
          <CardDescription>
            {keys.length === 0
              ? "No API keys yet. Create one to get started."
              : `${keys.filter((k) => k.status === "active").length} active key${keys.filter((k) => k.status === "active").length !== 1 ? "s" : ""}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {keys.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <KeyRound className="mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                No API keys created yet.
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 gap-1.5"
                onClick={() => setIsCreating(true)}
              >
                <Plus className="h-3.5 w-3.5" />
                Create your first key
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {keys.map((key) => (
                <div
                  key={key.id}
                  className={cn(
                    "flex flex-col gap-3 rounded-lg border border-border p-4 transition-colors sm:flex-row sm:items-center sm:justify-between",
                    key.status === "expired" && "opacity-60"
                  )}
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">
                        {key.name}
                      </span>
                      <Badge
                        variant={
                          key.status === "active" ? "success" : "warning"
                        }
                      >
                        {key.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <code className="rounded bg-mist px-1.5 py-0.5 font-mono">
                        {key.keyPrefix}...{key.lastFour}
                      </code>
                      <span>Created {formatDate(key.createdAt)}</span>
                      <span>Last used {formatDate(key.lastUsedAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleCopy(
                          `${key.keyPrefix}${"*".repeat(32)}${key.lastFour}`,
                          key.id
                        )
                      }
                      className="gap-1.5"
                    >
                      {copiedKeyId === key.id ? (
                        <Check className="h-3.5 w-3.5 text-fern" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                    {deleteConfirmId === key.id ? (
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(key.id)}
                          className="text-red-400 hover:bg-red-900/20 hover:text-red-300"
                        >
                          Confirm
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteConfirmId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirmId(key.id)}
                        className="text-muted-foreground hover:text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
