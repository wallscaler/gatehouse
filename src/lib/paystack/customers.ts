import { getPaystackClient } from "./client";
import type { PaystackCustomer, CreateCustomerParams, PaystackListResponse } from "./types";

export async function createCustomer(params: CreateCustomerParams) {
  const client = getPaystackClient();
  return client.request<PaystackCustomer>("POST", "/customer", params);
}

export async function fetchCustomer(emailOrCode: string) {
  const client = getPaystackClient();
  return client.request<PaystackCustomer>("GET", `/customer/${emailOrCode}`);
}

export async function updateCustomer(
  code: string,
  params: Partial<CreateCustomerParams>
) {
  const client = getPaystackClient();
  return client.request<PaystackCustomer>("PUT", `/customer/${code}`, params);
}

export async function listCustomers(
  params?: { perPage?: number; page?: number }
): Promise<PaystackListResponse<PaystackCustomer>> {
  const client = getPaystackClient();
  return client.requestList<PaystackCustomer>("/customer", params as Record<string, string | number>);
}
