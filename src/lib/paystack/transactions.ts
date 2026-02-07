import { getPaystackClient } from "./client";
import type {
  PaystackTransaction,
  InitializeTransactionParams,
  InitializeTransactionResponse,
  PaystackListResponse,
} from "./types";

export async function initializeTransaction(params: InitializeTransactionParams) {
  const client = getPaystackClient();
  return client.request<InitializeTransactionResponse>(
    "POST",
    "/transaction/initialize",
    params
  );
}

export async function verifyTransaction(reference: string) {
  const client = getPaystackClient();
  return client.request<PaystackTransaction>(
    "GET",
    `/transaction/verify/${reference}`
  );
}

export async function listTransactions(
  params?: { perPage?: number; page?: number; customer?: number; status?: string }
): Promise<PaystackListResponse<PaystackTransaction>> {
  const client = getPaystackClient();
  return client.requestList<PaystackTransaction>(
    "/transaction",
    params as Record<string, string | number>
  );
}

export async function fetchTransaction(id: number) {
  const client = getPaystackClient();
  return client.request<PaystackTransaction>("GET", `/transaction/${id}`);
}
