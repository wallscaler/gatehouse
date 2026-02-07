"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Server,
  Activity,
  Wallet,
  Users,
  PlusCircle,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  CreditCard,
  Container,
  HeartPulse,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Total Resources", value: "6", icon: Server, change: 2 },
  { label: "Active Resources", value: "4", icon: Activity, change: 0 },
  { label: "Total Earnings", value: "\u20A6850,000", icon: Wallet, change: 12 },
  { label: "Active Rentals", value: "3", icon: Users, change: -5 },
];

const earningsData = [
  { label: "Mon", value: 95000 },
  { label: "Tue", value: 120000 },
  { label: "Wed", value: 85000 },
  { label: "Thu", value: 140000 },
  { label: "Fri", value: 110000 },
  { label: "Sat", value: 75000 },
  { label: "Sun", value: 130000 },
];

const recentActivity = [
  {
    id: "1",
    icon: ShieldCheck,
    description: "RTX 4090 resource verified by system validator",
    timestamp: "2 hours ago",
    color: "bg-fern",
  },
  {
    id: "2",
    icon: Container,
    description: "Container deployed on your RTX 3090 by user adeola_k",
    timestamp: "4 hours ago",
    color: "bg-forest",
  },
  {
    id: "3",
    icon: CreditCard,
    description: "Payment received: \u20A645,000 for 12hrs compute rental",
    timestamp: "6 hours ago",
    color: "bg-copper",
  },
  {
    id: "4",
    icon: AlertTriangle,
    description: "Heartbeat warning: CPU-Lagos-02 latency above threshold",
    timestamp: "8 hours ago",
    color: "bg-copper",
  },
  {
    id: "5",
    icon: CheckCircle,
    description: "RTX 3060 resource approved by admin review",
    timestamp: "12 hours ago",
    color: "bg-fern",
  },
  {
    id: "6",
    icon: HeartPulse,
    description: "All resources passed scheduled health check",
    timestamp: "1 day ago",
    color: "bg-lichen",
  },
];

export default function ProviderDashboardPage() {
  const maxEarning = Math.max(...earningsData.map((d) => d.value));

  const tickCount = 4;
  const step = Math.ceil(maxEarning / tickCount);
  const ticks = Array.from(
    { length: tickCount + 1 },
    (_, i) => step * (tickCount - i)
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Provider Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Monitor your compute resources and earnings.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, change }) => {
          const isPositive = change >= 0;
          return (
            <Card key={label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="rounded-lg bg-mist p-2.5">
                    <Icon className="h-5 w-5 text-forest" />
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-medium",
                      isPositive
                        ? "bg-fern/15 text-fern"
                        : "bg-red-500/15 text-red-400"
                    )}
                  >
                    {isPositive ? "+" : ""}
                    {change}%
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-foreground">{value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Earnings chart + Recent activity */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Earnings chart */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">Earnings (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {/* Y-axis labels */}
              <div className="flex w-12 shrink-0 flex-col justify-between pb-7 text-right">
                {ticks.map((tick) => (
                  <span
                    key={tick}
                    className="text-xs leading-none text-muted-foreground"
                  >
                    {tick >= 1000
                      ? `\u20A6${(tick / 1000).toFixed(0)}k`
                      : tick}
                  </span>
                ))}
              </div>

              {/* Bars area */}
              <div className="flex flex-1 items-end gap-2">
                {earningsData.map((item) => {
                  const heightPercent =
                    maxEarning > 0 ? (item.value / maxEarning) * 100 : 0;

                  return (
                    <div
                      key={item.label}
                      className="flex flex-1 flex-col items-center gap-2"
                    >
                      <div className="relative flex h-48 w-full items-end justify-center">
                        <div
                          className={cn(
                            "w-full max-w-12 rounded-t-md bg-copper transition-all duration-200",
                            "hover:bg-copper/80"
                          )}
                          style={{ height: `${heightPercent}%` }}
                          title={`${item.label}: \u20A6${item.value.toLocaleString()}`}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
              {recentActivity.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-mist"
                  >
                    <div
                      className={cn(
                        "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                        item.color + "/15"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-3.5 w-3.5",
                          item.color.replace("bg-", "text-")
                        )}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-foreground">
                        {item.description}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {item.timestamp}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="transition-colors hover:border-forest/40">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-forest/15 p-3">
              <PlusCircle className="h-6 w-6 text-forest" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">
                Register New Resource
              </h3>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Add a new GPU or CPU to start earning
              </p>
            </div>
            <Link href="/provider/resources/register">
              <Button size="sm" className="gap-1">
                Register <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="transition-colors hover:border-copper/40">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-copper/15 p-3">
              <Wallet className="h-6 w-6 text-copper" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">View Earnings</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Track your revenue and request payouts
              </p>
            </div>
            <Link href="/provider/earnings">
              <Button variant="outline" size="sm" className="gap-1">
                Earnings <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
