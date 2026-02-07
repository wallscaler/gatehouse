"use client";

import {
  Users,
  Pickaxe,
  Server,
  Container,
  CreditCard,
  Clock,
  AlertTriangle,
  ArrowRight,
  UserPlus,
  HardDrive,
  Rocket,
  Banknote,
  ShieldAlert,
  CheckCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const stats = [
  { icon: Users, label: "Total Users", value: "1,247", change: 12 },
  { icon: Pickaxe, label: "Active Miners", value: "89", change: 5 },
  { icon: Server, label: "Compute Resources", value: "156", change: 8, sub: "verified" },
  { icon: Container, label: "Running Containers", value: "43", change: -3 },
  { icon: CreditCard, label: "Revenue (this month)", value: "\u20A64,250,000", change: 18 },
  { icon: Clock, label: "Pending Approvals", value: "12", change: 0 },
];

const activityFeed = [
  { icon: UserPlus, text: "Adebayo Ogunleye signed up", time: "2 min ago", color: "text-fern" },
  { icon: HardDrive, text: "New RTX 4090 resource registered by MinerNaija", time: "8 min ago", color: "text-forest" },
  { icon: Rocket, text: "Container deployed on gpu-lagos-07", time: "15 min ago", color: "text-copper" },
  { icon: Banknote, text: "Payment of \u20A6350,000 received from TechLabs", time: "22 min ago", color: "text-fern" },
  { icon: UserPlus, text: "Chioma Nwosu signed up", time: "35 min ago", color: "text-fern" },
  { icon: CheckCircle, text: "Resource gpu-abuja-03 verified by system", time: "1 hr ago", color: "text-forest" },
  { icon: HardDrive, text: "New A100 resource registered by AccraCompute", time: "1.5 hrs ago", color: "text-forest" },
  { icon: Rocket, text: "Container deployed on gpu-accra-12", time: "2 hrs ago", color: "text-copper" },
];

const alerts = [
  {
    text: "5 resources pending verification",
    severity: "warning" as const,
    link: "/admin/resources/pending",
  },
  {
    text: "2 containers nearing expiry",
    severity: "warning" as const,
    link: "/admin/containers",
  },
  {
    text: "1 suspicious login detected",
    severity: "destructive" as const,
    link: "/admin/security",
  },
];

export default function AdminOverviewPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-deep-moss">Admin Overview</h1>
        <p className="mt-1 text-muted-foreground">
          Platform health and key metrics at a glance.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.change > 0;
          const isNeutral = stat.change === 0;
          return (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="rounded-lg bg-mist p-2.5">
                    <Icon className="h-5 w-5 text-forest" />
                  </div>
                  {!isNeutral && (
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-medium",
                        isPositive
                          ? "bg-fern/15 text-fern"
                          : "bg-red-500/15 text-red-400"
                      )}
                    >
                      {isPositive ? "+" : ""}
                      {stat.change}%
                    </span>
                  )}
                  {isNeutral && (
                    <span className="rounded-full bg-mist px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      0%
                    </span>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {stat.label}
                    {stat.sub && (
                      <span className="ml-1 text-xs text-lichen">
                        ({stat.sub})
                      </span>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityFeed.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="flex items-start gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
                  >
                    <div className="mt-0.5 rounded-lg bg-mist p-2">
                      <Icon className={cn("h-4 w-4", item.color)} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{item.text}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Alerts + Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-copper" />
                <CardTitle className="text-base">Alerts</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map((alert, i) => (
                  <Link
                    key={i}
                    href={alert.link}
                    className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-mist"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant={alert.severity}>{alert.text}</Badge>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/resources/pending">
                <Button className="w-full gap-2" size="sm">
                  <ShieldAlert className="h-4 w-4" />
                  Review Pending Resources
                </Button>
              </Link>
              <Link href="/admin/security">
                <Button variant="outline" className="w-full gap-2" size="sm">
                  <ShieldAlert className="h-4 w-4" />
                  View Security Logs
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
