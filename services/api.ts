/**
 * Lendro VTU API Service Layer
 *
 * Base URL  : https://trackd.live/lendro/api/v1
 * Auth model: Bearer token (stored in memory + AsyncStorage after login)
 * CORS      : server returns Access-Control-Allow-Origin: * + Allow-Credentials: true
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

export const BASE_URL = "https://trackd.live/lendro/api/v1";

// ─── Token management ──────────────────────────────────────────────────────────

const TOKEN_STORAGE_KEY = "@lendro_api_token";
let _token: string | null = null;

export async function loadStoredToken(): Promise<string | null> {
  if (_token) return _token;
  const stored = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
  if (stored) _token = stored;
  return _token;
}

export async function setAuthToken(token: string) {
  _token = token;
  await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export async function clearAuthToken() {
  _token = null;
  await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
}

export function getAuthToken() {
  return _token;
}

// ─── Core fetch wrapper ────────────────────────────────────────────────────────

async function request<T>(
  method: "GET" | "POST",
  path: string,
  body?: Record<string, unknown>
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  // Attach bearer token if available
  const tok = _token ?? (await AsyncStorage.getItem(TOKEN_STORAGE_KEY));
  if (tok) headers["Authorization"] = `Bearer ${tok}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({
    status: "failed",
    message: `HTTP ${res.status}`,
  }));

  if (data?.status === "failed") {
    throw new Error(
      data.message ?? (data.errors as string[])?.join(", ") ?? `HTTP ${res.status}`
    );
  }
  return data as T;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  wallet_balance: number;
}

export interface LoginResponse {
  status: "success";
  message: string;
  token: string;
  user: AuthUser;
}

/**
 * POST /auth/login.php — email + password → returns Bearer token + user profile.
 * Call setAuthToken(res.token) after this to persist the session.
 */
export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await request<LoginResponse>("POST", "/auth/login.php", {
    email,
    password,
  });
  if (res.token) await setAuthToken(res.token);
  return res;
}

export interface RegisterResponse {
  status: "success";
  message: string;
  user_id: number;
}

/**
 * POST /auth/register.php — create a new user account.
 * On success, call login() immediately to get a token.
 */
export function register(
  name: string,
  email: string,
  phone: string,
  password: string
): Promise<RegisterResponse> {
  return request<RegisterResponse>("POST", "/auth/register.php", {
    name,
    email,
    phone,
    password,
  });
}

/** POST /auth/logout.php — invalidates session + clears stored token. */
export async function logout() {
  const res = await request<{ status: "success"; message: string }>(
    "POST",
    "/auth/logout.php"
  );
  await clearAuthToken();
  return res;
}

// ─── Wallet ───────────────────────────────────────────────────────────────────

export interface WalletTransaction {
  reference: string;
  amount: number;
  type: string;
  service: string;
  status:
    | "pending"
    | "processing"
    | "success"
    | "failed"
    | "reversed"
    | "awaiting_reconciliation";
  date: string;
  time_ago: string;
}

export interface WalletResponse {
  status: "success";
  balance: number;
  transactions: WalletTransaction[];
}

/** GET /client/wallet.php — current balance + last 20 transactions. */
export function getWallet(): Promise<WalletResponse> {
  return request<WalletResponse>("GET", "/client/wallet.php");
}

// ─── Service Catalogue ────────────────────────────────────────────────────────

export interface ServiceItem {
  id: number;
  key: string;
  name: string;
  price: number | null;
  category: string;
  duration: string | null;
  unit: string | null;
}

export interface ServicesResponse {
  status: "success";
  data: {
    airtime?: Record<string, ServiceItem[]>;
    data?: Record<string, ServiceItem[]>;
    bill?: Record<string, ServiceItem[]>;
    [key: string]: Record<string, ServiceItem[]> | undefined;
  };
}

/**
 * GET /client/services.php — full service catalogue grouped by type + network.
 * Use optional `type` and `network` params to filter results.
 */
export function getServices(
  type?: string,
  network?: string
): Promise<ServicesResponse> {
  const qs = new URLSearchParams();
  if (type) qs.set("type", type);
  if (network) qs.set("network", network);
  const query = qs.toString() ? `?${qs}` : "";
  return request<ServicesResponse>("GET", `/client/services.php${query}`);
}

// ─── Place Order ──────────────────────────────────────────────────────────────

export interface OrderResponse {
  status: "processing" | "already_processed" | "failed" | "success";
  reference: string;
  message: string;
}

/**
 * POST /client/order.php — place a VTU purchase.
 *
 * Wallet is debited immediately; provider API is called asynchronously
 * by the background worker. Use getOrderStatus(reference) to poll.
 *
 * @param service_id      Service ID from the catalogue (getServices())
 * @param phone           Recipient's phone number (e.g. "08012345678")
 * @param idempotency_key Client-generated UUID to prevent duplicate charges
 */
export function placeOrder(
  service_id: number,
  phone: string,
  idempotency_key: string
): Promise<OrderResponse> {
  return request<OrderResponse>("POST", "/client/order.php", {
    service_id,
    phone,
    idempotency_key,
  });
}

/**
 * Generate a UUID-based idempotency key.
 * Always generate a new one per purchase attempt — never reuse across sessions.
 */
export function generateIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ─── Transaction Status ───────────────────────────────────────────────────────

export interface StatusResponse {
  status: "success";
  transaction: {
    reference: string;
    status: "pending" | "processing" | "success" | "failed" | "reversed";
    service: string;
    amount: number;
    phone: string;
    created_at: string;
    updated_at: string;
  };
}

/** GET /client/status.php?ref= — poll a single order's status by reference. */
export function getOrderStatus(reference: string): Promise<StatusResponse> {
  return request<StatusResponse>(
    "GET",
    `/client/status.php?ref=${encodeURIComponent(reference)}`
  );
}

// ─── Transaction History ──────────────────────────────────────────────────────

export interface TransactionRecord {
  reference: string;
  service: string;
  provider: string;
  amount: number;
  phone: string;
  status: string;
  created_at: string;
  updated_at: string;
  time_ago: string;
}

export interface TransactionsListResponse {
  status: "success";
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  transactions: TransactionRecord[];
}

/** GET /client/transactions.php — paginated full transaction history. */
export function getTransactions(
  page = 1,
  limit = 20,
  status?: string
): Promise<TransactionsListResponse> {
  const qs = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (status) qs.set("status", status);
  return request<TransactionsListResponse>(
    "GET",
    `/client/transactions.php?${qs}`
  );
}
