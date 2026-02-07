"use client";

import { useState } from "react";
import {
  ShieldAlert,
  Download,
  Filter,
  LogIn,
  LogOut,
  UserPlus,
  Server,
  Rocket,
  Settings,
  AlertTriangle,
  Key,
  Trash2,
  Eye,
  RefreshCw,
  Ban,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

type EventType =
  | "login"
  | "logout"
  | "signup"
  | "resource_register"
  | "deployment"
  | "settings_change"
  | "suspicious"
  | "api_key"
  | "deletion"
  | "password_change"
  | "role_change";

interface ActivityLog {
  id: string;
  timestamp: string;
  userName: string;
  userEmail: string;
  event: EventType;
  description: string;
  ipAddress: string;
  subject: string;
  suspicious: boolean;
}

const eventIcons: Record<EventType, LucideIcon> = {
  login: LogIn,
  logout: LogOut,
  signup: UserPlus,
  resource_register: Server,
  deployment: Rocket,
  settings_change: Settings,
  suspicious: AlertTriangle,
  api_key: Key,
  deletion: Trash2,
  password_change: RefreshCw,
  role_change: ShieldAlert,
};

const eventLabels: Record<EventType, string> = {
  login: "Login",
  logout: "Logout",
  signup: "Signup",
  resource_register: "Resource Registration",
  deployment: "Deployment",
  settings_change: "Settings Change",
  suspicious: "Suspicious Activity",
  api_key: "API Key",
  deletion: "Deletion",
  password_change: "Password Change",
  role_change: "Role Change",
};

const mockLogs: ActivityLog[] = [
  { id: "log-001", timestamp: "2026-02-07T10:45:00Z", userName: "Adebayo Ogunleye", userEmail: "adebayo@techstartup.ng", event: "login", description: "Successful login via email/password", ipAddress: "102.89.23.45", subject: "Auth", suspicious: false },
  { id: "log-002", timestamp: "2026-02-07T10:30:00Z", userName: "Unknown", userEmail: "admin@gatehouse.cloud", event: "suspicious", description: "5 failed login attempts for admin account from unknown IP", ipAddress: "185.220.101.34", subject: "Auth", suspicious: true },
  { id: "log-003", timestamp: "2026-02-07T10:15:00Z", userName: "Chioma Nwosu", userEmail: "chioma@airesearch.ng", event: "deployment", description: "Deployed PyTorch 2.2 container on A100 80GB", ipAddress: "102.89.45.67", subject: "Container cnt-a1b2c3", suspicious: false },
  { id: "log-004", timestamp: "2026-02-07T09:50:00Z", userName: "DakarNodes", userEmail: "ops@dakarnodes.sn", event: "resource_register", description: "Registered new RTX 4090 resource for verification", ipAddress: "41.82.100.12", subject: "Resource res-u1v2w3x4", suspicious: false },
  { id: "log-005", timestamp: "2026-02-07T09:30:00Z", userName: "Grace Okafor", userEmail: "grace@fintech.ng", event: "login", description: "Successful login via Google OAuth", ipAddress: "102.89.88.90", subject: "Auth", suspicious: false },
  { id: "log-006", timestamp: "2026-02-07T09:00:00Z", userName: "Oluwaseun Bakare", userEmail: "seun@gatehouse.cloud", event: "role_change", description: "Changed user Kofi Boateng role from user to verifier", ipAddress: "102.89.23.100", subject: "User usr-014", suspicious: false },
  { id: "log-007", timestamp: "2026-02-07T08:45:00Z", userName: "Unknown", userEmail: "unknown@tor-exit.net", event: "suspicious", description: "Port scanning detected from Tor exit node targeting API endpoints", ipAddress: "51.15.43.205", subject: "Infrastructure", suspicious: true },
  { id: "log-008", timestamp: "2026-02-07T08:30:00Z", userName: "Emeka Obi", userEmail: "emeka@mllab.ng", event: "api_key", description: "Generated new API key for programmatic access", ipAddress: "102.89.55.12", subject: "API Key ak-e7f8g9", suspicious: false },
  { id: "log-009", timestamp: "2026-02-07T08:00:00Z", userName: "Aisha Bello", userEmail: "aisha@gatehouse.cloud", event: "settings_change", description: "Updated platform pricing for RTX 4090 tier", ipAddress: "102.89.23.101", subject: "Settings/Pricing", suspicious: false },
  { id: "log-010", timestamp: "2026-02-06T23:45:00Z", userName: "Tendai Moyo", userEmail: "tendai@zimtech.zw", event: "suspicious", description: "Access attempt from suspended account", ipAddress: "41.60.234.12", subject: "Auth", suspicious: true },
  { id: "log-011", timestamp: "2026-02-06T22:00:00Z", userName: "Daniel Osei", userEmail: "daniel@renderlab.gh", event: "deployment", description: "Deployed CUDA Development container on A100 80GB", ipAddress: "154.160.1.88", subject: "Container cnt-m3n4o5", suspicious: false },
  { id: "log-012", timestamp: "2026-02-06T20:30:00Z", userName: "Chioma Nwosu", userEmail: "chioma@airesearch.ng", event: "password_change", description: "Password changed successfully", ipAddress: "102.89.45.67", subject: "Account", suspicious: false },
  { id: "log-013", timestamp: "2026-02-06T18:00:00Z", userName: "Ifeoma Eze", userEmail: "ifeoma@bigdata.ng", event: "deployment", description: "Deployed TensorFlow 2.15 container on A6000", ipAddress: "102.89.77.33", subject: "Container cnt-h4i5j6", suspicious: false },
  { id: "log-014", timestamp: "2026-02-06T16:00:00Z", userName: "KigaliCompute", userEmail: "jp@kigalicompute.rw", event: "resource_register", description: "Registered new L40S resource for verification", ipAddress: "41.186.78.55", subject: "Resource res-y5z6a7b8", suspicious: false },
  { id: "log-015", timestamp: "2026-02-06T14:00:00Z", userName: "Adebayo Ogunleye", userEmail: "adebayo@techstartup.ng", event: "deployment", description: "Deployed Stable Diffusion container on RTX 4090", ipAddress: "102.89.23.45", subject: "Container cnt-d4e5f6", suspicious: false },
  { id: "log-016", timestamp: "2026-02-06T12:00:00Z", userName: "Oluwaseun Bakare", userEmail: "seun@gatehouse.cloud", event: "settings_change", description: "Enabled two-factor authentication requirement for admins", ipAddress: "102.89.23.100", subject: "Settings/Security", suspicious: false },
  { id: "log-017", timestamp: "2026-02-06T10:00:00Z", userName: "Yusuf Ahmed", userEmail: "yusuf@somalitech.so", event: "signup", description: "New user registration via email", ipAddress: "41.78.123.45", subject: "Auth", suspicious: false },
  { id: "log-018", timestamp: "2026-02-06T08:00:00Z", userName: "Nia Mensah", userEmail: "nia@deeplearn.gh", event: "login", description: "Successful login via email/password", ipAddress: "154.160.1.22", subject: "Auth", suspicious: false },
  { id: "log-019", timestamp: "2026-02-05T22:00:00Z", userName: "Moussa Traore", userEmail: "moussa@bamako.ml", event: "suspicious", description: "Multiple failed payment attempts with different card numbers", ipAddress: "41.73.200.15", subject: "Payments", suspicious: true },
  { id: "log-020", timestamp: "2026-02-05T18:00:00Z", userName: "Samuel Kariuki", userEmail: "samuel@nairobitech.ke", event: "deletion", description: "Deleted terminated container cnt-b8c9d0", ipAddress: "196.201.214.33", subject: "Container cnt-b8c9d0", suspicious: false },
];

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "medium",
  });
}

