import { NextResponse } from "next/server";
import { mockResources, mockHeartbeats } from "@/lib/compute/mock-data";
import { obfuscateResource } from "@/lib/compute/obfuscation";
import type { ComputeResourceFilters } from "@/lib/compute/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const filters: ComputeResourceFilters = {
      type: (searchParams.get("type") as "cpu" | "gpu") || undefined,
      gpuModel: searchParams.get("gpuModel") || undefined,
      region: searchParams.get("region") || undefined,
      minRam: searchParams.get("minRam") ? Number(searchParams.get("minRam")) : undefined,
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
      sortBy: (searchParams.get("sortBy") as ComputeResourceFilters["sortBy"]) || undefined,
      page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
      limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 20,
    };

    // Filter only active, fully approved resources for public listing
    let resources = mockResources.filter(
      (r) =>
        r.isActive &&
        !r.isBlacklisted &&
        r.adminApprovalStatus === "verified"
    );

    if (filters.type) {
      resources = resources.filter((r) => r.resourceType === filters.type);
    }

    if (filters.gpuModel) {
      resources = resources.filter(
        (r) => r.gpuModel?.toLowerCase().includes(filters.gpuModel!.toLowerCase())
      );
    }

    if (filters.region) {
      resources = resources.filter(
        (r) => r.region?.toLowerCase() === filters.region!.toLowerCase()
      );
    }

    if (filters.minRam !== undefined) {
      resources = resources.filter((r) => (r.ramGb ?? 0) >= filters.minRam!);
    }

    if (filters.maxPrice !== undefined) {
      resources = resources.filter((r) => (r.hourlyPrice ?? 0) <= filters.maxPrice!);
    }

    // Sort
    switch (filters.sortBy) {
      case "price":
        resources.sort((a, b) => (a.hourlyPrice ?? 0) - (b.hourlyPrice ?? 0));
        break;
      case "ram":
        resources.sort((a, b) => (b.ramGb ?? 0) - (a.ramGb ?? 0));
        break;
      case "gpuVram":
        resources.sort((a, b) => (b.gpuVramGb ?? 0) - (a.gpuVramGb ?? 0));
        break;
      case "newest":
        resources.sort(
          (a, b) =>
            (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0)
        );
        break;
      default:
        // Default: sort by price ascending
        resources.sort((a, b) => (a.hourlyPrice ?? 0) - (b.hourlyPrice ?? 0));
    }

    const total = resources.length;
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const start = (page - 1) * limit;
    const paginated = resources.slice(start, start + limit);

    // Obfuscate resources for public API response
    // Raw hardware details, provider names, and IPs are masked
    const data = paginated.map((resource) => {
      const heartbeat = mockHeartbeats.find((h) => h.resourceId === resource.id);
      const obfuscated = obfuscateResource(resource);
      return {
        ...obfuscated,
        isOnline: heartbeat?.isOnline ?? false,
        health: heartbeat?.health ?? "critical",
      };
    });

    return NextResponse.json({ data, total, page });
  } catch (error) {
    console.error("Failed to fetch compute resources:", error);
    return NextResponse.json(
      { error: "Failed to fetch compute resources" },
      { status: 500 }
    );
  }
}
