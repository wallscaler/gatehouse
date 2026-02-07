import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { mockPlatformStats } from "@/lib/compute/mock-data";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // In production, check admin role here.

    return NextResponse.json({ data: mockPlatformStats });
  } catch (error) {
    console.error("Failed to fetch platform stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch platform stats" },
      { status: 500 }
    );
  }
}
