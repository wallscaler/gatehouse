export const dynamic = "force-dynamic";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Pricing } from "@/components/landing/pricing";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Shield, Pickaxe, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-forest" />
              <span className="text-lg font-semibold text-deep-moss">
                Gatehouse
              </span>
            </Link>
            <div className="hidden items-center gap-6 sm:flex">
              <Link
                href="#pricing"
                className="text-sm text-muted-foreground transition-colors hover:text-forest"
              >
                Pricing
              </Link>
              <Link
                href="/docs"
                className="text-sm text-muted-foreground transition-colors hover:text-forest"
              >
                Docs
              </Link>
              <Link
                href="/changelog"
                className="text-sm text-muted-foreground transition-colors hover:text-forest"
              >
                Changelog
              </Link>
            </div>
          </div>
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

      {/* Provider CTA */}
      <section className="bg-soft-sage py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-2xl border border-border bg-card p-8 md:p-12">
            <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-copper/10">
                <Pickaxe className="h-8 w-8 text-copper" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-deep-moss md:text-3xl">
                  Got idle GPUs? Start earning.
                </h2>
                <p className="mt-2 text-muted-foreground">
                  List your hardware on Gatehouse and earn revenue from
                  researchers and teams who need compute. Set your own prices,
                  manage availability, and get paid through Paystack.
                </p>
              </div>
              <Link href="/become-provider" className="shrink-0">
                <Button size="lg" variant="outline" className="gap-2 border-copper text-copper hover:bg-copper/10">
                  Become a Provider
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Pricing />
      <Footer />
    </div>
  );
}
