"use client";

import { useState } from "react";
import { PlanCard } from "@/components/billing/plan-card";
import { SubscriptionStatus } from "@/components/billing/subscription-status";

const plans = [
  {
    name: "Free",
    description: "Get started with the basics",
    amount: 0,
    interval: "month",
    features: [
      "Up to 100 users",
      "Basic analytics",
      "Community support",
      "1 project",
    ],
    planCode: "free",
    isPopular: false,
  },
  {
    name: "Pro",
    description: "For growing businesses",
    amount: 1500000, // 15,000 NGN in kobo
    interval: "month",
    features: [
      "Unlimited users",
      "Advanced analytics",
      "Priority support",
      "Unlimited projects",
      "Custom domain",
      "API access",
    ],
    planCode: "PLN_pro", // Replace with actual Paystack plan code
    isPopular: true,
  },
  {
    name: "Enterprise",
    description: "For large-scale operations",
    amount: 5000000, // 50,000 NGN in kobo
    interval: "month",
    features: [
      "Everything in Pro",
      "Dedicated support",
      "SLA guarantee",
      "Custom integrations",
      "Audit logs",
      "SSO / SAML",
    ],
    planCode: "PLN_enterprise", // Replace with actual Paystack plan code
    isPopular: false,
  },
];

export default function BillingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleSubscribe(planCode: string) {
    if (planCode === "free") return;

    setLoading(planCode);
    try {
      const res = await fetch("/api/billing/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planCode }),
      });

      const data = await res.json();

      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      }
    } catch (error) {
      console.error("Failed to subscribe:", error);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-deep-moss">Billing</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your subscription and payment details.
        </p>
      </div>

      <SubscriptionStatus
        planName={null}
        status={null}
        currentPeriodEnd={null}
      />

      <div>
        <h2 className="mb-4 text-lg font-semibold text-deep-moss">
          Available Plans
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard
              key={plan.planCode}
              {...plan}
              onSubscribe={handleSubscribe}
              loading={loading === plan.planCode}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
