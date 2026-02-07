# Gatehouse

Clerk authentication + Paystack billing, wired together. The SaaS starter kit for Africa.

## What's Included

- **Clerk Auth** — Sign-up, sign-in, user management, protected routes
- **Paystack Billing** — Subscriptions, payments in NGN/GHS/ZAR/KES, webhook handling
- **Dashboard** — Overview, billing management, user settings
- **Landing Page** — Hero, features, pricing sections
- **Database** — SQLite via Drizzle ORM for user↔subscription sync
- **TypeScript** — Full type safety across the stack

## Tech Stack

- Next.js 15 (App Router)
- Clerk (`@clerk/nextjs`)
- Paystack (custom TypeScript wrapper)
- Tailwind CSS
- Drizzle ORM + SQLite
- Lucide icons

## Getting Started

### 1. Clone and install

```bash
cd gatehouse
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
```

Fill in your keys:

| Variable | Where to get it |
|----------|----------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | [Clerk Dashboard](https://dashboard.clerk.com) → API Keys |
| `CLERK_SECRET_KEY` | Clerk Dashboard → API Keys |
| `CLERK_WEBHOOK_SECRET` | Clerk Dashboard → Webhooks → Create endpoint |
| `PAYSTACK_SECRET_KEY` | [Paystack Dashboard](https://dashboard.paystack.com) → Settings → API Keys |
| `PAYSTACK_PUBLIC_KEY` | Paystack Dashboard → Settings → API Keys |
| `PAYSTACK_WEBHOOK_SECRET` | Paystack Dashboard → Settings → API Keys & Webhooks |

### 3. Set up Clerk webhooks

In your Clerk Dashboard, create a webhook endpoint pointing to:
```
https://your-domain.com/api/webhooks/clerk
```

Subscribe to events: `user.created`, `user.deleted`

### 4. Set up Paystack webhooks

In your Paystack Dashboard, set your webhook URL to:
```
https://your-domain.com/api/webhooks/paystack
```

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # ClerkProvider + global layout
│   ├── page.tsx                # Landing page
│   ├── (auth)/                 # Sign-in, sign-up pages
│   ├── (dashboard)/            # Protected dashboard pages
│   └── api/                    # Webhooks + billing API routes
├── lib/
│   ├── paystack/               # Paystack API client + modules
│   ├── db/                     # Drizzle schema + queries
│   └── utils.ts                # Shared utilities
└── components/
    ├── ui/                     # Base UI components
    ├── layout/                 # Sidebar, header, footer
    ├── billing/                # Plan cards, payment button
    └── landing/                # Hero, features, pricing
```

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/health` | GET | Health check |
| `/api/webhooks/clerk` | POST | Clerk user events |
| `/api/webhooks/paystack` | POST | Paystack payment events |
| `/api/billing/plans` | GET | List available plans |
| `/api/billing/subscribe` | POST | Start subscription checkout |
| `/api/billing/transactions` | GET | User's transaction history |

## How the Sync Works

1. User signs up via Clerk → `user.created` webhook fires → local DB user created → Paystack customer created
2. User subscribes → Paystack checkout → `charge.success` webhook → subscription stored locally
3. Subscription cancelled → `subscription.disable` webhook → local status updated

## Customization

- **Plans**: Update plan codes in `src/app/(dashboard)/billing/page.tsx` with your Paystack plan codes
- **Colors**: Edit CSS variables in `src/app/globals.css` (forest green palette by default)
- **Features**: Modify landing page content in `src/components/landing/`

## License

MIT
