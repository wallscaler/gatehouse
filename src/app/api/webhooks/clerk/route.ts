import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createUser, deleteUserByClerkId, updateUserPaystackCode } from "@/lib/db/queries";
import { createCustomer } from "@/lib/paystack/customers";

interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses?: Array<{ email_address: string }>;
    first_name?: string;
    last_name?: string;
  };
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { error: "Missing svix headers" },
      { status: 400 }
    );
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  let event: ClerkWebhookEvent;
  try {
    const wh = new Webhook(WEBHOOK_SECRET);
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkWebhookEvent;
  } catch {
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "user.created": {
      const email = event.data.email_addresses?.[0]?.email_address;
      if (!email) break;

      // Create local user record
      await createUser({
        clerkId: event.data.id,
        email,
      });

      // Create Paystack customer
      try {
        const customer = await createCustomer({
          email,
          first_name: event.data.first_name || undefined,
          last_name: event.data.last_name || undefined,
          metadata: { clerkId: event.data.id },
        });
        await updateUserPaystackCode(event.data.id, customer.data.customer_code);
      } catch (err) {
        console.error("Failed to create Paystack customer:", err);
      }
      break;
    }

    case "user.deleted": {
      await deleteUserByClerkId(event.data.id);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
