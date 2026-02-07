import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Changelog — Polaris Cloud",
  description:
    "See what's new in Polaris Cloud. Latest updates, features, and improvements.",
};

interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  description: string;
  changes: string[];
}

const entries: ChangelogEntry[] = [
  {
    version: "v0.3.0",
    date: "January 28, 2026",
    title: "Team Management",
    description:
      "Collaborate with your team. Invite members, assign roles, and manage access from the dashboard.",
    changes: [
      "Added team creation and settings page",
      "Email-based invite system with pending/accepted states",
      "Role management — Owner, Admin, and Member roles",
      "Team members list with role badges and remove action",
      "API routes for team CRUD operations",
      "Team-scoped data isolation in queries",
    ],
  },
  {
    version: "v0.2.0",
    date: "January 14, 2026",
    title: "Analytics Dashboard",
    description:
      "Understand your usage at a glance with the new analytics dashboard and activity feed.",
    changes: [
      "Dashboard overview with key metrics cards",
      "Usage analytics with monthly trends",
      "Activity feed showing recent account events",
      "Subscription status widget with plan details",
      "Responsive chart components using Recharts",
      "Date range filtering for analytics data",
    ],
  },
  {
    version: "v0.1.0",
    date: "December 20, 2025",
    title: "Initial Release",
    description:
      "The first release of Polaris Cloud — a SaaS starter kit with Clerk authentication and Paystack billing, built for Africa.",
    changes: [
      "Clerk authentication with dark-themed sign-in/sign-up pages",
      "Paystack billing integration with plan selection",
      "Subscription management — upgrade, downgrade, cancel",
      "Webhook handlers for Paystack events",
      "Dashboard layout with sidebar navigation",
      "Landing page with hero, features, and pricing sections",
      "Dark mode interface with forest green palette",
      "PostgreSQL database with Prisma ORM",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      {/* Page header */}
      <div className="mb-16 text-center">
        <Badge className="mb-4">Changelog</Badge>
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          What&apos;s New
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          All the latest updates, features, and improvements to Polaris Cloud.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[7px] top-2 bottom-0 w-px bg-border" />

        <div className="space-y-16">
          {entries.map((entry, index) => (
            <article key={entry.version} className="relative pl-10">
              {/* Timeline dot */}
              <div className="absolute left-0 top-1.5 flex h-[15px] w-[15px] items-center justify-center">
                <div className="h-[15px] w-[15px] rounded-full border-2 border-forest bg-background" />
                <div className="absolute h-[7px] w-[7px] rounded-full bg-forest" />
              </div>

              {/* Version and date */}
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <Badge variant="success">{entry.version}</Badge>
                <span className="text-sm text-muted-foreground">
                  {entry.date}
                </span>
              </div>

              {/* Title and description */}
              <h2 className="mb-2 text-xl font-bold text-foreground">
                {entry.title}
              </h2>
              <p className="mb-4 text-muted-foreground">{entry.description}</p>

              {/* Changes list */}
              <ul className="space-y-2">
                {entry.changes.map((change) => (
                  <li key={change} className="flex items-start gap-3 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-forest/60" />
                    <span className="text-muted-foreground">{change}</span>
                  </li>
                ))}
              </ul>

              {/* Separator (except last) */}
              {index < entries.length - 1 && (
                <div className="mt-16 border-b border-border" />
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
