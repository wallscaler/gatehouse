export const dynamic = "force-dynamic";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Pricing } from "@/components/landing/pricing";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-forest" />
            <span className="text-lg font-semibold text-deep-moss">
              Gatehouse
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <SignedOut>
              <Link href="/sign-in">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm">Get Started</Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button size="sm">Dashboard</Button>
              </Link>
            </SignedIn>
          </div>
        </div>
      </nav>

      <Hero />
      <Features />
      <Pricing />
      <Footer />
    </div>
  );
}
