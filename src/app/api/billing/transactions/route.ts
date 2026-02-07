import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserByClerkId } from "@/lib/db/queries";
import { listTransactions } from "@/lib/paystack/transactions";
import { fetchCustomer } from "@/lib/paystack/customers";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserByClerkId(userId);
  if (!user || !user.paystackCustomerCode) {
    return NextResponse.json({ data: [], meta: { total: 0 } });
  }

  try {
    // Fetch customer to get their Paystack ID
    const customer = await fetchCustomer(user.paystackCustomerCode);
    const transactions = await listTransactions({
      customer: customer.data.id,
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
