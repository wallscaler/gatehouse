"use client";

import { UserButton } from "@clerk/nextjs";
import {
  Shield,
  Menu,
  Bell,
  LayoutDashboard,
  CreditCard,
  Users,
  Settings,
  BarChart3,
  Server,
  Box,
  KeyRound,
  Key,
  Webhook,
  AppWindow,
  Pickaxe,
  ShieldAlert,
  HardDrive,
  Database,
  Brain,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const platformLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/compute", label: "Compute", icon: Server },
  { href: "/apps", label: "Apps", icon: AppWindow },
  { href: "/instances", label: "My Instances", icon: Box },
  { href: "/ssh-keys", label: "SSH Keys", icon: KeyRound },
];

const serviceLinks = [
  { href: "/storage", label: "Storage", icon: HardDrive },
  { href: "/databases", label: "Databases", icon: Database },
  { href: "/models", label: "AI Models", icon: Brain },
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

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 hover:bg-mist"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/dashboard" className="flex items-center gap-2">
          <img src="/logo-mark-white.svg" alt="Polaris" className="h-5 w-5" />
          <span className="font-semibold text-deep-moss">Polaris</span>
        </Link>
      </div>

      <div className="hidden md:block" />

      <div className="flex items-center gap-3">
        <Link
          href="/notifications"
          className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-mist hover:text-foreground"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-forest text-[10px] font-bold text-white">
            4
          </span>
        </Link>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-8 w-8",
            },
          }}
        />
      </div>

      {mobileOpen && (
        <div className="absolute left-0 top-16 z-50 w-full border-b border-border bg-card p-4 shadow-lg md:hidden">
          <nav className="flex flex-col gap-1">
            {/* Platform section */}
            <span className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Platform
            </span>
            {platformLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
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

            {/* Services section */}
            <span className="mb-1 mt-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Services
            </span>
            {serviceLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
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
            <span className="mb-1 mt-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Account
            </span>
            {accountLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
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
            <div className="mt-3 border-t border-border pt-3">
              <Link
                href="/provider/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-copper transition-colors hover:bg-mist"
              >
                <Pickaxe className="h-4 w-4" />
                Provider Portal
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-mist hover:text-foreground"
              >
                <ShieldAlert className="h-4 w-4" />
                Admin
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
