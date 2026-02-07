import type { PaystackResponse, PaystackListResponse } from "./types";

export class PaystackClient {
  private baseUrl = "https://api.paystack.co";
  private secretKey: string;

  constructor(secretKey?: string) {
    this.secretKey = secretKey || process.env.PAYSTACK_SECRET_KEY || "";
    if (!this.secretKey) {
      throw new Error("Paystack secret key is required");
    }
  }

  async request<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    path: string,
    body?: unknown
  ): Promise<PaystackResponse<T>> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(`Paystack API error: ${error.message || res.statusText}`);
    }

    return res.json();
  }

  async requestList<T>(
    path: string,
    params?: Record<string, string | number>
  ): Promise<PaystackListResponse<T>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        searchParams.set(key, String(value));
      });
    }

    const url = searchParams.toString()
      ? `${this.baseUrl}${path}?${searchParams}`
      : `${this.baseUrl}${path}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(`Paystack API error: ${error.message || res.statusText}`);
    }

    return res.json();
  }
}

let client: PaystackClient | null = null;

export function getPaystackClient(): PaystackClient {
  if (!client) {
    client = new PaystackClient();
  }
  return client;
}
