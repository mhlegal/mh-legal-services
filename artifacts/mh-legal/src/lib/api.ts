/**
 * Hybrid API Client
 * 
 * Routes requests to either:
 * 1. Vercel API routes (default) - /api/*
 * 2. Replit backend (when VITE_API_URL is set) - external URL
 * 
 * Usage: When you upgrade to Replit Core, just set VITE_API_URL env var and
 * all API calls automatically route to Replit. Zero code changes needed.
 */

// When deployed separately (frontend on Vercel, backend on Replit),
// set VITE_API_URL to the full backend origin, e.g. "https://your-app.replit.dev".
// When unset (default — Vercel deployment), API calls use the local /api path.
const API_ORIGIN = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, "");
const BASE = API_ORIGIN || BASE_PATH;

export { BASE };

export async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${BASE}/api${path}`, {
    credentials: "include",
    ...options,
    // headers must come after ...options so we always merge correctly
    headers: { "Content-Type": "application/json", ...(options?.headers ?? {}) },
  });
  return res;
}

export async function apiJson<T = unknown>(path: string, options?: RequestInit): Promise<T> {
  const res = await apiFetch(path, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as any).error ?? `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

/**
 * Typed API methods for common endpoints
 */
export const api = {
  health: () => apiJson('/health'),

  auth: {
    login: (email: string, password: string) =>
      apiJson('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    logout: () =>
      apiJson('/auth/logout', { method: 'POST' }),
    me: () => apiJson('/auth/me'),
  },

  leads: {
    create: (data: {
      name: string;
      email: string;
      phone: string;
      service: string;
      message?: string;
    }) =>
      apiJson('/leads', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  applications: {
    uploadUrl: (fileName: string, contentType: string) =>
      apiJson('/applications/upload-url', {
        method: 'POST',
        body: JSON.stringify({ fileName, contentType }),
      }),
    create: (data: {
      fullNames: string;
      saIdNumber: string;
      physicalAddress: string;
      email: string;
      stipendStatus: boolean;
      province: string;
      willingToRelocate: boolean;
      trainingLetterPath?: string;
    }) =>
      apiJson('/applications', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    list: (filters?: { province?: string; stipend?: string }) => {
      const params = new URLSearchParams();
      if (filters?.province) params.append('province', filters.province);
      if (filters?.stipend) params.append('stipend', filters.stipend);
      return apiJson(`/applications?${params}`);
    },
    get: (id: number) => apiJson(`/applications/${id}`),
  },

  agentReports: {
    create: (data: {
      agentCount: number;
      province: string;
      period: string;
      notes?: string;
    }) =>
      apiJson('/agent-reports', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    list: () => apiJson('/agent-reports'),
    delete: (id: number) =>
      apiJson(`/agent-reports/${id}`, { method: 'DELETE' }),
  },

  analytics: {
    track: (path: string) =>
      apiJson('/analytics/track', {
        method: 'POST',
        body: JSON.stringify({ path }),
      }),
    getTraffic: () => apiJson('/analytics/traffic'),
  },
};
