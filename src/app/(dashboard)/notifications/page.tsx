"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  UserX,
  UserPlus,
  KeyRound,
  AlertTriangle,
  CheckCheck,
  Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "payment" | "subscription_cancelled" | "invite_accepted" | "api_key_created" | "usage_warning";
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

const iconMap = {
  payment: CreditCard,
  subscription_cancelled: UserX,
  invite_accepted: UserPlus,
  api_key_created: KeyRound,
  usage_warning: AlertTriangle,
};

const iconColorMap = {
  payment: "text-fern",
  subscription_cancelled: "text-red-400",
  invite_accepted: "text-forest",
  api_key_created: "text-copper",
  usage_warning: "text-copper",
};

function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}

const initialNotifications: Notification[] = [
  {
    id: "n_1",
    type: "payment",
    title: "Payment received",
    description: "Amara Obi paid NGN 5,000 for the Pro Plan subscription.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    read: false,
  },
  {
    id: "n_2",
    type: "subscription_cancelled",
    title: "Subscription cancelled",
    description: "Ngozi Eze cancelled their Pro Plan subscription. Access expires Feb 28.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
  },
  {
    id: "n_3",
    type: "invite_accepted",
    title: "Team invite accepted",
    description: "Emeka Okafor accepted the invitation to join your workspace.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: false,
  },
  {
    id: "n_4",
    type: "api_key_created",
    title: "API key created",
    description: "A new API key ending in ...7f3a was created for production environment.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    read: false,
  },
  {
    id: "n_5",
    type: "usage_warning",
    title: "Usage limit warning",
    description: "Your workspace has used 85% of the monthly API request quota.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    read: true,
  },
  {
    id: "n_6",
    type: "payment",
    title: "Payment received",
    description: "Kemi Adeyemi paid NGN 2,500 for the Starter Plan subscription.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    read: true,
  },
  {
    id: "n_7",
    type: "invite_accepted",
    title: "Team invite accepted",
    description: "Fatima Ibrahim accepted the invitation to join your workspace.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    read: true,
  },
  {
    id: "n_8",
    type: "subscription_cancelled",
    title: "Subscription cancelled",
    description: "Yemi Bakare cancelled their Starter Plan subscription. Access expires Mar 5.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true,
  },
  {
    id: "n_9",
    type: "api_key_created",
    title: "API key created",
    description: "A new API key ending in ...9c2e was created for staging environment.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    read: true,
  },
  {
    id: "n_10",
    type: "usage_warning",
    title: "Usage limit warning",
    description: "Your workspace exceeded the monthly API request quota. Overage charges may apply.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    read: true,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function toggleRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-moss">Notifications</h1>
          <p className="mt-1 text-muted-foreground">
            Stay up to date with events across your workspace.
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead} className="gap-2">
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Unread count */}
      {unreadCount > 0 && (
        <Badge variant="warning" className="gap-1.5">
          {unreadCount} unread
        </Badge>
      )}

      {/* Notification list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Notifications</CardTitle>
          <CardDescription>
            Click a notification to toggle its read state.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-t border-border">
            {notifications.map((notification) => {
              const Icon = iconMap[notification.type];
              const iconColor = iconColorMap[notification.type];

              return (
                <button
                  key={notification.id}
                  onClick={() => toggleRead(notification.id)}
                  className={cn(
                    "flex w-full items-start gap-4 border-b border-border px-6 py-4 text-left transition-colors hover:bg-mist/50 last:border-b-0",
                    !notification.read && "bg-forest/5"
                  )}
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                      !notification.read ? "bg-forest/10" : "bg-mist"
                    )}
                  >
                    <Icon className={cn("h-4 w-4", iconColor)} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "text-sm font-medium",
                          !notification.read ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {notification.title}
                      </span>
                      {!notification.read && (
                        <Circle className="h-2 w-2 fill-forest text-forest shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {notification.description}
                    </p>
                  </div>

                  {/* Timestamp */}
                  <span className="shrink-0 text-xs text-muted-foreground mt-0.5">
                    {formatRelativeTime(notification.timestamp)}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
