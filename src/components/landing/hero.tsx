import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-soft-sage">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground shadow-sm">
            <Shield className="h-4 w-4 text-forest" />
            Auth + Payments for African SaaS
          </div>

          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-deep-moss md:text-6xl">
            Ship your SaaS with{" "}
            <span className="text-forest">auth and billing</span>{" "}
            out of the box
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Gatehouse wires Clerk authentication to Paystack payments.
            Stop building auth and billing from scratch — start building your product.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/sign-up">
              <Button size="lg">Get Started Free</Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg">
                See Features
              </Button>
            </Link>
          </div>

          <div className="mt-16 w-full max-w-4xl rounded-xl border border-border bg-card p-4 shadow-lg">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
              <span className="ml-2 text-xs text-muted-foreground">
                ~/my-saas
              </span>
            </div>
            <div className="p-4 font-mono text-sm text-muted-foreground">
              <p>
                <span className="text-fern">$</span> npx create-next-app
                --example gatehouse my-saas
              </p>
              <p className="mt-1 text-foreground">
                Creating your SaaS with Clerk auth + Paystack billing...
              </p>
              <p className="mt-1 text-fern">
                Done! Auth, payments, and dashboard ready.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
