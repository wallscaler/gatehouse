import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getContainerById } from "@/lib/compute/mock-data";

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
    const container = getContainerById(id);

    if (!container) {
      return NextResponse.json(
        { error: "Instance not found" },
        { status: 404 }
      );
    }

    // Build connection details for running containers
    const connectionDetails =
      container.status === "running"
        ? {
            host: container.host ?? "0.0.0.0",
            port: container.port ?? 22,
            username: container.sshUsername ?? "polaris",
            ...(container.sshPassword ? { password: container.sshPassword } : {}),
          }
        : null;

    return NextResponse.json({ data: container, connectionDetails });
  } catch (error) {
    console.error("Failed to fetch instance:", error);
    return NextResponse.json(
      { error: "Failed to fetch instance" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const container = getContainerById(id);

    if (!container) {
      return NextResponse.json(
        { error: "Instance not found" },
        { status: 404 }
      );
    }

    if (container.status === "terminated") {
      return NextResponse.json(
        { error: "Instance is already terminated" },
        { status: 400 }
      );
    }

    // Mock termination — in production this would call the miner's API
    const terminatedContainer = {
      ...container,
      status: "terminated" as const,
      stoppedAt: new Date(),
    };

    return NextResponse.json({ data: terminatedContainer });
  } catch (error) {
    console.error("Failed to terminate instance:", error);
    return NextResponse.json(
      { error: "Failed to terminate instance" },
      { status: 500 }
    );
  }
}
