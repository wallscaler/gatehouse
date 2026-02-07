import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

      {children}

      <Footer />
    </div>
  );
}
