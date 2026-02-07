"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WebhookRow, type WebhookEvent } from "@/components/webhooks/webhook-row";
import { useToast } from "@/components/ui/toast";
import { Webhook, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

const mockEvents: WebhookEvent[] = [
  {
    id: "wh_1",
    eventType: "user.created",
    source: "Clerk",
    status: "success",
    timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    payload: {
      type: "user.created",
      data: {
        id: "user_2abc123",
        email_addresses: [{ email_address: "amara@example.com" }],
        first_name: "Amara",
        last_name: "Obi",
        created_at: 1706900000000,
      },
    },
  },
  {
    id: "wh_2",
    eventType: "charge.success",
    source: "Paystack",
    status: "success",
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    payload: {
      event: "charge.success",
      data: {
        id: 3045,
        reference: "TXN_abc123def",
        amount: 500000,
        currency: "NGN",
        customer: { email: "amara@example.com" },
        status: "success",
        paid_at: "2026-02-07T10:15:00.000Z",
      },
    },
  },
  {
    id: "wh_3",
    eventType: "invoice.payment_failed",
    source: "Paystack",
    status: "failed",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    payload: {
      event: "invoice.payment_failed",
      data: {
        id: 8821,
        invoice_code: "INV_xyz789",
        amount: 250000,
        currency: "NGN",
        customer: { email: "chidi@example.com" },
        description: "Monthly Pro subscription",
        status: "failed",
        reason: "insufficient_funds",
      },
    },
  },
  {
    id: "wh_4",
    eventType: "user.deleted",
    source: "Clerk",
    status: "success",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    payload: {
      type: "user.deleted",
      data: {
        id: "user_2def456",
        deleted: true,
      },
    },
  },
  {
    id: "wh_5",
    eventType: "subscription.disable",
    source: "Paystack",
    status: "success",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    payload: {
      event: "subscription.disable",
      data: {
        subscription_code: "SUB_abc456",
        customer: { email: "ngozi@example.com" },
        plan: { name: "Pro Plan", amount: 500000 },
        status: "non-renewing",
      },
    },
  },
  {
    id: "wh_6",
    eventType: "charge.success",
    source: "Paystack",
    status: "success",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    payload: {
      event: "charge.success",
      data: {
        id: 3021,
        reference: "TXN_ghi789abc",
        amount: 250000,
        currency: "NGN",
        customer: { email: "emeka@example.com" },
        status: "success",
        paid_at: "2026-02-07T05:30:00.000Z",
      },
    },
  },
  {
    id: "wh_7",
    eventType: "user.created",
    source: "Clerk",
    status: "success",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    payload: {
      type: "user.created",
      data: {
        id: "user_2ghi789",
        email_addresses: [{ email_address: "kemi@example.com" }],
        first_name: "Kemi",
        last_name: "Adeyemi",
        created_at: 1706850000000,
      },
    },
  },
  {
    id: "wh_8",
    eventType: "invoice.payment_failed",
    source: "Paystack",
    status: "failed",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    payload: {
      event: "invoice.payment_failed",
      data: {
        id: 8799,
        invoice_code: "INV_lmn012",
        amount: 500000,
        currency: "NGN",
        customer: { email: "tunde@example.com" },
        description: "Monthly Business subscription",
        status: "failed",
        reason: "card_expired",
      },
    },
  },
  {
    id: "wh_9",
    eventType: "charge.success",
    source: "Paystack",
    status: "success",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    payload: {
      event: "charge.success",
      data: {
        id: 2998,
        reference: "TXN_opq345rst",
        amount: 100000,
        currency: "NGN",
        customer: { email: "fatima@example.com" },
        status: "success",
        paid_at: "2026-02-06T16:00:00.000Z",
      },
    },
  },
  {
    id: "wh_10",
    eventType: "user.created",
    source: "Clerk",
    status: "failed",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    payload: {
      type: "user.created",
      data: {
        id: "user_2jkl012",
        email_addresses: [{ email_address: "bola@example.com" }],
        first_name: "Bola",
        last_name: "Akinwale",
      },
      error: "Database sync failed: connection timeout",
    },
  },
  {
    id: "wh_11",
    eventType: "subscription.disable",
    source: "Paystack",
    status: "success",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    payload: {
      event: "subscription.disable",
      data: {
        subscription_code: "SUB_mno789",
        customer: { email: "yemi@example.com" },
        plan: { name: "Starter Plan", amount: 100000 },
        status: "cancelled",
      },
    },
  },
  {
    id: "wh_12",
    eventType: "charge.success",
    source: "Paystack",
    status: "success",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    payload: {
      event: "charge.success",
      data: {
        id: 2950,
        reference: "TXN_uvw678xyz",
        amount: 500000,
        currency: "NGN",
        customer: { email: "ada@example.com" },
        status: "success",
        paid_at: "2026-02-05T09:00:00.000Z",
      },
    },
  },
];

type SourceFilter = "all" | "Clerk" | "Paystack";
type StatusFilter = "all" | "success" | "failed";

export default function WebhooksPage() {
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const { addToast } = useToast();

  const filteredEvents = mockEvents.filter((event) => {
    if (sourceFilter !== "all" && event.source !== sourceFilter) return false;
    if (statusFilter !== "all" && event.status !== statusFilter) return false;
    return true;
  });

  function handleRetry(id: string) {
    addToast({
      title: "Webhook retry queued",
      description: `Event ${id} has been queued for retry.`,
      variant: "info",
    });
  }

  const successCount = mockEvents.filter((e) => e.status === "success").length;
  const failedCount = mockEvents.filter((e) => e.status === "failed").length;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-deep-moss">Webhook Logs</h1>
        <p className="mt-1 text-muted-foreground">
          Monitor incoming webhook events from Clerk and Paystack.
        </p>
      </div>

      {/* Summary badges */}
      <div className="flex items-center gap-3">
        <Badge variant="default" className="gap-1.5">
          <Webhook className="h-3 w-3" />
          {mockEvents.length} total
        </Badge>
        <Badge variant="success">{successCount} success</Badge>
        <Badge variant="destructive">{failedCount} failed</Badge>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Filter className="h-4 w-4 text-forest" />
                Filters
              </CardTitle>
              <CardDescription className="mt-1">
                Narrow down webhook events by source or status.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-6">
            {/* Source filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Source
              </label>
              <div className="flex gap-1.5">
                {(["all", "Clerk", "Paystack"] as SourceFilter[]).map((source) => (
                  <Button
                    key={source}
                    variant={sourceFilter === source ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSourceFilter(source)}
                    className={cn(
                      "capitalize",
                      sourceFilter === source && "shadow-sm"
                    )}
                  >
                    {source === "all" ? "All" : source}
                  </Button>
                ))}
              </div>
            </div>

            {/* Status filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </label>
              <div className="flex gap-1.5">
                {(["all", "success", "failed"] as StatusFilter[]).map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                    className="capitalize"
                  >
                    {status === "all" ? "All" : status}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Event list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Recent Events
            {filteredEvents.length !== mockEvents.length && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({filteredEvents.length} of {mockEvents.length})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredEvents.length === 0 ? (
            <div className="px-6 pb-6 text-center text-sm text-muted-foreground">
              No webhook events match the current filters.
            </div>
          ) : (
            <div className="border-t border-border">
              {filteredEvents.map((event) => (
                <WebhookRow key={event.id} event={event} onRetry={handleRetry} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
