import { NextResponse } from "next/server";
import { listPlans } from "@/lib/paystack/plans";

export async function GET() {
  try {
    const plans = await listPlans();
    return NextResponse.json(plans);
  } catch (error) {
    console.error("Failed to fetch plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}
