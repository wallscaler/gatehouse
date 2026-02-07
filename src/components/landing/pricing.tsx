"use client";

import { Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

const plans = [
  {
    name: "Student",
    description: "Learn and experiment for free",
    price: "0",
    interval: "",
    features: [
      "2 GPU hours/month",
      "Community templates",
      "1 concurrent instance",
      "Community support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Researcher",
    description: "For individuals and small teams",
    price: "15",
    interval: "/month",
    features: [
      "50 GPU hours/month",
      "All templates",
      "3 concurrent instances",
      "SSH key management",
      "Priority support",
      "API access",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Researcher Pro",
    description: "For serious ML workloads",
    price: "49",
    interval: "/month",
    features: [
      "200 GPU hours/month",
      "All templates + custom images",
      "10 concurrent instances",
      "Team collaboration",
      "Dedicated support",
      "Webhook integrations",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For organizations at scale",
    price: "199",
    interval: "/month",
    features: [
      "Unlimited GPU hours",
      "Custom images + private registry",
      "Unlimited instances",
      "SSO / SAML",
      "SLA guarantee",
      "Dedicated account manager",
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
            Start free, scale as you grow. Pay only for what you use.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
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
                    {plan.price === "0" ? "Free" : `$${plan.price}`}
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
