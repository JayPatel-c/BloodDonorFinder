const API_BASE_URL = "http://localhost:8000";

// ─── Types ──────────────────────────────────────────────────────────
export interface AuthResponse {
  access_token: string;
  token_type: string;
  user_type: string;
  user_id: number;
  user_name: string;
}

export interface DonorResult {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  blood_group: string;
  age: number;
  gender: string;
  city: string;
  address: string | null;
  last_donation_date: string | null;
  is_available: boolean;
  medical_conditions: string | null;
  weight: number | null;
  created_at: string;
}

// ─── Helper ─────────────────────────────────────────────────────────
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // Add auth token if available
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || `HTTP ${res.status}`);
  }

  return res.json();
}

// ─── Auth ───────────────────────────────────────────────────────────
export function saveAuth(data: AuthResponse) {
  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("user_type", data.user_type);
  localStorage.setItem("user_id", String(data.user_id));
  localStorage.setItem("user_name", data.user_name);
}

export function clearAuth() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user_type");
  localStorage.removeItem("user_id");
  localStorage.removeItem("user_name");
}

export function getAuth() {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("access_token");
  if (!token) return null;
  return {
    token,
    user_type: localStorage.getItem("user_type"),
    user_id: localStorage.getItem("user_id"),
    user_name: localStorage.getItem("user_name"),
  };
}

// ─── Donor Auth ─────────────────────────────────────────────────────
export async function registerDonor(data: {
  full_name: string;
  email: string;
  password: string;
  phone: string;
  blood_group: string;
  age: number;
  gender: string;
  city: string;
  address?: string;
  last_donation_date?: string | null;
  medical_conditions?: string;
  weight?: number | null;
}): Promise<AuthResponse> {
  return request<AuthResponse>("/api/auth/donor/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function loginDonor(
  email: string,
  password: string
): Promise<AuthResponse> {
  return request<AuthResponse>("/api/auth/donor/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// ─── Hospital Auth ──────────────────────────────────────────────────
export async function registerHospital(data: {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  city: string;
  state?: string;
  pincode?: string;
  license_number?: string;
  hospital_type?: string;
  contact_person?: string;
}): Promise<AuthResponse> {
  return request<AuthResponse>("/api/auth/hospital/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function loginHospital(
  email: string,
  password: string
): Promise<AuthResponse> {
  return request<AuthResponse>("/api/auth/hospital/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// ─── Admin Auth ─────────────────────────────────────────────────────
export async function loginAdmin(
  email: string,
  password: string
): Promise<AuthResponse> {
  return request<AuthResponse>("/api/auth/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// ─── Donor Search ───────────────────────────────────────────────────
export async function searchDonors(params: {
  blood_group?: string;
  city?: string;
  is_available?: boolean;
}): Promise<DonorResult[]> {
  const searchParams = new URLSearchParams();
  if (params.blood_group) searchParams.set("blood_group", params.blood_group);
  if (params.city) searchParams.set("city", params.city);
  if (params.is_available !== undefined)
    searchParams.set("is_available", String(params.is_available));

  const query = searchParams.toString();
  return request<DonorResult[]>(
    `/api/donors/search${query ? `?${query}` : ""}`
  );
}
