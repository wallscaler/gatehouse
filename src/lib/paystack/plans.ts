import { getPaystackClient } from "./client";
import type { PaystackPlan, CreatePlanParams, PaystackListResponse } from "./types";

export async function createPlan(params: CreatePlanParams) {
  const client = getPaystackClient();
  return client.request<PaystackPlan>("POST", "/plan", params);
}

export async function fetchPlan(idOrCode: string | number) {
  const client = getPaystackClient();
  return client.request<PaystackPlan>("GET", `/plan/${idOrCode}`);
}

export async function listPlans(
  params?: { perPage?: number; page?: number }
): Promise<PaystackListResponse<PaystackPlan>> {
  const client = getPaystackClient();
  return client.requestList<PaystackPlan>("/plan", params as Record<string, string | number>);
}

export async function updatePlan(
  idOrCode: string | number,
  params: Partial<CreatePlanParams>
) {
  const client = getPaystackClient();
  return client.request<PaystackPlan>("PUT", `/plan/${idOrCode}`, params);
}
