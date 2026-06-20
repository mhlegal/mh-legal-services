// VITE_API_URL — set this only for cross-origin deployments.
// Leave empty (default) for same-origin: /api is served by the same host
// whether on Vercel (serverless function) or Replit (shared proxy).
const API_ORIGIN = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
const BASE = API_ORIGIN || "";

export { BASE };

export async function apiFetch(path: string, options?: RequestInit): Promise<Response> {
  const res = await fetch(`${BASE}/api${path}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
  });
  return res;
}

export async function apiJson<T = unknown>(path: string, options?: RequestInit): Promise<T> {
  const res = await apiFetch(path, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as Record<string, string>).error ?? `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}
