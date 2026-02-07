import { Store, Rocket, CreditCard, LayoutDashboard, Users, Terminal } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const features = [
  {
    icon: Store,
    title: "GPU Marketplace",
    description:
      "Browse available GPUs from providers worldwide. Filter by model, VRAM, region, and price to find the right fit for your workload.",
  },
  {
    icon: Rocket,
    title: "Instant Deploy",
    description:
      "Go from zero to running instance in under 30 seconds. Pre-configured templates for PyTorch, TensorFlow, JAX, and more.",
  },
  {
    icon: CreditCard,
    title: "Paystack Billing",
    description:
      "Pay in Naira, Cedis, Rand, or USD. Automatic invoicing, usage-based billing, and local payment methods built in.",
  },
  {
    icon: LayoutDashboard,
    title: "Template Library",
    description:
      "Start with pre-built environments for popular frameworks. Fine-tuning, inference, training, and notebook templates ready to go.",
  },
  {
    icon: Users,
    title: "Team Management",
    description:
      "Invite collaborators, set spending limits, and share instances. Role-based access keeps your team organized and secure.",
  },
  {
    icon: Terminal,
    title: "API Access",
    description:
      "Full REST API and CLI tool for programmatic control. Automate deployments, monitor instances, and integrate into your pipeline.",
  },
];

export function Features() {
  return (
    <section id="features" className="bg-soft-sage py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-deep-moss md:text-4xl">
            Everything you need to train and deploy
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            GPU compute, billing, and collaboration — wired together and ready to ship.
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
