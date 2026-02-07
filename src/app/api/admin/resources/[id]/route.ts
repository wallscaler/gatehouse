import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getResourceById } from "@/lib/compute/mock-data";
import type { AdminResourceUpdate } from "@/lib/compute/types";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // In production, check admin role here.

    const { id } = await params;
    const resource = getResourceById(id);

    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }

    const body = (await request.json()) as AdminResourceUpdate;

    if (!body.action || !["approve", "reject", "blacklist"].includes(body.action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be one of: approve, reject, blacklist" },
        { status: 400 }
      );
    }

    // Mock update
    const updatedResource = {
      ...resource,
      adminApprovalStatus:
        body.action === "approve"
          ? ("verified" as const)
          : body.action === "reject"
            ? ("rejected" as const)
            : resource.adminApprovalStatus,
      isBlacklisted: body.action === "blacklist" ? true : resource.isBlacklisted,
      isActive: body.action === "approve" ? true : body.action === "reject" ? false : resource.isActive,
      adminNotes: body.notes ?? resource.adminNotes,
      updatedAt: new Date(),
    };

    return NextResponse.json({ data: updatedResource });
  } catch (error) {
    console.error("Failed to update resource:", error);
    return NextResponse.json(
      { error: "Failed to update resource" },
      { status: 500 }
    );
  }
}
