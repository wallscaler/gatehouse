import { Shield, CreditCard, LayoutDashboard, Zap, Globe, Lock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const features = [
  {
    icon: Shield,
    title: "Clerk Authentication",
    description:
      "Sign-up, sign-in, user management, and session handling — all pre-configured and production-ready.",
  },
  {
    icon: CreditCard,
    title: "Paystack Billing",
    description:
      "Accept payments in Naira, Cedis, Rand, and more. Subscriptions, one-time payments, and invoicing built in.",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard Ready",
    description:
      "A complete dashboard with sidebar navigation, subscription management, and user settings.",
  },
  {
    icon: Zap,
    title: "Webhook Sync",
    description:
      "Clerk and Paystack webhooks are wired together. User creates an account, billing profile follows automatically.",
  },
  {
    icon: Globe,
    title: "Built for Africa",
    description:
      "Paystack handles local payment methods — bank transfers, mobile money, USSD — so your users can pay how they prefer.",
  },
  {
    icon: Lock,
    title: "TypeScript First",
    description:
      "Full type safety from API routes to database queries. Catch errors before they reach production.",
  },
];

export function Features() {
  return (
    <section id="features" className="bg-soft-sage py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-deep-moss md:text-4xl">
            Everything you need to launch
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Auth, payments, and a dashboard — wired together and ready to ship.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="border-border/50">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-forest/10">
                  <Icon className="h-5 w-5 text-forest" />
                </div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
