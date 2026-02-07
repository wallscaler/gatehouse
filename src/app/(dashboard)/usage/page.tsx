"use client";

import { useState } from "react";
import { Activity, Users, DollarSign, Key, BarChart3 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/analytics/stat-card";
import { BarChart } from "@/components/analytics/bar-chart";
import { ActivityFeed } from "@/components/analytics/activity-feed";

// --- Mock data by time period ---

const periodData = {
  "7d": {
    stats: [
      { icon: Activity, value: "12,847", label: "Total API Calls", change: 14.2 },
      { icon: Users, value: "342", label: "Active Users", change: 8.1 },
      { icon: DollarSign, value: "$4,280", label: "Revenue", change: -2.4 },
      { icon: Key, value: "89", label: "Subscriptions", change: 5.7 },
    ],
    chart: [
      { label: "Mon", value: 1420 },
      { label: "Tue", value: 1890 },
      { label: "Wed", value: 2100 },
      { label: "Thu", value: 1750 },
      { label: "Fri", value: 2340 },
      { label: "Sat", value: 1680 },
      { label: "Sun", value: 1667 },
    ],
  },
  "30d": {
    stats: [
      { icon: Activity, value: "48,392", label: "Total API Calls", change: 22.5 },
      { icon: Users, value: "1,204", label: "Active Users", change: 11.3 },
      { icon: DollarSign, value: "$18,640", label: "Revenue", change: 6.8 },
      { icon: Key, value: "156", label: "Subscriptions", change: 12.1 },
    ],
    chart: [
      { label: "Wk1", value: 9200 },
      { label: "Wk2", value: 11400 },
      { label: "Wk3", value: 12800 },
      { label: "Wk4", value: 14992 },
    ],
  },
  "90d": {
    stats: [
      { icon: Activity, value: "142,610", label: "Total API Calls", change: 38.7 },
      { icon: Users, value: "3,812", label: "Active Users", change: 24.6 },
      { icon: DollarSign, value: "$52,190", label: "Revenue", change: 18.2 },
      { icon: Key, value: "412", label: "Subscriptions", change: 31.4 },
    ],
    chart: [
      { label: "Jan", value: 38200 },
      { label: "Feb", value: 44800 },
      { label: "Mar", value: 59610 },
    ],
  },
} as const;

type Period = keyof typeof periodData;

const activityItems = [
  { id: "1", description: "Sarah Chen signed up for a Pro plan", timestamp: "12 minutes ago", type: "signup" as const },
  { id: "2", description: "Payment of $49.00 received from Acme Corp", timestamp: "38 minutes ago", type: "payment" as const },
  { id: "3", description: "New API key created by david@example.com", timestamp: "1 hour ago", type: "api_key" as const },
  { id: "4", description: "Enterprise subscription upgraded by TechStart Inc", timestamp: "2 hours ago", type: "subscription" as const },
  { id: "5", description: "API rate limit reached for key sk_live_...8f2a", timestamp: "3 hours ago", type: "usage" as const },
  { id: "6", description: "Maria Lopez updated her billing settings", timestamp: "4 hours ago", type: "settings" as const },
  { id: "7", description: "New API key created by ops@buildfast.io", timestamp: "5 hours ago", type: "api_key" as const },
  { id: "8", description: "Payment of $199.00 received from DataFlow Ltd", timestamp: "6 hours ago", type: "payment" as const },
  { id: "9", description: "James Rivera signed up for a Starter plan", timestamp: "8 hours ago", type: "signup" as const },
  { id: "10", description: "Webhook endpoint configured by infra@neonlabs.dev", timestamp: "12 hours ago", type: "settings" as const },
];

const periods: { value: Period; label: string }[] = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
];

export default function UsagePage() {
  const [period, setPeriod] = useState<Period>("7d");
  const current = periodData[period];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Page header with time period selector */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-moss">Usage Analytics</h1>
          <p className="mt-1 text-muted-foreground">
            Monitor API usage, active users, and revenue.
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
          {periods.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setPeriod(value)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                period === value
                  ? "bg-forest text-white"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {current.stats.map((stat) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
            change={stat.change}
          />
        ))}
      </div>

      {/* Chart and activity feed */}
      <div className="grid gap-4 lg:grid-cols-5">
        {/* Bar chart */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center gap-3">
            <BarChart3 className="h-5 w-5 text-forest" />
            <CardTitle className="text-base">API Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={[...current.chart]} title={`Last ${period}`} />
          </CardContent>
        </Card>

        {/* Activity feed */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityFeed items={activityItems} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
