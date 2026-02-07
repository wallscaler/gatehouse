import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { mockAdminUsers } from "@/lib/compute/mock-data";

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
    const role = searchParams.get("role");
    const status = searchParams.get("status");

    let users = [...mockAdminUsers];

    if (role) {
      users = users.filter((u) => u.role === role);
    }

    if (status) {
      users = users.filter((u) => u.status === status);
    }

    // Sort newest first
    users.sort(
      (a, b) =>
        (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0)
    );

    const total = users.length;
    const start = (page - 1) * limit;
    const paginated = users.slice(start, start + limit);

    return NextResponse.json({ data: paginated, total, page });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
