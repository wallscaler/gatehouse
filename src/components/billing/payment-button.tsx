"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface PaymentButtonProps {
  planCode: string;
  label?: string;
  className?: string;
}

export function PaymentButton({
  planCode,
  label = "Subscribe",
  className,
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleSubscribe() {
    setLoading(true);
    try {
      const res = await fetch("/api/billing/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planCode }),
      });

      const data = await res.json();

      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        console.error("No authorization URL returned");
      }
    } catch (error) {
      console.error("Failed to subscribe:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleSubscribe}
      disabled={loading}
      className={className}
    >
      {loading ? "Processing..." : label}
    </Button>
  );
}
