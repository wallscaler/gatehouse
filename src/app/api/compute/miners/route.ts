import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { mockMiners } from "@/lib/compute/mock-data";
import type { RegisterMinerRequest } from "@/lib/compute/types";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // In production, this would check for admin role.
    // Return all miners for now.
    return NextResponse.json({
      data: mockMiners,
      total: mockMiners.length,
      page: 1,
    });
  } catch (error) {
    console.error("Failed to fetch miners:", error);
    return NextResponse.json(
      { error: "Failed to fetch miners" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as RegisterMinerRequest;

    if (!body.name) {
      return NextResponse.json(
        { error: "Missing required field: name" },
        { status: 400 }
      );
    }

    // Mock miner registration
    const newMiner = {
      id: `miner-${crypto.randomUUID().slice(0, 8)}`,
      userId: "mock-user-id",
      name: body.name,
      location: body.location ?? null,
      description: body.description ?? null,
      status: "active" as const,
      hotkey: null,
      coldkey: null,
      minerUid: null,
      subnetUid: null,
      totalEarnings: 0,
      createdAt: new Date(),
    };

    return NextResponse.json({ data: newMiner }, { status: 201 });
  } catch (error) {
    console.error("Failed to register miner:", error);
    return NextResponse.json(
      { error: "Failed to register miner" },
      { status: 500 }
    );
  }
}
