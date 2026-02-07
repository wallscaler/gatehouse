import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { mockSshKeys } from "@/lib/compute/mock-data";
import type { AddSshKeyRequest } from "@/lib/compute/types";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // In production, filter by userId. For mock, return all.
    return NextResponse.json({ data: mockSshKeys });
  } catch (error) {
    console.error("Failed to fetch SSH keys:", error);
    return NextResponse.json(
      { error: "Failed to fetch SSH keys" },
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

    const body = (await request.json()) as AddSshKeyRequest;

    if (!body.name || !body.publicKey) {
      return NextResponse.json(
        { error: "Missing required fields: name, publicKey" },
        { status: 400 }
      );
    }

    // Basic validation: public key should start with ssh- or ecdsa-
    const validPrefixes = ["ssh-rsa", "ssh-ed25519", "ssh-dss", "ecdsa-sha2"];
    const hasValidPrefix = validPrefixes.some((prefix) =>
      body.publicKey.trim().startsWith(prefix)
    );

    if (!hasValidPrefix) {
      return NextResponse.json(
        { error: "Invalid SSH public key format" },
        { status: 400 }
      );
    }

    // Mock new key creation
    const newKey = {
      id: `key-${crypto.randomUUID().slice(0, 8)}`,
      userId: "mock-user-id",
      name: body.name,
      publicKey: body.publicKey.trim(),
      fingerprint: `SHA256:${btoa(crypto.randomUUID()).slice(0, 43)}`,
      isDefault: mockSshKeys.length === 0, // First key is default
      lastUsedAt: null,
      createdAt: new Date(),
    };

    return NextResponse.json({ data: newKey }, { status: 201 });
  } catch (error) {
    console.error("Failed to create SSH key:", error);
    return NextResponse.json(
      { error: "Failed to create SSH key" },
      { status: 500 }
    );
  }
}
