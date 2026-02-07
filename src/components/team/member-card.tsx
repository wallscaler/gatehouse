"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MoreVertical, UserMinus, Shield } from "lucide-react";
import { useState } from "react";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Member";
  joinedAt: string;
}

interface MemberCardProps {
  member: TeamMember;
  onChangeRole?: (id: string, role: TeamMember["role"]) => void;
  onRemove?: (id: string) => void;
}

function getInitial(name: string) {
  return name.charAt(0).toUpperCase();
}

function avatarColor(role: TeamMember["role"]) {
  switch (role) {
    case "Owner":
      return "bg-forest text-white";
    case "Admin":
      return "bg-copper/20 text-copper";
    case "Member":
      return "bg-mist text-muted-foreground";
  }
}

function roleBadgeClass(role: TeamMember["role"]) {
  switch (role) {
    case "Owner":
      return "bg-forest/15 text-forest";
    case "Admin":
      return "bg-copper/15 text-copper";
    case "Member":
      return "";
  }
}

export function MemberCard({ member, onChangeRole, onRemove }: MemberCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Card className="relative flex items-center gap-4 p-4">
      {/* Avatar */}
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
          avatarColor(member.role)
        )}
      >
        {getInitial(member.name)}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-foreground">
            {member.name}
          </span>
          <Badge className={cn("shrink-0", roleBadgeClass(member.role))}>
            {member.role}
          </Badge>
        </div>
        <p className="truncate text-xs text-muted-foreground">{member.email}</p>
        <p className="mt-0.5 text-xs text-muted-foreground/60">
          Joined {member.joinedAt}
        </p>
      </div>

      {/* Actions (hidden for Owner) */}
      {member.role !== "Owner" && (
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>

          {menuOpen && (
            <>
              {/* Backdrop to close menu */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-full z-50 mt-1 w-44 rounded-lg border border-border bg-card p-1 shadow-lg">
                <button
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-mist"
                  onClick={() => {
                    const newRole = member.role === "Admin" ? "Member" : "Admin";
                    onChangeRole?.(member.id, newRole);
                    setMenuOpen(false);
                  }}
                >
                  <Shield className="h-3.5 w-3.5" />
                  Make {member.role === "Admin" ? "Member" : "Admin"}
                </button>
                <button
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-400 hover:bg-red-900/20"
                  onClick={() => {
                    onRemove?.(member.id);
                    setMenuOpen(false);
                  }}
                >
                  <UserMinus className="h-3.5 w-3.5" />
                  Remove member
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </Card>
  );
}
