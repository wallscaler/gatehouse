"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  Settings,
  Shield,
  KeyRound,
  Key,
  Users,
  BarChart3,
  Webhook,
  Bell,
  Server,
  Box,
  Pickaxe,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";

const platformLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/compute", label: "Compute", icon: Server },
  { href: "/instances", label: "My Instances", icon: Box },
  { href: "/ssh-keys", label: "SSH Keys", icon: KeyRound },
];

const accountLinks = [
  { href: "/api-keys", label: "API Keys", icon: Key },
  { href: "/usage", label: "Usage", icon: BarChart3 },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/team", label: "Team", icon: Users },
  { href: "/webhooks", label: "Webhooks", icon: Webhook },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 border-r border-border bg-soft-sage md:flex md:flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <Shield className="h-6 w-6 text-forest" />
        <span className="text-lg font-semibold text-deep-moss">Gatehouse</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-4">
        {/* Platform section */}
        <span className="mb-1 mt-1 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Platform
        </span>
        {platformLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === href
                ? "bg-forest text-white"
                : "text-muted-foreground hover:bg-mist hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}

        {/* Account section */}
        <span className="mb-1 mt-4 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Account
        </span>
        {accountLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === href
                ? "bg-forest text-white"
                : "text-muted-foreground hover:bg-mist hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}

        {/* Bottom links */}
        <div className="mt-auto border-t border-border pt-4">
          <Link
            href="/provider/dashboard"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-copper transition-colors hover:bg-mist"
          >
            <Pickaxe className="h-4 w-4" />
            Provider Portal
          </Link>
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-mist hover:text-foreground"
          >
            <ShieldAlert className="h-4 w-4" />
            Admin
          </Link>
        </div>
      </nav>
    </aside>
  );
}
