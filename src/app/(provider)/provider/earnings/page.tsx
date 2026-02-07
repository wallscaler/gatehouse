"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  TrendingUp,
  Clock,
  Building2,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Period = "this_month" | "last_month" | "last_3_months" | "all_time";

const periods: { key: Period; label: string }[] = [
  { key: "this_month", label: "This Month" },
  { key: "last_month", label: "Last Month" },
  { key: "last_3_months", label: "Last 3 Months" },
  { key: "all_time", label: "All Time" },
];

interface EarningEntry {
  id: string;
  date: string;
  resource: string;
  renter: string;
  durationHrs: number;
  amount: number;
  status: "paid" | "pending" | "processing";
}

const allEarnings: EarningEntry[] = [
  {
    id: "earn-001",
    date: "2026-02-06",
    resource: "GPU-Lagos-01 (RTX 3090)",
    renter: "chioma_dev",
    durationHrs: 18,
    amount: 21600,
    status: "paid",
  },
  {
    id: "earn-002",
    date: "2026-02-05",
    resource: "GPU-Accra-01 (RTX 4090)",
    renter: "kwame_ml",
    durationHrs: 24,
    amount: 60000,
    status: "paid",
  },
  {
    id: "earn-003",
    date: "2026-02-04",
    resource: "CPU-Lagos-02 (EPYC 7543)",
    renter: "fatou_data",
    durationHrs: 48,
    amount: 40800,
    status: "paid",
  },
  {
    id: "earn-004",
    date: "2026-02-03",
    resource: "GPU-Lagos-01 (RTX 3090)",
    renter: "amara_ai",
    durationHrs: 12,
    amount: 14400,
    status: "paid",
  },
  {
    id: "earn-005",
    date: "2026-02-02",
    resource: "GPU-Accra-01 (RTX 4090)",
    renter: "emeka_labs",
    durationHrs: 36,
    amount: 90000,
    status: "processing",
  },
  {
    id: "earn-006",
    date: "2026-02-01",
    resource: "GPU-Nairobi-01 (RTX 3060)",
    renter: "wanjiku_tech",
    durationHrs: 8,
    amount: 5200,
    status: "paid",
  },
  {
    id: "earn-007",
    date: "2026-01-30",
    resource: "CPU-Lagos-02 (EPYC 7543)",
    renter: "tunde_ops",
    durationHrs: 72,
    amount: 61200,
    status: "paid",
  },
  {
    id: "earn-008",
    date: "2026-01-28",
    resource: "GPU-Lagos-01 (RTX 3090)",
    renter: "nala_research",
    durationHrs: 24,
    amount: 28800,
    status: "paid",
  },
  {
    id: "earn-009",
    date: "2026-01-25",
    resource: "GPU-Accra-01 (RTX 4090)",
    renter: "kofi_deep",
    durationHrs: 48,
    amount: 120000,
    status: "pending",
  },
  {
    id: "earn-010",
    date: "2026-01-20",
    resource: "GPU-Nairobi-01 (RTX 3060)",
    renter: "aisha_compute",
    durationHrs: 16,
    amount: 10400,
    status: "paid",
  },
];

const statusConfig: Record<
  EarningEntry["status"],
  { variant: "success" | "warning" | "default"; label: string }
> = {
  paid: { variant: "success", label: "Paid" },
  pending: { variant: "warning", label: "Pending" },
  processing: { variant: "default", label: "Processing" },
};

