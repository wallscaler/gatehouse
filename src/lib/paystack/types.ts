export interface PaystackResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

export interface PaystackListResponse<T> {
  status: boolean;
  message: string;
  data: T[];
  meta: {
    total: number;
    skipped: number;
    perPage: number;
    page: number;
    pageCount: number;
  };
}

export interface PaystackCustomer {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  customer_code: string;
  phone: string | null;
  metadata: Record<string, unknown> | null;
  risk_action: string;
  international_format_phone: string | null;
}

export interface PaystackPlan {
  id: number;
  name: string;
  plan_code: string;
  description: string | null;
  amount: number;
  interval: "hourly" | "daily" | "weekly" | "monthly" | "quarterly" | "biannually" | "annually";
  currency: string;
  send_invoices: boolean;
  send_sms: boolean;
  hosted_page: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaystackTransaction {
  id: number;
  domain: string;
  status: "success" | "failed" | "abandoned";
  reference: string;
  amount: number;
  message: string | null;
  gateway_response: string;
  paid_at: string | null;
  created_at: string;
  channel: string;
  currency: string;
  ip_address: string | null;
  metadata: Record<string, unknown> | null;
  fees: number | null;
  customer: PaystackCustomer;
  plan: PaystackPlan | null;
}

export interface PaystackSubscription {
  id: number;
  subscription_code: string;
  email_token: string;
  plan: PaystackPlan;
  customer: PaystackCustomer;
  status: "active" | "non-renewing" | "attention" | "completed" | "cancelled";
  amount: number;
  cron_expression: string;
  next_payment_date: string | null;
  created_at: string;
}

export interface InitializeTransactionParams {
  email: string;
  amount: number;
  currency?: string;
  reference?: string;
  callback_url?: string;
  plan?: string;
  metadata?: Record<string, unknown>;
  channels?: string[];
}

export interface InitializeTransactionResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface CreatePlanParams {
  name: string;
  amount: number;
  interval: PaystackPlan["interval"];
  description?: string;
  currency?: string;
  send_invoices?: boolean;
  send_sms?: boolean;
}

export interface CreateCustomerParams {
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateSubscriptionParams {
  customer: string;
  plan: string;
  authorization?: string;
  start_date?: string;
}

export interface PaystackWebhookEvent {
  event: string;
  data: Record<string, unknown>;
}
