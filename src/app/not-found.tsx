import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <Shield className="mb-6 h-16 w-16 text-forest" />
      <h1 className="text-7xl font-bold text-forest">404</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Page not found
      </p>
      <p className="mt-2 max-w-md text-center text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className="mt-8">
        <Button>Go home</Button>
      </Link>
    </div>
  );
}
