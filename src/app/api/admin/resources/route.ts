import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { mockResources, mockHeartbeats, mockMiners } from "@/lib/compute/mock-data";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // In production, check admin role here.

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 50);

    // Return all resources with heartbeat + miner info for admin view
    const resources = mockResources.map((resource) => {
      const heartbeat = mockHeartbeats.find((h) => h.resourceId === resource.id);
      const miner = mockMiners.find((m) => m.id === resource.minerId);
      return {
        ...resource,
        heartbeat: heartbeat ?? null,
        miner: miner ?? null,
      };
    });

    const total = resources.length;
    const start = (page - 1) * limit;
    const paginated = resources.slice(start, start + limit);

    return NextResponse.json({ data: paginated, total, page });
  } catch (error) {
    console.error("Failed to fetch admin resources:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin resources" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // In production, check admin role here.

    const body = await request.json();
    const { resourceIds, action, notes } = body as {
      resourceIds: string[];
      action: "approve" | "reject" | "blacklist";
      notes?: string;
    };

    if (!resourceIds || !Array.isArray(resourceIds) || resourceIds.length === 0) {
      return NextResponse.json(
        { error: "Missing required field: resourceIds (array)" },
        { status: 400 }
      );
    }

    if (!action || !["approve", "reject", "blacklist"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be one of: approve, reject, blacklist" },
        { status: 400 }
      );
    }

    // Mock bulk update
    const updated = resourceIds.map((resourceId) => {
      const resource = mockResources.find((r) => r.id === resourceId);
      if (!resource) return { id: resourceId, error: "Not found" };

      return {
        id: resourceId,
        adminApprovalStatus:
          action === "approve"
            ? "verified"
            : action === "reject"
              ? "rejected"
              : resource.adminApprovalStatus,
        isBlacklisted: action === "blacklist" ? true : resource.isBlacklisted,
        adminNotes: notes ?? resource.adminNotes,
      };
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("Failed to update resources:", error);
    return NextResponse.json(
      { error: "Failed to update resources" },
      { status: 500 }
    );
  }
}
