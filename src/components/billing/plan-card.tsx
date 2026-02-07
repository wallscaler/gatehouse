"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

interface PlanCardProps {
  name: string;
  description: string;
  amount: number;
  interval: string;
  currency?: string;
  features: string[];
  planCode: string;
  isCurrentPlan?: boolean;
  isPopular?: boolean;
  onSubscribe: (planCode: string) => void;
  loading?: boolean;
}

export function PlanCard({
  name,
  description,
  amount,
  interval,
  currency = "NGN",
  features,
  planCode,
  isCurrentPlan = false,
  isPopular = false,
  onSubscribe,
  loading = false,
}: PlanCardProps) {
  return (
    <Card
      className={cn(
        "relative flex flex-col",
        isPopular && "border-forest shadow-md"
      )}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge variant="success">Most Popular</Badge>
        </div>
      )}
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="mb-6">
          <span className="text-3xl font-bold text-deep-moss">
            {amount === 0 ? "Free" : formatCurrency(amount, currency)}
          </span>
          {amount > 0 && (
            <span className="text-muted-foreground">/{interval}</span>
          )}
        </div>
        <ul className="space-y-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-fern" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={isCurrentPlan ? "outline" : "default"}
          disabled={isCurrentPlan || loading}
          onClick={() => onSubscribe(planCode)}
        >
          {isCurrentPlan ? "Current Plan" : loading ? "Processing..." : "Subscribe"}
        </Button>
      </CardFooter>
    </Card>
  );
}
