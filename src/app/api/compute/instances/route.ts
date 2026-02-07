import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  mockContainers,
  getResourceById,
  getTemplateById,
} from "@/lib/compute/mock-data";
import type { DeployInstanceRequest } from "@/lib/compute/types";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status") as
      | "pending"
      | "running"
      | "stopped"
      | "terminated"
      | "failed"
      | null;
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 20);

    // In production, filter by userId. For mock, return all.
    let containers = [...mockContainers];

    if (statusFilter) {
      containers = containers.filter((c) => c.status === statusFilter);
    }

    // Sort newest first
    containers.sort(
      (a, b) =>
        (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0)
    );

    const total = containers.length;
    const start = (page - 1) * limit;
    const paginated = containers.slice(start, start + limit);

    return NextResponse.json({ data: paginated, total, page });
  } catch (error) {
    console.error("Failed to fetch instances:", error);
    return NextResponse.json(
      { error: "Failed to fetch instances" },
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

    const body = (await request.json()) as DeployInstanceRequest;

    // Validate required fields
    if (!body.resourceId || !body.templateId || !body.duration || !body.authMethod) {
      return NextResponse.json(
        { error: "Missing required fields: resourceId, templateId, duration, authMethod" },
        { status: 400 }
      );
    }

    // Validate resource exists
    const resource = getResourceById(body.resourceId);
    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }

    if (!resource.isActive || resource.isBlacklisted) {
      return NextResponse.json(
        { error: "Resource is not available for deployment" },
        { status: 400 }
      );
    }

    if (resource.rentalUserId) {
      return NextResponse.json(
        { error: "Resource is currently rented by another user" },
        { status: 409 }
      );
    }

    // Validate template exists
    const template = getTemplateById(body.templateId);
    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    if (template.gpuRequired && resource.resourceType !== "gpu") {
      return NextResponse.json(
        { error: "Selected template requires a GPU resource" },
        { status: 400 }
      );
    }

    // Mock deployment response
    const now = new Date();
    const expiresAt = new Date(
      now.getTime() +
        (body.duration.hours * 60 + (body.duration.minutes ?? 0)) * 60 * 1000
    );

    const mockContainer = {
      id: `ctr-${crypto.randomUUID().slice(0, 8)}`,
      userId: "mock-user-id",
      minerId: resource.minerId,
      resourceId: resource.id,
      subscriptionId: null,
      templateId: template.id,
      status: "pending" as const,
      paymentStatus: "pending" as const,
      host: resource.publicIp,
      port: resource.rentalPort,
      sshUsername: resource.sshUsername ?? "gatehouse",
      sshPassword: body.authMethod !== "key" ? `tmp_pw_${crypto.randomUUID().slice(0, 6)}` : null,
      sshKeyFingerprint: body.sshKeyId ? "SHA256:mock_fingerprint" : null,
      authMethod: body.authMethod,
      image: template.image,
      containerName: `${template.name.toLowerCase().replace(/\s+/g, "-")}-${resource.id.slice(-3)}`,
      jupyterUrl: null,
      jupyterToken: null,
      accessUrls: null,
      duration: JSON.stringify(body.duration),
      errorMessage: null,
      startedAt: null,
      stoppedAt: null,
      expiresAt,
      scheduledTermination: expiresAt,
      createdAt: now,
    };

    const connectionDetails = {
      host: resource.publicIp ?? "0.0.0.0",
      port: resource.rentalPort ?? 22,
      username: resource.sshUsername ?? "gatehouse",
      ...(mockContainer.sshPassword ? { password: mockContainer.sshPassword } : {}),
    };

    return NextResponse.json(
      { data: mockContainer, connectionDetails },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to deploy instance:", error);
    return NextResponse.json(
      { error: "Failed to deploy instance" },
      { status: 500 }
    );
  }
}
