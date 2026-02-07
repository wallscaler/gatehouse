import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Cpu } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-soft-sage">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground shadow-sm">
            <Cpu className="h-4 w-4 text-forest" />
            GPU Cloud for Africa
          </div>

          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-deep-moss md:text-6xl">
            Africa&apos;s{" "}
            <span className="text-forest">GPU Cloud</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Access global GPU compute with local payments. Deploy AI workloads
            in seconds with Clerk auth and Paystack billing.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/sign-up">
              <Button size="lg">Start Deploying</Button>
            </Link>
            <Link href="/become-provider">
              <Button variant="outline" size="lg">
                Become a Provider
              </Button>
            </Link>
          </div>

          {/* Terminal mockup */}
          <div className="mt-16 w-full max-w-4xl rounded-xl border border-border bg-card p-4 shadow-lg">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
              <span className="ml-2 text-xs text-muted-foreground">
                ~/my-project
              </span>
            </div>
            <div className="p-4 font-mono text-sm text-muted-foreground">
              <p>
                <span className="text-fern">$</span> gatehouse deploy --gpu
                rtx4090 --template pytorch
              </p>
              <p className="mt-1 text-foreground">
                Deploying PyTorch on RTX 4090 in Lagos...
              </p>
              <p className="mt-1 text-fern">
                Done! SSH: ubuntu@gpu-01.gatehouse.cloud
              </p>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-12 grid w-full max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { value: "500+", label: "GPUs" },
              { value: "12", label: "Regions" },
              { value: "< 30s", label: "Deploy" },
              { value: "99.9%", label: "Uptime" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-forest md:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
