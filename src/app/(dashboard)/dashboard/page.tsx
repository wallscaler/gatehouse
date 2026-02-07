export const dynamic = "force-dynamic";

import { currentUser } from "@clerk/nextjs/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SubscriptionStatus } from "@/components/billing/subscription-status";
import { LayoutDashboard, CreditCard, Settings, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await currentUser();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-deep-moss">
          Welcome back{user?.firstName ? `, ${user.firstName}` : ""}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here&apos;s an overview of your account.
        </p>
      </div>

      <SubscriptionStatus
        planName={null}
        status={null}
        currentPeriodEnd={null}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <LayoutDashboard className="h-5 w-5 text-forest" />
            <CardTitle className="text-base">Quick Start</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              This is your dashboard. Customize it to show the data that matters most to your users.
            </p>
            <Button variant="ghost" size="sm" className="gap-1">
              Learn more <ArrowRight className="h-3 w-3" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <CreditCard className="h-5 w-5 text-forest" />
            <CardTitle className="text-base">Billing</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Manage your subscription and view payment history.
            </p>
            <Link href="/billing">
              <Button variant="ghost" size="sm" className="gap-1">
                Manage billing <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Settings className="h-5 w-5 text-forest" />
            <CardTitle className="text-base">Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Update your profile, preferences, and account settings.
            </p>
            <Link href="/settings">
              <Button variant="ghost" size="sm" className="gap-1">
                Open settings <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
