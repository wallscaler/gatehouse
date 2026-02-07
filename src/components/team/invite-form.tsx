"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Send, X } from "lucide-react";

interface InviteFormProps {
  onInvite: (email: string, role: "Admin" | "Member") => void;
  onCancel: () => void;
}

export function InviteForm({ onInvite, onCancel }: InviteFormProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"Admin" | "Member">("Member");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    onInvite(email.trim(), role);
    setEmail("");
    setRole("Member");
  }

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          {/* Email input */}
          <div className="flex-1">
            <label
              htmlFor="invite-email"
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              Email address
            </label>
            <input
              id="invite-email"
              type="email"
              required
              placeholder="colleague@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-muted px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
            />
          </div>

          {/* Role select */}
          <div className="w-full sm:w-36">
            <label
              htmlFor="invite-role"
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              Role
            </label>
            <select
              id="invite-role"
              value={role}
              onChange={(e) => setRole(e.target.value as "Admin" | "Member")}
              className="h-10 w-full rounded-lg border border-border bg-muted px-3 text-sm text-foreground focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
            >
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button type="submit" size="sm" className="gap-1.5">
            <Send className="h-3.5 w-3.5" />
            Send invite
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            <X className="mr-1 h-3.5 w-3.5" />
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
