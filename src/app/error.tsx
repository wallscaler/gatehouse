"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <Shield className="mb-6 h-16 w-16 text-forest" />
      <h1 className="text-3xl font-bold text-foreground">
        Something went wrong
      </h1>
      <p className="mt-4 max-w-md text-center text-sm text-muted-foreground">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <Button onClick={reset} className="mt-8">
        Try again
      </Button>
    </div>
  );
}
