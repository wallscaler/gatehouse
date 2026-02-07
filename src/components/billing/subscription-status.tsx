"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";

interface SubscriptionStatusProps {
  planName: string | null;
  status: "active" | "cancelled" | "past_due" | null;
  currentPeriodEnd: string | null;
}

export function SubscriptionStatus({
  planName,
  status,
  currentPeriodEnd,
}: SubscriptionStatusProps) {
  const statusVariant = {
    active: "success" as const,
    cancelled: "destructive" as const,
    past_due: "warning" as const,
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3">
        <CreditCard className="h-5 w-5 text-forest" />
        <CardTitle>Subscription</CardTitle>
      </CardHeader>
      <CardContent>
        {planName && status ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Plan</span>
              <span className="text-sm">{planName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status</span>
              <Badge variant={statusVariant[status]}>{status}</Badge>
            </div>
            {currentPeriodEnd && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Renews</span>
                <span className="text-sm">
                  {new Date(currentPeriodEnd).toLocaleDateString("en-NG", {
                    dateStyle: "medium",
                  })}
                </span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            You&apos;re on the free plan. Upgrade to unlock more features.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
