import { NextResponse } from "next/server";
import { mockTemplates } from "@/lib/compute/mock-data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const gpuRequired = searchParams.get("gpuRequired");

    let templates = mockTemplates.filter((t) => t.isActive);

    if (category) {
      templates = templates.filter(
        (t) => t.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (gpuRequired !== null && gpuRequired !== undefined && gpuRequired !== "") {
      const requiresGpu = gpuRequired === "true";
      templates = templates.filter((t) => t.gpuRequired === requiresGpu);
    }

    return NextResponse.json({ data: templates });
  } catch (error) {
    console.error("Failed to fetch templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}
