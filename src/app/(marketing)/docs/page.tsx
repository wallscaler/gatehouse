import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Documentation — Polaris Cloud",
  description:
    "Developer documentation for Polaris Cloud. Learn how to set up Clerk authentication and Paystack billing for your African SaaS.",
};

const sections = [
  { id: "quick-start", label: "Quick Start" },
  { id: "authentication", label: "Authentication" },
  { id: "payments", label: "Payments" },
  { id: "api-reference", label: "API Reference" },
  { id: "database", label: "Database" },
  { id: "deployment", label: "Deployment" },
];

const endpoints = [
  {
    method: "GET",
    path: "/api/user/subscription",
    description: "Get the current user's active subscription and plan details",
  },
  {
    method: "POST",
    path: "/api/paystack/initialize",
    description: "Initialize a new Paystack transaction for plan purchase",
  },
  {
    method: "POST",
    path: "/api/paystack/webhook",
    description: "Handle Paystack webhook events (charge.success, subscription.*)",
  },
  {
    method: "GET",
    path: "/api/team",
    description: "List all members and pending invites for the current team",
  },
  {
    method: "POST",
    path: "/api/team/invite",
    description: "Send an invite to a new team member by email",
  },
  {
    method: "DELETE",
    path: "/api/team/members/:id",
    description: "Remove a member from the team",
  },
];

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg bg-mist p-4 font-mono text-sm text-foreground">
      <code>{children}</code>
    </pre>
  );
}

