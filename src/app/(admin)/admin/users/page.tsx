"use client";

import { useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  UserX,
  ShieldCheck,
  Eye,
  Filter,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type UserRole = "user" | "admin" | "provider" | "verifier";
type UserStatus = "active" | "suspended" | "pending";

interface MockUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  plan: string;
  instances: number;
  joinedAt: string;
  lastActive: string;
  totalSpent: number;
}

const mockUsers: MockUser[] = [
  { id: "usr-001", name: "Adebayo Ogunleye", email: "adebayo@techstartup.ng", role: "user", status: "active", plan: "Pro", instances: 3, joinedAt: "2025-11-15", lastActive: "2026-02-07", totalSpent: 1250000 },
  { id: "usr-002", name: "Chioma Nwosu", email: "chioma@airesearch.ng", role: "user", status: "active", plan: "Enterprise", instances: 7, joinedAt: "2025-10-20", lastActive: "2026-02-07", totalSpent: 4800000 },
  { id: "usr-003", name: "Kwame Asante", email: "kwame@accracompute.gh", role: "provider", status: "active", plan: "Provider", instances: 0, joinedAt: "2025-09-10", lastActive: "2026-02-06", totalSpent: 0 },
  { id: "usr-004", name: "Fatima Diallo", email: "fatima@dakarnodes.sn", role: "provider", status: "active", plan: "Provider", instances: 0, joinedAt: "2025-12-01", lastActive: "2026-02-07", totalSpent: 0 },
  { id: "usr-005", name: "Oluwaseun Bakare", email: "seun@gatehouse.cloud", role: "admin", status: "active", plan: "Internal", instances: 2, joinedAt: "2025-06-01", lastActive: "2026-02-07", totalSpent: 0 },
  { id: "usr-006", name: "Amara Kamara", email: "amara@verifier.ke", role: "verifier", status: "active", plan: "Verifier", instances: 0, joinedAt: "2025-08-15", lastActive: "2026-02-05", totalSpent: 0 },
  { id: "usr-007", name: "Emeka Obi", email: "emeka@mllab.ng", role: "user", status: "active", plan: "Starter", instances: 1, joinedAt: "2026-01-05", lastActive: "2026-02-04", totalSpent: 180000 },
  { id: "usr-008", name: "Nia Mensah", email: "nia@deeplearn.gh", role: "user", status: "active", plan: "Pro", instances: 2, joinedAt: "2025-12-10", lastActive: "2026-02-07", totalSpent: 920000 },
  { id: "usr-009", name: "Tendai Moyo", email: "tendai@zimtech.zw", role: "user", status: "suspended", plan: "Pro", instances: 0, joinedAt: "2025-11-01", lastActive: "2026-01-15", totalSpent: 340000 },
  { id: "usr-010", name: "Ifeoma Eze", email: "ifeoma@bigdata.ng", role: "user", status: "active", plan: "Enterprise", instances: 5, joinedAt: "2025-10-01", lastActive: "2026-02-06", totalSpent: 3200000 },
  { id: "usr-011", name: "Jean-Pierre Habimana", email: "jp@kigalicompute.rw", role: "provider", status: "active", plan: "Provider", instances: 0, joinedAt: "2025-11-20", lastActive: "2026-02-07", totalSpent: 0 },
  { id: "usr-012", name: "Yusuf Ahmed", email: "yusuf@somalitech.so", role: "user", status: "pending", plan: "Starter", instances: 0, joinedAt: "2026-02-06", lastActive: "2026-02-06", totalSpent: 0 },
  { id: "usr-013", name: "Grace Okafor", email: "grace@fintech.ng", role: "user", status: "active", plan: "Pro", instances: 2, joinedAt: "2025-12-25", lastActive: "2026-02-07", totalSpent: 760000 },
  { id: "usr-014", name: "Kofi Boateng", email: "kofi@verifier.gh", role: "verifier", status: "active", plan: "Verifier", instances: 0, joinedAt: "2025-09-01", lastActive: "2026-02-06", totalSpent: 0 },
  { id: "usr-015", name: "Blessing Afolabi", email: "blessing@creativeai.ng", role: "user", status: "active", plan: "Starter", instances: 1, joinedAt: "2026-01-20", lastActive: "2026-02-05", totalSpent: 95000 },
  { id: "usr-016", name: "Moussa Traore", email: "moussa@bamako.ml", role: "user", status: "suspended", plan: "Starter", instances: 0, joinedAt: "2025-10-15", lastActive: "2025-12-20", totalSpent: 45000 },
  { id: "usr-017", name: "Aisha Bello", email: "aisha@gatehouse.cloud", role: "admin", status: "active", plan: "Internal", instances: 1, joinedAt: "2025-06-15", lastActive: "2026-02-07", totalSpent: 0 },
  { id: "usr-018", name: "Daniel Osei", email: "daniel@renderlab.gh", role: "user", status: "active", plan: "Pro", instances: 4, joinedAt: "2025-11-05", lastActive: "2026-02-07", totalSpent: 2100000 },
  { id: "usr-019", name: "Ngozi Chukwu", email: "ngozi@healthai.ng", role: "user", status: "pending", plan: "Enterprise", instances: 0, joinedAt: "2026-02-05", lastActive: "2026-02-05", totalSpent: 0 },
  { id: "usr-020", name: "Samuel Kariuki", email: "samuel@nairobitech.ke", role: "user", status: "active", plan: "Starter", instances: 1, joinedAt: "2026-01-10", lastActive: "2026-02-03", totalSpent: 120000 },
];

