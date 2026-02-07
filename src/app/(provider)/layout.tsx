"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Server,
  PlusCircle,
  Wallet,
  Settings,
  Pickaxe,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ToastProvider } from "@/components/ui/toast";
import { useState } from "react";

const providerLinks = [
  { href: "/provider/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/provider/resources", label: "My Resources", icon: Server },
  { href: "/provider/resources/register", label: "Register Resource", icon: PlusCircle },
  { href: "/provider/earnings", label: "Earnings", icon: Wallet },
  { href: "/provider/settings", label: "Settings", icon: Settings },
];

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="flex min-h-screen">
        {/* Provider Sidebar */}
        <aside className="hidden w-64 border-r border-border bg-soft-sage md:block">
          <div className="flex h-16 items-center gap-2 border-b border-border px-6">
            <Pickaxe className="h-6 w-6 text-copper" />
            <span className="text-lg font-semibold text-deep-moss">
              Polaris Cloud
            </span>
            <span className="ml-auto rounded-md bg-copper/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-copper">
              Provider
            </span>
          </div>
          <nav className="flex flex-col gap-1 p-4">
            {providerLinks.map(({ href, label, icon: Icon }) => (
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
          </nav>
        </aside>

        {/* Main content area */}
        <div className="flex flex-1 flex-col">
          {/* Provider Header */}
          <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
            <div className="flex items-center gap-3 md:hidden">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="rounded-lg p-2 hover:bg-mist"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2">
                <Pickaxe className="h-5 w-5 text-copper" />
                <span className="font-semibold text-deep-moss">Polaris Cloud</span>
                <span className="rounded-md bg-copper/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-copper">
                  Provider
                </span>
              </div>
            </div>

            <div className="hidden items-center gap-2 md:flex">
              <span className="text-sm text-muted-foreground">
                Polaris Cloud Provider
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-mist hover:text-foreground"
              >
                Client Dashboard
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8",
                  },
                }}
              />
            </div>
          </header>

          {/* Mobile sidebar */}
          {mobileOpen && (
            <div className="absolute left-0 top-16 z-50 w-full border-b border-border bg-card p-4 shadow-lg md:hidden">
              <nav className="flex flex-col gap-1">
                {providerLinks.map(({ href, label, icon: Icon }) => (
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
              </nav>
            </div>
          )}

          <main className="flex-1 bg-soft-sage p-6">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