const eventTypes: EventType[] = [
  "login",
  "logout",
  "signup",
  "resource_register",
  "deployment",
  "settings_change",
  "suspicious",
  "api_key",
  "deletion",
  "password_change",
  "role_change",
];

export default function AdminSecurityPage() {
  const [eventFilter, setEventFilter] = useState<EventType | "all">("all");

  const filtered = mockLogs.filter(
    (log) => eventFilter === "all" || log.event === eventFilter
  );

  const suspiciousLogs = mockLogs.filter((log) => log.suspicious);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-moss">
            Security & Activity Logs
          </h1>
          <p className="mt-1 text-muted-foreground">
            Monitor platform activity and security events.
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Logs
        </Button>
      </div>

      {/* Suspicious Activity Section */}
      {suspiciousLogs.length > 0 && (
        <Card className="border-red-500/30">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <CardTitle className="text-base text-red-400">
                Suspicious Activity ({suspiciousLogs.length})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {suspiciousLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-900/10 p-3"
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">
                      {log.description}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {formatDateTime(log.timestamp)}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>IP: {log.ipAddress}</span>
                    <span>User: {log.userName}</span>
                    <span>Subject: {log.subject}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    className="rounded p-1 text-muted-foreground transition-colors hover:bg-mist hover:text-foreground"
                    title="Investigate"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    className="rounded p-1 text-muted-foreground transition-colors hover:bg-red-900/20 hover:text-red-400"
                    title="Block IP"
                  >
                    <Ban className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Event Type Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <select
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value as EventType | "all")}
          className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-forest/50"
        >
          <option value="all">All Events</option>
          {eventTypes.map((et) => (
            <option key={et} value={et}>
              {eventLabels[et]}
            </option>
          ))}
        </select>
        <span className="text-xs text-muted-foreground">
          {filtered.length} events
        </span>
      </div>

      {/* Activity Log Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Timestamp</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Event</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">IP Address</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Subject</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log) => {
                  const EventIcon = eventIcons[log.event];
                  return (
                    <tr
                      key={log.id}
                      className={cn(
                        "border-b border-border transition-colors hover:bg-mist/50",
                        log.suspicious && "bg-red-900/5"
                      )}
                    >
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted-foreground">
                        {formatDateTime(log.timestamp)}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-foreground">{log.userName}</p>
                          <p className="text-xs text-muted-foreground">{log.userEmail}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <EventIcon
                            className={cn(
                              "h-3.5 w-3.5",
                              log.suspicious ? "text-red-400" : "text-muted-foreground"
                            )}
                          />
                          <Badge
                            variant={log.suspicious ? "destructive" : "default"}
                          >
                            {eventLabels[log.event]}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="max-w-[300px] text-xs text-foreground">
                          {log.description}
                        </p>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {log.ipAddress}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {log.subject}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No events found matching your filter.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
