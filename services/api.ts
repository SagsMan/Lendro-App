/**
 * Lendro API Service Layer
 * Base URL: https://trackd.live/api/v1
 * Auth: Bearer token (stored after OTP verification)
 */

const BASE_URL = "https://trackd.live/api/v1";

let _token: string | null = null;

export function setAuthToken(token: string) {
  _token = token;
}

export function clearAuthToken() {
  _token = null;
}

async function request<T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  body?: Record<string, unknown>
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (_token) headers["Authorization"] = `Bearer ${_token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message ?? `HTTP ${res.status}`);
  }
  return data as T;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export type SendOtpResponse = { message: string; expires_in: number };
export type VerifyOtpResponse = { token: string; user: User };

/** Send OTP to phone or email */
export function sendOtp(contact: string, channel: "phone" | "email") {
  return request<SendOtpResponse>("POST", "/auth/otp/send", { contact, channel });
}

/** Verify OTP — returns auth token */
export function verifyOtp(contact: string, otp: string) {
  return request<VerifyOtpResponse>("POST", "/auth/otp/verify", { contact, otp });
}

/** Register a new user (called after first OTP verify if user is new) */
export function register(params: { name: string; phone: string; email?: string }) {
  return request<VerifyOtpResponse>("POST", "/auth/register", params);
}

/** Logout — invalidates server session */
export function logout() {
  return request<{ message: string }>("POST", "/auth/logout");
}

// ─── User / Profile ──────────────────────────────────────────────────────────

export type User = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  wallet_balance: number;
  oshare_balance: number;
  support_funding_limit: number;
  outstanding: number;
  participation_points: number;
  usage_points: number;
  repayment_score: number;
  total_points_earned: number;
  rank: number;
};

export function getProfile() {
  return request<User>("GET", "/user/profile");
}

export function updateProfile(params: { name?: string; email?: string }) {
  return request<User>("PUT", "/user/profile", params);
}

// ─── Wallet ──────────────────────────────────────────────────────────────────

export type WalletBalance = { balance: number; oshare_balance: number };

export function getWalletBalance() {
  return request<WalletBalance>("GET", "/wallet/balance");
}

export type DepositPayload = { amount: number; payment_method: "paystack" | "flutterwave" };
export type DepositResponse = { payment_url: string; reference: string };

export function initiateDeposit(payload: DepositPayload) {
  return request<DepositResponse>("POST", "/wallet/deposit", payload);
}

export function verifyDeposit(reference: string) {
  return request<{ success: boolean; amount: number }>("POST", "/wallet/deposit/verify", { reference });
}

// ─── Transactions ─────────────────────────────────────────────────────────────

export type Transaction = {
  id: number;
  type: "airtime" | "data" | "cable" | "electricity" | "exam" | "deposit" | "withdrawal";
  description: string;
  amount: number;
  status: "success" | "pending" | "failed";
  created_at: string;
  phone?: string;
  network?: string;
  reference?: string;
};

export type TransactionsResponse = {
  data: Transaction[];
  total: number;
  page: number;
  per_page: number;
};

export function getTransactions(params?: { page?: number; type?: string; status?: string }) {
  const qs = new URLSearchParams(params as Record<string, string>).toString();
  return request<TransactionsResponse>("GET", `/transactions${qs ? `?${qs}` : ""}`);
}

export function retryTransaction(id: number) {
  return request<{ success: boolean; message: string }>("POST", `/transactions/${id}/retry`);
}

// ─── Airtime ─────────────────────────────────────────────────────────────────

export type AirtimePurchasePayload = {
  network: "mtn" | "airtel" | "glo" | "9mobile";
  phone: string;
  amount: number;
};

export type ServicePurchaseResponse = {
  success: boolean;
  message: string;
  reference: string;
  transaction_id: number;
  points_earned: number;
};

export function purchaseAirtime(payload: AirtimePurchasePayload) {
  return request<ServicePurchaseResponse>("POST", "/services/airtime", payload);
}

// ─── Data ────────────────────────────────────────────────────────────────────

export type DataPlan = {
  id: string;
  network: string;
  size: string;
  price: number;
  validity: string;
  description: string;
  cashback_points: number;
};

export function getDataPlans(network: string) {
  return request<DataPlan[]>("GET", `/services/data/plans?network=${network}`);
}

export type DataPurchasePayload = {
  network: "mtn" | "airtel" | "glo" | "9mobile";
  phone: string;
  plan_id: string;
};

export function purchaseData(payload: DataPurchasePayload) {
  return request<ServicePurchaseResponse>("POST", "/services/data", payload);
}

// ─── Cable TV ────────────────────────────────────────────────────────────────

export type CablePlan = {
  id: string;
  provider: string;
  name: string;
  price: number;
  duration: string;
  channels: string;
};

export function getCablePlans(provider: string) {
  return request<CablePlan[]>("GET", `/services/cable/plans?provider=${provider}`);
}

export type CableSubscribePayload = {
  provider: "dstv" | "gotv" | "startimes" | "showmax";
  smart_card_number: string;
  plan_id: string;
};

export function subscribeCable(payload: CableSubscribePayload) {
  return request<ServicePurchaseResponse>("POST", "/services/cable", payload);
}

// ─── Electricity ──────────────────────────────────────────────────────────────

export type ElectricityDisco = {
  id: string;
  name: string;
  slug: string;
  states: string[];
};

export function getDiscos() {
  return request<ElectricityDisco[]>("GET", "/services/electricity/discos");
}

export function validateMeter(disco: string, meter_number: string, meter_type: "prepaid" | "postpaid") {
  return request<{ name: string; address: string; tariff: string }>("POST", "/services/electricity/validate", {
    disco,
    meter_number,
    meter_type,
  });
}

export type ElectricityPayload = {
  disco: string;
  meter_number: string;
  meter_type: "prepaid" | "postpaid";
  amount: number;
  phone: string;
};

export function payElectricity(payload: ElectricityPayload) {
  return request<ServicePurchaseResponse & { token?: string }>("POST", "/services/electricity", payload);
}

// ─── Exam PIN ─────────────────────────────────────────────────────────────────

export type ExamBody = { id: string; name: string; slug: string };

export type ExamPinType = {
  id: string;
  body: string;
  name: string;
  price: number;
  description: string;
};

export function getExamBodies() {
  return request<ExamBody[]>("GET", "/services/exam/bodies");
}

export function getExamPinTypes(body: string) {
  return request<ExamPinType[]>("GET", `/services/exam/pin-types?body=${body}`);
}

export type ExamPinPayload = {
  body: "waec" | "neco" | "jamb" | "nabteb";
  pin_type_id: string;
  reg_number: string;
};

export type ExamPinResponse = ServicePurchaseResponse & { pin: string; serial?: string };

export function purchaseExamPin(payload: ExamPinPayload) {
  return request<ExamPinResponse>("POST", "/services/exam/pin", payload);
}

// ─── Support Funding ──────────────────────────────────────────────────────────

export type FundingRequest = {
  amount: number;
  purpose: string;
  repayment_plan: "weekly" | "monthly";
};

export type FundingResponse = {
  id: number;
  status: "pending" | "approved" | "rejected";
  amount: number;
  message: string;
};

export function requestFunding(payload: FundingRequest) {
  return request<FundingResponse>("POST", "/funding/request", payload);
}

export function getFundingHistory() {
  return request<FundingResponse[]>("GET", "/funding/history");
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────

export type LeaderboardEntry = {
  rank: number;
  user_id: number;
  name: string;
  usage_points: number;
  is_current_user: boolean;
};

export function getLeaderboard() {
  return request<LeaderboardEntry[]>("GET", "/leaderboard");
}

// ─── Notifications ────────────────────────────────────────────────────────────

export type Notification = {
  id: number;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
};

export function getNotifications() {
  return request<Notification[]>("GET", "/notifications");
}

export function markNotificationRead(id: number) {
  return request<{ success: boolean }>("POST", `/notifications/${id}/read`);
}
