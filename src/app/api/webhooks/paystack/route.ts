import { createHmac } from "crypto";
import { NextResponse } from "next/server";
import {
  createSubscription,
  updateSubscriptionStatus,
  getSubscriptionByPaystackCode,
} from "@/lib/db/queries";
import { getUserByClerkId } from "@/lib/db/queries";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { PaystackWebhookEvent } from "@/lib/paystack/types";

function verifySignature(body: string, signature: string): boolean {
  const secret = process.env.PAYSTACK_WEBHOOK_SECRET || "";
  const hash = createHmac("sha512", secret).update(body).digest("hex");
  return hash === signature;
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("x-paystack-signature") || "";

  if (!verifySignature(body, signature)) {
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  const event: PaystackWebhookEvent = JSON.parse(body);

  switch (event.event) {
    case "charge.success": {
      const data = event.data as {
        plan?: { plan_code: string };
        customer: { customer_code: string; metadata?: { clerkId?: string } };
        subscription_code?: string;
      };

      // If this charge is for a subscription, create/update the subscription record
      if (data.plan?.plan_code && data.subscription_code) {
        const customerCode = data.customer.customer_code;

        // Find the user by paystack customer code
        const userResult = await db
          .select()
          .from(users)
          .where(eq(users.paystackCustomerCode, customerCode))
          .limit(1);

        const user = userResult[0];
        if (user) {
          const existing = await getSubscriptionByPaystackCode(data.subscription_code);
          if (!existing) {
            await createSubscription({
              userId: user.id,
              paystackSubscriptionCode: data.subscription_code,
              planCode: data.plan.plan_code,
              status: "active",
            });
          } else {
            await updateSubscriptionStatus(data.subscription_code, "active");
          }
        }
      }
      break;
    }

    case "subscription.disable": {
      const data = event.data as { subscription_code: string };
      await updateSubscriptionStatus(data.subscription_code, "cancelled");
      break;
    }

    case "subscription.not_renew": {
      const data = event.data as { subscription_code: string };
      await updateSubscriptionStatus(data.subscription_code, "cancelled");
      break;
    }

    case "invoice.payment_failed": {
      const data = event.data as { subscription?: { subscription_code: string } };
      if (data.subscription?.subscription_code) {
        await updateSubscriptionStatus(data.subscription.subscription_code, "past_due");
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
