"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  KeyRound,
  Plus,
  Copy,
  Check,
  Trash2,
  Star,
  Shield,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SshKey {
  id: string;
  name: string;
  fingerprint: string;
  publicKeyPreview: string;
  createdAt: Date;
  isDefault: boolean;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_SSH_KEYS: SshKey[] = [
  {
    id: "key-1",
    name: "MacBook Pro",
    fingerprint: "SHA256:xK9m3RqPvT7wLjN2sDfG8hYcBnM4kXaZ6uEiO1pW5Qo",
    publicKeyPreview: "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIHkPx...",
    createdAt: new Date("2026-01-10"),
    isDefault: true,
  },
  {
    id: "key-2",
    name: "Work Desktop (Lagos Office)",
    fingerprint: "SHA256:Rp4v2WqXsT6yNhK8mLjF3dGcBn7eZaU0iOxP9wM1rVt",
    publicKeyPreview: "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC...",
    createdAt: new Date("2026-01-22"),
    isDefault: false,
  },
  {
    id: "key-3",
    name: "CI/CD Deploy Key",
    fingerprint: "SHA256:Jm5nQ8sYwK2pL7rTvXaG1bHcD9fEiO3uZ0kN6xR4WtM",
    publicKeyPreview: "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIDvq8...",
    createdAt: new Date("2026-02-01"),
    isDefault: false,
  },
];

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(date);
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function SshKeysPage() {
  const [keys, setKeys] = useState<SshKey[]>(MOCK_SSH_KEYS);
  const [isAdding, setIsAdding] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyPublic, setNewKeyPublic] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  async function handleCopy(text: string, id: string) {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function handleAddKey() {
    if (!newKeyName.trim() || !newKeyPublic.trim()) return;

    // Generate a mock fingerprint
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let fp = "SHA256:";
    for (let i = 0; i < 43; i++) {
      fp += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const newKey: SshKey = {
      id: crypto.randomUUID(),
      name: newKeyName.trim(),
      fingerprint: fp,
      publicKeyPreview:
        newKeyPublic.trim().length > 50
          ? newKeyPublic.trim().slice(0, 50) + "..."
          : newKeyPublic.trim(),
      createdAt: new Date(),
      isDefault: keys.length === 0,
    };

    setKeys((prev) => [newKey, ...prev]);
    setNewKeyName("");
    setNewKeyPublic("");
    setIsAdding(false);
  }

  function handleDelete(id: string) {
    setKeys((prev) => prev.filter((k) => k.id !== id));
    setDeleteConfirmId(null);
  }

  function handleSetDefault(id: string) {
    setKeys((prev) =>
      prev.map((k) => ({
        ...k,
        isDefault: k.id === id,
      }))
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">SSH Keys</h1>
          <p className="mt-1 text-muted-foreground">
            Manage SSH keys used to connect to your compute instances.
          </p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add SSH Key
        </Button>
      </div>

      {/* Add key form */}
      {isAdding && (
        <Card className="border-forest/30">
          <CardHeader>
            <CardTitle className="text-base">Add New SSH Key</CardTitle>
            <CardDescription>
              Paste your public SSH key. This will be used to authenticate when connecting to instances.
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
                placeholder="e.g. MacBook Pro, Work Desktop"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-forest/50"
                autoFocus
              />
            </div>
            <div>
              <label
                htmlFor="public-key"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Public Key
              </label>
              <textarea
                id="public-key"
                value={newKeyPublic}
                onChange={(e) => setNewKeyPublic(e.target.value)}
                placeholder="ssh-ed25519 AAAA... or ssh-rsa AAAA..."
                rows={4}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-forest/50 resize-none"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleAddKey}
                disabled={!newKeyName.trim() || !newKeyPublic.trim()}
              >
                Add Key
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsAdding(false);
                  setNewKeyName("");
                  setNewKeyPublic("");
                }}
              >
                Cancel
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
            Your SSH Keys
          </CardTitle>
          <CardDescription>
            {keys.length === 0
              ? "No SSH keys yet. Add one to get started."
              : `${keys.length} key${keys.length !== 1 ? "s" : ""} registered`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {keys.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Shield className="mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm font-medium text-foreground">No SSH keys added</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add an SSH key to securely connect to your compute instances.
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 gap-1.5"
                onClick={() => setIsAdding(true)}
              >
                <Plus className="h-3.5 w-3.5" />
                Add your first key
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {keys.map((key) => (
                <div
                  key={key.id}
                  className="flex flex-col gap-3 rounded-lg border border-border p-4 transition-colors sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <KeyRound className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="font-medium text-foreground">{key.name}</span>
                      {key.isDefault && (
                        <Badge variant="success" className="gap-1">
                          <Star className="h-2.5 w-2.5" />
                          Default
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <code className="rounded bg-mist px-1.5 py-0.5 font-mono">
                          {key.fingerprint.length > 30
                            ? key.fingerprint.slice(0, 30) + "..."
                            : key.fingerprint}
                        </code>
                        <button
                          onClick={() => handleCopy(key.fingerprint, key.id + "-fp")}
                          className="rounded p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                          title="Copy fingerprint"
                        >
                          {copiedId === key.id + "-fp" ? (
                            <Check className="h-3 w-3 text-fern" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                      <span>Added {formatDate(key.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {!key.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetDefault(key.id)}
                        className="gap-1.5 text-muted-foreground hover:text-foreground"
                      >
                        <Star className="h-3.5 w-3.5" />
                        Set Default
                      </Button>
                    )}

                    {deleteConfirmId === key.id ? (
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(key.id)}
                          className="text-red-400 hover:bg-red-900/20 hover:text-red-300"
                        >
                          Confirm Delete
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
