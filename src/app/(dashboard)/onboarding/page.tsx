"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Shield,
  UserCheck,
  Key,
  CreditCard,
  Users,
  Code,
  Check,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  completed: boolean;
  action: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export default function OnboardingPage() {
  const [steps, setSteps] = useState<Step[]>([
    {
      id: "account",
      title: "Create your account",
      description: "Sign up and verify your email address.",
      icon: UserCheck,
      completed: true,
      action: {
        label: "Completed",
      },
    },
    {
      id: "paystack",
      title: "Set up your Paystack keys",
      description:
        "Connect your Paystack account to start accepting payments.",
      icon: Key,
      completed: false,
      action: {
        label: "Configure",
        href: "/settings",
      },
    },
    {
      id: "plan",
      title: "Create your first plan",
      description:
        "Define pricing plans that your customers can subscribe to.",
      icon: CreditCard,
      completed: false,
      action: {
        label: "Go to billing",
        href: "/billing",
      },
    },
    {
      id: "team",
      title: "Invite your team",
      description: "Add team members to collaborate on your project.",
      icon: Users,
      completed: false,
      action: {
        label: "Manage team",
        href: "/team",
      },
    },
    {
      id: "api-keys",
      title: "Generate API keys",
      description:
        "Create API keys to integrate Polaris Cloud with your application.",
      icon: Code,
      completed: false,
      action: {
        label: "Get API keys",
        href: "/settings",
      },
    },
  ]);

  const completedCount = steps.filter((s) => s.completed).length;
  const progress = (completedCount / steps.length) * 100;

  function toggleStep(id: string) {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === id ? { ...step, completed: !step.completed } : step
      )
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-forest" />
          <h1 className="text-2xl font-bold text-deep-moss">
            Welcome to Polaris Cloud!
          </h1>
        </div>
        <p className="text-muted-foreground">
          Let&apos;s get your SaaS set up in 5 minutes.
        </p>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Setup progress</span>
          <span className="font-medium text-foreground">
            {completedCount} of {steps.length} completed
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-mist">
          <div
            className="h-full rounded-full bg-forest transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <Card
              key={step.id}
              className={cn(
                "transition-colors",
                step.completed && "border-forest/30 bg-forest/5"
              )}
            >
              <CardContent className="flex items-center gap-4 p-4">
                {/* Checkbox */}
                <button
                  onClick={() => toggleStep(step.id)}
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors",
                    step.completed
                      ? "border-forest bg-forest text-white"
                      : "border-border bg-muted hover:border-lichen"
                  )}
                  aria-label={
                    step.completed
                      ? `Mark "${step.title}" as incomplete`
                      : `Mark "${step.title}" as complete`
                  }
                >
                  {step.completed && <Check className="h-4 w-4" />}
                </button>

                {/* Icon */}
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                    step.completed
                      ? "bg-forest/10 text-forest"
                      : "bg-mist text-muted-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <CardTitle
                    className={cn(
                      "text-sm font-medium",
                      step.completed && "text-muted-foreground line-through"
                    )}
                  >
                    <span className="mr-2 text-muted-foreground">
                      {index + 1}.
                    </span>
                    {step.title}
                  </CardTitle>
                  <CardDescription className="mt-0.5 text-xs">
                    {step.description}
                  </CardDescription>
                </div>

                {/* Action */}
                {step.action.href && !step.completed ? (
                  <Link href={step.action.href} className="shrink-0">
                    <Button variant="outline" size="sm" className="gap-1">
                      {step.action.label}
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                ) : step.completed ? (
                  <span className="shrink-0 text-xs font-medium text-forest">
                    Done
                  </span>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer CTA */}
      {completedCount === steps.length && (
        <div className="rounded-xl border border-forest/30 bg-forest/5 p-6 text-center">
          <h2 className="text-lg font-semibold text-foreground">
            You&apos;re all set!
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your Polaris Cloud setup is complete. Head to your dashboard to get
            started.
          </p>
          <Link href="/dashboard" className="mt-4 inline-block">
            <Button className="gap-1">
              Go to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
