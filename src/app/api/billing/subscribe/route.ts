import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserByClerkId } from "@/lib/db/queries";
import { initializeTransaction } from "@/lib/paystack/transactions";
import { getBaseUrl } from "@/lib/utils";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { planCode } = await req.json();
  if (!planCode) {
    return NextResponse.json(
      { error: "Plan code is required" },
      { status: 400 }
    );
  }

  const user = await getUserByClerkId(userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    const transaction = await initializeTransaction({
      email: user.email,
      amount: 0, // Paystack uses the plan's amount when a plan is specified
      plan: planCode,
      callback_url: `${getBaseUrl()}/billing`,
      metadata: {
        clerkId: userId,
        userId: user.id,
      },
    });

    return NextResponse.json({
      authorization_url: transaction.data.authorization_url,
      reference: transaction.data.reference,
    });
  } catch (error) {
    console.error("Failed to initialize subscription:", error);
    return NextResponse.json(
      { error: "Failed to initialize subscription" },
      { status: 500 }
    );
  }
}
