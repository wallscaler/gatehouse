# Polaris Cloud

**Decentralized GPU/CPU cloud compute platform for Africa.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?logo=clerk&logoColor=white)](https://clerk.com)
[![Paystack](https://img.shields.io/badge/Paystack-Billing-00C3F7?logo=paystack&logoColor=white)](https://paystack.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-2D5A47)](LICENSE)

Polaris Cloud is a full-stack Next.js platform that wires Clerk authentication to Paystack payments for decentralized GPU/CPU cloud compute in Africa. Dark mode design with a forest green palette. SQLite for zero-config local development. Deploy to Vercel in minutes.

<!-- screenshot here -->

---

## Features

### Authentication (Clerk)
- Sign-up and sign-in pages with custom dark theme
- Protected routes via middleware (`/dashboard`, `/billing`, `/settings`)
- User profile management (Clerk `<UserProfile />`)
- Webhook-driven user sync (Clerk -> local DB -> Paystack customer)

### Billing (Paystack)
- Subscription plans with checkout flow (Free / Pro / Enterprise)
- One-time payments and recurring subscriptions
- Nigerian Naira (NGN) + other African currencies (GHS, ZAR, KES)
- Typed Paystack API wrapper -- no raw `fetch` calls in your app code
- Webhook-driven subscription lifecycle (charge success, cancellation, payment failure)

### Dashboard
- Sidebar navigation with active-state highlighting
- Overview page with quick-start cards
- Billing management with plan selection and subscription status
- Team management (invite members, assign roles, remove members)
- API keys management (create, copy, revoke, show-once pattern)
- User settings via embedded Clerk `<UserProfile />`

### Landing Page
- Hero section, features grid, pricing cards
- Responsive navigation with signed-in / signed-out states
- Footer with links

### Developer Experience
- TypeScript across the entire stack
- Tailwind CSS v4 with `@theme inline` custom palette
- SQLite + Drizzle ORM (zero-config, no external database needed)
- Lucide icons
- `clsx` + `tailwind-merge` for clean class composition

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | [Next.js 16](https://nextjs.org) (App Router) | Full-stack React framework |
| Language | [TypeScript 5](https://typescriptlang.org) | Type safety |
| Auth | [Clerk](https://clerk.com) (`@clerk/nextjs`) | Authentication, user management, protected routes |
| Payments | [Paystack](https://paystack.com) (custom typed wrapper) | Subscriptions, transactions, African currencies |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) | Utility-first CSS with custom dark theme |
| Database | [SQLite](https://sqlite.org) via [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) | Local-first, zero-config database |
| ORM | [Drizzle ORM](https://orm.drizzle.team) | Type-safe database queries and schema |
| Webhooks | [Svix](https://svix.com) | Clerk webhook signature verification |
| Icons | [Lucide React](https://lucide.dev) | Icon library |
| UI Utils | [clsx](https://github.com/lukeed/clsx) + [tailwind-merge](https://github.com/dcastil/tailwind-merge) | Conditional class merging |

---

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/your-username/polaris-cloud.git
cd polaris-cloud
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in your keys (see [Environment Variables](#environment-variables) below).

### 3. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up, and Polaris Cloud will automatically create a local user record and a Paystack customer via webhooks.

---

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in each value:

| Variable | Required | Description | Where to get it |
|----------|----------|-------------|-----------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk public key (starts with `pk_`) | [Clerk Dashboard](https://dashboard.clerk.com) -> API Keys |
| `CLERK_SECRET_KEY` | Yes | Clerk secret key (starts with `sk_`) | Clerk Dashboard -> API Keys |
| `CLERK_WEBHOOK_SECRET` | Yes | Secret for verifying Clerk webhook signatures (starts with `whsec_`) | Clerk Dashboard -> Webhooks -> Create endpoint |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | No | Custom sign-in route (default: `/sign-in`) | Set in `.env.local` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | No | Custom sign-up route (default: `/sign-up`) | Set in `.env.local` |
| `PAYSTACK_SECRET_KEY` | Yes | Paystack secret key (starts with `sk_`) | [Paystack Dashboard](https://dashboard.paystack.com) -> Settings -> API Keys |
| `PAYSTACK_PUBLIC_KEY` | Yes | Paystack public key (starts with `pk_`) | Paystack Dashboard -> Settings -> API Keys |
| `PAYSTACK_WEBHOOK_SECRET` | Yes | Secret for verifying Paystack webhook signatures | Paystack Dashboard -> Settings -> API Keys & Webhooks |
| `DATABASE_URL` | No | SQLite database path (default: `file:./polaris.db`) | Auto-created on first run |
| `NEXT_PUBLIC_APP_URL` | No | Your app's public URL (default: `http://localhost:3000`) | Set to your production domain when deploying |

---

## Project Structure

```
polaris-cloud/
├── src/
│   ├── app/
│   │   ├── layout.tsx                          # Root layout: ClerkProvider, fonts, global CSS
│   │   ├── page.tsx                            # Landing page (Hero, Features, Pricing)
│   │   ├── globals.css                         # Tailwind v4 theme (forest green dark palette)
│   │   ├── error.tsx                           # Global error boundary
│   │   ├── not-found.tsx                       # 404 page
│   │   ├── (auth)/
│   │   │   ├── sign-in/[[...sign-in]]/page.tsx # Clerk sign-in
│   │   │   └── sign-up/[[...sign-up]]/page.tsx # Clerk sign-up
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx                      # Dashboard shell (Sidebar + Header)
│   │   │   ├── dashboard/page.tsx              # Overview page
│   │   │   ├── billing/page.tsx                # Plan selection + subscription status
│   │   │   ├── api-keys/page.tsx               # API key management
│   │   │   ├── team/page.tsx                   # Team member management
│   │   │   └── settings/page.tsx               # Clerk UserProfile embed
│   │   ├── (marketing)/
│   │   │   └── layout.tsx                      # Marketing pages layout
│   │   └── api/
│   │       ├── health/route.ts                 # Health check endpoint
│   │       ├── billing/
│   │       │   ├── plans/route.ts              # GET  /api/billing/plans
│   │       │   ├── subscribe/route.ts          # POST /api/billing/subscribe
│   │       │   └── transactions/route.ts       # GET  /api/billing/transactions
│   │       └── webhooks/
│   │           ├── clerk/route.ts              # POST /api/webhooks/clerk
│   │           └── paystack/route.ts           # POST /api/webhooks/paystack
│   ├── components/
│   │   ├── ui/                                 # Base components (Button, Card, Badge, Spinner)
│   │   ├── layout/                             # Sidebar, Header, Footer
│   │   ├── billing/                            # PlanCard, PaymentButton, SubscriptionStatus
│   │   ├── landing/                            # Hero, Features, Pricing
│   │   ├── team/                               # MemberCard, InviteForm
│   │   └── analytics/                          # StatCard, BarChart, ActivityFeed
│   ├── lib/
│   │   ├── paystack/                           # Typed Paystack API wrapper
│   │   │   ├── client.ts                       # Base HTTP client (singleton)
│   │   │   ├── types.ts                        # All Paystack TypeScript interfaces
│   │   │   ├── customers.ts                    # Create, fetch, update, list customers
│   │   │   ├── plans.ts                        # Create, fetch, update, list plans
│   │   │   ├── subscriptions.ts                # Create, fetch, list, enable, disable
│   │   │   └── transactions.ts                 # Initialize, verify, list, fetch
│   │   ├── db/
│   │   │   ├── index.ts                        # Database connection (lazy Proxy pattern)
│   │   │   ├── schema.ts                       # Drizzle schema (users, subscriptions, apiKeys)
│   │   │   └── queries.ts                      # Database query functions
│   │   └── utils.ts                            # Shared utilities (cn, getBaseUrl)
│   └── middleware.ts                           # Clerk auth middleware (protects /dashboard/*)
├── drizzle.config.ts                           # Drizzle Kit configuration
├── package.json
├── tsconfig.json
├── postcss.config.mjs
└── .env.local.example
```

---

## Paystack Integration

Polaris Cloud includes a fully typed Paystack API wrapper in `src/lib/paystack/` so you never write raw `fetch` calls against the Paystack API. The wrapper is organized into domain modules:

| Module | File | Functions |
|--------|------|-----------|
| **Client** | `client.ts` | `PaystackClient` class with `request<T>()` and `requestList<T>()` methods. Singleton via `getPaystackClient()`. |
| **Customers** | `customers.ts` | `createCustomer`, `fetchCustomer`, `updateCustomer`, `listCustomers` |
| **Plans** | `plans.ts` | `createPlan`, `fetchPlan`, `updatePlan`, `listPlans` |
| **Subscriptions** | `subscriptions.ts` | `createSubscription`, `fetchSubscription`, `listSubscriptions`, `enableSubscription`, `disableSubscription` |
| **Transactions** | `transactions.ts` | `initializeTransaction`, `verifyTransaction`, `listTransactions`, `fetchTransaction` |
| **Types** | `types.ts` | `PaystackCustomer`, `PaystackPlan`, `PaystackTransaction`, `PaystackSubscription`, `PaystackWebhookEvent`, and all param/response interfaces |

All responses are typed with `PaystackResponse<T>` (single item) or `PaystackListResponse<T>` (paginated list with `meta`).

### Subscription Flow

```
User clicks "Subscribe" on billing page
  -> POST /api/billing/subscribe { planCode }
    -> initializeTransaction({ email, plan, callback_url })
      -> Paystack returns authorization_url
        -> User redirected to Paystack checkout
          -> Payment succeeds
            -> Paystack sends charge.success webhook
              -> POST /api/webhooks/paystack
                -> Subscription record created in local DB
```

---

## Webhook Setup

Polaris Cloud uses webhooks from both Clerk and Paystack to keep your local database in sync with external state.

### Clerk Webhooks

1. Go to [Clerk Dashboard](https://dashboard.clerk.com) -> **Webhooks**
2. Click **Add Endpoint**
3. Set the URL to:
   ```
   https://your-domain.com/api/webhooks/clerk
   ```
4. Subscribe to these events:
   - `user.created` -- creates a local user record and a Paystack customer
   - `user.deleted` -- removes the local user record
5. Copy the **Signing Secret** (starts with `whsec_`) into your `CLERK_WEBHOOK_SECRET` env var

Clerk webhooks are verified using the [Svix](https://svix.com) library with `svix-id`, `svix-timestamp`, and `svix-signature` headers.

### Paystack Webhooks

1. Go to [Paystack Dashboard](https://dashboard.paystack.com) -> **Settings** -> **API Keys & Webhooks**
2. Set your **Webhook URL** to:
   ```
   https://your-domain.com/api/webhooks/paystack
   ```
3. Copy your webhook secret into the `PAYSTACK_WEBHOOK_SECRET` env var

Polaris Cloud handles these Paystack events:

| Event | What happens |
|-------|-------------|
| `charge.success` | Creates or updates a subscription record when a plan-based charge succeeds |
| `subscription.disable` | Marks the subscription as `cancelled` |
| `subscription.not_renew` | Marks the subscription as `cancelled` |
| `invoice.payment_failed` | Marks the subscription as `past_due` |

Paystack webhooks are verified using HMAC-SHA512 signature comparison against the `x-paystack-signature` header.

### Local Development

For local webhook testing, use a tunneling tool to expose your local server:

```bash
# Using ngrok
ngrok http 3000

# Then set your webhook URLs to:
# https://your-ngrok-id.ngrok.io/api/webhooks/clerk
# https://your-ngrok-id.ngrok.io/api/webhooks/paystack
```

---

## Database

Polaris Cloud uses **SQLite** via **better-sqlite3** with **Drizzle ORM** for type-safe queries. The database is created automatically on first run -- no setup needed.

### Schema

```
┌─────────────────────┐     ┌──────────────────────────┐     ┌─────────────────────┐
│       users          │     │     subscriptions         │     │      api_keys        │
├─────────────────────┤     ├──────────────────────────┤     ├─────────────────────┤
│ id (PK)             │<────│ user_id (FK)             │     │ id (PK)             │
│ clerk_id (unique)   │     │ id (PK)                  │     │ user_id (FK) ───────│───> users.id
│ paystack_customer_  │     │ paystack_subscription_   │     │ name                │
│   code              │     │   code                   │     │ key_hash            │
│ email               │     │ plan_code                │     │ key_prefix          │
│ created_at          │     │ status (active |         │     │ last_four           │
│                     │     │   cancelled | past_due)  │     │ last_used_at        │
│                     │     │ current_period_end       │     │ created_at          │
│                     │     │ created_at               │     │                     │
└─────────────────────┘     └──────────────────────────┘     └─────────────────────┘
```

### Key Design Decisions

- **Lazy connection**: The database connection uses a `Proxy` pattern so it is only initialized when first accessed, avoiding issues with edge runtime environments.
- **WAL mode**: SQLite is configured with `journal_mode = WAL` for better concurrent read performance.
- **Auto-migration**: Tables are created via `CREATE TABLE IF NOT EXISTS` on first connection -- no migration step required for development.
- **Drizzle Kit**: For production migrations, run `npx drizzle-kit generate` and `npx drizzle-kit migrate`.

### Drizzle Configuration

The Drizzle Kit config lives at `drizzle.config.ts`:

```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL || "file:./polaris.db",
  },
});
```

---

## API Routes

| Route | Method | Auth | Purpose |
|-------|--------|------|---------|
| `/api/health` | GET | No | Health check |
| `/api/webhooks/clerk` | POST | Svix signature | Clerk user lifecycle events |
| `/api/webhooks/paystack` | POST | HMAC-SHA512 | Paystack payment and subscription events |
| `/api/billing/plans` | GET | Yes | List available subscription plans |
| `/api/billing/subscribe` | POST | Yes | Initialize a Paystack checkout for a plan |
| `/api/billing/transactions` | GET | Yes | Fetch the current user's transaction history |

---

## How the Sync Works

```
1. SIGN-UP
   User signs up via Clerk
   └─> Clerk fires user.created webhook
       └─> POST /api/webhooks/clerk
           ├─> Local user record created in SQLite
           └─> Paystack customer created via API
               └─> paystack_customer_code saved to user record

2. SUBSCRIBE
   User selects a plan on /billing
   └─> POST /api/billing/subscribe { planCode }
       └─> Paystack transaction initialized
           └─> User redirected to Paystack checkout
               └─> Payment succeeds
                   └─> Paystack fires charge.success webhook
                       └─> POST /api/webhooks/paystack
                           └─> Subscription record created locally

3. CANCEL / FAIL
   Subscription cancelled or payment fails
   └─> Paystack fires subscription.disable or invoice.payment_failed
       └─> POST /api/webhooks/paystack
           └─> Local subscription status updated (cancelled / past_due)
```

---

## Customization

### Plans

Update the plan codes in `src/app/(dashboard)/billing/page.tsx` with your actual Paystack plan codes:

```ts
const plans = [
  {
    name: "Pro",
    amount: 1500000,      // 15,000 NGN in kobo
    planCode: "PLN_xxxxx", // Your Paystack plan code
    // ...
  },
];
```

Create plans in your [Paystack Dashboard](https://dashboard.paystack.com) -> **Products** -> **Plans**, then copy the plan codes.

### Theme

The dark mode forest green palette is defined in `src/app/globals.css` using CSS custom properties and Tailwind v4's `@theme inline` syntax. Key colors:

| Token | Value | Usage |
|-------|-------|-------|
| `--forest` | `#3D7A5F` | Primary accent, CTAs, active states |
| `--deep-moss` | `#A8C5B5` | Headings, emphasized text |
| `--fern` | `#5A9C6F` | Success states, secondary accent |
| `--copper` | `#D4924A` | Warm accent, warnings |
| `--background` | `#0a0f0d` | Page background |
| `--card` | `#111916` | Card backgrounds |
| `--border` | `#1e3329` | Borders and dividers |

### Landing Page

Modify the marketing content in `src/components/landing/`:
- `hero.tsx` -- headline, subheadline, CTA buttons
- `features.tsx` -- feature grid items
- `pricing.tsx` -- pricing cards and tiers

---

## Deployment

### Vercel (Recommended)

1. Push your repository to GitHub

2. Import the project on [Vercel](https://vercel.com/new)

3. Add all environment variables from `.env.local` to the Vercel project settings:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `CLERK_WEBHOOK_SECRET`
   - `PAYSTACK_SECRET_KEY`
   - `PAYSTACK_PUBLIC_KEY`
   - `PAYSTACK_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_APP_URL` (set to your Vercel domain, e.g. `https://polariscloud.ai`)

4. Deploy

5. Update your webhook URLs in Clerk and Paystack dashboards to point to your production domain:
   - Clerk: `https://your-domain.com/api/webhooks/clerk`
   - Paystack: `https://your-domain.com/api/webhooks/paystack`

> **Note on SQLite in production**: SQLite works well for single-instance deployments. For Vercel Serverless Functions, consider switching to a hosted database (Turso, PlanetScale, Neon) since the filesystem is ephemeral. The Drizzle ORM schema and queries will work with minimal changes -- just swap the dialect and driver.

---

## Scripts

```bash
npm run dev       # Start development server (http://localhost:3000)
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

---

## Contributing

Contributions are welcome. To get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Run lint: `npm run lint`
5. Commit with a clear message: `git commit -m "Add your feature"`
6. Push to your fork: `git push origin feature/your-feature`
7. Open a Pull Request

Please follow the existing code style and conventions.

---

## License

MIT