function MethodBadge({ method }: { method: string }) {
  const colorMap: Record<string, string> = {
    GET: "bg-fern/15 text-fern",
    POST: "bg-copper/15 text-copper",
    DELETE: "bg-red-900/30 text-red-400",
    PUT: "bg-forest/15 text-forest",
    PATCH: "bg-lichen/15 text-lichen",
  };

  return (
    <span
      className={`inline-flex min-w-[4.5rem] items-center justify-center rounded-md px-2 py-0.5 font-mono text-xs font-bold ${colorMap[method] ?? "bg-mist text-foreground"}`}
    >
      {method}
    </span>
  );
}

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      {/* Page header */}
      <div className="mb-12">
        <Badge className="mb-4">Documentation</Badge>
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          Polaris Cloud Developer Docs
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          Everything you need to set up Clerk authentication and Paystack
          billing for your SaaS application.
        </p>
      </div>

      <div className="flex gap-12">
        {/* Sidebar */}
        <aside className="hidden w-52 shrink-0 lg:block">
          <nav className="sticky top-24">
            <ul className="space-y-1 border-l border-border">
              {sections.map((section) => (
                <li key={section.id}>
                  <Link
                    href={`#${section.id}`}
                    className="block border-l-2 border-transparent py-1.5 pl-4 text-sm text-muted-foreground transition-colors hover:border-forest hover:text-forest"
                  >
                    {section.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 space-y-16">
          {/* Quick Start */}
          <section id="quick-start">
            <h2 className="mb-6 text-2xl font-bold text-foreground">
              Quick Start
            </h2>
            <p className="mb-6 text-muted-foreground">
              Get Polaris Cloud running locally in under five minutes.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-lichen">
                  1. Clone the repository
                </h3>
                <CodeBlock>{`git clone https://github.com/your-org/polaris-cloud.git
cd polaris-cloud`}</CodeBlock>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-lichen">
                  2. Install dependencies
                </h3>
                <CodeBlock>{`npm install`}</CodeBlock>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-lichen">
                  3. Configure environment variables
                </h3>
                <p className="mb-3 text-sm text-muted-foreground">
                  Copy the example env file and fill in your keys from the Clerk
                  and Paystack dashboards.
                </p>
                <CodeBlock>{`cp .env.example .env.local

# .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

PAYSTACK_SECRET_KEY=sk_test_...
PAYSTACK_PUBLIC_KEY=pk_test_...
NEXT_PUBLIC_APP_URL=http://localhost:3000

DATABASE_URL=postgresql://user:pass@localhost:5432/polaris`}</CodeBlock>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-lichen">
                  4. Set up the database
                </h3>
                <CodeBlock>{`npx prisma migrate dev
npx prisma generate`}</CodeBlock>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-lichen">
                  5. Start the development server
                </h3>
                <CodeBlock>{`npm run dev`}</CodeBlock>
                <p className="mt-3 text-sm text-muted-foreground">
                  Open{" "}
                  <code className="rounded bg-mist px-1.5 py-0.5 font-mono text-xs text-forest">
                    http://localhost:3000
                  </code>{" "}
                  to see the landing page. Sign up to access the dashboard.
                </p>
              </div>
            </div>
          </section>

          {/* Authentication */}
          <section id="authentication">
            <h2 className="mb-6 text-2xl font-bold text-foreground">
              Authentication
            </h2>
            <p className="mb-6 text-muted-foreground">
              Polaris Cloud uses{" "}
              <span className="text-foreground font-medium">Clerk</span> for
              authentication. User sessions, sign-up/sign-in flows, and user
              management are all handled by Clerk's hosted components.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="mb-3 text-lg font-semibold text-foreground">
                  Clerk Provider
                </h3>
                <p className="mb-3 text-sm text-muted-foreground">
                  The root layout wraps the app in{" "}
                  <code className="rounded bg-mist px-1.5 py-0.5 font-mono text-xs text-forest">
                    {"<ClerkProvider>"}
                  </code>{" "}
                  with dark mode appearance variables that match the Polaris Cloud
                  palette.
                </p>
                <CodeBlock>{`// src/app/layout.tsx
<ClerkProvider
  appearance={{
    variables: {
      colorBackground: "#111916",
      colorText: "#E8EFEB",
      colorPrimary: "#3D7A5F",
    },
  }}
>
  {children}
</ClerkProvider>`}</CodeBlock>
              </div>

              <div>
                <h3 className="mb-3 text-lg font-semibold text-foreground">
                  Middleware
                </h3>
                <p className="mb-3 text-sm text-muted-foreground">
                  Clerk's middleware protects all dashboard routes. Public routes
                  (landing page, docs, sign-in/up) are explicitly allowed.
                </p>
                <CodeBlock>{`// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/docs(.*)",
  "/changelog(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/paystack/webhook",
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});`}</CodeBlock>
              </div>

              <div>
                <h3 className="mb-3 text-lg font-semibold text-foreground">
                  Protecting Routes
                </h3>
                <p className="mb-3 text-sm text-muted-foreground">
                  Use Clerk's server-side helpers and components to gate access
                  in pages and API routes.
                </p>
                <CodeBlock>{`// Server component — redirect if unauthenticated
import { auth } from "@clerk/nextjs/server";

export default async function ProtectedPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  // ...
}

// Client component — conditional rendering
import { SignedIn, SignedOut } from "@clerk/nextjs";

<SignedIn>
  <DashboardLink />
</SignedIn>
<SignedOut>
  <SignInButton />
</SignedOut>`}</CodeBlock>
              </div>
            </div>
          </section>

          {/* Payments */}
          <section id="payments">
            <h2 className="mb-6 text-2xl font-bold text-foreground">
              Payments
            </h2>
            <p className="mb-6 text-muted-foreground">
              Billing is powered by{" "}
              <span className="text-foreground font-medium">Paystack</span>,
              the leading payment gateway across Africa. Polaris Cloud handles plan
              selection, transaction initialization, and webhook processing out
              of the box.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="mb-3 text-lg font-semibold text-foreground">
                  Initializing a Transaction
                </h3>
                <p className="mb-3 text-sm text-muted-foreground">
                  When a user selects a plan, the frontend calls the initialize
                  endpoint which creates a Paystack transaction and returns an
                  authorization URL.
                </p>
                <CodeBlock>{`// POST /api/paystack/initialize
const response = await fetch("/api/paystack/initialize", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    plan: "pro",        // plan slug
    interval: "monthly" // or "annually"
  }),
});

const { authorization_url } = await response.json();
window.location.href = authorization_url;`}</CodeBlock>
              </div>

              <div>
                <h3 className="mb-3 text-lg font-semibold text-foreground">
                  Handling Webhooks
                </h3>
                <p className="mb-3 text-sm text-muted-foreground">
                  Paystack sends webhook events for successful charges,
                  subscription updates, and cancellations. The webhook endpoint
                  verifies the signature and updates the database.
                </p>
                <CodeBlock>{`// POST /api/paystack/webhook
// Paystack signs webhooks with your secret key.
// The handler verifies the HMAC-SHA512 signature
// before processing any event.

// Handled events:
// - charge.success       → activate subscription
// - subscription.create  → record new subscription
// - subscription.disable → mark as cancelled
// - invoice.payment_failed → flag for retry`}</CodeBlock>
              </div>
            </div>
          </section>

          {/* API Reference */}
          <section id="api-reference">
            <h2 className="mb-6 text-2xl font-bold text-foreground">
              API Reference
            </h2>
            <p className="mb-6 text-muted-foreground">
              All API routes are under{" "}
              <code className="rounded bg-mist px-1.5 py-0.5 font-mono text-xs text-forest">
                /api
              </code>
              . Protected routes require a valid Clerk session.
            </p>

            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-mist">
                    <th className="px-4 py-3 font-semibold text-foreground">
                      Method
                    </th>
                    <th className="px-4 py-3 font-semibold text-foreground">
                      Path
                    </th>
                    <th className="hidden px-4 py-3 font-semibold text-foreground sm:table-cell">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {endpoints.map((ep) => (
                    <tr
                      key={`${ep.method}-${ep.path}`}
                      className="transition-colors hover:bg-mist/50"
                    >
                      <td className="px-4 py-3">
                        <MethodBadge method={ep.method} />
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-forest">
                        {ep.path}
                      </td>
                      <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                        {ep.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Database */}
          <section id="database">
            <h2 className="mb-6 text-2xl font-bold text-foreground">
              Database
            </h2>
            <p className="mb-6 text-muted-foreground">
              Polaris Cloud uses{" "}
              <span className="text-foreground font-medium">Prisma</span> with
              PostgreSQL. The schema tracks users, subscriptions, teams, and
              invoices.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="mb-3 text-lg font-semibold text-foreground">
                  Schema Overview
                </h3>
                <CodeBlock>{`model User {
  id          String   @id @default(cuid())
  clerkId     String   @unique
  email       String   @unique
  name        String?
  role        Role     @default(MEMBER)
  teamId      String?
  team        Team?    @relation(fields: [teamId])
  subscription Subscription?
  createdAt   DateTime @default(now())
}

model Subscription {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId])
  plan            Plan     @default(FREE)
  paystackSubCode String?
  status          SubStatus @default(ACTIVE)
  currentPeriodEnd DateTime?
}

model Team {
  id       String   @id @default(cuid())
  name     String
  ownerId  String
  members  User[]
  invites  Invite[]
}`}</CodeBlock>
              </div>

              <div>
                <h3 className="mb-3 text-lg font-semibold text-foreground">
                  Syncing Users from Clerk
                </h3>
                <p className="mb-3 text-sm text-muted-foreground">
                  When a user signs up through Clerk, a webhook (or the first
                  authenticated request) creates a corresponding database record.
                  The{" "}
                  <code className="rounded bg-mist px-1.5 py-0.5 font-mono text-xs text-forest">
                    clerkId
                  </code>{" "}
                  field links the Clerk user to the local database.
                </p>
                <CodeBlock>{`// Sync user on first request
const { userId } = await auth();

let user = await prisma.user.findUnique({
  where: { clerkId: userId },
});

if (!user) {
  const clerkUser = await clerkClient.users.getUser(userId);
  user = await prisma.user.create({
    data: {
      clerkId: userId,
      email: clerkUser.emailAddresses[0].emailAddress,
      name: clerkUser.firstName,
    },
  });
}`}</CodeBlock>
              </div>
            </div>
          </section>

          {/* Deployment */}
          <section id="deployment">
            <h2 className="mb-6 text-2xl font-bold text-foreground">
              Deployment
            </h2>
            <p className="mb-6 text-muted-foreground">
              Polaris Cloud is designed to deploy on{" "}
              <span className="text-foreground font-medium">Vercel</span> with
              zero configuration. Just connect your repo and set the environment
              variables.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-lichen">
                  1. Push to GitHub
                </h3>
                <CodeBlock>{`git remote add origin https://github.com/your-org/polaris-cloud.git
git push -u origin main`}</CodeBlock>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-lichen">
                  2. Import in Vercel
                </h3>
                <p className="text-sm text-muted-foreground">
                  Go to{" "}
                  <code className="rounded bg-mist px-1.5 py-0.5 font-mono text-xs text-forest">
                    vercel.com/new
                  </code>
                  , import your repository, and Vercel will auto-detect Next.js.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-lichen">
                  3. Set environment variables
                </h3>
                <p className="mb-3 text-sm text-muted-foreground">
                  Add all variables from{" "}
                  <code className="rounded bg-mist px-1.5 py-0.5 font-mono text-xs text-forest">
                    .env.local
                  </code>{" "}
                  to your Vercel project settings. Use production keys for Clerk
                  and Paystack.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-lichen">
                  4. Configure webhooks
                </h3>
                <p className="text-sm text-muted-foreground">
                  Update your Paystack webhook URL to{" "}
                  <code className="rounded bg-mist px-1.5 py-0.5 font-mono text-xs text-forest">
                    https://your-domain.com/api/paystack/webhook
                  </code>
                  . Do the same for the Clerk webhook if you use server-side
                  user syncing.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-lichen">
                  5. Deploy
                </h3>
                <p className="text-sm text-muted-foreground">
                  Push to{" "}
                  <code className="rounded bg-mist px-1.5 py-0.5 font-mono text-xs text-forest">
                    main
                  </code>{" "}
                  and Vercel will build and deploy automatically. Preview
                  deployments are created for every pull request.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