export default function ProviderEarningsPage() {
  const [activePeriod, setActivePeriod] = useState<Period>("all_time");

  // Simple period filtering based on mock dates
  const filtered = allEarnings.filter((e) => {
    if (activePeriod === "all_time") return true;
    const date = new Date(e.date);
    const now = new Date("2026-02-07");
    if (activePeriod === "this_month") {
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }
    if (activePeriod === "last_month") {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return (
        date.getMonth() === lastMonth.getMonth() &&
        date.getFullYear() === lastMonth.getFullYear()
      );
    }
    if (activePeriod === "last_3_months") {
      const threeMonthsAgo = new Date(now);
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return date >= threeMonthsAgo;
    }
    return true;
  });

  const filteredTotal = filtered.reduce((sum, e) => sum + e.amount, 0);
  const paidTotal = filtered
    .filter((e) => e.status === "paid")
    .reduce((sum, e) => sum + e.amount, 0);
  const pendingTotal = filtered
    .filter((e) => e.status !== "paid")
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Earnings</h1>
        <p className="mt-1 text-muted-foreground">
          Track your revenue from compute rentals.
        </p>
      </div>

      {/* Summary stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-copper/15 p-2.5">
                <Wallet className="h-5 w-5 text-copper" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-foreground">
                {"\u20A6"}850,000
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                All-Time Earnings
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-fern/15 p-2.5">
                <TrendingUp className="h-5 w-5 text-fern" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-foreground">
                {"\u20A6"}
                {paidTotal.toLocaleString()}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Paid ({activePeriod === "all_time" ? "All Time" : periods.find((p) => p.key === activePeriod)?.label})
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-mist p-2.5">
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-foreground">
                {"\u20A6"}
                {pendingTotal.toLocaleString()}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Pending / Processing
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Period selector */}
      <div className="flex gap-1 rounded-lg bg-card p-1">
        {periods.map((period) => (
          <button
            key={period.key}
            onClick={() => setActivePeriod(period.key)}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-medium transition-colors",
              activePeriod === period.key
                ? "bg-forest text-white"
                : "text-muted-foreground hover:bg-mist hover:text-foreground"
            )}
          >
            {period.label}
          </button>
        ))}
      </div>

      {/* Earnings table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Earnings Breakdown
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({filtered.length} entries, {"\u20A6"}
              {filteredTotal.toLocaleString()} total)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 pr-4 font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="pb-3 pr-4 font-medium text-muted-foreground">
                    Resource
                  </th>
                  <th className="pb-3 pr-4 font-medium text-muted-foreground">
                    Renter
                  </th>
                  <th className="pb-3 pr-4 text-right font-medium text-muted-foreground">
                    Duration
                  </th>
                  <th className="pb-3 pr-4 text-right font-medium text-muted-foreground">
                    Amount
                  </th>
                  <th className="pb-3 text-right font-medium text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry) => {
                  const sc = statusConfig[entry.status];
                  return (
                    <tr
                      key={entry.id}
                      className="border-b border-border/50 transition-colors hover:bg-mist/50"
                    >
                      <td className="py-3 pr-4 text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString("en-NG", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3 pr-4 text-foreground">
                        {entry.resource}
                      </td>
                      <td className="py-3 pr-4 text-foreground">
                        {entry.renter}
                      </td>
                      <td className="py-3 pr-4 text-right text-muted-foreground">
                        {entry.durationHrs}hrs
                      </td>
                      <td className="py-3 pr-4 text-right font-medium text-foreground">
                        {"\u20A6"}
                        {entry.amount.toLocaleString()}
                      </td>
                      <td className="py-3 text-right">
                        <Badge variant={sc.variant}>{sc.label}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Payout section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            Payout Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-mist p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Bank Name
              </p>
              <p className="mt-1 text-sm text-foreground">
                First Bank of Nigeria
              </p>
            </div>
            <div className="rounded-lg bg-mist p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Account Number
              </p>
              <p className="mt-1 text-sm text-foreground">
                **** **** 4521
              </p>
            </div>
            <div className="rounded-lg bg-mist p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Account Name
              </p>
              <p className="mt-1 text-sm text-foreground">
                Adebayo Technologies Ltd
              </p>
            </div>
            <div className="rounded-lg bg-mist p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Available for Payout
              </p>
              <p className="mt-1 text-lg font-bold text-fern">
                {"\u20A6"}210,400
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button className="gap-2">
              <Wallet className="h-4 w-4" />
              Request Payout
            </Button>
            <Button variant="outline" className="gap-2">
              <Building2 className="h-4 w-4" />
              Update Bank Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
