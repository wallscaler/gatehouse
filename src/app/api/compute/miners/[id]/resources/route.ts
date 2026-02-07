import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { mockResources, mockHeartbeats, getMinerById } from "@/lib/compute/mock-data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const miner = getMinerById(id);

    if (!miner) {
      return NextResponse.json(
        { error: "Miner not found" },
        { status: 404 }
      );
    }

    const resources = mockResources
      .filter((r) => r.minerId === id)
      .map((resource) => {
        const heartbeat = mockHeartbeats.find((h) => h.resourceId === resource.id);
        return {
          ...resource,
          isOnline: heartbeat?.isOnline ?? false,
          health: heartbeat?.health ?? "critical",
        };
      });

    return NextResponse.json({
      data: resources,
      total: resources.length,
      page: 1,
    });
  } catch (error) {
    console.error("Failed to fetch miner resources:", error);
    return NextResponse.json(
      { error: "Failed to fetch miner resources" },
      { status: 500 }
    );
  }
}
