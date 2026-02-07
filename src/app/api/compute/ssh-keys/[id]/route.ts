import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getSshKeyById } from "@/lib/compute/mock-data";
import type { UpdateSshKeyRequest } from "@/lib/compute/types";

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
    const key = getSshKeyById(id);

    if (!key) {
      return NextResponse.json(
        { error: "SSH key not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: key });
  } catch (error) {
    console.error("Failed to fetch SSH key:", error);
    return NextResponse.json(
      { error: "Failed to fetch SSH key" },
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
    const key = getSshKeyById(id);

    if (!key) {
      return NextResponse.json(
        { error: "SSH key not found" },
        { status: 404 }
      );
    }

    if (key.isDefault) {
      return NextResponse.json(
        { error: "Cannot delete the default SSH key. Set another key as default first." },
        { status: 400 }
      );
    }

    // Mock deletion
    return NextResponse.json({ data: { id, deleted: true } });
  } catch (error) {
    console.error("Failed to delete SSH key:", error);
    return NextResponse.json(
      { error: "Failed to delete SSH key" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const key = getSshKeyById(id);

    if (!key) {
      return NextResponse.json(
        { error: "SSH key not found" },
        { status: 404 }
      );
    }

    const body = (await request.json()) as UpdateSshKeyRequest;

    // Mock update
    const updatedKey = {
      ...key,
      ...(body.isDefault !== undefined ? { isDefault: body.isDefault } : {}),
    };

    return NextResponse.json({ data: updatedKey });
  } catch (error) {
    console.error("Failed to update SSH key:", error);
    return NextResponse.json(
      { error: "Failed to update SSH key" },
      { status: 500 }
    );
  }
}
