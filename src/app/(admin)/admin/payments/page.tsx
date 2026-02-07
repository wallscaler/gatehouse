"use client";

import { useState } from "react";
import {
  Search,
  CreditCard,
  RefreshCw,
  Eye,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Filter,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PaymentStatus = "succeeded" | "pending" | "failed" | "refunded";
type StatusFilter = "all" | PaymentStatus;

interface Payment {
  id: string;
  userName: string;
  userEmail: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: string;
  date: string;
  description: string;
}

const mockPayments: Payment[] = [
  { id: "pay-001", userName: "Chioma Nwosu", userEmail: "chioma@airesearch.ng", amount: 142800000, currency: "NGN", status: "succeeded", method: "Paystack", date: "2026-02-07T10:30:00Z", description: "A100 80GB - 168 hours" },
  { id: "pay-002", userName: "Adebayo Ogunleye", userEmail: "adebayo@techstartup.ng", amount: 12000000, currency: "NGN", status: "succeeded", method: "Paystack", date: "2026-02-06T14:15:00Z", description: "RTX 4090 - 48 hours" },
  { id: "pay-003", userName: "Ifeoma Eze", userEmail: "ifeoma@bigdata.ng", amount: 92400000, currency: "NGN", status: "succeeded", method: "Paystack", date: "2026-02-06T18:00:00Z", description: "A6000 - 168 hours" },
  { id: "pay-004", userName: "Daniel Osei", userEmail: "daniel@renderlab.gh", amount: 142800000, currency: "NGN", status: "pending", method: "Bank Transfer", date: "2026-02-06T20:00:00Z", description: "A100 80GB - 168 hours" },
  { id: "pay-005", userName: "Nia Mensah", userEmail: "nia@deeplearn.gh", amount: 92400000, currency: "NGN", status: "succeeded", method: "Paystack", date: "2026-02-04T08:00:00Z", description: "A6000 - 168 hours" },
  { id: "pay-006", userName: "Grace Okafor", userEmail: "grace@fintech.ng", amount: 79200000, currency: "NGN", status: "failed", method: "Paystack", date: "2026-02-07T09:00:00Z", description: "A6000 - 144 hours" },
  { id: "pay-007", userName: "Emeka Obi", userEmail: "emeka@mllab.ng", amount: 6000000, currency: "NGN", status: "succeeded", method: "Paystack", date: "2026-02-06T20:30:00Z", description: "RTX 4090 - 24 hours" },
  { id: "pay-008", userName: "Blessing Afolabi", userEmail: "blessing@creativeai.ng", amount: 12000000, currency: "NGN", status: "succeeded", method: "Paystack", date: "2026-01-25T16:00:00Z", description: "RTX 4090 - 48 hours" },
  { id: "pay-009", userName: "Samuel Kariuki", userEmail: "samuel@nairobitech.ke", amount: 8640000, currency: "NGN", status: "refunded", method: "Paystack", date: "2026-01-20T08:00:00Z", description: "RTX 3090 - 48 hours (refunded - resource issue)" },
  { id: "pay-010", userName: "Tendai Moyo", userEmail: "tendai@zimtech.zw", amount: 8640000, currency: "NGN", status: "refunded", method: "Paystack", date: "2026-02-03T14:00:00Z", description: "RTX 3090 - 48 hours (refunded - deployment failed)" },
  { id: "pay-011", userName: "Ifeoma Eze", userEmail: "ifeoma@bigdata.ng", amount: 14400000, currency: "NGN", status: "succeeded", method: "Paystack", date: "2026-02-07T06:00:00Z", description: "RTX 4080 - 72 hours" },
  { id: "pay-012", userName: "Chioma Nwosu", userEmail: "chioma@airesearch.ng", amount: 33600000, currency: "NGN", status: "succeeded", method: "Bank Transfer", date: "2026-01-28T10:00:00Z", description: "RTX 4080 - 168 hours" },
  { id: "pay-013", userName: "Adebayo Ogunleye", userEmail: "adebayo@techstartup.ng", amount: 6000000, currency: "NGN", status: "failed", method: "Paystack", date: "2026-02-05T12:00:00Z", description: "RTX 4090 - 24 hours (card declined)" },
  { id: "pay-014", userName: "Samuel Kariuki", userEmail: "samuel@nairobitech.ke", amount: 4320000, currency: "NGN", status: "succeeded", method: "Paystack", date: "2026-01-15T10:00:00Z", description: "RTX 3090 - 24 hours" },
  { id: "pay-015", userName: "Nia Mensah", userEmail: "nia@deeplearn.gh", amount: 92400000, currency: "NGN", status: "succeeded", method: "Paystack", date: "2026-02-06T18:00:00Z", description: "A6000 - 168 hours" },
];

function formatKobo(amount: number): string {
  return `\u20A6${(amount / 100).toLocaleString("en-NG")}`;
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

const paymentBadgeVariant: Record<PaymentStatus, "success" | "warning" | "destructive" | "default"> = {
  succeeded: "success",
  pending: "warning",
  failed: "destructive",
  refunded: "default",
};

export default function AdminPaymentsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filters: StatusFilter[] = ["all", "succeeded", "pending", "failed", "refunded"];

  const filtered = mockPayments
    .filter((p) => statusFilter === "all" || p.status === statusFilter)
    .filter((p) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.userName.toLowerCase().includes(q) ||
        p.userEmail.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
      );
    });

  const totalRevenue = mockPayments
    .filter((p) => p.status === "succeeded")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalFailed = mockPayments
    .filter((p) => p.status === "failed")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalRefunded = mockPayments
    .filter((p) => p.status === "refunded")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalPending = mockPayments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-deep-moss">Payment Management</h1>
        <p className="mt-1 text-muted-foreground">
          Track and manage all platform transactions.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-fern/10 p-2">
                <TrendingUp className="h-5 w-5 text-fern" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{formatKobo(totalRevenue)}</p>
                <p className="text-xs text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-copper/10 p-2">
                <CreditCard className="h-5 w-5 text-copper" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{formatKobo(totalPending)}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-900/20 p-2">
                <TrendingDown className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{formatKobo(totalFailed)}</p>
                <p className="text-xs text-muted-foreground">Failed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-mist p-2">
                <RefreshCw className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{formatKobo(totalRefunded)}</p>
                <p className="text-xs text-muted-foreground">Refunded</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors",
                statusFilter === f
                  ? "bg-forest text-white"
                  : "bg-mist text-muted-foreground hover:text-foreground"
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-72 rounded-lg border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-forest/50"
          />
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Method</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-border transition-colors hover:bg-mist/50">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.id}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-foreground">{p.userName}</p>
                        <p className="text-xs text-muted-foreground">{p.userEmail}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {formatKobo(p.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={paymentBadgeVariant[p.status]}>{p.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-foreground">{p.method}</td>
                    <td className="px-4 py-3">
                      <p className="max-w-[200px] truncate text-xs text-muted-foreground">
                        {p.description}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {formatDateTime(p.date)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {p.status === "succeeded" && (
                          <button
                            className="rounded p-1 text-muted-foreground transition-colors hover:bg-copper/10 hover:text-copper"
                            title="Refund"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          className="rounded p-1 text-muted-foreground transition-colors hover:bg-mist hover:text-foreground"
                          title="View Receipt"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No payments found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
