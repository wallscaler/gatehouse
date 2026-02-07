"use client";

import { Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    description: "Get started with the basics",
    price: "0",
    interval: "",
    features: [
      "Up to 100 users",
      "Basic analytics",
      "Community support",
      "1 project",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    description: "For growing businesses",
    price: "15,000",
    interval: "/month",
    features: [
      "Unlimited users",
      "Advanced analytics",
      "Priority support",
      "Unlimited projects",
      "Custom domain",
      "API access",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For large-scale operations",
    price: "50,000",
    interval: "/month",
    features: [
      "Everything in Pro",
      "Dedicated support",
      "SLA guarantee",
      "Custom integrations",
      "Audit logs",
      "SSO / SAML",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="bg-warm-stone py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-deep-moss md:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free, scale as you grow. All prices in Nigerian Naira.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "relative flex flex-col",
                plan.popular && "border-forest shadow-lg"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="success">Most Popular</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-4xl font-bold text-deep-moss">
                    {plan.price === "0" ? "Free" : `\u20A6${plan.price}`}
                  </span>
                  {plan.interval && (
                    <span className="text-muted-foreground">{plan.interval}</span>
                  )}
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-fern" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/sign-up" className="w-full">
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
