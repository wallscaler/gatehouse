import { getPaystackClient } from "./client";
import type {
  PaystackSubscription,
  CreateSubscriptionParams,
  PaystackListResponse,
} from "./types";

export async function createSubscription(params: CreateSubscriptionParams) {
  const client = getPaystackClient();
  return client.request<PaystackSubscription>("POST", "/subscription", params);
}

export async function fetchSubscription(idOrCode: string | number) {
  const client = getPaystackClient();
  return client.request<PaystackSubscription>(
    "GET",
    `/subscription/${idOrCode}`
  );
}

export async function listSubscriptions(
  params?: { perPage?: number; page?: number; customer?: number; plan?: number }
): Promise<PaystackListResponse<PaystackSubscription>> {
  const client = getPaystackClient();
  return client.requestList<PaystackSubscription>(
    "/subscription",
    params as Record<string, string | number>
  );
}

export async function enableSubscription(code: string, token: string) {
  const client = getPaystackClient();
  return client.request<{ message: string }>("POST", "/subscription/enable", {
    code,
    token,
  });
}

export async function disableSubscription(code: string, token: string) {
  const client = getPaystackClient();
  return client.request<{ message: string }>("POST", "/subscription/disable", {
    code,
    token,
  });
}