const roleBadgeVariant: Record<UserRole, "default" | "success" | "warning" | "destructive"> = {
  user: "default",
  admin: "destructive",
  provider: "success",
  verifier: "warning",
};

const statusBadgeVariant: Record<UserStatus, "default" | "success" | "warning" | "destructive"> = {
  active: "success",
  suspended: "destructive",
  pending: "warning",
};

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = mockUsers
    .filter((u) => {
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (statusFilter !== "all" && u.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
        );
      }
      return true;
    });

  const roles: (UserRole | "all")[] = ["all", "user", "admin", "provider", "verifier"];
  const statuses: (UserStatus | "all")[] = ["all", "active", "suspended", "pending"];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-deep-moss">User Management</h1>
        <p className="mt-1 text-muted-foreground">
          {mockUsers.length} registered users on the platform.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-forest/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as UserRole | "all")}
            className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-forest/50"
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r === "all" ? "All Roles" : r.charAt(0).toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as UserStatus | "all")}
            className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-forest/50"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Plan</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Instances</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Joined</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <>
                    <tr
                      key={user.id}
                      onClick={() => setExpandedId(expandedId === user.id ? null : user.id)}
                      className="cursor-pointer border-b border-border transition-colors hover:bg-mist/50"
                    >
                      <td className="px-4 py-3 font-medium text-foreground">{user.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                      <td className="px-4 py-3">
                        <Badge variant={roleBadgeVariant[user.role]}>{user.role}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={statusBadgeVariant[user.status]}>{user.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-foreground">{user.plan}</td>
                      <td className="px-4 py-3 text-foreground">{user.instances}</td>
                      <td className="px-4 py-3 text-muted-foreground">{user.joinedAt}</td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          <button
                            className="rounded p-1 text-muted-foreground transition-colors hover:bg-mist hover:text-foreground"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {user.status !== "suspended" ? (
                            <button
                              className="rounded p-1 text-muted-foreground transition-colors hover:bg-red-900/20 hover:text-red-400"
                              title="Suspend User"
                            >
                              <UserX className="h-4 w-4" />
                            </button>
                          ) : (
                            <button
                              className="rounded p-1 text-muted-foreground transition-colors hover:bg-fern/10 hover:text-fern"
                              title="Reactivate User"
                            >
                              <ShieldCheck className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            className="rounded p-1 text-muted-foreground transition-colors hover:bg-mist hover:text-foreground"
                            title="Change Role"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedId === user.id && (
                      <tr key={`${user.id}-expanded`} className="border-b border-border">
                        <td colSpan={8} className="bg-mist/30 px-8 py-4">
                          <div className="grid gap-4 sm:grid-cols-4">
                            <div>
                              <p className="text-xs font-medium uppercase text-muted-foreground">Last Active</p>
                              <p className="mt-1 text-sm text-foreground">{user.lastActive}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium uppercase text-muted-foreground">Total Spent</p>
                              <p className="mt-1 text-sm font-medium text-foreground">
                                {user.totalSpent > 0
                                  ? `\u20A6${(user.totalSpent / 100).toLocaleString()}`
                                  : "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-medium uppercase text-muted-foreground">Active Instances</p>
                              <p className="mt-1 text-sm text-foreground">{user.instances} running</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium uppercase text-muted-foreground">User ID</p>
                              <p className="mt-1 font-mono text-sm text-muted-foreground">{user.id}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No users found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
