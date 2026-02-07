import { NextResponse } from "next/server";
import { mockResources, mockHeartbeats } from "@/lib/compute/mock-data";
import { obfuscateResource } from "@/lib/compute/obfuscation";
import { fetchOffers, transformOfferToResource } from "@/lib/compute/psca-client";
import type { ComputeResourceFilters } from "@/lib/compute/types";
import type { ComputeResource } from "@/lib/db/schema";

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

    // Try fetching real offers from PSCA, fall back to mock data
    let resources: ComputeResource[];
    const pscaOffers = await fetchOffers({
      gpu_model: filters.gpuModel ? [filters.gpuModel] : undefined,
      region: filters.region ? [filters.region] : undefined,
      max_price: filters.maxPrice,
      limit: 500,
    });

    if (pscaOffers && pscaOffers.length > 0) {
      // Transform real PSCA offers into our resource format
      resources = pscaOffers.map((offer) => {
        const transformed = transformOfferToResource(offer);
        return transformed as unknown as ComputeResource;
      });
    } else {
      // Fall back to mock data when PSCA is unavailable
      resources = mockResources.filter(
        (r) =>
          r.isActive &&
          !r.isBlacklisted &&
          r.adminApprovalStatus === "verified"
      );
    }

    // Apply filters
    if (filters.type) {
      resources = resources.filter((r) => r.resourceType === filters.type);
    }

    if (filters.gpuModel && !pscaOffers) {
      resources = resources.filter(
        (r) => r.gpuModel?.toLowerCase().includes(filters.gpuModel!.toLowerCase())
      );
    }

    if (filters.region && !pscaOffers) {
      resources = resources.filter(
        (r) => r.region?.toLowerCase() === filters.region!.toLowerCase()
      );
    }

    if (filters.minRam !== undefined) {
      resources = resources.filter((r) => (r.ramGb ?? 0) >= filters.minRam!);
    }

    if (filters.maxPrice !== undefined && !pscaOffers) {
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
        resources.sort((a, b) => (a.hourlyPrice ?? 0) - (b.hourlyPrice ?? 0));
    }

    const total = resources.length;
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const start = (page - 1) * limit;
    const paginated = resources.slice(start, start + limit);

    // Obfuscate resources for public API response
    const data = paginated.map((resource) => {
      const heartbeat = mockHeartbeats.find((h) => h.resourceId === resource.id);
      const obfuscated = obfuscateResource(resource);
      return {
        ...obfuscated,
        isOnline: heartbeat?.isOnline ?? true,
        health: heartbeat?.health ?? "healthy",
      };
    });

    return NextResponse.json({
      data,
      total,
      page,
      source: pscaOffers ? "live" : "mock",
    });
  } catch (error) {
    console.error("Failed to fetch compute resources:", error);
    return NextResponse.json(
      { error: "Failed to fetch compute resources" },
      { status: 500 }
    );
  }
}
