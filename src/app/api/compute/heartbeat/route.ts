import { NextResponse } from "next/server";
import { getResourceById } from "@/lib/compute/mock-data";
import type { HeartbeatRequest } from "@/lib/compute/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as HeartbeatRequest;

    // Validate required fields
    if (!body.resourceId || !body.status || !body.hardware || !body.network) {
      return NextResponse.json(
        { error: "Missing required fields: resourceId, status, hardware, network" },
        { status: 400 }
      );
    }

    // Validate the resource exists
    const resource = getResourceById(body.resourceId);
    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }

    // Mock heartbeat ingestion — in production this would upsert a heartbeat record
    const heartbeat = {
      id: `hb-${crypto.randomUUID().slice(0, 8)}`,
      resourceId: body.resourceId,
      isOnline: body.status.isOnline,
      health: body.status.health,
      hasInternet: body.status.hasInternet,
      uptimeHours: body.hardware.uptimeHours,
      cpuUsagePercent: body.hardware.cpuUsagePercent,
      memoryUsagePercent: body.hardware.memoryUsagePercent,
      gpuUsagePercent: body.hardware.gpuUsagePercent ?? null,
      gpuTempCelsius: body.hardware.gpuTempCelsius ?? null,
      externalIp: body.network.externalIp,
      watchtowerDeployed: body.network.watchtowerDeployed,
      lastUpdatedAt: new Date(),
      createdAt: new Date(),
    };

    return NextResponse.json({ data: heartbeat }, { status: 201 });
  } catch (error) {
    console.error("Failed to process heartbeat:", error);
    return NextResponse.json(
      { error: "Failed to process heartbeat" },
      { status: 500 }
    );
  }
}
