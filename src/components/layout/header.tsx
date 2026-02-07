"use client";

import { UserButton } from "@clerk/nextjs";
import { Shield, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CreditCard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/billing", label: "Billing", icon: CreditCard },
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
          <Shield className="h-5 w-5 text-forest" />
          <span className="font-semibold text-deep-moss">Gatehouse</span>
        </Link>
      </div>

      <div className="hidden md:block" />

      <UserButton
        appearance={{
          elements: {
            avatarBox: "h-8 w-8",
          },
        }}
      />

      {mobileOpen && (
        <div className="absolute left-0 top-16 z-50 w-full border-b border-border bg-card p-4 shadow-lg md:hidden">
          <nav className="flex flex-col gap-1">
            {links.map(({ href, label, icon: Icon }) => (
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
    </header>
  );
}
