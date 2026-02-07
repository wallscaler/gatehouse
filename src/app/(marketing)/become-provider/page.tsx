"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pickaxe,
  Server,
  ShieldCheck,
  DollarSign,
  Zap,
  Wifi,
  Terminal,
  HardDrive,
  Cpu,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: Server,
    title: "Register your hardware",
    description:
      "Add your GPU or CPU specs, connection details, and set your asking price.",
  },
  {
    icon: ShieldCheck,
    title: "Pass verification",
    description:
      "Our automated system tests your machine, then a verifier confirms performance benchmarks.",
  },
  {
    icon: DollarSign,
    title: "Set your price",
    description:
      "Choose your hourly rate. We suggest competitive pricing based on similar hardware on the network.",
  },
  {
    icon: Zap,
    title: "Start earning",
    description:
      "Once approved, your resource goes live. Clients rent it, you earn. Payouts sent to your bank.",
  },
];

const gpuEstimates: { model: string; monthly: number }[] = [
  { model: "NVIDIA RTX 3090", monthly: 450000 },
  { model: "NVIDIA RTX 4090", monthly: 750000 },
  { model: "NVIDIA A100 80GB", monthly: 1200000 },
  { model: "NVIDIA H100", monthly: 2400000 },
];

const requirements = [
  {
    icon: Terminal,
    title: "Docker installed",
    description: "Docker Engine running and accessible via the rental user.",
  },
  {
    icon: Wifi,
    title: "Stable internet",
    description:
      "Minimum 100 Mbps with less than 50ms latency to regional hub.",
  },
  {
    icon: Server,
    title: "SSH access",
    description:
      "Open SSH port (22 or custom) reachable from Gatehouse verifiers.",
  },
  {
    icon: HardDrive,
    title: "Minimum specs",
    description:
      "At least 4 CPU cores, 16GB RAM, 100GB storage. GPU resources need CUDA-compatible card.",
  },
];

const faqs: { question: string; answer: string }[] = [
  {
    question: "How much can I realistically earn?",
    answer:
      "Earnings depend on your hardware, uptime, and demand in your region. An RTX 3090 running at 70% utilization typically earns around \u20A6450,000/month. Higher-end GPUs like the A100 or H100 can earn significantly more. Providers in regions with high demand (Lagos, Nairobi, Accra) tend to see better utilization rates.",
  },
  {
    question: "What happens during verification?",
    answer:
      "After you register, our automated system connects to your machine via SSH, runs benchmark tests (GPU compute, CPU, memory, disk I/O, network speed), and checks that Docker is properly configured. A human verifier then reviews the results. The whole process typically takes 24-48 hours.",
  },
  {
    question: "How do payouts work?",
    answer:
      "Earnings accumulate as clients rent your resource. You can request payouts at any time once your balance exceeds \u20A610,000. Payouts are sent to your linked Nigerian bank account via Paystack and typically arrive within 24 hours. We charge a 15% platform fee on all earnings.",
  },
  {
    question: "Is my data safe? Who accesses my machine?",
    answer:
      "Clients run their workloads inside isolated Docker containers with strict resource limits. They cannot access your host system, other containers, or any of your personal data. Gatehouse enforces network isolation and monitors all container activity. You can also set up dedicated rental partitions.",
  },
  {
    question: "Can I use my machine while it's listed?",
    answer:
      "Yes, but with caveats. When your resource is actively rented, the client gets dedicated access to the GPU/CPU cores you listed. You can still use the machine for other tasks as long as they don't conflict. When idle (not rented), your machine is fully yours. Enable the 'mining when idle' option to earn even when no one is renting.",
  },
];

export default function BecomeProviderPage() {
  const [selectedGpu, setSelectedGpu] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <section className="relative overflow-hidden bg-soft-sage">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex items-center gap-2 rounded-full border border-copper/30 bg-copper/10 px-4 py-2 text-sm text-copper shadow-sm">
              <Pickaxe className="h-4 w-4" />
              Gatehouse Provider Program
            </div>

            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground md:text-6xl">
              Monetize Your{" "}
              <span className="text-copper">Idle GPUs</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Turn your computing power into passive income on Africa&apos;s GPU
              cloud. Join hundreds of providers earning from their hardware.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="gap-2 bg-copper text-white hover:bg-copper/90"
                >
                  Start Earning
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#calculator">
                <Button variant="outline" size="lg">
                  See Earnings Estimates
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border bg-background py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground">
              How It Works
            </h2>
            <p className="mt-3 text-muted-foreground">
              Four simple steps to start earning from your hardware.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="relative text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-copper/15">
                    <Icon className="h-7 w-7 text-copper" />
                  </div>
                  <span className="mt-3 inline-block rounded-full bg-mist px-2.5 py-0.5 text-xs font-bold text-muted-foreground">
                    Step {idx + 1}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Earnings calculator */}
      <section
        id="calculator"
        className="border-t border-border bg-soft-sage py-20"
      >
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground">
              Earnings Calculator
            </h2>
            <p className="mt-3 text-muted-foreground">
              Estimate your monthly earnings based on your GPU model.
            </p>
          </div>

          <Card className="mt-10">
            <CardContent className="p-8">
              <div className="grid gap-6 md:grid-cols-2">
                {/* GPU selector */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-foreground">
                    Select Your GPU
                  </label>
                  <div className="space-y-2">
                    {gpuEstimates.map((gpu, idx) => (
                      <button
                        key={gpu.model}
                        onClick={() => setSelectedGpu(idx)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                          selectedGpu === idx
                            ? "border-copper bg-copper/10 text-copper"
                            : "border-border bg-mist text-muted-foreground hover:border-copper/30 hover:text-foreground"
                        )}
                      >
                        <Cpu className="h-4 w-4 shrink-0" />
                        {gpu.model}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Estimate display */}
                <div className="flex flex-col items-center justify-center rounded-xl bg-mist p-8">
                  <p className="text-sm font-medium text-muted-foreground">
                    Estimated Monthly Earnings
                  </p>
                  <p className="mt-2 text-4xl font-bold text-copper md:text-5xl">
                    {"\u20A6"}
                    {gpuEstimates[selectedGpu].monthly.toLocaleString()}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    per month
                  </p>
                  <p className="mt-4 text-center text-xs text-muted-foreground">
                    Based on 70% average utilization.
                    <br />
                    Actual earnings vary by demand and uptime.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Requirements */}
      <section className="border-t border-border bg-background py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground">
              Requirements
            </h2>
            <p className="mt-3 text-muted-foreground">
              Make sure your machine meets these minimum requirements before
              registering.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {requirements.map((req) => {
              const Icon = req.icon;
              return (
                <Card key={req.title}>
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className="rounded-lg bg-forest/15 p-2.5">
                      <Icon className="h-5 w-5 text-forest" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {req.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {req.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-soft-sage py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-muted-foreground">
              Everything you need to know about providing compute on Gatehouse.
            </p>
          </div>

          <div className="mt-10 space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <Card key={idx}>
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-5 text-left"
                  >
                    <span className="pr-4 font-medium text-foreground">
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5 shrink-0 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="border-t border-border px-5 pb-5 pt-3">
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border bg-background py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-copper/15">
            <Pickaxe className="h-8 w-8 text-copper" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-foreground">
            Ready to start earning?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Join the Gatehouse provider network and turn your idle hardware into
            a revenue stream.
          </p>
          <div className="mt-8">
            <Link href="/sign-up">
              <Button
                size="lg"
                className="gap-2 bg-copper text-white hover:bg-copper/90"
              >
                Register as a Provider
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
