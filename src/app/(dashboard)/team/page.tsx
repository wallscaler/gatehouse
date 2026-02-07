"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MemberCard, type TeamMember } from "@/components/team/member-card";
import { InviteForm } from "@/components/team/invite-form";
import { UserPlus, Users } from "lucide-react";

const initialMembers: TeamMember[] = [
  {
    id: "1",
    name: "Adaeze Okonkwo",
    email: "adaeze@polariscloud.ai",
    role: "Owner",
    joinedAt: "Jan 3, 2026",
  },
  {
    id: "2",
    name: "Marcus Chen",
    email: "marcus@polariscloud.ai",
    role: "Admin",
    joinedAt: "Jan 15, 2026",
  },
  {
    id: "3",
    name: "Sofia Petrov",
    email: "sofia@polariscloud.ai",
    role: "Member",
    joinedAt: "Jan 28, 2026",
  },
  {
    id: "4",
    name: "James Abiola",
    email: "james@polariscloud.ai",
    role: "Member",
    joinedAt: "Feb 1, 2026",
  },
];

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [showInvite, setShowInvite] = useState(false);

  function handleChangeRole(id: string, newRole: TeamMember["role"]) {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, role: newRole } : m))
    );
  }

  function handleRemove(id: string) {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  function handleInvite(email: string, role: "Admin" | "Member") {
    const newMember: TeamMember = {
      id: crypto.randomUUID(),
      name: email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      role,
      joinedAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };
    setMembers((prev) => [...prev, newMember]);
    setShowInvite(false);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-moss">Team</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your team members and their roles.
          </p>
        </div>
        {!showInvite && (
          <Button
            size="sm"
            className="gap-1.5 self-start"
            onClick={() => setShowInvite(true)}
          >
            <UserPlus className="h-4 w-4" />
            Invite member
          </Button>
        )}
      </div>

      {/* Invite form */}
      {showInvite && (
        <InviteForm
          onInvite={handleInvite}
          onCancel={() => setShowInvite(false)}
        />
      )}

      {/* Member list */}
      {members.length > 0 ? (
        <div className="grid gap-3">
          {members.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onChangeRole={handleChangeRole}
              onRemove={handleRemove}
            />
          ))}
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-mist">
            <Users className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-sm font-medium text-foreground">
            No team members
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Invite people to collaborate with your team.
          </p>
          <Button
            size="sm"
            className="mt-4 gap-1.5"
            onClick={() => setShowInvite(true)}
          >
            <UserPlus className="h-4 w-4" />
            Invite member
          </Button>
        </div>
      )}
    </div>
  );
}
